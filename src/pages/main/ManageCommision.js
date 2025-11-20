import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Modal } from "react-bootstrap";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import ManagePaymentTable from "../../components/tables/ManageEarningTable";
import PageLayout from "../../layouts/PageLayout";
import PaginationComponent from "../../components/PaginationComponent";
import usersData from "../../assets/data/users.json";
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import axios from "axios";
import { Helmet } from "react-helmet-async";
export default function ManageCommision() {
    const { t } = useContext(TranslatorContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [commission, setCommission] = useState('');
    const [commissionId, setCommissionId] = useState('');
    const [alertModal, setAlertModal] = useState(false);
    const entriesPerPage = 5;

    const navigate = useNavigate();

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = usersData.tbody.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchCommission = () => {
        axios.get(API_URL + '/fetch_commission').then((res) => {
            if (res.data.success) {
                setCommission(res.data.commission_arr[0].commision_percentage)
                setCommissionId(res.data.commission_arr[0].commission_id)
            }
        }).catch((error) => {
            console.log(error);

        })
    }

    useEffect(() => {
        fetchCommission();
    }, [])

    const handleUpdate = () => {
        let errors = {}
        if (!commission) {
            errors.commission = 'Please enter commission'
        }

        if (Object.keys(errors).length > 0) {
            setError(errors)
            return
        }

        axios.post(API_URL + '/update_commission', { commission_id: commissionId, commision_percentage: commission }).then((res) => {
            if (res.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    fetchCommission();
                }, 2000);
            }
        }).catch((error) => {
            console.log(error);

        })

    }
    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Manage-Commision</title>
            </Helmet>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t("Manage Commission")}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('commission')}</Link></li>
                                {/* <li className="mc-breadcrumb-item">{t('commision')}</li> */}
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-card-header">
                            <h4 className="mc-card-title">{t('Manage Commission')}</h4>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row xs={1} sm={2} xl={12} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <div className='col-lg-4'>
                    <label htmlFor="categoryDescription" className="form-label">
                        Commission (%)
                    </label>
                    <Form.Control type="text" placeholder='Enter commission' value={commission}
                        isInvalid={error.commission}
                        style={{ border: "1px solid blue" }}
                        onChange={(e) => {
                            setCommission(e.target.value)
                            setError((prev) => ({ ...prev, commission: "" }));
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {error.commission}
                    </Form.Control.Feedback>
                </div>

                <div className="col-lg-4 mt-4">
                    <button style={{ background: '#2b77e5', padding: '22px 13px', color: '#fff', borderRadius: '5px' }} onClick={handleUpdate} >  UPDATE </button>
                </div>
            </Row>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Commission updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    );
}
