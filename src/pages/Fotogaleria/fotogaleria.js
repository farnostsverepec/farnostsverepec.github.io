import "./fotogaleria.css"
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';

export default function Fotogaleria() {
    return (<div><Hero background={KostolSverepec}>Fotogaléria</Hero></div>)
}