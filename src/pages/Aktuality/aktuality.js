import "./aktuality.css"
import Hero from '@components/hero/hero.js';
import KostolSverepec from '@img/KostolSverepec.jpg';
import ArticlesArray from "@functions/articlesArray/articlesArray";

export default function Aktuality() {
    return (
        <div>
            <Hero background={KostolSverepec}>Aktuality</Hero>
            <ArticlesArray source="/external/aktuality"/>
        </div>
    )
}