import "./farskeOznamy.css"
import Hero from '@components/hero/hero.js';
import ArticlesArray from "@functions/articlesArray/articlesArray";

export default function FarskeOznamy() {
    return (
        <div>
            <Hero background={process.env.PUBLIC_URL + "KostolSverepec.jpg"}>Farské Oznamy</Hero>
            <ArticlesArray source="/content/external/oznamy"/>
        </div>
    )
}