import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import branchRouter from "./routes/branch.routes.js";
import brandingRouter from "./routes/branding.routes.js";
import currencyRouter from "./routes/currency.routes.js";
import customerRouter from "./routes/customer.routes.js";
import loginRouter from "./routes/login.routes.js";
import sendEmailRouter from "./routes/send-email.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import usersRouter from "./routes/users.routes.js";
import verifyRouter from "./routes/verify.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static files từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/branch", branchRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/branding", brandingRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/send-email", sendEmailRouter);
app.use("/api/verify-token", verifyRouter);
app.use("/api/customers", customerRouter);

app.use((_req, res) => {
  res.status(404).json({
    message: "API endpoint không tồn tại",
    success: false,
  });
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port}`);
});

export default app;
