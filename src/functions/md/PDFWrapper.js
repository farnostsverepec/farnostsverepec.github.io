import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

export default function PDFWrapper({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
            <style>{`.react-pdf__Document {display: flex; flex-direction: column; width: fit-content; left: 50%; transform: translateX(-50%); position: relative;} .react-pdf__Page > div { display: none; } .react-pdf__Page__canvas {width: 100% !important; aspect-ratio: 1/1.414 !important; height: unset !important}`}</style>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber}/>
            </Document>
            <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', left: '50%', transform: 'translateX(-50%)', position: 'relative', textAlign: 'center', rowGap: '8px' }}>
                <p>
                    Strana {pageNumber || (numPages ? 1 : '--')} z {numPages || '--'}
                </p>
                <div style={{display: 'flex', flexDirection: 'row', columnGap: '8px'}}>
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                    >
                        Prechádzajúca Strana
                    </button>
                    <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                    >
                        Nasledujúca Strana
                    </button>
                </div>
            </div>
        </>
    );
}