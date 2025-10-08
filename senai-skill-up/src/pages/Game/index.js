import React from "react";
import { Header, MeioFooter, Footer, GameOptions, GameContent } from '../../components';
import "./style.css";

export default function Game() {
    return (
        <>
            <Header />
            <GameOptions />
            <GameContent />
            <MeioFooter />
            <Footer />
        </>
    );
}
