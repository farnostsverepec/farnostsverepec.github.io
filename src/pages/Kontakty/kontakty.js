import Hero from '../../components/hero/hero.js';
import KostolSverepec from '../../images/KostolSverepec.jpg';
import './kontakty.css'

export default function Kontakty() {
    return (
        <div>
            <Hero background={KostolSverepec}>Kontakty</Hero>
            <span><strong>Email:</strong> rkfu.sverepec@gmail.com</span><br />
            <span><strong>Tel. č:</strong> 0947 955 033</span>
        </div>
    )
}