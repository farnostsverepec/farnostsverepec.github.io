import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';
import Carousel from '@components/carousel/carousel';
import './fotoContent.css'

export default function FotoContent() {
    const { id } = useParams();
    const [photoNames, setPhotoNames] = useState([]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + `/external/foto/${id}/photos.json`)
            .then(response => response.json())
            .then(json => setPhotoNames(json));
    }, [id]);
    return (
        <div>
            <Hero background={KostolSverepec}><h1>Fotogaléria</h1><span>{id}</span></Hero>
            <Carousel show={1}>{ photoNames.map((photo) => (<img src={"/external/foto/" + id + "/" + photo} alt="" key={photo}/>))}</Carousel>
        </div>
    )
}