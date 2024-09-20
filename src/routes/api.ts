import { Router } from "express";

const router = Router();

router.get("/health", (req, res, _) => {
  res.json({
    status: "OK",
  });
});

export default router;
