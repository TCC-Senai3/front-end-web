import React from "react";
import { Header, Footer, MeioFooter, Intro, InformationCards, ContactSection } from '../../components';
import "./style.css";

export default function Home() {
    return (
        <>
            <Header />
            <Intro />
            <InformationCards />
            <ContactSection />
            <MeioFooter />
            <Footer />
        </>
    );
}
