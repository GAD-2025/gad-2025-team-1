const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();

const PORT = 5000; // 리액트(3000)와 충돌 방지
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// 1. MySQL 연결 설정
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '4346',     // ★비밀번호 확인 필수★
    database: 'myspace_db', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. 회원가입 API (수정됨: 필수 4가지만 처리)
app.post('/api/signup', async (req, res) => {
    console.log("--- 회원가입 요청 ---");
    console.log("데이터:", req.body);

    // 프론트에서 보낸 4가지 데이터 받기
    const { id, password, name, email } = req.body;

    try {
        // (1) 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // (2) DB 저장 (bio, type 제거함)
        // profile_image는 나중에 에러 안 나게 기본값으로 넣어줍니다.
        const sql = `INSERT INTO users (username, password, nickname, email, profile_image) VALUES (?, ?, ?, ?, ?)`;
        const defaultImg = "/images/White Cats.jpg"; 

        await pool.query(sql, [id, hashedPassword, name, email, defaultImg]);
        
        console.log("회원가입 성공!");
        res.json({ success: true, message: "회원가입 성공!" });

    } catch (error) {
        console.error("회원가입 에러:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "이미 사용중인 아이디입니다." });
        }
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
});

// 3. 로그인 API
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                delete user.password;
                res.json({ success: true, user: user });
            } else {
                res.json({ success: false, message: "비밀번호가 일치하지 않습니다." });
            }
        } else {
            res.json({ success: false, message: "존재하지 않는 아이디입니다." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

// ... (위쪽 로그인 API 코드는 그대로 두세요) ...

// 4. 회원 정보 수정 API (PUT /api/user/update)
app.put('/api/user/update', async (req, res) => {
    console.log("--- 회원 정보 수정 요청 ---");
    const { id, name, bio, img } = req.body; // 프론트에서 보낸 데이터

    try {
        // 1. DB 업데이트 (아이디가 일치하는 사람의 정보를 바꿈)
        // 주의: profile_image 컬럼 크기가 작으면 긴 이미지(Base64) 저장 시 에러가 날 수 있습니다.
        const sql = `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`;
        
        await pool.query(sql, [name, bio, img, id]);

        console.log(`유저(${id}) 정보 수정 완료`);
        
        // 2. 업데이트된 정보를 다시 프론트엔드로 보내줌 (동기화용)
        res.json({ 
            success: true, 
            message: "정보가 수정되었습니다.",
            user: { username: id, nickname: name, bio: bio, profile_image: img } 
        });

    } catch (error) {
        console.error("수정 에러:", error);
        res.status(500).json({ success: false, message: "정보 수정 중 오류가 발생했습니다." });
    }
});



// ★ [NEW] 1. 내 인벤토리(구매+찜) 가져오기 API
app.get('/api/inventory/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // 1. 구매한 작품 목록
        const [purchased] = await pool.query(`
            SELECT a.id, a.image_url, a.title, 'purchased' as type 
            FROM purchases p 
            JOIN artworks a ON p.artwork_id = a.id 
            WHERE p.user_id = ?
        `, [userId]);

        // 2. 찜한 작품 목록
        const [liked] = await pool.query(`
            SELECT a.id, a.image_url, a.title, 'liked' as type 
            FROM likes l 
            JOIN artworks a ON l.artwork_id = a.id 
            WHERE l.user_id = ?
        `, [userId]);

        // 두 목록 합쳐서 보내기
        res.json({ success: true, inventory: [...purchased, ...liked] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "인벤토리 로딩 실패" });
    }
});

// ... (기존 로그인/회원가입 코드 유지) ...

// ★ [NEW] 마이스페이스 데이터 조회 (설정 페이지 & 메인 페이지용)
app.get('/api/myspace/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // 1. 내 폴더 3개 가져오기
        const [folders] = await pool.query(
            `SELECT id, name, cover_image as thumb, folder_index FROM myspace_folders WHERE user_id = ? ORDER BY folder_index`, 
            [userId]
        );

        // 2. 각 폴더 안에 들어있는 작품 가져오기
        for (let folder of folders) {
            const [works] = await pool.query(
                `SELECT a.image_url FROM folder_items fi 
                 JOIN artworks a ON fi.artwork_id = a.id 
                 WHERE fi.folder_id = ?`, 
                [folder.id]
            );
            folder.works = works.map(w => w.image_url); // 이미지 경로만 배열로 추출
        }

        // 3. 내 궤도(Orbit) 작품 가져오기
        const [orbitRows] = await pool.query(
            `SELECT a.image_url FROM myspace_orbit mo
             JOIN artworks a ON mo.artwork_id = a.id
             WHERE mo.user_id = ? ORDER BY mo.position_index`,
            [userId]
        );
        const orbit = orbitRows.map(o => o.image_url);

        // 4. 내가 구매한(보유한) 전체 작품 목록 가져오기 (설정 페이지 피커용)
        const [inventoryRows] = await pool.query(
            `SELECT a.id, a.title, a.image_url FROM purchases p
             JOIN artworks a ON p.artwork_id = a.id
             WHERE p.user_id = ?`,
            [userId]
        );

        res.json({ success: true, folders, orbit, inventory: inventoryRows });

    } catch (error) {
        console.error("마이스페이스 로드 실패:", error);
        res.status(500).json({ success: false, message: "데이터 로드 실패" });
    }
});

