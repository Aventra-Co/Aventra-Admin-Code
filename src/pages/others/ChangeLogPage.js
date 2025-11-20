import React from "react";
import PageLayout from "../../layouts/PageLayout";

export default function ChangeLogPage() {
    return (
        <PageLayout>
           <div className="mc-card">
                <div className="mc-alert green">
                    <i className="material-icons">campaign</i>
                    <h3>
                        Initial Release - Version 1.0
                        <span>Hotash :: React Admin Dashboard Template</span>
                    </h3>
                </div>
                <div className="mc-alert orange">
                    <i className="material-icons">campaign</i>
                    <h3>
                        Update - Version 2.0
                        <span>Hotash :: React Admin Dashboard Template</span>
                    </h3>
                </div>
                <ul className="mc-changelog-list">
                    <li>Multi-language support added, including translation for English and Arabic.</li>
                    <li>Site directionality (LTR & RTL) support included.</li>
                    <li>Improved UI/UX for cards, padding, margin, border, color, and more.</li>
                    <li>React Router library upgraded and new routing system implemented.</li>
                    <li>Bootstrap and React-Bootstrap library upgraded.</li>
                    <li>Sass library included for scalable CSS.</li>
                    <li>Components and JSON data simplified.</li>
                </ul>
           </div>
        </PageLayout>
    )
}