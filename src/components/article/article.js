import { useState, useEffect } from 'react';
import CompiledMarkdown from '@functions/md/md.js';
import './article.css';

export default function Article({ file, extraArgs = [] }) {
    const [text, setText] = useState('');
    const [compiledContent, setCompiledContent] = useState({ jsx: null, extraValues: [] });

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + `/external/${file}`)
            .then(res => res.text())
            .then(restext => {
                setText(restext);
                const compiled = CompiledMarkdown({ text: text, extraArgs: ["title", "description", "date"] });
                setCompiledContent(compiled);
            });
    }, [file, extraArgs]);

    return compiledContent ? (
        <div className="article-container">
            {compiledContent.extraValues[0] && <h1>{compiledContent.extraValues[0]}<span>{ new Date(compiledContent.extraValues[2]).toLocaleDateString("sk-SK") }</span></h1>}
            {compiledContent.extraValues[1] && <h3>{compiledContent.extraValues[1]}</h3>}
            {(compiledContent.extraValues[0] || compiledContent.extraValues[1]) && <hr />}
            <div className='article-contents'>
                {compiledContent.jsx}
            </div>
        </div>
    ) : null;
}