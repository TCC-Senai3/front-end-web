import React from "react";
import { Header, ContactSidebar, TermsContent } from "../../components";
import "./style.css";

export default function Termos() {
    return (
        <>
            <Header />
            <div className="terms-wrapper">
                <ContactSidebar />
                <TermsContent />
            </div>
        </>
    );
}
