const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // promise 버전 사용 통일
const bcrypt = require('bcrypt');
const app = express();

const PORT = 5000;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// 1. MySQL 연결 설정
const pool = mysql.createPool({
    host: 'route.nois.club',
    port: 12759,
    user: 'team1',
    password: 'xcFAWlYUurIY',
    database: 'team1_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4' // ★ 한글 깨짐 방지 필수
});

// DB 초기화 함수
const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("🔄 데이터베이스 테이블 확인 중...");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nickname VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                bio VARCHAR(255) DEFAULT NULL,
                profile_image VARCHAR(255) DEFAULT '/images/default.jpg',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS artworks (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(100) NOT NULL,
                artist_name VARCHAR(50) NOT NULL,
                category VARCHAR(50) NOT NULL DEFAULT 'Etc',
                price INT DEFAULT '0',
                image_url VARCHAR(500) NOT NULL,
                prompt TEXT DEFAULT NULL,
                views INT DEFAULT '0',
                description VARCHAR(500) DEFAULT NULL,
                tags VARCHAR(200) DEFAULT 'AI,Art',
                is_weekly_best BOOLEAN DEFAULT FALSE,
                ai_tool VARCHAR(50) DEFAULT NULL,
                ai_ratio VARCHAR(50) DEFAULT NULL,
                is_public BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS myspace_folders (
                id INT NOT NULL AUTO_INCREMENT,
                user_id VARCHAR(50) NOT NULL,
                folder_index INT NOT NULL,
                name VARCHAR(50) DEFAULT 'New Folder',
                cover_image VARCHAR(255) DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_folder (user_id, folder_index)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS folder_items (
                id INT NOT NULL AUTO_INCREMENT,
                folder_id INT NOT NULL,
                artwork_id INT NOT NULL,
                PRIMARY KEY (id),
                KEY folder_id (folder_id),
                KEY artwork_id (artwork_id),
                CONSTRAINT folder_items_ibfk_1 FOREIGN KEY (folder_id) REFERENCES myspace_folders (id) ON DELETE CASCADE,
                CONSTRAINT folder_items_ibfk_2 FOREIGN KEY (artwork_id) REFERENCES artworks (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS purchases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                artwork_id INT NOT NULL,
                price INT NOT NULL DEFAULT 0,
                purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (artwork_id) REFERENCES artworks (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT NOT NULL AUTO_INCREMENT,
                user_id VARCHAR(50) NOT NULL,
                artwork_id INT NOT NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY artwork_id (artwork_id),
                CONSTRAINT likes_ibfk_1 FOREIGN KEY (artwork_id) REFERENCES artworks (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS myspace_orbit (
                id INT NOT NULL AUTO_INCREMENT,
                user_id VARCHAR(50) NOT NULL,
                artwork_id INT NOT NULL,
                orbit_type VARCHAR(10) DEFAULT 'outer',
                position_index INT DEFAULT NULL,
                PRIMARY KEY (id),
                KEY artwork_id (artwork_id),
                CONSTRAINT myspace_orbit_ibfk_1 FOREIGN KEY (artwork_id) REFERENCES artworks (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS project_nodes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                artwork_id INT,
                type VARCHAR(50),
                title VARCHAR(100),
                content TEXT,
                position_x INT,
                position_y INT,
                FOREIGN KEY (artwork_id) REFERENCES artworks (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS node_connections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                from_node_id INT,
                to_node_id INT,
                FOREIGN KEY (from_node_id) REFERENCES project_nodes (id) ON DELETE CASCADE,
                FOREIGN KEY (to_node_id) REFERENCES project_nodes (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        connection.release();
        console.log("✅ 데이터베이스 테이블 초기화 완료");
    } catch (err) {
        console.error("❌ 테이블 초기화 실패:", err);
    }
};

initDB();

// ------------------------------------------------------------------
// API 구현
// ------------------------------------------------------------------

// 1. 회원가입
app.post('/api/signup', async (req, res) => {
    console.log("--- 회원가입 요청 ---");
    const { id, password, name, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO users (username, password, nickname, email, profile_image, bio) VALUES (?, ?, ?, ?, ?, NULL)`;
        const defaultImg = "/images/White Cats.jpg"; 

        await pool.query(sql, [id, hashedPassword, name, email, defaultImg]);
        
        // 신규 가입자에게 Art 1~7번 자동 구매 처리
        const starterPackIds = [1, 2, 3, 4, 5, 6, 7];
        for (const artId of starterPackIds) {
            await pool.query(
                `INSERT INTO purchases (user_id, artwork_id, price) VALUES (?, ?, 0)`,
                [id, artId]
            ).catch(() => {}); // 중복 에러 무시
        }
        
        console.log(`회원가입 성공! (${id}님에게 기본 작품 지급 완료)`);
        res.json({ success: true, message: "회원가입 성공!" });

    } catch (error) {
        console.error("회원가입 에러:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "이미 사용중인 아이디입니다." });
        }
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
});

// 2. 로그인
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const userResponse = { ...user };
                delete userResponse.password; 
                res.json({ success: true, user: userResponse });
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

// ★ 3. 회원 정보 수정 (핵심 수정: 닉네임 변경 시 작품 작가명도 변경)
app.put('/api/user/update', async (req, res) => {
    console.log("--- 회원 정보 수정 요청 ---");
    const { id, name, bio, img } = req.body; // id=유저아이디, name=새 닉네임

    const connection = await pool.getConnection(); // 트랜잭션 사용
    try {
        await connection.beginTransaction();

        // 1. 기존 닉네임 가져오기
        const [userRows] = await connection.query("SELECT nickname FROM users WHERE username = ?", [id]);
        if (userRows.length === 0) throw new Error("User not found");
        const oldNickname = userRows[0].nickname;

        // 2. 유저 정보 업데이트 (users 테이블)
        const sql = `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`;
        await connection.query(sql, [name, bio, img, id]);

        // 3. 만약 닉네임이 바뀌었다면, 작품의 작가명(artworks 테이블)도 같이 변경
        if (oldNickname !== name) {
            console.log(`🔄 닉네임 변경 감지: ${oldNickname} -> ${name}`);
            const [artResult] = await connection.query(
                `UPDATE artworks SET artist_name = ? WHERE artist_name = ?`,
                [name, oldNickname]
            );
            console.log(`   └ 관련 작품 ${artResult.affectedRows}개의 작가명 업데이트 완료`);
        }

        await connection.commit();

        console.log(`유저(${id}) 정보 및 작품 동기화 완료`);
        res.json({ 
            success: true, 
            message: "정보가 수정되었습니다.",
            user: { username: id, nickname: name, bio: bio, profile_image: img } 
        });

    } catch (error) {
        await connection.rollback();
        console.error("수정 에러:", error);
        res.status(500).json({ success: false, message: "정보 수정 중 오류가 발생했습니다." });
    } finally {
        connection.release();
    }
});

// 4. 작품 구매하기 API
app.post('/api/purchase', async (req, res) => {
    const { userId, artworkId } = req.body;

    try {
        const [check] = await pool.query(
            `SELECT * FROM purchases WHERE user_id = ? AND artwork_id = ?`, 
            [userId, artworkId]
        );

        if (check.length > 0) {
            return res.json({ success: false, message: "이미 소유한 작품입니다." });
        }

        await pool.query(
            `INSERT INTO purchases (user_id, artwork_id) VALUES (?, ?)`,
            [userId, artworkId]
        );

        res.json({ success: true, message: "구매 성공! 마이스페이스 보관함에 추가되었습니다." });

    } catch (error) {
        console.error("구매 에러:", error);
        res.status(500).json({ success: false, message: "구매 처리 실패" });
    }
});

// 5. 내 인벤토리 조회
app.get('/api/inventory/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [purchased] = await pool.query(`
            SELECT a.id, a.image_url, a.title, a.prompt, 'purchased' as type 
            FROM purchases p 
            JOIN artworks a ON p.artwork_id = a.id 
            WHERE p.user_id = ?
        `, [userId]);

        const [liked] = await pool.query(`
            SELECT a.id, a.image_url, a.title, a.prompt, 'liked' as type 
            FROM likes l 
            JOIN artworks a ON l.artwork_id = a.id 
            WHERE l.user_id = ?
        `, [userId]);

        res.json({ success: true, inventory: [...purchased, ...liked] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "인벤토리 로딩 실패" });
    }
});

// 6. 마이스페이스 데이터 조회
app.get('/api/myspace/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // 폴더 정보
        const [folders] = await pool.query(
            `SELECT id, name, cover_image as thumb, folder_index FROM myspace_folders WHERE user_id = ? ORDER BY folder_index`, 
            [userId]
        );

        for (let folder of folders) {
            const [works] = await pool.query(
                `SELECT a.image_url FROM folder_items fi 
                 JOIN artworks a ON fi.artwork_id = a.id 
                 WHERE fi.folder_id = ?`, 
                [folder.id]
            );
            folder.works = works.map(w => w.image_url);
        }

        // 궤도 정보
        const [orbitRows] = await pool.query(
            `SELECT a.image_url FROM myspace_orbit mo
             JOIN artworks a ON mo.artwork_id = a.id
             WHERE mo.user_id = ? ORDER BY mo.position_index`,
            [userId]
        );
        const orbit = orbitRows.map(o => o.image_url);

        // 인벤토리 (구매한 작품 목록)
        const [inventoryRows] = await pool.query(
            `SELECT a.id, a.title, a.image_url 
             FROM purchases p
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

// 7. 마이스페이스 설정 저장
app.put('/api/myspace/save', async (req, res) => {
    const { id, name, bio, img, folders, orbit } = req.body;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1) 유저 정보 업데이트 (여기도 닉네임 동기화 로직 추가)
        const [userRows] = await connection.query("SELECT nickname FROM users WHERE username = ?", [id]);
        const oldNickname = userRows[0]?.nickname;

        await connection.query(
            `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`,
            [name, bio, img, id]
        );

        if (oldNickname && oldNickname !== name) {
             await connection.query(
                `UPDATE artworks SET artist_name = ? WHERE artist_name = ?`,
                [name, oldNickname]
            );
        }

        // 2) 폴더 정보 업데이트
        await connection.query(`DELETE FROM myspace_folders WHERE user_id = ?`, [id]);

        if (folders && folders.length > 0) {
            for (let i = 0; i < folders.length; i++) {
                const folder = folders[i];
                const [folderResult] = await connection.query(
                    `INSERT INTO myspace_folders (user_id, folder_index, name, cover_image) VALUES (?, ?, ?, ?)`,
                    [id, i, folder.name, folder.thumb]
                );
                const newFolderId = folderResult.insertId;

                if (folder.works && folder.works.length > 0) {
                    for (let workImg of folder.works) {
                        const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [workImg]);
                        if (artRow.length > 0) {
                            await connection.query(
                                `INSERT INTO folder_items (folder_id, artwork_id) VALUES (?, ?)`, 
                                [newFolderId, artRow[0].id]
                            );
                        }
                    }
                }
            }
        }

        // 3) 궤도 업데이트
        await connection.query(`DELETE FROM myspace_orbit WHERE user_id = ?`, [id]);
        
        if (orbit && orbit.length > 0) {
            let pos = 0;
            for (let orbitImg of orbit) {
                const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [orbitImg]);
                if (artRow.length > 0) {
                    await connection.query(
                        `INSERT INTO myspace_orbit (user_id, artwork_id, orbit_type, position_index) VALUES (?, ?, ?, ?)`,
                        [id, artRow[0].id, 'outer', pos++]
                    );
                }
            }
        }

        await connection.commit();
        console.log(`✅ 마이스페이스 저장 완료: ${id}`);
        res.json({ 
            success: true, 
            user: { username: id, nickname: name, bio: bio, profile_image: img }
        });

    } catch (error) {
        await connection.rollback();
        console.error("❌ 저장 에러 상세:", error);
        res.status(500).json({ success: false, message: "저장 실패" });
    } finally {
        connection.release();
    }
});

// 8. 전체 작품 목록
app.get('/api/artworks', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM artworks");
        res.json(rows);
    } catch (error) {
        console.error("작품 목록 로딩 실패:", error);
        res.status(500).send("서버 에러");
    }
});

// 9. 노드 및 연결선 가져오기
app.get('/api/nodes/:artworkId', async (req, res) => {
    const { artworkId } = req.params;
    try {
        let [nodes] = await pool.query(
            `SELECT * FROM project_nodes WHERE artwork_id = ?`, 
            [artworkId]
        );
        
        // 노드가 없으면 기본 트리 자동 생성
        if (nodes.length === 0) {
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                const [artInfo] = await connection.query(`SELECT title, prompt FROM artworks WHERE id = ?`, [artworkId]);
                
                if (artInfo.length > 0) {
                    const { title, prompt } = artInfo[0];
                    const basePrompt = prompt || '프롬프트 없음';

                    // Layer 0 (Root)
                    const [rootRes] = await connection.query(
                        `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`,
                        [artworkId, 'original', title, basePrompt, 100, 300]
                    );
                    const rootId = rootRes.insertId;

                    // Layer 1
                    const [l1_1_Res] = await connection.query(
                        `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`,
                        [artworkId, 'modified', 'Cyberpunk Style', basePrompt + ', cyberpunk city', 400, 150]
                    );
                    const l1_1_Id = l1_1_Res.insertId;
                    
                    const [l1_2_Res] = await connection.query(
                        `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`,
                        [artworkId, 'modified', 'Watercolor Ver.', basePrompt + ', watercolor style', 400, 450]
                    );
                    const l1_2_Id = l1_2_Res.insertId;

                    await connection.query(`INSERT INTO node_connections (from_node_id, to_node_id) VALUES (?, ?)`, [rootId, l1_1_Id]);
                    await connection.query(`INSERT INTO node_connections (from_node_id, to_node_id) VALUES (?, ?)`, [rootId, l1_2_Id]);

                    // Layer 2
                    const [l2_1_Res] = await connection.query(
                        `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`,
                        [artworkId, 'modified', 'High Detail', basePrompt + ', 8k resolution', 700, 150]
                    );
                    const l2_1_Id = l2_1_Res.insertId;

                    const [l2_2_Res] = await connection.query(
                        `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`,
                        [artworkId, 'modified', 'Cold Mood', basePrompt + ', cold blue tint', 700, 450]
                    );
                    const l2_2_Id = l2_2_Res.insertId;

                    await connection.query(`INSERT INTO node_connections (from_node_id, to_node_id) VALUES (?, ?)`, [l1_1_Id, l2_1_Id]);
                    await connection.query(`INSERT INTO node_connections (from_node_id, to_node_id) VALUES (?, ?)`, [l1_2_Id, l2_2_Id]);

                    await connection.commit();
                }
            } catch (err) {
                await connection.rollback();
                console.error("노드 자동 생성 실패:", err);
            } finally {
                connection.release();
            }
            const [newNodes] = await pool.query(`SELECT * FROM project_nodes WHERE artwork_id = ?`, [artworkId]);
            nodes = newNodes;
        }

        const [connections] = await pool.query(`
            SELECT nc.from_node_id as 'from', nc.to_node_id as 'to'
            FROM node_connections nc
            JOIN project_nodes pn ON nc.from_node_id = pn.id
            WHERE pn.artwork_id = ?
        `, [artworkId]);

        res.json({ success: true, nodes, connections });

    } catch (error) {
        console.error("노드 조회 에러:", error);
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

// 10. 노드 생성
app.post('/api/nodes', async (req, res) => {
    const { postId, type, title, content, x, y } = req.body;
    try {
        const sql = `INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [postId, type, title, content, x, y]);
        
        res.json({ 
            success: true, 
            newNode: { id: result.insertId, artwork_id: postId, type, title, content, position_x: x, position_y: y } 
        });
    } catch (error) {
        console.error("노드 생성 에러:", error);
        res.status(500).json({ success: false, message: "노드 생성 실패" });
    }
});

// 11. 노드 삭제
app.delete('/api/nodes/:nodeId', async (req, res) => {
    const { nodeId } = req.params;
    try {
        const sql = `DELETE FROM project_nodes WHERE id = ?`;
        const [result] = await pool.query(sql, [nodeId]);
        
        if (result.affectedRows > 0) {
             res.json({ success: true, message: "삭제 성공" });
        } else {
             res.status(404).json({ success: false, message: "노드를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("노드 삭제 에러:", error);
        res.status(500).json({ success: false, message: "삭제 실패" });
    }
});

// ==========================================
// [Archive 페이지용 API]
// ==========================================

// 12. 유저 정보 가져오기 (닉네임 표시용)
app.get('/api/user-info/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query(`SELECT nickname FROM users WHERE username = ?`, [userId]);
        if (rows.length > 0) {
            res.json({ success: true, nickname: rows[0].nickname });
        } else {
            res.json({ success: false, message: "유저 없음" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 13. 유저의 구매 목록 가져오기
app.get('/api/purchases/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT 
                a.id, a.title, a.artist_name, a.image_url, a.category,
                p.purchased_at
            FROM purchases p
            JOIN artworks a ON p.artwork_id = a.id
            WHERE p.user_id = ?
            ORDER BY p.purchased_at DESC
        `;
        const [rows] = await pool.query(query, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 14. [수정됨] 내가 업로드한 작품 가져오기 (async/await 적용)
app.get('/api/my-uploads/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(`🔎 [API] 업로드 목록 조회: ID=${userId}`);

    try {
        // 1. 유저 ID로 닉네임 찾기
        const [userRows] = await pool.query("SELECT nickname FROM users WHERE username = ?", [userId]);
        
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const nickname = userRows[0].nickname;
        console.log(`   ➜ 현재 닉네임: ${nickname}`);

        // 2. 해당 닉네임의 작품 조회
        const [artRows] = await pool.query("SELECT * FROM artworks WHERE artist_name = ? ORDER BY id DESC", [nickname]);
        
        console.log(`   ➜ 작품 수: ${artRows.length}개`);
        res.json({ success: true, data: artRows });

    } catch (err) {
        console.error("❌ 업로드 목록 조회 에러:", err);
        res.status(500).json({ success: false, err });
    }
});

// 15. [수정됨] 작품 정보 수정하기 (async/await 적용)
app.put('/api/my-uploads/update', async (req, res) => {
    const { id, description, price, ai_tool, ai_ratio, prompt, is_public } = req.body;
    console.log(`📝 [API] 작품 수정 시도: ID=${id}`);

    const sql = `
        UPDATE artworks 
        SET description = ?, price = ?, ai_tool = ?, ai_ratio = ?, prompt = ?, is_public = ?
        WHERE id = ?
    `;
    const isPublicVal = is_public ? 1 : 0;

    try {
        await pool.query(sql, [description, price, ai_tool, ai_ratio, prompt, isPublicVal, id]);
        console.log("✅ 작품 업데이트 성공");
        res.json({ success: true, message: 'Updated Successfully' });
    } catch (err) {
        console.error("❌ 작품 업데이트 실패:", err);
        res.json({ success: false, message: 'DB Update Failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});