import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import { AnchorComponent } from "../../components/elements";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import { encode } from "base-64";
export default function UserProfilePage() {
    const [content, setContent] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const handleButtonClick = (contentType) => {
        setContent(contentTypes[contentType]);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const { t } = useContext(TranslatorContext)
    const { user_id } = useParams();
    const [Data, setData] = useState('');
    const [Ratings, setRatings] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);

    const [tripdetails, settripdetails] = useState([]);
    // const [consultation, setconsultation] = useState([]);

    const contentTypes = {
        all: 0,
        specific: 1
    };


    const getData = () => {
        axios.get(API_URL + `/view_user_by_id?user_id=${user_id}`).then((res) => {
            setData(res.data.user_arr[0] || []);

        }).catch((error) => {
            console.log(error);

        })

    }

    const TripData = () => {
        axios.get(API_URL + `/fetch_user_trip_details?user_id=${user_id}`).then((res) => {
            console.log('response', res.data);
            settripdetails(res.data.trip_arr);
        }).catch((error) => {
            console.log(error);

        })
    }

    const fetchRatings = () => {
        axios.get(API_URL + `/fetch_user_ratings?user_id=${user_id}`).then((res) => {
            console.log('response', res.data);
            setRatings(res.data.rating_arr);
        }).catch((error) => {
            console.log(error);

        })
    }

    useEffect(() => {
        getData();
        TripData();
        fetchRatings();
    }, [])
    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };
    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };
    const filteredTripdetails = tripdetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            (user.transaction_id && String(user.transaction_id).toLowerCase().includes(lowercasedTerm)) ||
            (user.total_amount && String(user.total_amount).toLowerCase().includes(lowercasedTerm)) ||
            (user.booking_time && String(user.booking_time).toLowerCase().includes(lowercasedTerm)) ||
            (user.hours && String(user.hours).toLowerCase().includes(lowercasedTerm)) ||
            (user.date && String(user.date).toLowerCase().includes(lowercasedTerm)) ||
            (user.trip_name_english && String(user.trip_name_english).toLowerCase().includes(lowercasedTerm)) ||
            (user.random_booking_id && String(user.random_booking_id).toLowerCase().includes(lowercasedTerm)) ||
            (user.createtime && String(user.createtime).toLowerCase().includes(lowercasedTerm))
        );
    });

    const filteredRatings = Ratings.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            (user.review && String(user.review).toLowerCase().includes(lowercasedTerm)) ||
            (user.entertainment && String(user.entertainment).toLowerCase().includes(lowercasedTerm)) ||
            (user.equipment && String(user.equipment).toLowerCase().includes(lowercasedTerm)) ||
            (user.food && String(user.food).toLowerCase().includes(lowercasedTerm)) ||
            (user.hospitality && String(user.hospitality).toLowerCase().includes(lowercasedTerm)) ||
            (user.captain && String(user.captain).toLowerCase().includes(lowercasedTerm)) ||
            (user.captain && String(user.captain).toLowerCase().includes(lowercasedTerm)) ||
            (user.clean && String(user.clean).toLowerCase().includes(lowercasedTerm)) ||
            (user.time && String(user.time).toLowerCase().includes(lowercasedTerm)) ||
            (user.name && String(user.name).toLowerCase().includes(lowercasedTerm)) ||
            (user.trip_name_english && String(user.trip_name_english).toLowerCase().includes(lowercasedTerm)) ||
            (user.createtime && String(user.createtime).toLowerCase().includes(lowercasedTerm))
        );
    });

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title " style={{ marginLeft: '15px' }}>{t('user_profile')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-users'}`} className="mc-breadcrumb-link">{t('Customers')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('user_profile')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="mc-card p-lg-4">
                <Row>
                    <Col xl={5}>
                        {/* <h6 className="mc-divide-title mb-4">{t('user_profile')}</h6> */}
                        <div className="mc-user-group">
                            <div className="">
                                <div className="">

                                    <img
                                        src={Data.image ? `${IMAGE_PATH}${Data.image}` : `${IMAGE_PATH}Placeholder.webp`}
                                        alt="Profile"
                                        style={{ width: '15rem', height: '15rem', borderRadius: '5%', cursor: 'pointer' }}
                                        onClick={() => handleImageClick(Data.image ? `${IMAGE_PATH}${Data.image}` : `${IMAGE_PATH}Placeholder.webp`)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleImageClick(Data.image ? `${IMAGE_PATH}${Data.image}` : `${IMAGE_PATH}Placeholder.webp`);
                                            }
                                        }}
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                        role="button" // Add role="button" to indicate interactive element
                                        tabIndex={0} // Add tabIndex={0} to make it focusable
                                    />

                                    {/* Enlarged image overlay */}
                                    {showImagePopup && (
                                        <div
                                            className="enlarged-image-overlay"
                                            onClick={handleCloseImage}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                    handleCloseImage();
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <span
                                                className="close-button"
                                                onClick={handleCloseImage}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleCloseImage();
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                &times;
                                            </span>
                                            <img src={enlargedImage} alt="Enlarged Profile" className="enlarged-image" style={{ width: '30rem', height: '30rem' }} />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </Col>
                    <Col xl={7}>
                        {/* <h6 className="mc-divide-title mb-4">{t('user_details')}</h6> */}
                        <div className="mc-product-view-info-group">

                            <div className="col-lg-12 content">

                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('name')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.name ? Data.name : "NA"}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('email')} : &nbsp;
                                        </h6>


                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.email ? Data.email : "NA"}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('Mobile Number')} : &nbsp;
                                        </h6>


                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}> {Data.mobile ? "+965" + Data.mobile : 'NA'}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('dob')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.dob ? Data.dob : 'NA'}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('Country')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.country_name ? Data.country_name : 'NA'}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('City')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.city_name ? Data.city_name : 'NA'}</span>
                                    </div>

                                </div>
                                {/* <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('Address')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.address ? Data.address : 'NA'}</span>
                                    </div>

                                </div> */}
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h6 className="mt-2">
                                            {t('createdatetime')} : &nbsp;
                                        </h6>

                                    </div>
                                    <div className="col-lg-8">
                                        <span style={{ fontWeight: '400' }}>{Data.createtime ? Data.createtime : "NA"}</span>
                                    </div>

                                </div>





                            </div>
                        </div>


                    </Col>


                </Row>
                <Card.Body className="mt-5">
                    <Form>
                        <nav className="navbar navbar-expand-lg navbar-light navBar">
                            <div
                                className="container mobile"
                                id="container-div"
                                style={{ marginTop: '-2rem', width: '22rem', borderRadius: '5px', marginLeft: '0rem' }}
                            >
                                <button
                                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.all ? 'btn-active' : ''}`}
                                    style={{ width: '15rem' }}
                                    type="button"
                                    onClick={() => handleButtonClick('all')}
                                >
                                    {t('Trip Booking')}
                                </button>
                                <button
                                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.specific ? 'btn-active' : ''}`}
                                    style={{ width: '15rem' }}
                                    type="button"
                                    onClick={() => handleButtonClick('specific')}
                                >
                                    {t('Ratings')}
                                </button>
                            </div>
                        </nav>

                        <Row xs={1} sm={2} xl={4} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Col>
                                <LabelFieldComponent
                                    type="search"
                                    icon="Search"
                                    placeholder={`${t('search_here')}`}
                                    labelDir="label-col"
                                    fieldSize="mb-4 w-100 h-md"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </Col>
                        </Row>

                        {content === 0 && (
                            <div style={{ margin: '1rem' }}>
                                <div className="mc-table-responsive">
                                    <table className="mc-table">
                                        <thead className="mc-table-head primary">
                                            <tr>
                                                <th>
                                                    <div className="mc-table-check">
                                                        <p>{t("sno")}</p>
                                                    </div>
                                                </th>


                                                <th>{t("Action")}</th>
                                                <th>{t("Booking ID")}</th>
                                                <th>{t("Boat Name")}</th>
                                                <th>{t("date")}</th>
                                                <th>{t("Hours")}</th>
                                                <th>{t("Booking Time")}</th>
                                                <th>{t("Status")}</th>
                                                <th>{t("Total Amount")}</th>
                                                <th>{t("Transaction ID")}</th>
                                                <th>{t("Booking Date & Time")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="mc-table-body even">

                                            {filteredTripdetails && filteredTripdetails.length > 0 ? (
                                                tripdetails.map((item, index) => (
                                                    <tr key={index}>
                                                        <td title="id">
                                                            <div className="mc-table-check">
                                                                <p>{index + 1}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <AnchorComponent to={`${APP_PREFIX_PATH}/view-trip/${encode(item.trip_id)}`} title="View" className="material-icons view">visibility</AnchorComponent></td>
                                                        <td>#{item.random_booking_id || 'NA'}</td>
                                                        <td>{item.boat_name_english || 'NA'}</td>
                                                        <td>{item.date || 'NA'}</td>
                                                        <td>{item.hours || 'NA'}</td>
                                                        <td>{item.booking_time || 'NA'}</td>
                                                        <td>
                                                            <span
                                                                style={{
                                                                    padding: '4px 12px',
                                                                    borderRadius: '999px',
                                                                    backgroundColor:
                                                                        item.trip_status === 0
                                                                            ? '#FFF3CD' // yellow
                                                                            : item.trip_status === 1
                                                                                ? '#CCE5FF' // blue
                                                                                : item.trip_status === 2
                                                                                    ? '#D4EDDA' // green
                                                                                    : item.trip_status === 3
                                                                                        ? '#F8D7DA' // red
                                                                                        : '#E2E3E5', // default gray
                                                                    color:
                                                                        item.trip_status === 0
                                                                            ? '#856404'
                                                                            : item.trip_status === 1
                                                                                ? '#004085'
                                                                                : item.trip_status === 2
                                                                                    ? '#155724'
                                                                                    : item.trip_status === 3
                                                                                        ? '#721c24'
                                                                                        : '#383d41',
                                                                    fontSize: '14px',
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                {item.trip_status === 0
                                                                    ? 'Pending'
                                                                    : item.trip_status === 1
                                                                        ? 'Ongoing'
                                                                        : item.trip_status === 2
                                                                            ? 'Completed'
                                                                            : item.trip_status === 3
                                                                                ? 'Canceled'
                                                                                : 'NA'}
                                                            </span>
                                                        </td>

                                                        <td>{item.total_amount || 'NA'}</td>
                                                        <td>{item.transaction_id || 'NA'}</td>
                                                        <td>{item.createtime || 'NA'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                        </tbody>


                                    </table>

                                </div>
                            </div>
                        )}
                        {content === 1 && (
                            <div style={{ margin: '1rem' }}>
                                <div className="mc-table-responsive">
                                    <table className="mc-table">
                                        <thead className="mc-table-head primary">
                                            <tr>
                                                <th>
                                                    <div className="mc-table-check">
                                                        <p>{t("sno")}</p>
                                                    </div>
                                                </th>
                                                <th>{t("Boat Name")}</th>
                                                <th>{t("Time")}</th>
                                                <th>{t("Clean")}</th>
                                                <th>{t("Captain")}</th>
                                                <th>{t("Hospitality")}</th>
                                                <th>{t("Food")}</th>
                                                <th>{t("Equipment")}</th>

                                                <th>{t("Entertainment")}</th>
                                                <th>{t("review")}</th>
                                                <th>{t("createtime")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="mc-table-body even">
                                            {filteredRatings && filteredRatings.length > 0 ? (
                                                Ratings.map((item, index) => (
                                                    <tr key={index}>
                                                        <td title="id">
                                                            <div className="mc-table-check">
                                                                <p>{index + 1}</p>
                                                            </div>
                                                        </td>
                                                        <td>{item.boat_name_english || 'NA'}</td>
                                                        <td>{item.time || 'NA'}</td>
                                                        <td>{item.clean || 'NA'}</td>
                                                        <td>{item.captain || 'NA'}</td>
                                                        <td>{item.hospitality || 'NA'}</td>
                                                        <td>{item.food || 'NA'}</td>
                                                        <td>{item.equipment || 'NA'}</td>
                                                        <td>{item.entertainment || 'NA'}</td>
                                                        <td>{item.review || 'NA'}</td>
                                                        <td>{item.createtime || 'NA'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table >

                                </div>
                            </div>
                        )}

                    </Form>
                </Card.Body>
            </div>
        </PageLayout>
    )
}