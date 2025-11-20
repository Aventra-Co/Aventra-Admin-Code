import React from "react";

export default function RoundAvatarComponent({ size, src, alt }) {
    return (
        <div className={`mc-round-avatar ${ size || "md" }`}>
            <img src={ src } alt={ alt } />
        </div>
    )
}