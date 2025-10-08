import React from "react";
import { Header, ContactSidebar, SupportForm } from "../../components";
import "./style.css";

export default function Suporte() {
    return (
        <>
            <Header />
            <div className="support-wrapper">
                <ContactSidebar />
                <SupportForm />
            </div>
        </>
    );
}
