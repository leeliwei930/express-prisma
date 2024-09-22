import blobsService from "@/services/blobs/index";
import { Album, Blobs, PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// A serializer that serialize the created album record to client
interface CreateAlbumResponse {
  id: string;
  name: string;
  description: string | null;
  photos: string[];
}

const photosSerializer = async (blobs: Blobs[]) => {
  let photos = await Promise.all(
    blobs.map(async (blob) => {
      return await blobsService.getSignedUrl({ key: blob!.key, expiresIn: 60 });
    })
  );
  return photos;
};

const albumCreatedResponse = async (albumWithBlobs: {
  album: Album;
  blobs: Blobs[];
}): Promise<CreateAlbumResponse> => {
  let { album, blobs } = albumWithBlobs;
  let photos = await photosSerializer(blobs);

  return {
    id: album.id,
    name: album.name,
    description: album.description,
    photos,
  };
};

export default { albumCreatedResponse };
