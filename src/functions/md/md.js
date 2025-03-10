import React from 'react';
import { useMediaQuery } from 'react-responsive';
import PDFWrapper from './PDFWrapper.js';
import "./md.css";

export function getExtraArgs(text, extraArgs) {
    const extraValues = new Array(extraArgs.length).fill(null);

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

    text.split('\n').forEach(processExtraArgs);

    return extraValues;
}

export default function CompiledMarkdown({ text, className, id, style, fileName }) {
    const isNarrowScreen = useMediaQuery({ query: '(max-width: 588px)' });

    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentOl = [];
    let currentUl = [];
    let currentTable = [];
    let isInTable = false;
    let tableConfig = null;

    // Special marker for PDF rendering
    const PDF_MARKER_PREFIX = 'ピーディーエフマーカー';

    const processInlineFormatting = (line) => {
        // Process escaped backslashes first
        line = line.replace(/\\\\/g, '&#92;');

        // Convert '\n' to '<br />' before other processing
        line = line.replace(/(?<!\\)\\n/g, '<br />');

        // Process image and PDF syntax before other formatting
        // For PDFs: ![pdf](file.pdf)
        line = line.replace(
            /(?<!\\)!\[(pdf)\]\((.*?\.pdf)(?<!\\)\)/g, 
            `${PDF_MARKER_PREFIX}$2`
        );
        
        // For regular images: ![alt text](image-url)
        line = line.replace(
            /(?<!\\)!\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/g, 
            '<img src="$2" alt="$1" />'
        );

        // Process non-escaped formatting
        const patterns = [
            { regex: /(?<!\\)\*\*(.*?)(?<!\\)\*\*/g, replacement: '<strong>$1</strong>' },
            { regex: /(?<!\\)\*(.*?)(?<!\\)\*/g, replacement: '<i>$1</i>' },
            { regex: /(?<!\\)\[(.*?)(?<!\\)\]\((.*?)(?<!\\)\)/g, replacement: '<a href="$2">$1</a>' },
            { regex: /(?<!\\)\^(.*?)(?<!\\)\^/g, replacement: '<sup>$1</sup>' },
            { regex: /^(?!ピーディーエフマーカー)(?<!\\)_(.*?)(?<!\\)_/g, replacement: '<sub>$1</sub>' },
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

    const renderSplitTable = (headerCells, separator, rows) => {
        const columns = headerCells.map((_, colIndex) => (
            <div key={colIndex}>
                <table className="MDTable">
                    <thead>
                        <tr>
                            <th style={{ textAlign: getColumnAlignment(separator[colIndex]) }} dangerouslySetInnerHTML={{ __html: processInlineFormatting(headerCells[colIndex]) }} />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => {
                            const cells = parseTableRow(row);
                            const lastContentfulCell = cells.slice().reverse().find(cell => cell !== '-///-');
                            const cellContent = cells[colIndex] === '-///-' ? lastContentfulCell : cells[colIndex];
                            return (
                                <tr key={rowIndex}>
                                    <td style={{ textAlign: getColumnAlignment(separator[colIndex]) }} dangerouslySetInnerHTML={{ __html: processInlineFormatting(cellContent) }} />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ));
        return <div className="table-split">{columns}</div>;
    };

    // Function to process PDF markers and convert them to React components
    const processPdfElements = (content) => {
        // Check if content contains a PDF marker
        if (typeof content === 'string' && content.includes(PDF_MARKER_PREFIX)) {
            const pdfPath = content.replace(PDF_MARKER_PREFIX, '');
            console.log(pdfPath);
            return <PDFWrapper file={pdfPath} />;
        }
        return content;
    };

    // Helper function to create elements with PDF support
    const createElementWithPdfSupport = (tag, key, content) => {
        if (typeof content === 'string' && content.includes(PDF_MARKER_PREFIX)) {
            const pdfPath = content.replace(PDF_MARKER_PREFIX, '');
            return React.createElement(tag, { key }, <PDFWrapper file={pdfPath} />);
        }
        return React.createElement(tag, { key, dangerouslySetInnerHTML: { __html: content } });
    };

    lines.forEach((line, index) => {
        if (line.trim() === '---') {
            elements.push(<hr key={`hr-${index}`} />);
        } else if (line.startsWith('<!-- table-setup ')) {
            const configParts = line.replace('<!-- table-setup ', '').replace(' -->', '').split(';');
            tableConfig = {};
            configParts.forEach((part) => {
                const [key, value] = part.trim().split('=');
                if (key === 'wrapHideHeader') { tableConfig = { ...tableConfig, wrapHideHeader: value === 'true' }; } else {
                    tableConfig[key] = value.split(",").length === 1 ? value : value.split(",");
                }
            });
            console.log(fileName)
        } else if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
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

                const tableElement = (isNarrowScreen && /\/static\/media\/kontakty\.(.*)\.md/.test(fileName)) ? renderSplitTable(headerCells, separators, rows) :
                    <table key={`table-${index}`} id={fileName.replace(/\//g, '-').replace(' ', '_').replace(/\.md$/, "").replace(/^[-_](.*)|(.*)[-_]$/, `$1`) + "-l" + index} className={`MDTable ${tableConfig?.wrapStyle ? ("table-wrap-" + tableConfig.wrapStyle) : ''}`}>
                        <style>
                            {`@media (${tableConfig?.wrapOn ? Array.isArray(tableConfig.wrapOn) ? tableConfig.wrapOn.join(') and (') : tableConfig.wrapOn : ''}) {
                                table#${fileName.replace(/\//g, '-').replace(' ', '_').replace(/\.md$/, "").replace(/^[-_](.*)|(.*)[-_]$/, `$1`) + "-l" + index} {
                                    & thead.table-wrap-hide-header {
                                        display:none
                                    }

                                    & tbody {
                                    display: flex;
                                    flex-direction: column;
                                    row-gap: 16px;
                                        tr {
                                            display: flex;
                                            flex-direction: column;
                                        }
                                    }
                                }   
                            }`}
                        </style>
                        <thead className={tableConfig?.wrapHideHeader ? 'table-wrap-hide-header' : ''}>
                            <tr>
                                {headerCells.map((cell, i) => (
                                    <th key={i} style={{ textAlign: alignments[i] }}>
                                        <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(cell) }} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => {
                                const cells = parseTableRow(row);
                                const renderedCells = [];

                                for (let i = 0; i < cells.length; i++) {
                                    if (cells[i] === '-///-') {
                                        // Skip rendering this cell as it spans with the previous one
                                        continue;
                                    }
                                    const colspan = (i + 1 < cells.length && cells[i + 1] === '-///-') ? 2 : 1;
                                    const processedCell = processInlineFormatting(cells[i]);
                                    
                                    renderedCells.push(
                                        <td key={i} colSpan={colspan} style={{ textAlign: alignments[i] }}>
                                            {processedCell.includes(PDF_MARKER_PREFIX) ? 
                                                processPdfElements(processedCell) : 
                                                <span dangerouslySetInnerHTML={{ __html: processedCell }} />
                                            }
                                        </td>
                                    );
                                }

                                return <tr key={rowIndex}>{renderedCells}</tr>;
                            })}
                        </tbody>
                    </table>
                elements.push(
                    <div key={`table-wrapper-${index}`} className="table-wrapper">
                        {tableElement}
                    </div>
                );
                isInTable = false;
                currentTable = [];
                tableConfig = null;
            }
        } else if (line.startsWith('# ')) {
            const formattedText = processInlineFormatting(line.slice(2));
            elements.push(
                formattedText.includes(PDF_MARKER_PREFIX) ?
                createElementWithPdfSupport('h1', index, formattedText) :
                <h1 key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
            );
        } else if (line.startsWith('## ')) {
            const formattedText = processInlineFormatting(line.slice(3));
            elements.push(
                formattedText.includes(PDF_MARKER_PREFIX) ?
                createElementWithPdfSupport('h2', index, formattedText) :
                <h2 key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
            );
        } else if (line.startsWith('### ')) {
            const formattedText = processInlineFormatting(line.slice(4));
            elements.push(
                formattedText.includes(PDF_MARKER_PREFIX) ?
                createElementWithPdfSupport('h3', index, formattedText) :
                <h3 key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
            );
        } else if (/^\d+\. /.test(line)) {
            const listItemContent = processInlineFormatting(line.replace(/^\d+\. /, ''));
            
            const listItem = listItemContent.includes(PDF_MARKER_PREFIX) ? 
                <li key={index}>{processPdfElements(listItemContent)}</li> :
                <li key={index} dangerouslySetInnerHTML={{ __html: listItemContent }} />;
                
            currentOl.push(listItem);
            if (index === lines.length - 1 || !/^\d+\. /.test(lines[index + 1])) {
                const start = parseInt(line.match(/^\d+/)[0], 10);
                elements.push(<ol key={`ol-${index}`} start={start}>{currentOl}</ol>);
                currentOl = [];
            }
        } else if (line.startsWith('- ')) {
            const listItemContent = processInlineFormatting(line.slice(2));
            
            const listItem = listItemContent.includes(PDF_MARKER_PREFIX) ? 
                <li key={index}>{processPdfElements(listItemContent)}</li> :
                <li key={index} dangerouslySetInnerHTML={{ __html: listItemContent }} />;
                
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
            
            if (formattedLine.includes(PDF_MARKER_PREFIX)) {
                elements.push(
                    <p key={index}>
                        {processPdfElements(formattedLine)}
                    </p>
                );
            } else {
                elements.push(
                    <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                );
            }
        }
    });

    return <div className={className} id={id} style={style}>{elements}</div>
}
