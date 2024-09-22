import albumsController from "@/controllers/albums/index";
import { Router } from "express";

const router = Router();

router.get("/health", (req, res, _) => {
  return res.json({ status: "ok" });
});

const albumRoute = Router();
albumRoute.post("/create", albumsController.create);

router.use("/albums", albumRoute);
export default router;
