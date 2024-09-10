import React from 'react';

export default function CompiledMarkdown({ text, className, id }) {
    const lines = text.split('\n');
    const elements = [];
    let currentOl = [];
    let currentUl = [];

    const processInlineFormatting = (line) => {
        // Process escaped backslashes first
        line = line.replace(/\\\\/g, '&#92;');

        // Process non-escaped formatting
        const patterns = [
            { regex: /(?<!\\)\*\*(.*?)(?<!\\)\*\*/g, replacement: '<strong>$1</strong>' },
            { regex: /(?<!\\)\*(.*?)(?<!\\)\*/g, replacement: '<i>$1</i>' },
            { regex: /(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/g, replacement: '<a href="$2">$1</a>' },
            { regex: /(?<!\\)\^(.*?)(?<!\\)\^/g, replacement: '<sup>$1</sup>' },
            { regex: /(?<!\\)_(.*?)(?<!\\)_/g, replacement: '<sub>$1</sub>' },
            { regex: /(?<!\\)~~(.*?)(?<!\\)~~/g, replacement: '<del>$1</del>' },
        ];

        patterns.forEach(({ regex, replacement }) => {
            line = line.replace(regex, replacement);
        });

        // Remove escape characters, but not for backslashes
        line = line.replace(/\\([^\\])/g, '$1');

        // Convert remaining escaped backslashes back to single backslashes
        line = line.replace(/&#92;/g, '\\');

        return line;
    };

    lines.forEach((line, index) => {
        if (line.startsWith('# ')) {
            elements.push(<h1 key={index}>{processInlineFormatting(line.slice(2))}</h1>);
        } else if (line.startsWith('## ')) {
            elements.push(<h2 key={index}>{processInlineFormatting(line.slice(3))}</h2>);
        } else if (line.startsWith('### ')) {
            elements.push(<h3 key={index}>{processInlineFormatting(line.slice(4))}</h3>);
        } else if (/^\d+\. /.test(line)) {
            const listItem = <li key={index}>{processInlineFormatting(line.replace(/^\d+\. /, ''))}</li>;
            currentOl.push(listItem);
            if (index === lines.length - 1 || !/^\d+\. /.test(lines[index + 1])) {
                const start = parseInt(line.match(/^\d+/)[0], 10);
                elements.push(<ol key={`ol-${index}`} start={start}>{currentOl}</ol>);
                currentOl = [];
            }
        } else if (line.startsWith('- ')) {
            const listItem = <li key={index}>{processInlineFormatting(line.slice(2))}</li>;
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
            const formattedLine = processInlineFormatting(line);
            elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
        }
    });

    return <div className={className} id={id}>{elements}</div>;
}