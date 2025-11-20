import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import * as Icons from '@mui/icons-material'; // Import all MUI icons

export default function LabelFieldComponent({ label, labelDir, fieldSize, option, type, placeholder, icon, ...rest }) {
    const { t } = useContext(TranslatorContext);
    const IconComponent = icon ? Icons[icon] : null; // Access the icon dynamically based on the `icon` prop

    return (
        <div className={`mc-label-field-group ${label ? labelDir || "label-col" : ""}`}>
            {label && <label className="mc-label-field-title">{t(label)}</label>}
            {type === "select" ? (
                <select
                    style={{ backgroundImage: 'url(/images/dropdown.svg)' }}
                    className={`mc-label-field-select ${fieldSize || "w-md h-sm"}`}
                    {...rest}
                >
                    {option.map((item, index) => (
                        <option key={index} value={item}>{t(item)}</option>
                    ))}
                </select>
            ) : (
                <div style={{ position: 'relative' }}>
                    {IconComponent && (
                        <IconComponent style={{
                            position: 'absolute',
                            left: '10px',
                            top: '34%',
                            transform: 'translateY(-50%)',
                            color: '#888'
                        }} />
                    )}
                    <input
                        type={type || "text"}
                        placeholder={placeholder || t('type_here')}
                        className={`mc-label-field-input ${fieldSize || "w-md h-sm"}`}
                        style={{ paddingLeft: IconComponent ? '35px' : undefined }} // Adjust padding if icon is present
                        {...rest}
                    />
                </div>
            )}
        </div>
    );
}
