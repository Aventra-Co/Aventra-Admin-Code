import React, { useContext, useEffect, useState } from "react";
import PageLayout from "../../layouts/PageLayout";
import { Row, Col } from "react-bootstrap";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import '../../components/cards/card.css';
import PeopleIcon from '@mui/icons-material/People';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import TodayIcon from '@mui/icons-material/Today';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { SyncLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
export default function AnalyticsPage() {
    const { t } = useContext(TranslatorContext);
    const [loading, setLoading] = useState(false);

    const [Count, setCount] = useState({
        usercount: 0,
        tripcount: 0,
        ownercount: 0,
        staffcount: 0,
        boatcount: 0,
        contactusCount: 0,
        earningcount: 0,
        propertyCount:0


    });

    const id = localStorage.getItem('id');

    const getcount = () => {
        setLoading(true);
        axios.get(API_URL + "/get_user_count")
            .then((res) => {
                if (res.data.success) {
                    setCount(res.data);
                    setLoading(false);
                }


            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getcount();
    }, []);


    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }


    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | dashboard</title>
            </Helmet>
            <Row>
                <Col xl={12} >
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('dashboard')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to='#' className="mc-breadcrumb-link">{t('home')}</Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to='#' className="mc-breadcrumb-link">{t('dashboard')}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
                {/* Render analytics cards with dynamic data */}
                {loading ? (
                    <div className="d-flex align-items-center" style={{ height: '40vh' }}>
                        <SyncLoader animation="border" color="#086861" variant="primary" style={{ marginLeft: '40%' }} />
                    </div>
                ) : (
                    <>
                        <Col xl={3} md={6} sm={12}>

                            <div className="card">
                                <Link to={APP_PREFIX_PATH + "/manage-users"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Customers')}</h3>
                                        <div ><PeopleIcon style={{ color: 'white', fontSize: "50px" }} /></div>
                                    </div>
                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.usercount}</p>
                                </Link>
                            </div>

                        </Col>

                        <Col xl={3} md={6} sm={12}>
                            <div className="card2">
                                <Link to={APP_PREFIX_PATH + "/manage-owners"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Owners')}</h3>
                                        <div><AddHomeWorkIcon style={{ color: 'white', fontSize: "50px" }} /></div>
                                    </div>
                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.ownercount}</p>
                                </Link>
                            </div>
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                            <div className="card3">
                                <Link to={APP_PREFIX_PATH + "/manage-staff"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Staff')}</h3>
                                        <div><GroupAddIcon style={{ color: 'white', fontSize: "50px" }} /></div>
                                    </div>
                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}> {Count.staffcount}</p>
                                </Link>
                            </div>
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                            <div className="card6">
                                <Link to={APP_PREFIX_PATH + "/manage-trips"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Trips')}</h3>
                                        <div><FormatListBulletedIcon style={{ color: 'white', fontSize: "50px" }} /></div>
                                    </div>

                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.tripcount}</p>
                                </Link>
                            </div>
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                            <div className="card6">
                                <Link to={APP_PREFIX_PATH + "/property-advertisement"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Property')}</h3>
                                        <div><FormatListBulletedIcon style={{ color: 'white', fontSize: "50px" }} /></div>
                                    </div>

                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.propertyCount}</p>
                                </Link>
                            </div>
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                            <div className="card4">
                                <Link to={APP_PREFIX_PATH + "/manage-earning"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('Earning (KWD)')}</h3>
                                        <div><AccountBalanceIcon style={{ color: 'white', fontSize: "47px" }} /></div>
                                    </div>
                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.earningcount ? formatCurrency(Count.earningcount) : 0}</p>
                                </Link>
                            </div>
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                            <div className="card9">
                                <Link to={APP_PREFIX_PATH + "/manage-contactus"} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-heading">{t('contact_us')}</h3>
                                        <div ><AddIcCallIcon style={{ color: 'white', fontSize: "48px" }} /></div>
                                    </div>
                                    <p className="card-p mt-0" style={{ fontSize: '25px' }}>{Count.contactusCount}</p>
                                </Link>
                            </div>
                        </Col>
                    </>
                )}

            </Row>
        </PageLayout>
    );
}
