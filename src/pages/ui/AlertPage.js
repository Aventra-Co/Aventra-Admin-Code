import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col, Alert } from "react-bootstrap";
import { BreadcrumbComponent, IconAlertComponent } from "../../components";
import { AnchorComponent } from "../../components/elements";
import { CardHeaderComponent } from "../../components/cards";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/alerts.json";

export default function AlertPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <BreadcrumbComponent title={t(data?.pageTitle)}>
                        {data?.breadcrumb.map((item, index) => (
                            <li key={ index } className="mc-breadcrumb-item">
                                {item.path ? <AnchorComponent className="mc-breadcrumb-link" href={ item.path }>{ t(item.text) }</AnchorComponent> : t(item.text) }
                            </li>
                        ))}
                    </BreadcrumbComponent>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <CardHeaderComponent title={t('bootstrap_alerts')} />
                        {data?.bootstrap.map((item, index) => (
                            <Alert key={ index } variant={ item.variant } dismissible>{ item.label }</Alert>
                        ))}
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <CardHeaderComponent title={t('custom_alerts')} />
                        {data?.custom.map((item, index) => (
                            <IconAlertComponent 
                                key={ index }
                                classes={ item.classes } 
                                icon={ item.icon }
                                title={ item.title }
                                text={ item.text }
                            />
                        ))}
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}