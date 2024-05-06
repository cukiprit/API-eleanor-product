import express from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/mysql.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("username").notEmpty().trim().escape(),
    body("password").notEmpty().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const [rows] = await pool.execute(
        "SELECT id_user, password FROM users WHERE username = ?",
        [username]
      );

      if (rows.result === 0) {
        return res
          .status(401)
          .json({ error: "No user found with that username!" });
      }

      const user = rows[0];
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      const token = generateToken(user.id_user);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/register",
  [
    body("username").notEmpty().trim().escape(),
    body("password").notEmpty().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.execute(
        "INSERT INTO users (id_user, username, password) VALUES (?, ?, ?)",
        [id, username, hashedPassword]
      );

      const userId = result.insertId;
      const token = generateToken(userId);

      return res.status(201).json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
