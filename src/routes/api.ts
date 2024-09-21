import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();

// 20MB maximum file upload size
const MAX_FILE_SIZE = 20_000_000;

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

router.get("/health", (req, res, _) => {
  let reqBody = req.body;

  res.json({
    status: "OK",
  });
});


// Sample Code for handlings file upload
type MultiUploadFiles = {
    [fieldname: string]: Express.Multer.File[]
}

router.post(
  "/upload",
  upload.fields([{ name: "verification_doc", maxCount: 1 }]),
  (req, res, _) => {
    let files = req.files as MultiUploadFiles;
    if (files?.length) {
      res.status(400).send("No files uploaded.");
      return;
    }

    let vDoc = files["verification_doc"]?.[0];
    if (!vDoc) {
      res.status(400).send("No file uploaded.");
      return;
    }

    res.json({
      status: "OK",
      file: vDoc.originalname,
    });
  }
);

export default router;
