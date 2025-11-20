import React from "react";

export default function FloatCardComponent({ variant, digit, title, icon }) {
    return (
        <div className={`mc-float-card ${ variant }`}>
            <h3>{ digit }</h3>
            <p>{ title }</p>
            <i className="material-icons">{ icon }</i>
        </div>
    )
}