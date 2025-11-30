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

app.listen(PORT, () => {
    console.log(`🚀 백엔드 서버 실행 중: http://localhost:${PORT}`);
});