import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent, DivideTitleComponent } from "../../components";
import { CardHeaderComponent } from "../../components/cards";
import { IconFieldComponent, IconTextareaComponent, LabelFieldComponent, LabelTextareaComponent, LegendFieldComponent, LegendTextareaComponent } from "../../components/fields";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/fields.json";

export default function FieldPage() {
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
                    <div className="mc-card">
                        <CardHeaderComponent title="icon_fields" />
                        <Row xs={1} md={2} xl={3}>
                            <Col>
                                <DivideTitleComponent title={t('small_size')} className="mb-3 mt-3" />
                                <IconFieldComponent icon="email" type="text" classes="w-100 h-sm gray" />
                                <IconFieldComponent icon="verified_user" classes="w-100 h-sm gray" option={["admin", "member", "client"]} />
                                <IconTextareaComponent icon="feed" classes="w-100 h-text-sm mb-0 gray" />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('medium_size')} className="mb-3 mt-3" />
                                <IconFieldComponent icon="email" type="text" classes="w-100 h-md gray" />
                                <IconFieldComponent icon="verified_user" classes="w-100 h-md gray" option={["admin", "member", "client"]} />
                                <IconTextareaComponent icon="feed" classes="w-100 h-text-md mb-0 gray" />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('large_size')} className="mb-3 mt-3" />
                                <IconFieldComponent icon="email" type="text" classes="w-100 h-lg gray" />
                                <IconFieldComponent icon="verified_user" classes="w-100 h-lg gray" option={["admin", "member", "client"]} />
                                <IconTextareaComponent icon="feed" classes="w-100 h-text-lg mb-0 gray" />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <CardHeaderComponent title={t('legend_fields')} />
                        <Row xs={1} md={2} xl={3}>
                            <Col>
                                <DivideTitleComponent title={t('small_size')} className="mb-4 mt-3" />
                                <LegendFieldComponent type="text" fieldSize="w-100 h-sm" className="mb-4" />
                                <LegendFieldComponent fieldSize="w-100 h-sm" className="mb-4" option={["admin", "member", "client"]} />
                                <LegendTextareaComponent fieldSize="w-100 h-text-sm" />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('medium_size')} className="mb-4 mt-3" />
                                <LegendFieldComponent type="text" fieldSize="w-100 h-md" className="mb-4" />
                                <LegendFieldComponent fieldSize="w-100 h-md" className="mb-4" option={["admin", "member", "client"]} />
                                <LegendTextareaComponent fieldSize="w-100 h-text-md" />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('large_size')} className="mb-4 mt-3" />
                                <LegendFieldComponent type="text" fieldSize="w-100 h-lg" className="mb-4" />
                                <LegendFieldComponent fieldSize="w-100 h-lg" className="mb-4" option={["admin", "member", "client"]} />
                                <LegendTextareaComponent fieldSize="w-100 h-text-lg" />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <CardHeaderComponent title={t('label_fields')} />
                        <Row xs={1} md={2} xl={3}>
                            <Col>
                                <DivideTitleComponent title={t('small_size')} className="mb-4 mt-3" />
                                <LabelFieldComponent label={t('text_field')} type="text" fieldSize="w-100 h-sm" labelDir="label-col mb-4" />
                                <LabelFieldComponent label={t('select_option')} fieldSize="w-100 h-sm" labelDir="label-col mb-4" option={["admin", "member", "client"]} />
                                <LabelTextareaComponent label={t('long_textarea')} fieldSize="w-100 h-text-sm" labelDir="label-col"  />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('medium_size')} className="mb-4 mt-3" />
                                <LabelFieldComponent label={t('text_field')} type="text" fieldSize="w-100 h-md" labelDir="label-col mb-4" />
                                <LabelFieldComponent label={t('select_option')} fieldSize="w-100 h-md" labelDir="label-col mb-4" option={["admin", "member", "client"]} />
                                <LabelTextareaComponent label={t('long_textarea')} fieldSize="w-100 h-text-md" labelDir="label-col"  />
                            </Col>
                            <Col>
                                <DivideTitleComponent title={t('large_size')} className="mb-4 mt-3" />
                                <LabelFieldComponent label={t('text_field')} type="text" fieldSize="w-100 h-lg" labelDir="label-col mb-4" />
                                <LabelFieldComponent label={t('select_option')} fieldSize="w-100 h-lg" labelDir="label-col mb-4" option={["admin", "member", "client"]} />
                                <LabelTextareaComponent label={t('long_textarea')} fieldSize="w-100 h-text-lg" labelDir="label-col"  />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}