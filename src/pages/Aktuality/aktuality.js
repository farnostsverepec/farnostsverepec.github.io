import "./aktuality.css"
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';

export default function Aktuality() {
    return (<div><Hero background={KostolSverepec}>Aktuality</Hero></div>)
}