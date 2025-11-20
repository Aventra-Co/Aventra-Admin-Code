import React from "react";

export default function IconTextareaComponent({ classes, icon, placeholder, children, ...rest }) {
    return (
        <div className={`mc-icon-field textarea ${ classes || "w-md h-text-sm white" }`}>
            <i className={ icon || "account_circle" } />
            <textarea placeholder={ placeholder || "Long textarea..." }>{ children }</textarea>
       </div>
    )
}