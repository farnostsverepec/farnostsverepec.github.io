import { useState, useEffect } from 'react';
import './articlesArray.css';
import Article from '@components/article/article';

export default function ArticlesArray() {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + `/external/articles.json`)
        .then(response => response.json())
        .then(json => setArticles(json.reverse()));
    }, []);

    return articles.length ? (<div className='articles-array'>{articles.map(article => <Article file={article} key={article}/>)}</div>) : <h1>Načítavajú sa dáta...</h1>
}