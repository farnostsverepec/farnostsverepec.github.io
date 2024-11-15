import "./aktuality.css"
import Hero from '@components/hero/hero.js';
import ArticlesArray from "@functions/articlesArray/articlesArray";

export default function Aktuality() {
    return (
        <div>
            <Hero background={"/KostolSverepec.jpg"}>Aktuality</Hero>
            <ArticlesArray source="/content/external/aktuality"/>
        </div>
    )
}