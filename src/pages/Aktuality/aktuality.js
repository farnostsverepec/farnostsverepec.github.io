import "./aktuality.css"
import Hero from '@components/hero/hero.js';
import ArticlesArray from "@functions/articlesArray/articlesArray";

export default function Aktuality() {
    return (
        <div>
            <Hero background={process.env.PUBLIC_URL + "KostolSverepec.jpg"}>Aktuality</Hero>
            <ArticlesArray source="/external/aktuality"/>
        </div>
    )
}