/* Import základní knihovny Reactu */
import React from 'react';
/* Import komponenty Image z externí knihovny react-bootstrap. (viz https://react-bootstrap.github.io/components/images/) */
import { Image } from 'react-bootstrap';
/* Připojení souboru Footer.css, který je umístěn ve shodné složce a obsahuje nastavení CSS pro komponentu */
import './Footer.css';

/* Komponenta je vytvořena a exportována jako konstanta s využitím arrow function. */
export const Footer = (props) => {
    /* Komponentě mohou být při jejím volání předány atributy/props logo a copyright.
       Jejich hodnoty načteme do konstant logo a copyright. */
    const { logo, copyright } = props;
    /* Konstanta logoStyle obsahuje nastavení vloženého stylu pro odstavec s logem. */
    const logoStyle = {
        width: '300px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,.5)',
        boxShadow: '5px 5px'
    };
    /* Do proměnné year načteme pomocí objektu Date a metody getFullYear() aktuální rok. */
    let year = new Date().getFullYear();

    /* Zajistí vyrenderování komponenty - kód v jazyce JSX je převeden do podoby HTML */
    return (
        <footer className='bg-dark mt-3 p-3 text-center'>
            {/* Provede podmíněné renderování odstavce - jen pokud existuje atribut/props logo */}
            { logo &&
                <p style={ logoStyle }><Image src={ logo } alt="Logo" /></p>
            }
            {/* Do složených závorek můžeme vkládat proměnné/konstanty nebo výrazy v JS */}
            <p className='copyright'>&copy; { year } - { copyright.projectName } - autor: <b>{ copyright.projectAuthor }</b></p>
        </footer>
    );
}