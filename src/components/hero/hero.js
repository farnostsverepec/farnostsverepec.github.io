import './hero.css';

/**
 * A Hero component that displays a background image and children elements.
 *
 * @param {object} props - The component props.
 * @param {string} props.background - The URL of the background image.
 * @param {ReactNode} props.children - The elements to be displayed inside the Hero component - ideally a text node.
 * @return {JSX.Element} The Hero component element.
 */
export default function Hero(props) {
    console.log(props.background)
    return (
        <div className="hero" style={{ backgroundImage: `url(${props.background})` }}>{props.children}</div>
    )
}