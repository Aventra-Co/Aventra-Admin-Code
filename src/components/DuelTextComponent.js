import React from "react";

export default function DuelTextComponent({ size, title, descrip, timesTamp }) {
    return (
        <div className={`mc-duel-text ${ size ? size : "md" }`}>
            <h3 className="mc-duel-text-title">
                { title }
                {timesTamp && <small>{ timesTamp }</small>}
            </h3>
            <p className="mc-duel-text-descrip">{ descrip }</p>
        </div>
    )
}