import React, { useContext, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import DeletedUserTableComponent from "../../components/tables/DeletedUserTableComponent";
import PageLayout from "../../layouts/PageLayout";
import PaginationComponent from "../../components/PaginationComponent";
import usersData from "../../assets/data/users.json";
import { APP_PREFIX_PATH } from "../../constant/constant";
import { Helmet } from "react-helmet-async";
export default function DeletedUserListPage() {
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
                <title>Aventra | Deleted-Users</title>
            </Helmet>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('deleted_user_details')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('users')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('deleted_user_list')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('deleted users')}</h4>
                        </div>
                        {/* <Row xs={1} sm={2} xl={4}>
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    label={t('search_by')}
                                    placeholder={`${t('id')} / ${t('name')} / ${t('email')} / ${t('number')}`}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                />
                            </Col>
                        </Row> */}
                        <DeletedUserTableComponent
                            thead={usersData.thead}
                            tbody={currentUsers}
                        />
                        {/* <PaginationComponent
                            totalEntries={usersData.tbody.length}
                            entriesPerPage={entriesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        /> */}
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
