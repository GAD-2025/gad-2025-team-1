const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();

const PORT = 5000; 
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------
// 1. MySQL 연결 설정 (팀원 공용 원격 DB)
// ----------------------------------------------------------------------
const pool = mysql.createPool({
    host: 'route.nois.club',
    port: 12759,
    user: 'team1',
    password: 'xcFAWlYUurIY',
    database: 'team1_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ----------------------------------------------------------------------
// 2. 테이블 초기화 함수 (서버 실행 시 자동 체크)
// ----------------------------------------------------------------------
const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("🔄 데이터베이스 테이블 확인 중...");

        // Users 테이블 (coins, bio 포함)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nickname VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                bio VARCHAR(255) DEFAULT NULL,
                profile_image VARCHAR(255) DEFAULT '/images/default.jpg',
                coins INT DEFAULT 100000,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // Artworks 테이블 (tags, is_weekly_best 포함)
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
                description VARCHAR(200) DEFAULT NULL,
                tags VARCHAR(200) DEFAULT 'AI,Art',
                is_weekly_best BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);

        // 나머지 테이블들도 없으면 생성 (에러 방지용)
        const tables = [
            `CREATE TABLE IF NOT EXISTS myspace_folders (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(50), folder_index INT, name VARCHAR(50), cover_image VARCHAR(255), UNIQUE KEY unique_folder (user_id, folder_index))`,
            `CREATE TABLE IF NOT EXISTS folder_items (id INT AUTO_INCREMENT PRIMARY KEY, folder_id INT, artwork_id INT, FOREIGN KEY (folder_id) REFERENCES myspace_folders(id) ON DELETE CASCADE)`,
            `CREATE TABLE IF NOT EXISTS purchases (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(50), artwork_id INT, price INT, purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE)`,
            `CREATE TABLE IF NOT EXISTS likes (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(50), artwork_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE)`,
            `CREATE TABLE IF NOT EXISTS myspace_orbit (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(50), artwork_id INT, orbit_type VARCHAR(10), position_index INT, FOREIGN KEY (artwork_id) REFERENCES artworks(id))`,
            `CREATE TABLE IF NOT EXISTS project_nodes (id INT AUTO_INCREMENT PRIMARY KEY, artwork_id INT, type VARCHAR(50), title VARCHAR(100), content TEXT, position_x INT, position_y INT, FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE)`,
            `CREATE TABLE IF NOT EXISTS node_connections (id INT AUTO_INCREMENT PRIMARY KEY, from_node_id INT, to_node_id INT, FOREIGN KEY (from_node_id) REFERENCES project_nodes(id) ON DELETE CASCADE, FOREIGN KEY (to_node_id) REFERENCES project_nodes(id) ON DELETE CASCADE)`
        ];

        for (const sql of tables) {
            await connection.query(sql);
        }

        connection.release();
        console.log("✅ 데이터베이스 테이블 초기화 완료");
    } catch (err) {
        console.error("❌ 테이블 초기화 실패 (이미 존재하거나 권한 문제일 수 있음):", err.message);
    }
};

initDB();

// ----------------------------------------------------------------------
// 3. API 라우트
// ----------------------------------------------------------------------

