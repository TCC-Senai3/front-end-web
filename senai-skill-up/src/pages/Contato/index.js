import React from "react";
import { Header, ContactSidebar, ContactForm } from "../../components";
import "./style.css";

export default function Contato() {
    return (
        <>
            <Header />
            <div className="contact-wrapper">
                <ContactSidebar />
                <ContactForm />
            </div>
        </>
    );
}
