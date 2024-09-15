import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './galleryChip.css';

export default function GalleryChip({ title, preview }) {
    return (
        <div className="galleryChip">
            <img src={preview} alt="" />
            <Link to={"/fotogaleria/" + title}>{title}</Link>
        </div>
    )
}