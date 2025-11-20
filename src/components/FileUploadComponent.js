import React, { useContext } from "react";
import { TranslatorContext } from "../context/Translator";

export default function FileUploadComponent({ icon, text, onFileUpload }) {
    const { t } = useContext(TranslatorContext)

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file && onFileUpload) {
            onFileUpload(file);  // Pass the selected file to the parent component
        }
    };

    return (
        <>
            {text ? (
                <div className={`mc-file-upload m-0 ${text ? "button" : "icon"}`}>
                    <input
                        type="file"
                        id="avatar"
                        onChange={handleChange}
                    />
                    <label htmlFor="avatar">
                        <i className="material-icons">{icon || t('cloud_upload')}</i>
                        <span>{text || t('upload')}</span>
                    </label>
                </div>
            ) : (
                <div className={`mc-file-upload ${text ? "button" : "icon"}`}>
                    <input
                        type="file"
                        id="avatar"
                        onChange={handleChange}
                    />
                    <label htmlFor="avatar" className="material-icons">{icon || t('cloud_upload')}</label>
                </div>
            )}
        </>
    );
}
