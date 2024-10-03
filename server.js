const express = require('express')
const app = express()

const dotenv = require('dotenv');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

const saltRounds = 10;

dotenv.config();
app.use(express.json());

const port = process.env.PORT
const conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

conn.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connect database success');
});

// SELECT ALL USERS
app.get('/users', async (req, res) => {
  let sql = "SELECT * FROM users"

  await conn.execute(sql, (err, result) => {
        if(err) {
            res.status(500).json({ message: err.message });
            return 
        }
        res.status(200).json({ message: "success", data: result });
    });
});

// SELECT USER By ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id; 
    const sql = "SELECT * FROM users WHERE id = ?";  

    await conn.execute(sql, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "success", data: result });
    });
});

// REGISTER USER
app.post('/users/register', async (req, res) => {
    const {name, gender, age, phone, username, password } = req.body;
    let role = "member";
    let createdAt = new Date();

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                res.status(500).json({ message: err.message });
                return;
            }

            let sql = "INSERT INTO users (name, gender, age, phone, username, password, role, createdAt) VALUES (?,?,?,?,?,?,?,?)";
            conn.execute(sql, [name, gender, age, phone, username, hash, role, createdAt], (err, result) => {
                if(err) {
                    res.status(500).json({ message: err.message });
                    return;
                }
                res.status(201).json({ message: "Add data success", data: result });
            });
        });
    });
});

// UPDATE USER
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, age, phone, username, password } = req.body; // No need to get updatedAt from body

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                res.status(500).json({ message: err.message });
                return;
            }

            // No need to pass updatedAt from the body, handled by SQL
            let sql = "UPDATE users SET name = ?, gender = ?, age = ?, phone = ?, username = ?, password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
            conn.execute(sql, [name, gender, age, phone, username, hash, id], (err, result) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                    return;
                }
                res.status(200).json({ message: "Update data success", data: result });
            });
        });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})