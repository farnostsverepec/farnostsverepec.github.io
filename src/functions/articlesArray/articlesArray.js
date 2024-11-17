import { useState, useEffect } from 'react';
import './articlesArray.css';
import Article from '@components/article/article';

export default function ArticlesArray({source}) {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetch(`${source}/articles.json`)
        .then(response => response.json())
        .then(json => setArticles(json.reverse()))
        .catch(error => {
          console.error('Error fetching articles:', error);
          setArticles([]);  // Set empty array to trigger "No data" state
        });
    }, [source]);

    return articles.length ? (<div className='articles-array'>{articles.map(article => <Article root={source} file={article} key={article} extraArgs={["title", "description", "date", "gallery"]}/>)}</div>) : <h1>Načítavajú sa dáta...</h1>
}