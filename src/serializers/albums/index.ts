import blobsService from "@/services/blobs/index";
import { Album, PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// A serializer that serialize the created album record to client
interface CreateAlbumResponse {
  id: string;
  name: string;
  description: string | null;
  photos: string[];
}

const photosSerializer = async (album: Album) => {
  let blobs = await prismaClient.blobsOnAlbum.findMany({
    where: {
      albumId: album.id,
    },
  });

  let photos = await Promise.all(
    blobs.map(async (albumBlobs) => {
      let blob = await prismaClient.blobs.findUnique({
        where: {
          id: albumBlobs.blobId,
        },
      });

      return await blobsService.getSignedUrl({ key: blob!.key, expiresIn: 60 });
    })
  );
  return photos;
};

const albumCreatedResponse = async (
  album: Album
): Promise<CreateAlbumResponse> => {
  let photos = await photosSerializer(album);
  return {
    id: album.id,
    name: album.name,
    description: album.description,
    photos,
  };
};

export default { albumCreatedResponse };
