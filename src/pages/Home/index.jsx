import React from "react";
import { Header, Footer, Intro, Carousel, InformationCards, ContactSection } from '../../components';
import "./style.css";

export default function Home() {
    return (
        <>
            <Header />
            <Intro />
            <Carousel />
            <InformationCards />
            <ContactSection />
            <Footer />
        </>
    );
}
