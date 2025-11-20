import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent } from "../../components";
import { CardHeaderComponent } from "../../components/cards";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/headings.json";

export default function HeadingPage() {
    const { t } = useContext(TranslatorContext)

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
                    <div className="mc-card p-4">
                        <CardHeaderComponent title={t('custom_headings')} />
                        <h1 className="text-capitalize m-4">h1. customize heading variants</h1>
                        <h2 className="text-capitalize m-4">h2. customize heading variants</h2>
                        <h3 className="text-capitalize m-4">h3. customize heading variants</h3>
                        <h4 className="text-capitalize m-4">h4. customize heading variants</h4>
                        <h5 className="text-capitalize m-4">h5. customize heading variants</h5>
                        <h6 className="text-capitalize m-4">h6. customize heading variants</h6>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}