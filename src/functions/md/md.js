import React from 'react';
import "./md.css"

export default function CompiledMarkdown({ text, className, id, extraArgs = [] }) {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let currentOl = [];
    let currentUl = [];
    let currentTable = [];
    let isInTable = false;
    const extraValues = new Array(extraArgs.length).fill(null);

    const processInlineFormatting = (line) => {
        // Process escaped backslashes first
        line = line.replace(/\\\\/g, '&#92;');

        // Convert '\n' to '<br />' before other processing
        line = line.replace(/(?<!\\)\\n/g, '<br />');

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

    const parseTableRow = (row) => {
        return row.split('|').slice(1, -1).map(cell => cell.trim());
    };

    const getColumnAlignment = (separator) => {
        if (separator.startsWith(':') && separator.endsWith(':')) return 'center';
        if (separator.endsWith(':')) return 'right';
        return 'left';
    };

    const processExtraArgs = (line) => {
        const commentRegex = /<!--\s*(\w+)\s*:\s*"(.+?)"\s*-->/;
        const match = line.match(commentRegex);
        if (match) {
            const [, argName, argValue] = match;
            const index = extraArgs.indexOf(argName);
            if (index !== -1) {
                extraValues[index] = argValue;
            }
        }
    };

    lines.forEach((line, index) => {
        processExtraArgs(line);

        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            if (!isInTable) {
                isInTable = true;
                currentTable = [];
            }
            currentTable.push(line);
            if (index === lines.length - 1 || !lines[index + 1].trim().startsWith('|')) {
                // End of table
                const [header, separator, ...rows] = currentTable;
                const headerCells = parseTableRow(header);
                const separators = parseTableRow(separator);
                const alignments = separators.map(getColumnAlignment);

                const tableElement = (
                    <table key={`table-${index}`} className='MDTable'>
                        <thead>
                            <tr>
                                {headerCells.map((cell, i) => (
                                    <th key={i} style={{ textAlign: alignments[i] }}>
                                        <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(cell) }} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {parseTableRow(row).map((cell, cellIndex) => (
                                        <td key={cellIndex} style={{ textAlign: alignments[cellIndex] }}>
                                            <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(cell) }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                elements.push(tableElement);
                isInTable = false;
                currentTable = [];
            }
        } else if (line.startsWith('# ')) {
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
    return (extraArgs.length === 0 || !extraArgs) ? (<div className={className} id={id}>{elements}</div>) : {
        jsx: <div className={className} id={id}>{elements}</div>,
        extraValues
    };
}