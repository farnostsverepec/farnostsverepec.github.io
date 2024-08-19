import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar.js';
import OFarnosti from './pages/OFarnosti/oFarnosti.js';
import Kontakty from './pages/Kontakty/kontakty.js';
import NotFound from './pages/NotFound/NotFound.js';
import './App.css'

export default function App() {
    return (
        <Router>
            <Sidebar>{['O farnosti', 'Farské oznamy', 'Aktuality', 'Fotogaléria', 'Kontakty']}</Sidebar>
            <div id="content">
                <Routes>
                    <Route path="/" element={<OFarnosti />} />
                    <Route path="oFarnosti" element={<OFarnosti />} />
                    <Route path="farskeOznamy" element={<div><h1 style={{marginTop: 0}}>Farské Oznamy</h1></div>} />
                    <Route path="aktuality" element={<div><h1 style={{marginTop: 0}}>Aktuality</h1></div>} />
                    <Route path="fotogaleria" element={<div><h1 style={{marginTop: 0}}>Fotogaléria</h1></div>} />
                    <Route path="kontakty" element={<Kontakty />} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </div>
        </Router>
    )
}