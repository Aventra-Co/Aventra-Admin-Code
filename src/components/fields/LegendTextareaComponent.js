import React from "react";

export default function LagendTextareaComponent({ title, longText, placeholder, fieldSize, ...rest }) {
    return (
        <fieldset className="mc-fieldset">
            <legend>{ title || "legend" }</legend>
            <textarea 
                defaultValue = { longText }
                className={`${ fieldSize || "w-100 h-text-md" }`}
                placeholder={ placeholder || "Long textarea..." }
                { ...rest }
            >
            </textarea>
        </fieldset>
    )
}