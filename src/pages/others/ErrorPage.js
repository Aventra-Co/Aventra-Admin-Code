import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnchorComponent } from "../../components/elements";

export default function ErrorPage() {

    const { t } = useContext(TranslatorContext);
    
    return (
        <div className="mc-error">
            <img className="image" src="images/404.webp" alt="404" />
            <h3>ooops! this page can't be found.</h3>
            <p>It's looks like nothing was found at this location.</p>
            <AnchorComponent to="/ecommerce" className="mc-btn primary" icon="home" text={t('back_to_home')} />
        </div>
    )
}