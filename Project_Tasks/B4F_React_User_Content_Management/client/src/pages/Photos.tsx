import { useUser } from "@/context/UserContext";
import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
import { photosApi } from "@/services/api";
import { useParams } from "react-router";
import type { Photo } from "@/lib/types";
import { pageMeta } from "@/lib/constants";
import AlbumGrid from "@/components/AlbumGrid";
import PhotoCard from "@/components/PhotoCard";

const Photos = () => {
  const { user } = useUser();
  const { albumId } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchAlbums = async (albumId: string) => {
      const response = await photosApi.getAll(`?albumId=${albumId}`);
      setPhotos(response?.data || []);
    };
    if (albumId) {
      fetchAlbums(albumId);
    }
  }, [user, albumId, update]);
  // console.log(albumId);
  // console.log(photos.length);
  return (
    <div>
      <PageHeader {...pageMeta.albumPhotos} AddButton={<></>} />
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-lg font-semibold">No photos found</p>
        </div>
      ) : (
      <AlbumGrid>
        {photos.map((photo) => (
          <PhotoCard key={photo.id} { ...photo} setUpdate={setUpdate} />
        ))}
      </AlbumGrid>
      )}
    </div>
  );
};

export default Photos;
