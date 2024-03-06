import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/users", (req: Request, res: Response) => {
  res.json("Get users");
});

export default router;
