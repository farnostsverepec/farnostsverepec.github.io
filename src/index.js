/* eslint-disable no-extend-native */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { pdfjs } from 'react-pdf';
import './fonts/fonts.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

/**
 * Converts a string to camel case.
 *
 * @return {string} The camel case version of the string.
 */
String.prototype.toCamelCase = function() {
    return this.split(/[\s-_]+/)
        .map((word, index) => {
            if (index === 0) { return word.toLowerCase(); }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
};

/**
 * Removes diacritics from a string.
 *
 * @return {string} The string without diacritics.
 */
String.prototype.removeDiacritics = function() {
    return this.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);