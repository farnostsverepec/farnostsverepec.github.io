import { useState, useEffect } from 'react'
import Hero from '@components/hero/hero.js';
import { default as MD } from '@functions/md/md.js'
import './kontakty.css';
import contactsTable from './kontakty.md';

export default function Kontakty() {
    const [text, setText] = useState('');

    useEffect(() => {
        fetch(contactsTable).then(res => res.text()).then(restext => setText(restext))
    }, []);
    return (
        <div>
            <Hero background={process.env.PUBLIC_URL + "KostolSverepec.jpg"}>Kontakty</Hero>
            <MD text={text} style={{display: "flex", justifyContent: "center", flexWrap: "wrap", rowGap: "8px"}} />
        </div>
    )
}