import React, { useContext, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import ManageSubAdmin from "../../components/tables/ManageSubAdmin";
import PageLayout from "../../layouts/PageLayout";
import usersData from "../../assets/data/users.json";
import { APP_PREFIX_PATH } from "../../constant/constant";
import { Helmet } from "react-helmet-async";
export default function SubAdminListPage() {
    const { t } = useContext(TranslatorContext);
    const [currentPage] = useState(1);
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = usersData.tbody.slice(indexOfFirstEntry, indexOfLastEntry);


    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | manage-sub-admin</title>
            </Helmet>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('manage sub-admin')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                                {/* <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('sub-admin')}</Link></li> */}
                                <li className="mc-breadcrumb-item">{t('sub-admin list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('manage sub-admin')}</h4>
                        </div>


                        <ManageSubAdmin
                            thead={usersData.thead}
                            tbody={currentUsers}
                        />

                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
