import React from "react";

export default function TabCardComponent({ title, children }) {
    return (
        <div className="mc-tab-card">
            <h6 className="mc-tab-card-title">{ title }</h6>
            { children }
        </div>
    )
}