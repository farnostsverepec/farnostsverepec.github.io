/* eslint-disable no-extend-native */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

String.prototype.toCamelCase = function() {
    return this.split(/[\s-_]+/)
        .map((word, index) => {
            if (index === 0) { return word.toLowerCase(); }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
};

String.prototype.removeDiacritics = function() {
    return this.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);