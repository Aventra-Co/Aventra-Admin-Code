import React from "react";
import { Link } from "react-router-dom";

export default function LogoComponent({ src, alt, name, href, className, style }) {
    return (
        <>
            {name ?
                <Link to={href} className={`mc-logo-group ${className}`}>
                    <img src={src} alt={alt} style={style} />
                    <span>{name}</span>
                </Link>
                :
                <Link to={href} className={`mc-logo ${className}`}>
                    <img src={src} alt={alt} style={style} />
                </Link>
            }
        </>
    )
}