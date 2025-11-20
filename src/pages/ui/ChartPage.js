import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator"; 
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent, DivideTitleComponent } from "../../components";
import { AnchorComponent } from "../../components/elements";
import { CRMCardComponent, EcommerceCardComponent, SalesCardComponent, AnalyticsCardComponent, RevenueCardComponent, OrdersCardComponent, DevicesCardComponent } from "../../components/cards";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/charts.json";

export default function ChartPage() {
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
                <Col xl={8}>
                    <DivideTitleComponent title={t('step_area_chart')} className="mb-4 mt-3" />
                    <RevenueCardComponent 
                        title={ data?.revenue.title }
                        field={ data?.revenue.field }
                        report={ data?.revenue.report }
                        chart={ data?.revenue.chart }
                    />
                </Col>
                <Col xl={4}>
                    <DivideTitleComponent title={t('round_pie_chart')} className="mb-4 mt-3" />
                    <OrdersCardComponent 
                        title={ data?.orders.title }
                        dotsMenu={ data?.orders.dotsMenu }
                        items={ data?.orders.items }
                    />
                </Col>
                <Col xs={12} xl={8}>
                    <DivideTitleComponent title={t('arrow_icon_chart')} className="mb-4 mt-4" />
                    <Row xs={1} md={2}>
                        {data?.heros.map((item, index) => (
                            <Col key={ index }>
                                <EcommerceCardComponent 
                                    icon = { item.icon }
                                    trend = { item.trend }
                                    title = { item.title }
                                    number = { item.number }
                                    variant = { item.variant }
                                    percent = { item.percent }
                                    compare = { item.compare }
                                    dotsMenu = { item.dotsMenu }
                                /> 
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xs={12} xl={4}>
                    <DivideTitleComponent title={t('natural_area_chart')} className="mb-4 mt-4" />
                    <SalesCardComponent 
                        title={ data?.sales.title } 
                        amount={ data?.sales.amount } 
                        percent={ data?.sales.percent }
                        trendIcon={ data?.sales.trendIcon }
                        dotsMenu = { data?.sales.dotsMenu }
                        compare={ data?.sales.compare }
                        chart={ data?.sales.chart }
                    />
                </Col>
                <DivideTitleComponent title={t('gradient_bar_chart')} className="pt-4" />
                {data?.crms.map((item, index) => (
                    <Col xl={6} key={ index }>
                        <CRMCardComponent 
                            variant={ item.variant }
                            content={ item.content }
                            status={ item.status }
                            dataKey={ item.dataKey }
                            dataSet={ item.dataSet }
                        />
                    </Col>
                ))}
                <DivideTitleComponent title={t('gradient_line_chart')} className="pt-4" />
                {data?.analytics.map((item, index) => (
                    <Col xs={12} md={6} xl={3} key={ index }>
                        <AnalyticsCardComponent
                            digit={ item.digit }
                            label={ item.label }
                            dataSet={ item.dataSet }
                            dataKey={ item.dataKey }
                            variant={ item.variant }
                            dotsMenu={ item.more }
                        />
                    </Col>
                ))}
                <Col xl={12}>
                    <DivideTitleComponent title="double_bar_chart" className="mb-4 mt-4" />
                    <DevicesCardComponent 
                        title={ data?.device.title }
                        icon={ data?.device.icon }
                        option={ data?.device.option }
                        chart={ data?.device.chart }
                    />
                </Col>
            </Row>
        </PageLayout>
    )
}