import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import productRoutes from "./api/routes/products.js";
import loginRoutes from "./api/routes/auth.js";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use("/api", loginRoutes);
app.use("/api/products", productRoutes);

// app.listen(3000, () => console.log("Server started on port 3000"));

const handler = serverless(app);
export { handler };
