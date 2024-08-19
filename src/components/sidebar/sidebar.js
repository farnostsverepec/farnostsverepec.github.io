import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'

/**
 * A Sidebar component that displays a navigation menu and credits.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The elements to be displayed inside the Sidebar component - ideally a list of navigation items.
 * @return {JSX.Element} The Sidebar component element.
 */
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