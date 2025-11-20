import React from "react";
import { Link } from "react-router-dom";

export default function AnchorComponent({ icon, text, badge, arrow, children, ...rest }) {
    return (
        <Link {...rest}>
            { icon && <i className="material-icons">{ icon }</i> }
            { text && <span>{ text }</span> }
            { badge && <sup className={ badge.variant }>{ badge.text }</sup> }
            { arrow && <small className="material-icons">{ arrow }</small>}
            { children }
        </Link>
    )
}