// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // mysql2 라이브러리 불러오기
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. MySQL 연결 설정 (본인 정보로 수정 필수!)
const pool = mysql.createPool({
    host: 'localhost',      // 보통 내 컴퓨터면 localhost
    user: 'root',           // MySQL 아이디 (보통 root)
    password: '030422', // ★여기에 MySQL 설치할 때 정한 비밀번호 입력★
    database: 'myspace_db', // 아까 만든 데이터베이스 이름
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. API 엔드포인트: 게시글 목록 조회 (DB에서 가져오기)
app.get('/api/posts', async (req, res) => {
    try {
        // DB에 SQL 쿼리를 날려서 데이터를 가져옵니다.
        // posts 테이블의 내용과 작성자(users)의 닉네임을 같이 가져오기 위해 JOIN을 씁니다.
        const [rows] = await pool.query(`
            SELECT posts.*, users.nickname, users.profile_image 
            FROM posts 
            JOIN users ON posts.user_id = users.id
        `);

        // 가져온 데이터를 프론트엔드에 응답으로 보냅니다.
        res.json(rows);
    } catch (error) {
        console.error("데이터베이스 조회 에러:", error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
});

// --- 기존 server.js 코드 아래에 추가 ---

// 3. 회원가입 API (POST /api/signup)
app.post('/api/signup', async (req, res) => {
    console.log("--- 회원가입 요청 도착 ---");
    console.log("받은 데이터:", req.body); 

    const { id, password, name, email, type, bio } = req.body;
   

    try {
        // DB에 데이터 넣기 (SQL INSERT 문)
        const sql = `INSERT INTO users (username, password, nickname, email, user_type, bio, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        // 프로필 이미지는 기본값 설정
        const defaultImg = "/gad-2025-team-1/frontend/images/White Cats.jpg";
        
        await pool.query(sql, [id, password, name, email, type, bio, defaultImg]);
        
        res.json({ message: "회원가입 성공!", success: true });
    } catch (error) {
        console.error("회원가입 에러:", error);
        res.status(500).json({ message: "회원가입 실패 (아이디 중복 등)", success: false });
    }
});

// 4. 로그인 API (POST /api/login)
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        // DB에서 아이디와 비밀번호가 일치하는 유저 찾기
        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const [rows] = await pool.query(sql, [id, password]);

        if (rows.length > 0) {
            // 로그인 성공! (유저 정보를 프론트로 보내줌)
            res.json({ success: true, user: rows[0] });
        } else {
            // 로그인 실패
            res.json({ success: false, message: "아이디 또는 비밀번호가 틀렸습니다." });
        }
    } catch (error) {
        console.error("로그인 에러:", error);
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

// 서버 시작
app.listen(PORT, async () => {
    try {
        // 서버 켤 때 DB 연결 잘 되는지 테스트
        const connection = await pool.getConnection();
        console.log("✅ MySQL 데이터베이스 연결 성공!");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL 연결 실패! 비밀번호나 DB 이름을 확인하세요.", err);
    }
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});