import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent } from "../../components";
import { CardHeaderComponent } from "../../components/cards";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/colors.json";

export default function ColorPage() {
    const { t } = useContext(TranslatorContext)

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <BreadcrumbComponent title={ t(data?.pageTitle) }>
                        {data?.breadcrumb.map((item, index) => (
                            <li key={ index } className="mc-breadcrumb-item">
                                {item.path ? <AnchorComponent className="mc-breadcrumb-link" href={ item.path }>{ t(item.text) }</AnchorComponent> : t(item.text) }
                            </li>
                        ))}
                    </BreadcrumbComponent>
                </Col>
                {data?.variants.map((item, index) => (
                    <Col key={ index } xl={12}>
                        <div className="mc-card p-4">
                            <CardHeaderComponent title={ t(item.title) } />
                            <div className="mc-color-group">
                                {item.colors.map((color, serial) => (
                                    <div key={ serial } className="mc-color">
                                        <div style={{ background: color.code }}></div>
                                        <span>
                                            <small>{ color.name }</small>
                                            <small>{ color.code }</small>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </PageLayout>
    )
}