import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { BreadcrumbComponent, DivideTitleComponent } from "../../components";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/others/docs.json";

export default function DocumentationPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <BreadcrumbComponent title={t(data?.pageTitle)} className="mb-4">
                {data?.breadcrumb.map((item, index) => (
                    <li key={ index } className="mc-breadcrumb-item">
                        {item.path ? <AnchorComponent className="mc-breadcrumb-link" href={ item.path }>{ t(item.text) }</AnchorComponent> : t(item.text) }
                    </li>
                ))}
            </BreadcrumbComponent>
            <div className="mc-card">
                {data?.docs.map((item, index) => (
                    <div key={ index } className="mc-docs">
                        <DivideTitleComponent as="h3" title={ item.heading } />
                        <p dangerouslySetInnerHTML={{ __html: item.describe }} />
                        {item.images ?
                            item.images.map((image, index) => (
                                <img 
                                    key={ index } 
                                    src={ image } 
                                    alt="screenshot" 
                                />
                            ))
                        : ""}
                    </div>
                ))}
                <div className="mc-docs-footer">
                    <h3>Need to more support?</h3>
                    <a 
                        href="https://themeforest.net/item/hotash-react-admin-dashboard-template/40188968/support" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mc-btn primary" 
                    >
                        <i className="material-icons">forum</i>
                        <span>{t('contact_us')}</span>
                    </a>
                </div>
            </div>
        </PageLayout>
    )
}