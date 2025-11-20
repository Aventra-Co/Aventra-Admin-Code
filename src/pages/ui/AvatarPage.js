import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Row, Col } from "react-bootstrap";
import { BreadcrumbComponent, RoundAvatarComponent } from "../../components";
import { CardHeaderComponent } from "../../components/cards";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import data from "../../assets/data/ui/avatars.json";

export default function AvatarPage() {

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
                    <div className="mc-card p-4">
                        <CardHeaderComponent title="custom avatars" />
                        <RoundAvatarComponent src="images/avatar/08.webp" alt="avatar" size="xl d-inline-flex m-3" />
                        <RoundAvatarComponent src="images/avatar/08.webp" alt="avatar" size="lg d-inline-flex m-3" />
                        <RoundAvatarComponent src="images/avatar/08.webp" alt="avatar" size="md d-inline-flex m-3" />
                        <RoundAvatarComponent src="images/avatar/08.webp" alt="avatar" size="sm d-inline-flex m-3" />
                        <RoundAvatarComponent src="images/avatar/08.webp" alt="avatar" size="xs d-inline-flex m-3" />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    )
}