import "./farskeOznamy.css"
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';
import ArticlesArray from "@functions/articlesArray/articlesArray";

export default function FarskeOznamy() {
    return (
        <div>
            <Hero background={KostolSverepec}>Farské Oznamy</Hero>
            <ArticlesArray source="/external/oznamy"/>
        </div>
    )
}