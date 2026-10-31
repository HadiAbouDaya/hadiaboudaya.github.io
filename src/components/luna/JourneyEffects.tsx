"use client";

import { useState, type CSSProperties } from "react";
import type { VaultJourneyTheme } from "@/lib/luna-vault";
import styles from "./journey-effects.module.css";

type Motif = VaultJourneyTheme["motif"];
type ConnectionNavigator = Navigator & { connection?: { saveData?: boolean } };

function Scene({ motif }: { motif: Motif }) {
  switch (motif) {
    case "skyline": return <>
      <path className={styles.wash} d="M22 118V88h38V70h32v25h30V57h37v35h31V72h34V43h23V29l10-17 10 17v14h23v48h31V63h44v29h24V77h42V49h34v46h30V66h33v40h51v12Z" />
      <path className={styles.wire} d="M22 118V88h38V70h32v25h30V57h37v35h31V72h34V43h23V29l10-17 10 17v14h23v48h31V63h44v29h24V77h42V49h34v46h30V66h33v40h51M29 118H605M249 49v42m13-42v42" />
      <g className={styles.ripples}><path className={styles.fine} d="M66 140c32-9 65 8 100 0s69-8 102 0 66 8 101 0 71-8 106 0 65 8 99 0M107 155c24-6 52 5 78 0s54-5 80 0 53 5 81 0 55-5 82 0 54 5 81 0" /></g>
      <circle className={styles.sun} cx="521" cy="35" r="17" />
    </>;
    case "prism": return <>
      <path className={styles.beam} d="m72 26 244 74-15 13L53 52Z" />
      <path className={styles.wash} d="m320 25 139 125H181Z" />
      <path className={styles.wire} d="m320 25 139 125H181Zm0 0 33 125m-33-125-48 125m-17-57h140m-164 34h199M147 150h346" />
      <g className={styles.prismLight}><path d="m350 108 218-65m-213 74 232-20m-226 29 205 38" /><path d="m349 105 204-80m-199 95 233-3" /></g>
      <path className={styles.fine} d="M47 150h70m402 0h71" />
    </>;
    case "road": return <>
      <path className={styles.wash} d="M0 142c155-44 257 15 368-8s173-56 272-33v47c-124-29-177 9-272 20S154 124 0 171Z" />
      <path className={styles.fine} d="M0 157c160-44 259 13 370-8s166-50 270-24" />
      <g className={styles.roadCar}>
        <path className={styles.carBody} d="M131 111v-15c0-8 8-12 18-12h17l13-23h49l18 23h15c11 0 18 6 18 15v12H131Z" />
        <path className={styles.wire} d="m175 83 10-16h37l12 16h-59m29-16v17m-65 15h11m103 0h15" />
        <circle className={styles.wheel} cx="160" cy="111" r="13" /><circle className={styles.wheel} cx="250" cy="111" r="13" />
      </g>
      <path className={styles.fine} d="M89 51h46m-27-13h27m378 34h45m-66-13h30" />
    </>;
    case "bokeh": return <>
      <path className={styles.wash} d="M37 150V75h62v75h35V41h75v109h29V92h42v58h38V57h66v93h34V24h80v126h32V88h67v62Z" />
      <path className={styles.wire} d="M37 150V75h62m35 75V41h75v109m109 0V57h66v93m34 0V24h80v126m32 0V88h67M22 151h594" />
      <g className={styles.cityWindows}>{[0, 1, 2, 3].flatMap(row => [0, 1, 2].map(col => <rect key={`${row}-${col}`} x={432 + col * 21} y={39 + row * 25} width="7" height="9" />))}</g>
      <g className={styles.bokehLights}><circle cx="68" cy="47" r="15" /><circle cx="272" cy="41" r="7" /><circle cx="562" cy="52" r="17" /><circle cx="301" cy="119" r="8" /></g>
    </>;
    case "headlights": return <>
      <path className={styles.fine} d="M20 145h600M83 18v127m161-127v127m159-127v127m160-127v127M20 53l108-35 116 35 80-35 79 35 108-35 109 35" />
      <g className={styles.headlightBeams}><path d="m375 91 236-35v87l-236-33Z" /><path d="m365 93 238-20v55l-238-20Z" /></g>
      <g><path className={styles.carBody} d="m202 119 19-32h91l31 25 29 6v16H191v-12Z" /><path className={styles.wire} d="m231 91-12 20h107l-21-20h-74m42 0v20m-73 12h13m133-3h14" /><circle className={styles.wheel} cx="227" cy="133" r="14" /><circle className={styles.wheel} cx="337" cy="133" r="14" /></g>
      <path className={styles.raceStripe} d="M54 158h172m14 0h57m12 0h20" />
    </>;
    case "tram": return <>
      <path className={styles.fine} d="M137 169 283 39m-80 130 98-130m97 130L339 39m124 130L357 39M102 19h424M230 19l44 21h86l42-21M61 139h516" />
      <g className={styles.tramCar}><rect className={styles.carBody} x="268" y="49" width="98" height="99" rx="15" /><path className={styles.wire} d="M279 70h76v39h-76Zm37 0v39m-35 19h72m-61 20v9m49-9v9" /><circle className={styles.lamp} cx="286" cy="119" r="4" /><circle className={styles.lamp} cx="348" cy="119" r="4" /></g>
      <path className={styles.wire} d="M30 139V77h52v62m-41-47h28m433 47V69h54v70m-41-52h28" />
    </>;
    case "meadow": return <>
      <path className={styles.fine} d="M19 151c93-20 137-16 220-4s166-16 249-7 93 5 133-1M42 147l-8-24m47 19 5-30m475 32 13-27m-40 27-6-30" />
      {[{x:158,y:93,s:1}, {x:310,y:65,s:1.3}, {x:460,y:100,s:.85}].map(({x,y,s},i) => <g key={i} className={styles.flower} style={{transformOrigin:`${x}px ${y}px`,animationDelay:`${i * 80}ms`}}>
        <path className={styles.wire} d={`M${x} ${y+10}v${47 / s}m0-19c-16-20-28-4-3 5m3-1c16-20 27-3 3 5`} />
        <g transform={`translate(${x} ${y}) scale(${s})`} className={styles.petals}><ellipse cx="0" cy="-12" rx="8" ry="12" /><ellipse cx="0" cy="12" rx="8" ry="12" /><ellipse cx="-12" cy="0" rx="12" ry="8" /><ellipse cx="12" cy="0" rx="12" ry="8" /><circle className={styles.flowerHeart} r="5" /></g>
      </g>)}
    </>;
    case "ink": return <>
      <path className={styles.wash} d="M97 33h429v115H97Z" />
      <path className={styles.fine} d="M86 33h451M86 66h451M86 100h451M86 148h451M141 33v33m82 0v34m82-67v33m83 0v34m83-67v33M140 100v48m165-48v48m165-48v48" />
      <path className={styles.inkStroke} d="M148 125c21-62 68-76 75-40s-2 51 24 30 35-49 57-42 11 49 39 43 54-54 86-28 45 27 64 9" />
      <path className={styles.wire} d="M256 44v31m-15-15h30" />
    </>;
    case "orbit": return <>
      <path className={styles.wire} d="M238 143v-23h14V93h17V67c0-28 101-28 101 0v26h17v27h14v23H238Zm31-76h101m-118 26h135m-135 27h135m-76-89v15m-17-15h34m-91 90v23m26-23v23m27-23v23m27-23v23m26-23v23M211 145h218" />
      <ellipse className={styles.orbitRing} cx="320" cy="83" rx="205" ry="62" transform="rotate(-8 320 83)" />
      <ellipse className={styles.orbitRing} cx="320" cy="83" rx="205" ry="62" transform="rotate(16 320 83)" />
      <g className={styles.orbitPoint}><circle className={styles.lamp} cx="127" cy="76" r="6" /></g>
    </>;
    case "tide": return <>
      <path className={styles.wash} d="M381 112 405 89h12V70h12V51h15V34h13V13l6-12 6 12v21h11v28h17v24h17l28 26Z" />
      <path className={styles.wire} d="m357 118 48-29h12V70h12V51h15V34h13V13l6-12 6 12v21h11v28h17v24h17l42 32M264 134l115-18m65-53h19m-24 22h46" />
      <g className={styles.tideWaves}><path className={styles.fine} d="M0 134c56-22 99 16 150 0s94-19 148 0 93 16 147 0 97-17 145 0 74 7 90 0M-40 153c56-22 99 16 150 0s94-19 148 0 93 16 147 0 97-17 145 0 74 7 90 0M0 173c56-22 99 16 150 0s94-19 148 0 93 16 147 0 97-17 145 0 74 7 90 0" /></g>
      <circle className={styles.sun} cx="146" cy="49" r="22" />
    </>;
    case "umbrellas": return <>
      <path className={styles.wash} d="M24 147V51h65V32h48v115h38V62h73v85h44V33h58v114h52V57h65V26h48v121h102Z" />
      <path className={styles.fine} d="M24 147V51h65V32h48m38 115V62h73m44 85V33h58m52 114V57h65V26h48M43 70h25m27-19h26m87 30h23m79-29h24m84 25h28m29-31h24M18 149h604" />
      {[104,270,445].map((x,i) => <g key={x} className={styles.parasol} style={{animationDelay:`${i * 80}ms`}}><path className={styles.canopy} d={`m${x-56} 111 56-36 56 36Z`} /><path className={styles.wire} d={`M${x} 81v69m-27 0h54m-67-20v20m80-20v20`} /></g>)}
    </>;
    case "candle": return <>
      <path className={styles.fine} d="M74 146h492M97 157h446M107 68h-4v45m-11-45v45m22-45v45m-11 0v25m434-70v70m-10-70c0 26 15 26 15 0M176 101c-20 29 27 29 7 0m-3 23v17m-12 0h24m253-40c-20 29 27 29 7 0m-3 23v17m-12 0h24" />
      <rect className={styles.candleBody} x="267" y="87" width="18" height="58" rx="3" /><rect className={styles.candleBody} x="348" y="71" width="18" height="74" rx="3" />
      <path className={styles.flame} d="M276 82c-19-8-8-28 0-36 6 17 17 27 0 36Zm81-15c-19-8-8-28 0-36 6 17 17 27 0 36Z" />
      <path className={styles.wire} d="M252 146h47m35 0h47" />
    </>;
    case "paper": return <>
      <g><path className={styles.cardPaper} d="m188 39 198-17 10 119-198 18Z" /><path className={styles.fine} d="m211 57 151-13 6 63-151 13Zm6 78 109-9" /></g>
      <g className={styles.frontPaper}><path className={styles.cardPaper} d="m284 36 169 26-18 114-169-26Z" /><path className={styles.fine} d="m300 56 130 21-10 61-130-20Zm-12 82 87 14" /></g>
      <path className={styles.wire} d="m107 92 7-18 7 18 18 7-18 7-7 18-7-18-18-7Zm419-35 5-13 5 13 13 5-13 5-5 13-5-13-13-5Z" />
    </>;
    case "steam": return <>
      <path className={styles.fine} d="M115 144h410m-353 14h296" />
      <path className={styles.carBody} d="M248 80h125v22c0 46-125 46-125 0Zm125 9h21c28 0 28 33 0 33h-30" />
      <ellipse className={styles.wire} cx="310" cy="145" rx="104" ry="11" />
      <g className={styles.steam}><path className={styles.wire} d="M282 65c-18-16 17-25 0-42m29 42c-18-16 17-25 0-42m29 42c-18-16 17-25 0-42" /></g>
      <path className={styles.fine} d="M64 16h512m-512 0 38 24 38-24 38 24 38-24 38 24 38-24 38 24 38-24 38 24 38-24 38 24 38-24" />
    </>;
    case "reflection": return <>
      <path className={styles.wash} d="M106 25h428v126H106Z" />
      <path className={styles.wire} d="M106 25h428v126H106Zm214 0v126M100 157h440" />
      <path className={styles.fine} d="M119 38h188v100H119Zm214 0h188v100H333ZM144 49l-14 20m28-20-28 41m370 18-14 20m28-41-28 41" />
      <path className={styles.reflectionHeart} d="M249 116c-15-14-54-30-54-57 0-23 37-24 54 0 17-24 54-23 54 0 0 27-39 43-54 57Z" />
      <path className={styles.reflectionHeart} opacity=".36" transform="translate(640 0) scale(-1 1)" d="M249 116c-15-14-54-30-54-57 0-23 37-24 54 0 17-24 54-23 54 0 0 27-39 43-54 57Z" />
      <g className={styles.reflectionSweep}><path d="m142 38 18 0-43 100h-8Z" /><path d="m350 38 18 0-43 100h-8Z" /></g>
      <circle className={styles.lamp} cx="79" cy="91" r="5" /><circle className={styles.lamp} cx="561" cy="91" r="5" />
    </>;
  }
}

/** Small, bounded illustrations; only a deliberate tap starts motion. */
export function JourneyEffects({ theme, compact = false }: { theme: VaultJourneyTheme; compact?: boolean }) {
  const [active, setActive] = useState(false);
  const [animate, setAnimate] = useState(true);
  const variables = { "--journey-accent": theme.accent, "--journey-backdrop": theme.backdrop, "--journey-ink": theme.ink } as CSSProperties;
  const illustration = <svg className={styles.scene} viewBox="0 0 640 180" fill="none" aria-hidden="true" focusable="false"><Scene motif={theme.motif} /></svg>;

  if (compact) return <span className={`${styles.effects} ${styles.compact}`} style={variables} data-motif={theme.motif} aria-hidden="true">{illustration}</span>;

  return (
    <section className={styles.effects} style={variables} data-motif={theme.motif} data-active={active} data-animate={animate} aria-label={theme.description}>
      <div className={styles.illustration}>{illustration}</div>
      <div className={styles.controls}>
        <button type="button" data-journey-effect aria-pressed={active} onClick={() => { setAnimate(!(navigator as ConnectionNavigator).connection?.saveData); setActive(value => !value); }}>{active ? theme.activeLabel : theme.actionLabel}</button>
      </div>
    </section>
  );
}
