import { useLocation, Link } from 'react-router-dom';
import { get } from "fast-levenshtein";
import locations from './locations.json'
import './NotFound.css'

export default function NotFound() {
    var location = useLocation()
    function findClosestRoute(invalidRoute, validRoutes) {
        let closestMatch = null;
        let smallestDistance = invalidRoute.length / 3 * 2;
    
        validRoutes.forEach(route => {
            const distance = get(invalidRoute, route, {useCollator: true});
            console.log(route, distance)
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestMatch = route;
            }
        });
        return closestMatch;
    }
    console.log(decodeURIComponent(location.pathname.normalize()))
    var closest = locations.aliases[decodeURIComponent(location.pathname).removeDiacritics()] || findClosestRoute(decodeURIComponent(location.pathname).removeDiacritics(), locations.validLocations)

    return (
        <div id="notFound">
            <h1>404</h1>
            { location.pathname !== '/404' ? <><h3>Táto stránka nebola nájdená :(</h3>{closest == null ? <span>Prosím, skontrolujte, či v <code>{decodeURIComponent(location.pathname)}</code> nie je preklep.</span> : <><span>Mali ste na mysli <Link to={closest}><code><i>{closest}</i></code></Link>?</span></>}</> : <></>}
        </div>
    )
}