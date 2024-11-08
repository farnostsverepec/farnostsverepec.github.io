import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@components/sidebar/sidebar.js';
import OFarnosti from '@pages/OFarnosti/oFarnosti.js';
import Kontakty from '@pages/Kontakty/kontakty.js';
import NotFound from '@pages/NotFound/NotFound.js';
import Fotogaleria from '@pages/Fotogaleria/fotogaleria.js';
import FotoContent from '@pages/FotoContent/fotoContent.js';
import FarskeOznamy from  '@pages/FarskeOznamy/farskeOznamy.js';
import Aktuality from '@pages/Aktuality/aktuality.js';

import './App.css';
import './fonts/fonts.css'

export default function App() {
    return (
        <Router>
            <Sidebar>{['O farnosti', 'Farské oznamy', 'Aktuality', 'Fotogaléria', 'Kontakty']}</Sidebar>
            <div id="content">
                <Routes>
                    <Route path="/" element={<OFarnosti />} />
                    <Route path="oFarnosti" element={<OFarnosti />} />
                    <Route path="farskeOznamy" element={<FarskeOznamy />} />
                    <Route path="aktuality" element={<Aktuality />} />
                    <Route path="fotogaleria" element={<Fotogaleria />} />
                    <Route path="fotogaleria/:id" element={<FotoContent />} />
                    <Route path="kontakty" element={<Kontakty />} />
                    <Route path="404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </div>
        </Router>
    )
}