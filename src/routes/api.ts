import albumsController from "@/controllers/albums/index";
import { Router } from "express";

const router = Router();

router.get("/health", (req, res, _) => {
  return res.json({ status: "ok" });
});

const albumRoute = Router();
router.use("/albums", albumRoute);

// This register the endpoint /api/v1/albums/create
albumRoute.post("/create", albumsController.create);

export default router;
