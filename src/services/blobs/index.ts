import { S3 } from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { PrismaClient } from "@prisma/client";
import { Hash } from "@smithy/hash-node";
import { HttpRequest } from "@smithy/protocol-http";
import { parseUrl } from "@smithy/url-parser";
import { nanoid } from "nanoid";
const { NodeHttpHandler } = require("@smithy/node-http-handler");
console.log(process.env.S3_ENDPOINT_URL);
const s3Client = new S3({
  endpoint: process.env.S3_ENDPOINT_URL,
  region: process.env.S3_REGION,
  credentials: {
    accountId: process.env.S3_ACCOUNT_ID ?? "",
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

const prismaClient = new PrismaClient();

const generateRandomFilename = (file: Express.Multer.File) => {
  const randomFileKey = nanoid(25);
  let fileKeyPrefix = (fileKey: string): string => {
    // some security measure to prevent file guessing
    // we take the generated file key, take the first 2 characters as folder root, and last 2 as subdir
    // so the file will be stored in a folder structure like this: /ab/cd/abcdefg.ext
    let [pathRoot, pathSubDir] = [fileKey.slice(0, 2), fileKey.slice(2, 4)];
    return `${pathRoot}/${pathSubDir}`;
  };

  // Extractout the filename without extension
  let originalFileName = file.originalname.split(".").shift();
  // priginal filename extension
  let originalFileExtension = file.originalname.split(".").pop();

  return `${fileKeyPrefix(
    randomFileKey
  )}/${originalFileName}_${randomFileKey}.${originalFileExtension}`;
};

const uploadAndCreate = async (file: Express.Multer.File) => {
  let generatedUploadedFileName = generateRandomFilename(file);

  let uploadedFile = await s3Client.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: generatedUploadedFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalFileName: file.originalname,
    },
  });

  let blob = await prismaClient.blobs.create({
    data: {
      checksum: uploadedFile.ChecksumCRC32C ?? "",
      filename: file.originalname,
      key: generatedUploadedFileName,
      size: file.size,
      mimetype: file.mimetype,
      disk: "s3",
    },
  });

  return blob;
};

const createPresignedUrl = async ({
  region,
  bucket,
  key,
  expiresIn,
}: {
  region: string;
  bucket: string;
  key: string;
  expiresIn: number;
}) => {
  const signedUrl =
    process.env.APP_ENV === "development"
      ? `${process.env.S3_ENDPOINT_URL}/${bucket}/${key}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  const parsedSignedUrl = parseUrl(signedUrl);
  const presigner = new S3RequestPresigner({
    credentials: {
      accountId: process.env.S3_ACCOUNT_ID ?? "",
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    region,
    sha256: Hash.bind(null, "sha256"),
  });

  const signedUrlObject = await presigner.presign(
    new HttpRequest(parsedSignedUrl),
    {
      expiresIn,
    }
  );
  return formatUrl(signedUrlObject);
};

const getSignedUrl = async ({
  key,
  expiresIn,
}: {
  key: string;
  expiresIn: number;
}) => {
  return createPresignedUrl({
    region: process.env.S3_REGION ?? "",
    bucket: process.env.S3_BUCKET_NAME ?? "",
    key,
    expiresIn,
  });
};

export default { getSignedUrl, uploadAndCreate };
