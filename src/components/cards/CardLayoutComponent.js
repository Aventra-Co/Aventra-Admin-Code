import React from "react";

export default function CardLayoutComponent ({ className, children }) {
    return <div className={`mc-card ${ className ? className : "" }`}> { children }</div>
}