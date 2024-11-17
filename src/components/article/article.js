import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompiledMarkdown, { getExtraArgs } from '@functions/md/md.js';
import './article.css';

export default function Article({ root, file, extraArgs = [] }) {
    const [text, setText] = useState('');
    const [extraDetails, setExtraDetails] = useState(new Array(extraArgs.length).fill(null));

    useEffect(() => {
        fetch(`${root}/${file}`)
            .then(res => res.text())
            .then(restext => {
                setText(restext);
            });
    }, [file, extraArgs, root]);

    useEffect(() => {
        const newExtraDetails = getExtraArgs(text, extraArgs);
        // Only update if details actually changed
        if (JSON.stringify(newExtraDetails) !== JSON.stringify(extraDetails)) {
            setExtraDetails(newExtraDetails);
        }
    }, [text, extraArgs, extraDetails]);

    return (
        <div className="article-container">
            {extraDetails[0] && <h1>{extraDetails[0]}<span>{ new Date(extraDetails[2]).toLocaleDateString("sk-SK") }</span></h1>}
            {extraDetails[1] && <h3>{extraDetails[1]}</h3>}
            {extraDetails[3] && <h6>Tento článok má pripojenú fotogalériu "<Link to={`/fotogaleria/${extraDetails[3]}`}>{extraDetails[3]}</Link>"</h6>}
            {(extraDetails[0] || extraDetails[1] || extraDetails[3]) && <hr />}
            <div className='article-contents'>
                <CompiledMarkdown text={text} />
            </div>
        </div>
    )
}