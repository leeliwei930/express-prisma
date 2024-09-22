import albumSerializer from "@/serializers/albums/index";
import blobsService from "@/services/blobs/index";
import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import multer from "multer";
const prisma = new PrismaClient();
const storage = multer.memoryStorage();

// 20MB maximum file upload size
const MAX_FILE_SIZE = 20_000_000;

interface CreateAlbumParams {
  name: string;
  description: string | null;
  photos: Express.Multer.File[] | undefined;
}

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadHandler = upload.fields([
  {
    name: "photos",
    maxCount: 3,
  },
]);

const createHandler: RequestHandler = async (req, res, next) => {
  let params = req.body as CreateAlbumParams;

  if (req.files === undefined) {
    return res.status(400).json({ error: "No files were uploaded." });
  }

  let uploadedFiles = req.files as {
    photos: Express.Multer.File[];
  };

  try {
    let blob = await blobsService.uploadAndCreate(uploadedFiles.photos[0]);
    let album = await prisma.album.create({
      data: {
        name: params.name,
        description: params.description,
      },
    });

    await prisma.blobsOnAlbum.create({
      data: {
        blobId: blob.id,
        albumId: album.id,
      },
    });

    let albumCreatedResponse = await albumSerializer.albumCreatedResponse(
      album
    );
    return res.json(albumCreatedResponse);
  } catch (error) {
    next(error);
  }
};

const create: RequestHandler[] = [uploadHandler, createHandler];

export default { create };
