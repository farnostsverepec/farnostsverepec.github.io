import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar.js';
import NotFound from './pages/NotFound/NotFound.js';
import './App.css'

export default function App() {
    return (
        <Router>
            <Sidebar>{['O farnosti', 'Sväté omše', 'Farské oznamy', 'Aktuality', 'Fotogaléria', 'Kontakty']}</Sidebar>
            <div id="content">
                <Routes>
                    <Route path="/" element={<div><h1 style={{marginTop: 0}}>O farnosti</h1></div>} />
                    <Route path="oFarnosti" element={<div><h1 style={{marginTop: 0}}>O farnosti</h1></div>} />
                    <Route path="svateOmse" element={<div><h1 style={{marginTop: 0}}>Sväté Omše</h1></div>} />
                    <Route path="farskeOznamy" element={<div><h1 style={{marginTop: 0}}>Farské Oznamy</h1></div>} />
                    <Route path="aktuality" element={<div><h1 style={{marginTop: 0}}>Aktuality</h1></div>} />
                    <Route path="fotogaleria" element={<div><h1 style={{marginTop: 0}}>Fotogaléria</h1></div>} />
                    <Route path="kontakty" element={<div><h1 style={{marginTop: 0}}>Kontakty</h1><span><strong>Email:</strong> rkfu.sverepec@gmail.com</span></div>} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </div>
        </Router>
    )
}