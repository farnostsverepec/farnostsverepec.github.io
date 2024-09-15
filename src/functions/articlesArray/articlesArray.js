import { useState, useEffect } from 'react';
import './articlesArray.css';
import Article from '@components/article/article';

export default function ArticlesArray({source}) {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + source + "/articles.json")
        .then(response => response.json())
        .then(json => setArticles(json.reverse()));
    }, [source]);

    return articles.length ? (<div className='articles-array'>{articles.map(article => <Article root={source} file={article} key={article}/>)}</div>) : <h1>Načítavajú sa dáta...</h1>
}