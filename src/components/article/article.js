import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompiledMarkdown from '@functions/md/md.js';
import './article.css';

export default function Article({ root, file, extraArgs = [] }) {
    const [text, setText] = useState('');
    const [compiledContent, setCompiledContent] = useState({ jsx: null, extraValues: [] });

    useEffect(() => {
        fetch(`${root}/${file}`)
            .then(res => res.text())
            .then(restext => {
                setText(restext);
                const compiled = CompiledMarkdown({ text: text, extraArgs: ["title", "description", "date", "gallery"] });
                setCompiledContent(compiled);
            });
    }, [file, extraArgs, root, text]);

    return compiledContent ? (
        <div className="article-container">
            {compiledContent.extraValues[0] && <h1>{compiledContent.extraValues[0]}<span>{ new Date(compiledContent.extraValues[2]).toLocaleDateString("sk-SK") }</span></h1>}
            {compiledContent.extraValues[1] && <h3>{compiledContent.extraValues[1]}</h3>}
            {compiledContent.extraValues[3] && <h6>Tento článok má pripojenú fotogalériu "<Link to={`/fotogaleria/${compiledContent.extraValues[3]}`}>{compiledContent.extraValues[3]}</Link>"</h6>}
            {(compiledContent.extraValues[0] || compiledContent.extraValues[1] || compiledContent.extraValues[3]) && <hr />}
            <div className='article-contents'>
                {compiledContent.jsx}
            </div>
        </div>
    ) : null;
}