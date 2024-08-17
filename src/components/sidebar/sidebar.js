import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'

export default function Sidebar(props) {
    return (
        <div id="sidebar">
            <div id="sidebarTop">
                <div id="title"> <span>Farnosť</span> <span>Sverepec</span> </div>
                <hr />
                <div id="items">
                    {props.children.map((item, index) => (
                        <Link to={`/${String(item).removeDiacritics().toCamelCase()}`} id={`menu-${String(item).toCamelCase()}`} key={index} className="sidebar-item">{item}</Link>
                    ))}
                </div>
            </div>
            <div id="credits">© 2024 Farnosť Sverepec</div>
        </div>
    )
}