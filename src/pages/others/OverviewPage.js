import React from "react";
import LogoComponent from "../../components/LogoComponent";
import { AnchorComponent } from "../../components/elements";
import { Container, Row, Col } from "react-bootstrap";
import data from "../../assets/data/others/overview.json";

export default function OverviewPage() {
    return (
        <div className="mc-overview">
            <section style={{ backgroundImage: 'url(/images/pages-bg.webp)' }} className="mc-overview-banner">
                <Container>
                    <LogoComponent href="/" src={ data?.banner.logo } alt="logo" name="hotash" className="lg" />
                    <h1>{ data?.banner.title }</h1>
                    <p>{ data?.banner.descrip }</p>
                    <div className="tools">
                        <h3>{ data?.banner.subtitle }</h3>
                        {data?.tools.map((tool, index) => (
                            <img key={ index } src={ tool } alt="tools" />
                        ))}
                    </div>
                    <AnchorComponent 
                        to="/ecommerce" 
                        target="_blank" 
                        icon="launch" 
                        text="explore now" 
                        rel="noopener noreferrer"
                        className="mc-btn primary"
                    />
                </Container>
            </section>
            <section className="mc-overview-demo">
                <Container fluid>
                    <h2 className="mc-overview-title">unique pages</h2>
                    <Row xs={1} sm={2} xl={3}>
                        {data?.demos.map((demo, index) => (
                            <Col key={index} >
                                <div className="mc-overview-card">
                                    <div className="mc-overview-media">
                                        <img src={demo.image} alt="demo" />
                                        <div className="mc-overview-overlay">
                                            <AnchorComponent to={demo.path} target="_blank" rel="noopener noreferrer" className="mc-overview-link">live preview</AnchorComponent>
                                        </div>
                                    </div>
                                    <h2 className="mc-overview-name">{demo.title}</h2>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            <section className="mc-overview-footer">
                <h2>Do you want to inquiry about hotash template?</h2>
                <a 
                    href="https://themeforest.net/item/hotash-react-admin-dashboard-template/40188968/support" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mc-btn primary" 
                >
                    <i className="material-icons">forum</i>
                    <span>contact us</span>
                </a>
                <p>Hotash | © Copyrights by <span>Mironcoder</span></p>
            </section>
        </div>
    )
}