// 회원가입
app.post('/api/signup', async (req, res) => {
    const { id, password, name, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO users (username, password, nickname, email, profile_image, bio) VALUES (?, ?, ?, ?, ?, NULL)`;
        const defaultImg = "/images/default.jpg"; 
        await pool.query(sql, [id, hashedPassword, name, email, defaultImg]);
        res.json({ success: true, message: "회원가입 성공!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "이미 사용중인 아이디입니다." });
        }
        res.status(500).json({ success: false, message: "서버 오류" });
    }
});

// 로그인
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [id]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const userResponse = { ...user };
                delete userResponse.password;
                res.json({ success: true, user: userResponse });
            } else {
                res.json({ success: false, message: "비밀번호 불일치" });
            }
        } else {
            res.json({ success: false, message: "존재하지 않는 아이디" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

// 회원 정보 수정
app.put('/api/user/update', async (req, res) => {
    const { id, name, bio, img } = req.body;
    try {
        await pool.query('UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?', [name, bio, img, id]);
        res.json({ success: true, message: "정보 수정 완료", user: { username: id, nickname: name, bio, profile_image: img } });
    } catch (error) {
        res.status(500).json({ success: false, message: "수정 실패" });
    }
});

// ★ 구매하기 API (트랜잭션 적용)
app.post('/api/purchase', async (req, res) => {
    console.log('--- 구매 요청 진입 ---');
    const { userId, artworkId, price } = req.body;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. 유저 확인 및 코인 체크
        const [users] = await connection.query('SELECT coins FROM users WHERE username = ?', [userId]);
        if (users.length === 0) throw new Error('유저를 찾을 수 없습니다.');
        if (users[0].coins < price) throw new Error('코인이 부족합니다.');

        // 2. 중복 구매 체크
        const [exists] = await connection.query('SELECT * FROM purchases WHERE user_id = ? AND artwork_id = ?', [userId, artworkId]);
        if (exists.length > 0) throw new Error('이미 보유한 작품입니다.');

        // 3. 차감 및 기록
        await connection.query('UPDATE users SET coins = coins - ? WHERE username = ?', [price, userId]);
        await connection.query('INSERT INTO purchases (user_id, artwork_id, price) VALUES (?, ?, ?)', [userId, artworkId, price]);

        await connection.commit();
        
        const leftCoins = users[0].coins - price;
        console.log(`구매 완료: ${userId} -> 작품 ${artworkId}`);
        res.json({ success: true, message: '구매 성공', leftCoins });

    } catch (error) {
        await connection.rollback();
        console.error('구매 실패:', error.message);
        res.status(400).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});

// 내 인벤토리 조회 (작가 이름 포함)
app.get('/api/inventory/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [purchased] = await pool.query(`
            SELECT a.id, a.image_url, a.title, a.artist_name, 'purchased' as type 
            FROM purchases p JOIN artworks a ON p.artwork_id = a.id WHERE p.user_id = ?
        `, [userId]);

        const [liked] = await pool.query(`
            SELECT a.id, a.image_url, a.title, a.artist_name, 'liked' as type 
            FROM likes l JOIN artworks a ON l.artwork_id = a.id WHERE l.user_id = ?
        `, [userId]);

        res.json({ success: true, inventory: [...purchased, ...liked] });
    } catch (error) {
        res.status(500).json({ success: false, message: "인벤토리 로딩 실패" });
    }
});

// 전체 작품 목록 조회
app.get('/api/artworks', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM artworks");
        res.json(rows);
    } catch (error) {
        res.status(500).send("작품 목록 로딩 실패");
    }
});

// 마이스페이스 데이터 조회
app.get('/api/myspace/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [folders] = await pool.query(`SELECT id, name, cover_image as thumb, folder_index FROM myspace_folders WHERE user_id = ? ORDER BY folder_index`, [userId]);
        for (let folder of folders) {
            const [works] = await pool.query(`SELECT a.image_url FROM folder_items fi JOIN artworks a ON fi.artwork_id = a.id WHERE fi.folder_id = ?`, [folder.id]);
            folder.works = works.map(w => w.image_url);
        }
        const [orbitRows] = await pool.query(`SELECT a.image_url FROM myspace_orbit mo JOIN artworks a ON mo.artwork_id = a.id WHERE mo.user_id = ? ORDER BY mo.position_index`, [userId]);
        const [inventoryRows] = await pool.query(`SELECT a.id, a.title, a.image_url FROM purchases p JOIN artworks a ON p.artwork_id = a.id WHERE p.user_id = ?`, [userId]);

        res.json({ success: true, folders, orbit: orbitRows.map(o => o.image_url), inventory: inventoryRows });
    } catch (error) {
        res.status(500).json({ success: false, message: "마이스페이스 로드 실패" });
    }
});

// 마이스페이스 저장
app.put('/api/myspace/save', async (req, res) => {
    const { id, name, bio, img, folders, orbit } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(`UPDATE users SET nickname = ?, bio = ?, profile_image = ? WHERE username = ?`, [name, bio, img, id]);

        for (let folder of folders) {
            await connection.query(`UPDATE myspace_folders SET name = ?, cover_image = ? WHERE id = ? AND user_id = ?`, [folder.name, folder.thumb, folder.id, id]);
            await connection.query(`DELETE FROM folder_items WHERE folder_id = ?`, [folder.id]);
            if (folder.works) {
                for (let workImg of folder.works) {
                    const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [workImg]);
                    if (artRow.length > 0) await connection.query(`INSERT INTO folder_items (folder_id, artwork_id) VALUES (?, ?)`, [folder.id, artRow[0].id]);
                }
            }
        }

        await connection.query(`DELETE FROM myspace_orbit WHERE user_id = ?`, [id]);
        if (orbit) {
            let pos = 0;
            for (let orbitImg of orbit) {
                const [artRow] = await connection.query(`SELECT id FROM artworks WHERE image_url = ?`, [orbitImg]);
                if (artRow.length > 0) await connection.query(`INSERT INTO myspace_orbit (user_id, artwork_id, orbit_type, position_index) VALUES (?, ?, 'outer', ?)`, [id, artRow[0].id, pos++]);
            }
        }
        await connection.commit();
        res.json({ success: true, user: { username: id, nickname: name, bio, profile_image: img } });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "저장 실패" });
    } finally {
        connection.release();
    }
});

// 노드 관련 API
app.get('/api/nodes/:artworkId', async (req, res) => {
    const { artworkId } = req.params;
    try {
        const [nodes] = await pool.query(`SELECT * FROM project_nodes WHERE artwork_id = ?`, [artworkId]);
        const [connections] = await pool.query(`SELECT nc.from_node_id as 'from', nc.to_node_id as 'to' FROM node_connections nc JOIN project_nodes pn ON nc.from_node_id = pn.id WHERE pn.artwork_id = ?`, [artworkId]);
        res.json({ success: true, nodes, connections });
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

app.post('/api/nodes', async (req, res) => {
    const { postId, type, title, content, x, y } = req.body;
    try {
        const [result] = await pool.query(`INSERT INTO project_nodes (artwork_id, type, title, content, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)`, [postId, type, title, content, x, y]);
        res.json({ success: true, newNode: { id: result.insertId, artwork_id: postId, type, title, content, position_x: x, position_y: y } });
    } catch (error) {
        res.status(500).json({ success: false, message: "노드 생성 실패" });
    }
});

app.delete('/api/nodes/:nodeId', async (req, res) => {
    const { nodeId } = req.params;
    try {
        const [result] = await pool.query(`DELETE FROM project_nodes WHERE id = ?`, [nodeId]);
        if (result.affectedRows > 0) res.json({ success: true, message: "삭제 성공" });
        else res.status(404).json({ success: false, message: "노드 없음" });
    } catch (error) {
        res.status(500).json({ success: false, message: "삭제 실패" });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});