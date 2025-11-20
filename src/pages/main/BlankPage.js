import React from "react";
import PageLayout from "../../layouts/PageLayout";

export default function BlankPage() {
    return (
        <PageLayout>
            <div className="mc-blank">
                <i className="material-icons">extension</i>
                <p>blank this page</p>
            </div>
        </PageLayout>
    )
}