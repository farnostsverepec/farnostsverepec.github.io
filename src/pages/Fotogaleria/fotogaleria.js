import { useState, useEffect } from 'react'
import "./fotogaleria.css"
import Hero from '@components/hero/hero.js';
import GalleryChip from "@components/galleryChip/galleryChip";

export default function Fotogaleria() {
    const [galleryTitles, setGalleryTitles] = useState([]);
    const [previewImages, setPreviewImages] = useState({});
  
    useEffect(() => {
      fetch(`/content/external/foto/list.json`)
        .then(response => response.json())
        .then(json => setGalleryTitles(json));
    }, []);
  
    useEffect(() => {
      const fetchPreviewImages = async () => {
        const previewImages = {};
        for (const title of galleryTitles) {
          const response = await fetch(`/content/external/foto/${title}/photos.json`);
          const photos = await response.json();
          previewImages[title] = `/content/external/foto/${title}/${photos[0]}`;
        }
        setPreviewImages(previewImages);
      };
      fetchPreviewImages();
    }, [galleryTitles]);
  
    return (
      <div>
        <Hero background={process.env.PUBLIC_URL + "KostolSverepec.jpg"}>Fotogaléria</Hero>
        {galleryTitles.map((title) => (
          <GalleryChip
            key={title}
            title={title}
            preview={previewImages[title]}
          />
        ))}
      </div>
    );
  }