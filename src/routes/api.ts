import albumsController from "@/controllers/albums/index";
import { Router } from "express";

const router = Router();

router.get("/health", (req, res, _) => {
  throw new Error("This is an error");
});

const albumRoute = Router();
albumRoute.post("/create", albumsController.create);

router.use("/albums", albumRoute);
export default router;
