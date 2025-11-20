import React from "react";

export default function BreadcrumbComponent({ title, children }) {
    return (
        <div className="mc-card">
            <div className="mc-breadcrumb">
                <h1 className="mc-breadcrumb-title">{ title }</h1>
                <ul className="mc-breadcrumb-list">{ children }</ul>
            </div>
        </div>
    )
}