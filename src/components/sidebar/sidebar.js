import { useEffect, useRef } from 'react';
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
    const sidebarMenuTrigger = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            const contentDiv = e.target.localName === 'div' && e.target.id === 'content';

            if (sidebarMenuTrigger.current.checked && contentDiv) {
                sidebarMenuTrigger.current.checked = false;
            }
        }
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    
    return (
        <div id="sidebar">
            <div id="sidebarTop">
                <div id="title"> <span><span>Farnosť</span> <span>Sverepec</span></span> <input id="sidebarMenuTrigger" type='checkbox' ref={sidebarMenuTrigger}></input><label className='material-symbols' htmlFor='sidebarMenuTrigger'>menu</label></div>
                <hr />
                <div id="items">
                    {props.children.map((item, index) => (
                        <Link to={`/${String(item).removeDiacritics().toCamelCase()}`} id={`menu-${String(item).toCamelCase()}`} key={index} className="sidebar-item" onClick={() => sidebarMenuTrigger.current.checked = false}>{item}</Link>
                    ))}
                </div>
            </div>
            <div id="credits">© 2024 Farnosť Sverepec</div>
        </div>
    )
}