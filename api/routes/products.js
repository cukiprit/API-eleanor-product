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

const getExistingImageFilename = async (id) => {
  try {
    const [rows] = await pool.execute(
      "SELECT product_image FROM products WHERE id_product = ?",
      [id]
    );

    if (rows.length > 0) {
      return rows[0].product_image;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");

    const products = rows.map((product) => ({
      ...product,
      product_image: `http://localhost:3000/uploads/${product.product_image}`,
    }));

    return res.status(200).json({ products });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id_product = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No product found with that ID" });
    }

    const product = rows.map((product) => ({
      ...product,
      product_image: `http://localhost:3000/uploads/${product.product_image}`,
    }));

    return res.status(200).json({ product });
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

router.put(
  "/:id",
  verifyToken,
  upload.single("product_image"),
  [
    body("product_name").optional().trim().escape(),
    body("product_description").optional().trim().escape(),
    body("product_price").optional().isNumeric().toFloat(),
    body("product_stock").optional().isNumeric().toInt(),
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

      const existingImageFilename = await getExistingImageFilename(
        req.params.id
      );
      const finalImageFilename = product_image || existingImageFilename;

      const [result] = await pool.execute(
        "UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_image = ?, product_stock = ? WHERE id_product = ?",
        [
          product_name,
          product_description,
          product_price,
          finalImageFilename,
          product_stock,
          req.params.id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No product found with that ID" });
      }

      return res.status(200).json({ message: "Product updated" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", verifyToken, async (req, res) => {
  const [result] = await pool.execute(
    "DELETE FROM products WHERE id_product = ?",
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "No product found with that ID" });
  }

  res.status(202).json({ message: "Product deleted" });
});

export default router;
