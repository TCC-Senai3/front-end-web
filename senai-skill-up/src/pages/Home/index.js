import React from "react";
import { Header, Footer, Intro, InformationCards, ContactSection } from '../../components';
import "./style.css";

export default function Home() {
    return (
        <>
            <Header />
            <Intro />
            <InformationCards />
            <ContactSection />
            <Footer />
        </>
    );
}
