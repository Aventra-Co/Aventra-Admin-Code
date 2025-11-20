import React from "react";

export default function LegendFieldComponent({ title, type, value, placeholder, fieldSize, option, className, activeOption, ...rest }) {
    return (
        <fieldset className={`mc-fieldset ${ className ? className : "" }`}>
            <legend>{ title || "legend" }</legend>
            {option ? 
                <select className={`${ fieldSize || "w-100 h-md" }`}>
                    <option>{ activeOption || "Select Option" }</option>
                    {option.map((item, index)=> (
                        <option key={ index } value={ item }>{ item }</option>
                    ))}
                </select>
            :
                <input 
                    type = { type || "text" } 
                    defaultValue = { value } 
                    placeholder = { placeholder || "Type here..." }
                    className = {`${ fieldSize || "w-100 h-md" }`}
                    { ...rest } 
                />
            }
        </fieldset>
    )
}