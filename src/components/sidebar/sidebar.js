import { useEffect } from 'react';
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

    useEffect(() => {
        function handleClickOutside(e) {
            const sidebarMenuTrigger = document.querySelector('input#sidebarMenuTrigger');
            const contentDiv = e.target.localName === 'div' && e.target.id === 'content';

            if (sidebarMenuTrigger?.checked && contentDiv) {
                sidebarMenuTrigger.checked = false;
            }
        }
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    
    const sidebarScript = `document.addEventListener("click", (e) => {if (document.querySelector("input#sidebarMenuTrigger").checked == true && (e.target.localName == "div" && e.target.id == "content")) document.querySelector("input#sidebarMenuTrigger").checked = false})`
    return (
        <div id="sidebar">
            <div id="sidebarTop">
                <div id="title"> <span><span>Farnosť</span> <span>Sverepec</span></span> <input id="sidebarMenuTrigger" type='checkbox'></input><label className='material-symbols' htmlFor='sidebarMenuTrigger'>menu</label></div>
                <hr />
                <div id="items">
                    {props.children.map((item, index) => (
                        <Link to={`/${String(item).removeDiacritics().toCamelCase()}`} id={`menu-${String(item).toCamelCase()}`} key={index} className="sidebar-item" onClick={() => document.querySelector("div#sidebar input#sidebarMenuTrigger").checked = false}>{item}</Link>
                    ))}
                </div>
            </div>
            <div id="credits">© 2024 Farnosť Sverepec</div>
            <script>{sidebarScript}</script>
        </div>
    )
}