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
    password: '030422',     // ★비밀번호 확인 필수★
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

// ★ [NEW] 2. 마이스페이스 설정(폴더+궤도+프로필) 한 번에 저장 API
app.put('/api/myspace/save', async (req, res) => {
    const { id, name, bio, img, folders, orbit } = req.body; // orbit은 이미지 경로 배열이 아니라 객체 배열이어야 함

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. 유저 기본 정보 업데이트
        await connection.query(
            `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`,
            [name, bio, img, id]
        );

        // 2. 기존 폴더/궤도 데이터 삭제 (덮어쓰기 위해)
        await connection.query(`DELETE FROM myspace_orbit WHERE user_id = ?`, [id]);
        
        // 주의: 실제로는 폴더 테이블과 아이템 테이블을 정교하게 관리해야 하지만, 
        // 여기서는 로직 단순화를 위해 DB 저장은 생략하고 프론트엔드 localStorage와 연동하거나
        // 추후 폴더 테이블 구현 시 이 부분에 INSERT 로직을 넣습니다.
        // (이번 단계에서는 프로필 업데이트와 성공 응답 위주로 처리합니다.)

        /* 실제 DB 구현 시:
           1. myspace_folders 데이터 DELETE 후 INSERT
           2. folder_items 데이터 DELETE 후 INSERT
           3. myspace_orbit 데이터 DELETE 후 INSERT
        */

        await connection.commit();
        
        res.json({ 
            success: true, 
            user: { username: id, nickname: name, bio: bio, profile_image: img }
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: "저장 실패" });
    } finally {
        connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});