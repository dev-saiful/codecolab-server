import http from "http";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./src/config/dbconfig.js";
import { app } from "./src/app.js";


const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  await dbConnect();
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
