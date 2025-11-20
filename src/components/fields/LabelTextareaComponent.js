import React from "react";

export default function LabelTextareaComponent({ label, labelDir, fieldSize, placeholder, ...rest }) {
    return (
        <div className={`mc-label-field-group ${ label ? labelDir || "label-col" : "" }`}>
            {label && <label className="mc-label-field-title">{ label }</label>}
            <textarea 
                className={`mc-label-field-textarea ${ fieldSize || "w-md h-text-md" }`} 
                placeholder={ placeholder || "Type here..." }
                { ...rest } 
            ></textarea>
        </div>
    )
}