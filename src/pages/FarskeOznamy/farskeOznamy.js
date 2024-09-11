import "./farskeOznamy.css"
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';

export default function FarskeOznamy() {
    return (<div><Hero background={KostolSverepec}>Farské Oznamy</Hero></div>)
}