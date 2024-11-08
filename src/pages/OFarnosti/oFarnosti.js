import { useState, useEffect } from 'react';
import './oFarnosti.css';
import Hero from '@components/hero/hero.js';
import SvateOmse from '@components/svateOmse/svateOmse.js';
import {default as MD} from "@functions/md/md.js"

export default function OFarnosti() {
    const [info, setInfo] = useState('');

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/oFarnosti.md')
            .then(response => response.text())
            .then(text => setInfo(text));
    }, []);

    return (
        <>
            <Hero background={process.env.PUBLIC_URL + "KostolSverepec.jpg"}>O farnosti</Hero>
            <div id='contentWrapper'>
                <SvateOmse />
                <MD text={info} />
            </div>
        </>
    )
}