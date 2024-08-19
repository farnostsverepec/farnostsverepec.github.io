import './oFarnosti.css';
import Hero from '../../components/hero/hero.js';
import SvateOmse from '../../components/svateOmse/svateOmse.js';
import KostolSverepec from '../../images/KostolSverepec.jpg';


export default function OFarnosti() {
    return (
        <>
            <Hero background={KostolSverepec}>O farnosti</Hero>
            <div id='contentWrapper'>
                <SvateOmse />
                <p>
                    <strong>Farský kostol Najsvätejšej Trojice</strong> v obci Sverepec je jej hlavnou dominantou. Jeho základný kameň požehnal papež Ján Pavol II. 20. 4. 1990, počas svojej návštevy v Bratislave. Kostol bol postavený s iniciatívy dekana Pavla Trnku, ktorý takto naplnil túžbu obyvateľov obce mať svoj vlastný kostol. Vďaka patrí aj všetkým ostatným rodákom, živým a dnes už aj mŕtvym, ktorí pomáhali pri jeho výstavbe prácou a finančne.<strong> Kostol Najsvätejšej Trojice vysvätil dňa 26. mája 2002</strong> Ján Chryzostom kardinál Korec, nitriansky biskup.
                    <br /><br />
                    Kostol je <strong>jednoloďovou stavbou so samostatnou vežou</strong>, priestor so schodiskom medzi kostolom a vežou je zastrešený. V otvorenej veži sú umiestnené <strong>tri zvony</strong>. Vpravo pred kostolom je vytvorená<strong> jaskyňa so sochou Panny Márie</strong>, na terase nad jaskyňou je <strong>bronzové súsošie so svätým Jozefom</strong>.
                    <br /><br />
                    <strong>Hlavný oltár</strong> tvorí plastika so znázorneným Ježišom Kristom, oltárny stôl je zhotovený z mohutného kameňa. Na bočných stenách sú umiestnené repliky znázorňujúce krížovú cestu. V kostole je aj mnoho výzdoby z farebného skla, farebná je aj okenná vitráž.
                    <br /><br />
                    Počas vianočných sviatkov býva kostol aj pekne vyzdobený, s betlehemom a vianočnými stromčekami. Kostol býva pekne presvetlený, dopomáha k tomu pekné, takmer jarné počasie.
                    <br /><br />
                    Kto bude pri výstupe ku schodisku pozorný, môže si všimnúť v dolnej časti schodiska na mieste pri jaskyni v stene <strong>zamurovaný kameň so skamenelinou</strong> z morského dna, ktoré sa tu v dávnoveku nachádzalo.
                </p>
            </div>
        </>
    )
}