// ★ [NEW] 마이스페이스 설정 통째로 저장하기
app.put('/api/myspace/save', async (req, res) => {
    const { id, name, bio, img, folders, orbit } = req.body;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. 프로필 정보 업데이트
        await connection.query(
            `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`,
            [name, bio, img, id]
        );

        // 2. 폴더 정보 업데이트 (이름, 커버이미지)
        for (let folder of folders) {
            // folder.id가 있으면 업데이트
            await connection.query(
                `UPDATE myspace_folders SET name = ?, cover_image = ? WHERE id = ? AND user_id = ?`,
                [folder.name, folder.thumb, folder.id, id]
            );

            // 3. 폴더 내용물(작품) 업데이트: 싹 지우고 다시 넣기 (가장 쉬운 동기화 방법)
            await connection.query(`DELETE FROM folder_items WHERE folder_id = ?`, [folder.id]);
            
            if (folder.works && folder.works.length > 0) {
                // works 배열에는 이미지 경로(URL)가 들어있음. 이걸로 artwork_id를 찾아야 함.
                // (성능상 비효율적일 수 있지만, 현재 구조에선 이게 최선)
                for (let workImg of folder.works) {
                    const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [workImg]);
                    if (artRow.length > 0) {
                        await connection.query(`INSERT INTO folder_items (folder_id, artwork_id) VALUES (?, ?)`, [folder.id, artRow[0].id]);
                    }
                }
            }
        }

        // 4. 궤도(Orbit) 업데이트: 싹 지우고 다시 넣기
        await connection.query(`DELETE FROM myspace_orbit WHERE user_id = ?`, [id]);
        
        if (orbit && orbit.length > 0) {
            let pos = 0;
            for (let orbitImg of orbit) {
                const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [orbitImg]);
                if (artRow.length > 0) {
                    // 궤도 타입(inner/outer)은 단순화를 위해 일단 'outer'로 통일하거나 순서대로 배분
                    await connection.query(
                        `INSERT INTO myspace_orbit (user_id, artwork_id, orbit_type, position_index) VALUES (?, ?, ?, ?)`,
                        [id, artRow[0].id, 'outer', pos++]
                    );
                }
            }
        }

        await connection.commit();
        
        // 성공 후 최신 유저 정보 리턴
        res.json({ 
            success: true, 
            user: { username: id, nickname: name, bio: bio, profile_image: img }
        });

    } catch (error) {
        await connection.rollback();
        console.error("저장 에러:", error);
        res.status(500).json({ success: false, message: "저장 실패" });
    } finally {
        connection.release();
    }
});
// ★ [NEW] 작품 탐색 페이지용 전체 작품 목록 API
app.get('/api/artworks', async (req, res) => {
    try {
        // artworks 테이블의 모든 데이터를 가져옵니다.
        const [rows] = await pool.query("SELECT * FROM artworks");
        res.json(rows); // 리액트한테 데이터를 배열 그대로 줍니다.
    } catch (error) {
        console.error("작품 목록 로딩 실패:", error);
        res.status(500).send("서버 에러");
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});