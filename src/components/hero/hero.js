import './hero.css';

export default function Hero(props) {
    console.log(props.background)
    return (
        <div className="hero" style={{ backgroundImage: `url(${props.background})` }}>{props.children}</div>
    )
}