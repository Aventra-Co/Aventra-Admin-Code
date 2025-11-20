import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent, DivideTitleComponent } from "../../components";
import { AnchorComponent, ButtonComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/buttons.json";

export default function ButtonPage() {
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
                <Col xl={12}>
                    <div className="mc-card p-md-5">
                        <Row xs={1} md={2}>
                            <Col>
                                <DivideTitleComponent title={t('bootstrap_buttons')} className="mb-4" />
                                <div className="mb-4">
                                    {data?.bootstrap.btns.map((item, index) => (
                                        <ButtonComponent key={ index } className={ item.classes }>{ item.label }</ButtonComponent>
                                    ))}
                                </div>
                                <div>
                                    {data?.bootstrap.small.map((item, index) => (
                                        <ButtonComponent key={ index } className={ item.classes }>{ item.label }</ButtonComponent>
                                    ))}
                                </div>
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('custom_buttons')} className="mb-4" />
                                <div className="mb-4">
                                    {data?.custom.btns.map((item, index) => (
                                        <ButtonComponent key={ index } icon={ item.icon } text={ item.label } className={ item.classes } />
                                    ))}
                                </div>
                                <div>
                                    {data?.custom.small.map((item, index) => (
                                        <ButtonComponent key={ index } icon={ item.icon } text={ item.label } className={ item.classes } />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}