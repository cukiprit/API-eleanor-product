import express from "express";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import pool from "../config/mysql.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");
    // console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  verifyToken,
  upload.single("product_image"),
  [
    body("product_name").notEmpty().trim().escape(),
    body("product_description").notEmpty().trim().escape(),
    body("product_price").notEmpty().trim().toFloat(),
    body("product_stock").notEmpty().trim().toInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        product_name,
        product_description,
        product_price,
        product_stock,
      } = req.body;
      const product_image = req.file ? req.file.filename : null;
      const id = uuidv4();

      const [result] = await pool.execute(
        "INSERT INTO products (id_product, product_name, product_description, product_price, product_image, product_stock) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id,
          product_name,
          product_description,
          product_price,
          product_image,
          product_stock,
        ]
      );

      return res.status(201).json({ message: "Product created" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
