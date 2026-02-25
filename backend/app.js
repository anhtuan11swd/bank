import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import uploadRouter from "./routes/upload.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter);

const server = createServer(app);

server.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port}`);
});

export default app;
