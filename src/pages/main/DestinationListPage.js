import React, { useContext, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import DestinationTableComponent from "../../components/tables/DestinationTableComponent";
import PageLayout from "../../layouts/PageLayout";
import PaginationComponent from "../../components/PaginationComponent";
import usersData from "../../assets/data/users.json";
import { APP_PREFIX_PATH } from "../../constant/constant";
import { Helmet } from "react-helmet-async";
export default function DestinationListPage() {
    const { t } = useContext(TranslatorContext);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = usersData.tbody.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | manage-destination</title>
            </Helmet>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('manage destination')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('destination')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('destination list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('manage destination')}</h4>
                        </div>


                        <DestinationTableComponent
                            thead={usersData.thead}
                            tbody={currentUsers}
                        />

                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
