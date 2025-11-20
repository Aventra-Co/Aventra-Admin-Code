import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent } from "../../components";
import { CardHeaderComponent } from "../../components/cards";
import { AnchorComponent } from "../../components/elements";
import { ProductsTableComponent, UsersTableComponent, PagesTableComponent, TrafficsTableComponent } from "../../components/tables";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/tables.json";

export default function TablePage() {
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
                    <div className="mc-card">
                        <CardHeaderComponent 
                            title={t(data?.products.title)} 
                            dotsMenu={ data?.products.dotsMenu } 
                        />
                        <ProductsTableComponent 
                            thead={ data?.products.thead } 
                            tbody={ data?.products.tbody } 
                        />
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <CardHeaderComponent 
                            title={t(data?.users.title)} 
                            dotsMenu={ data?.users.dotsMenu } 
                        />
                        <UsersTableComponent 
                            thead={ data?.users.thead } 
                            tbody={ data?.users.tbody } 
                        />
                    </div>
                </Col>
                <Col xl={5}>
                    <div className="mc-card">
                        <CardHeaderComponent 
                            title={t(data?.pages.title)} 
                            dotsMenu={ data?.pages.dotsMenu } 
                        />
                        <PagesTableComponent 
                            thead={ data?.pages.thead }
                            tbody={ data?.pages.tbody }
                        />
                    </div>
                </Col>
                <Col xs={12} xl={7}>
                    <div className="mc-card">
                        <CardHeaderComponent 
                            title={t(data?.traffics.title)} 
                            dotsMenu={ data?.traffics.dotsMenu } 
                        />
                        <TrafficsTableComponent 
                            thead = { data?.traffics.thead } 
                            tbody = { data?.traffics.tbody }
                        />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}