import React from 'react';

export default function CompiledMarkdown({ text, className, id }) {
    const lines = text.split('\n');
    const elements = [];
    let currentOl = [];
    let currentUl = [];

    lines.forEach((line, index) => {
        if (line.startsWith('# ')) {
            elements.push(<h1 key={index}>{line.slice(2)}</h1>);
        } else if (line.startsWith('## ')) {
            elements.push(<h2 key={index}>{line.slice(3)}</h2>);
        } else if (line.startsWith('### ')) {
            elements.push(<h3 key={index}>{line.slice(4)}</h3>);
        } else if (/^\d+\. /.test(line)) {
            const listItem = <li key={index}>{line.replace(/^\d+\. /, '')}</li>;
            currentOl.push(listItem);
            if (index === lines.length - 1 || !/^\d+\. /.test(lines[index + 1])) {
                const start = parseInt(line.match(/^\d+/)[0], 10);
                elements.push(<ol key={`ol-${index}`} start={start}>{currentOl}</ol>);
                currentOl = [];
            }
        } else if (line.startsWith('- ')) {
            const listItem = <li key={index}>{line.slice(2)}</li>;
            currentUl.push(listItem);
            if (index === lines.length - 1 || !lines[index + 1].startsWith('- ')) {
                elements.push(<ul key={`ul-${index}`}>{currentUl}</ul>);
                currentUl = [];
            }
        } else {
            if (currentOl.length > 0) {
                elements.push(<ol key={`ol-${index}`}>{currentOl}</ol>);
                currentOl = [];
            }
            if (currentUl.length > 0) {
                elements.push(<ul key={`ul-${index}`}>{currentUl}</ul>);
                currentUl = [];
            }
            const formattedLine = line
                .replace(/\*\*(.*?)\*\*/g, (_, match) => `<strong>${match}</strong>`)
                .replace(/\*(.*?)\*/g, (_, match) => `<i>${match}</i>`);
            elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
        }
    });

    return <div className={className} id={id}>{elements}</div>;
}
