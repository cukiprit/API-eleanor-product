import express from "express";
import productRoutes from "./api/routes/products.js";
import loginRoutes from "./api/routes/auth.js";
import verifyToken from "./api/middleware/verifyToken.js";

const app = express();
app.use(express.json());
// app.use(verifyToken);

app.use("/api", loginRoutes);
app.use("/api/products", productRoutes);

app.listen(3000, () => console.log("Server started on port 3000"));
