import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(userRoutes);

app.get("/api", (req: Request, res: Response) => {
  res.json("Welcome to the RESTful API!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
