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
// ★수정됨: 제공해주신 원격 DB 정보로 설정 업데이트
const pool = mysql.createPool({
    host: 'route.nois.club', // ★호스트 수정
    port: 12759,             // ★포트 추가 (기본 3306이 아니므로 필수)
    user: 'team1',           // ★유저네임 수정 (root -> team1)
    password: 'xcFAWlYUurIY',      // ★중요: 여기에 'team1' 계정의 비밀번호를 입력해야 합니다.
    database: 'team1_db',    // 데이터베이스 이름
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ★ [추가됨] 테이블 자동 초기화 함수
// 서버 시작 시 테이블이 없으면 자동으로 생성해줍니다.
const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        
        console.log("🔄 데이터베이스 테이블 확인 및 생성 중...");

        // 1. Users 테이블
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nickname VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                profile_image VARCHAR(255) DEFAULT '/images/default.jpg',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // 2. Artworks 테이블
        await connection.query(`
            CREATE TABLE IF NOT EXISTS artworks (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(100) NOT NULL,
                artist_name VARCHAR(50) NOT NULL,
                category VARCHAR(50) NOT NULL DEFAULT 'Etc',
                price INT DEFAULT '0',
                image_url VARCHAR(500) NOT NULL,
                views INT DEFAULT '0',
                description VARCHAR(200) DEFAULT NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // 3. MySpace Folders 테이블
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

        // 4. Folder Items 테이블
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

        // 5. Purchases 테이블
        await connection.query(`
            CREATE TABLE IF NOT EXISTS purchases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                artwork_id INT NOT NULL,
                purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (artwork_id) REFERENCES artworks (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // 6. Likes 테이블
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

        // 7. MySpace Orbit 테이블
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

        // 8. Posts 테이블
        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT NOT NULL AUTO_INCREMENT,
                user_id INT NOT NULL,
                title VARCHAR(100) NOT NULL,
                content TEXT,
                image_url VARCHAR(255) DEFAULT NULL,
                likes INT DEFAULT '0',
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // 9. Project Nodes 테이블
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

        // 10. Node Connections 테이블
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

// 서버 시작 시 DB 초기화 실행
initDB();


// 2. 회원가입 API
app.post('/api/signup', async (req, res) => {
    console.log("--- 회원가입 요청 ---");
    const { id, password, name, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
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
                const userResponse = { ...user };
                delete userResponse.password; // 비밀번호는 제외하고 전송
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

// 4. 회원 정보 수정 API
app.put('/api/user/update', async (req, res) => {
    console.log("--- 회원 정보 수정 요청 ---");
    const { id, name, bio, img } = req.body;

    try {
        const sql = `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`;
        await pool.query(sql, [name, bio, img, id]);

        console.log(`유저(${id}) 정보 수정 완료`);
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

// 5. 내 인벤토리(구매+찜) 가져오기 API
app.get('/api/inventory/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [purchased] = await pool.query(`
            SELECT a.id, a.image_url, a.title, 'purchased' as type 
            FROM purchases p 
            JOIN artworks a ON p.artwork_id = a.id 
            WHERE p.user_id = ?
        `, [userId]);

        const [liked] = await pool.query(`
            SELECT a.id, a.image_url, a.title, 'liked' as type 
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
        // 폴더 가져오기
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

        // 궤도 작품 가져오기
        const [orbitRows] = await pool.query(
            `SELECT a.image_url FROM myspace_orbit mo
             JOIN artworks a ON mo.artwork_id = a.id
             WHERE mo.user_id = ? ORDER BY mo.position_index`,
            [userId]
        );
        const orbit = orbitRows.map(o => o.image_url);

        // 인벤토리 가져오기
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

// 7. 마이스페이스 설정 통째로 저장하기
app.put('/api/myspace/save', async (req, res) => {
    const { id, name, bio, img, folders, orbit } = req.body;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 유저 정보 업데이트
        await connection.query(
            `UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`,
            [name, bio, img, id]
        );

        // 폴더 정보 업데이트
        for (let folder of folders) {
            await connection.query(
                `UPDATE myspace_folders SET name = ?, cover_image = ? WHERE id = ? AND user_id = ?`,
                [folder.name, folder.thumb, folder.id, id]
            );

            await connection.query(`DELETE FROM folder_items WHERE folder_id = ?`, [folder.id]);
            
            if (folder.works && folder.works.length > 0) {
                for (let workImg of folder.works) {
                    const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [workImg]);
                    if (artRow.length > 0) {
                        await connection.query(`INSERT INTO folder_items (folder_id, artwork_id) VALUES (?, ?)`, [folder.id, artRow[0].id]);
                    }
                }
            }
        }

        // 궤도 업데이트
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

// 8. 작품 탐색 페이지용 전체 작품 목록 API
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


// 9. 노드 및 연결선 가져오기
app.get('/api/nodes/:artworkId', async (req, res) => {
    const { artworkId } = req.params;
    try {
        const [nodes] = await pool.query(
            `SELECT * FROM project_nodes WHERE artwork_id = ?`, 
            [artworkId]
        );
        
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

// 10. 새 노드 생성
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

// 11. 노드 삭제 API
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});