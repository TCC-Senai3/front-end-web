import React from "react";
import { Header, Footer, GameOptions, GameContent } from '../../components';
import "./style.css";

export default function Game() {
    return (
        <>
            <Header />
            <GameOptions />
            <GameContent />
            <Footer />
        </>
    );
}
