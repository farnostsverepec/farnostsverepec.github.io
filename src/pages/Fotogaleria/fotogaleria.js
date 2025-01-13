import { useState, useEffect } from 'react'
import "./fotogaleria.css"
import Hero from '@components/hero/hero.js';
import GalleryChip from "@components/galleryChip/galleryChip";

export default function Fotogaleria() {
    const [galleryTitles, setGalleryTitles] = useState([]);
    const [previewImages, setPreviewImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      fetch(`/content/external/foto/list.json`)
        .then(response => response.json())
        .then(json => setGalleryTitles(json))
        .catch(error => {
          console.error('Failed to fetch gallery list:', error);
          setGalleryTitles([]);
        });
    }, []);

    useEffect(() => {
        const fetchPreviewImages = async () => {
            const previewImages = {};
            setIsLoading(true);
            try {
                for (const title of galleryTitles) {
                    const response = await fetch(`/content/external/foto/${title}/photos.json`);
                    const photos = await response.json();
                    previewImages[title] = `/content/external/foto/${title}/${photos[0]}`;
                }
                await Promise.all(galleryTitles.map(async (title) => {
                    try {
                        const response = await fetch(`/content/external/foto/${title}/photos.json`);
                        const photos = await response.json();
                        previewImages[title] = `/content/external/foto/${title}/${photos[0]}`;
                    } catch (error) {
                        console.error(`Failed to fetch photos for gallery ${title}:`, error);
                        previewImages[title] = null;
                    }
                }));
                setPreviewImages(previewImages);
            } catch (error) {
                console.error('Failed to fetch preview images:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPreviewImages();
    }, [galleryTitles]);

    return (
        <div>
          <Hero background={"/KostolSverepec.jpg"}>Fotogaléria</Hero>
          {isLoading ? (
            <h1>Načítavajú sa dáta...</h1>
        ) : (
            <div className="galleryChips">
            {galleryTitles.toReversed().map((title) => (
              <GalleryChip
                key={title}
                title={title}
                preview={previewImages[title] }
              />
              ))}
            </div>
          )}
        </div>
      );
}