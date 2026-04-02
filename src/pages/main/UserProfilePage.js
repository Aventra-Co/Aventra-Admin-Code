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
        if (contentType === 'trip') setContent(0);
        if (contentType === 'property') setContent(1);
        if (contentType === 'ratings') setContent(2);
        setSearchTerm('');
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
    const [propertyBookings, setPropertyBookings] = useState([]);

    const getData = () => {
        axios.get(API_URL + `/view_user_by_id?user_id=${user_id}`).then((res) => {
            setData(res.data.user_arr[0] || []);
        }).catch((error) => {
            console.log(error);
        })
    }

    const TripData = () => {
        axios.get(API_URL + `/fetch_user_trip_details?user_id=${user_id}`).then((res) => {
            console.log('Trip response', res.data);
            settripdetails(res.data.trip_arr || []);
        }).catch((error) => {
            console.log(error);
        })
    }

    const fetchPropertyBookings = () => {
        axios.get(API_URL + `/fetch_user_property_booking?user_id=${user_id}`).then((res) => {
            console.log('Property Booking response', res.data);
            setPropertyBookings(res.data.property_booking_arr || []);
        }).catch((error) => {
            console.log(error);
        })
    }

    const fetchRatings = () => {
        axios.get(API_URL + `/fetch_user_ratings?user_id=${user_id}`).then((res) => {
            console.log('Ratings response', res.data);
            setRatings(res.data.rating_arr || []);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getData();
        TripData();
        fetchPropertyBookings();
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

    // Filter functions
    const filteredTripdetails = tripdetails.filter((item) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            (item.transaction_id && String(item.transaction_id).toLowerCase().includes(lowercasedTerm)) ||
            (item.total_amount && String(item.total_amount).toLowerCase().includes(lowercasedTerm)) ||
            (item.booking_time && String(item.booking_time).toLowerCase().includes(lowercasedTerm)) ||
            (item.hours && String(item.hours).toLowerCase().includes(lowercasedTerm)) ||
            (item.date && String(item.date).toLowerCase().includes(lowercasedTerm)) ||
            (item.trip_name_english && String(item.trip_name_english).toLowerCase().includes(lowercasedTerm)) ||
            (item.random_booking_id && String(item.random_booking_id).toLowerCase().includes(lowercasedTerm)) ||
            (item.createtime && String(item.createtime).toLowerCase().includes(lowercasedTerm))
        );
    });

    const filteredPropertyBookings = propertyBookings.filter((item) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            (item.booking_random_id && String(item.booking_random_id).toLowerCase().includes(lowercasedTerm)) ||
            (item.property_name_english && String(item.property_name_english).toLowerCase().includes(lowercasedTerm)) ||
            (item.transaction_id && String(item.transaction_id).toLowerCase().includes(lowercasedTerm)) ||
            (item.total_amount && String(item.total_amount).toLowerCase().includes(lowercasedTerm)) ||
            (item.checkin_date && String(item.checkin_date).toLowerCase().includes(lowercasedTerm)) ||
            (item.checkout_date && String(item.checkout_date).toLowerCase().includes(lowercasedTerm)) ||
            (item.createtime && String(item.createtime).toLowerCase().includes(lowercasedTerm))
        );
    });

    const filteredRatings = Ratings.filter((item) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            (item.review && String(item.review).toLowerCase().includes(lowercasedTerm)) ||
            (item.entertainment && String(item.entertainment).toLowerCase().includes(lowercasedTerm)) ||
            (item.equipment && String(item.equipment).toLowerCase().includes(lowercasedTerm)) ||
            (item.food && String(item.food).toLowerCase().includes(lowercasedTerm)) ||
            (item.hospitality && String(item.hospitality).toLowerCase().includes(lowercasedTerm)) ||
            (item.captain && String(item.captain).toLowerCase().includes(lowercasedTerm)) ||
            (item.clean && String(item.clean).toLowerCase().includes(lowercasedTerm)) ||
            (item.time && String(item.time).toLowerCase().includes(lowercasedTerm)) ||
            (item.name && String(item.name).toLowerCase().includes(lowercasedTerm)) ||
            (item.trip_name_english && String(item.trip_name_english).toLowerCase().includes(lowercasedTerm)) ||
            (item.createtime && String(item.createtime).toLowerCase().includes(lowercasedTerm))
        );
    });

    // Helper function to render status badge
    const renderBookingStatus = (bookingStatus) => {
        const statusConfig = {
            0: { label: 'Pending', bgColor: '#FFF3CD', color: '#856404' },
            1: { label: 'Ongoing', bgColor: '#CCE5FF', color: '#004085' },
            2: { label: 'Completed', bgColor: '#D4EDDA', color: '#155724' },
            3: { label: 'Canceled', bgColor: '#F8D7DA', color: '#721c24' }
        };
        
        const config = statusConfig[bookingStatus] || { label: 'NA', bgColor: '#E2E3E5', color: '#383d41' };
        
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: config.bgColor,
                color: config.color,
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-block'
            }}>
                {config.label}
            </span>
        );
    };

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
                                        role="button"
                                        tabIndex={0}
                                    />

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
                                style={{ marginTop: '-2rem', width: 'auto', borderRadius: '5px', marginLeft: '0rem', display: 'flex', flexWrap: 'wrap', gap: '10px' }}
                            >
                                <button
                                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === 0 ? 'btn-active' : ''}`}
                                    style={{ width: '12rem' }}
                                    type="button"
                                    onClick={() => handleButtonClick('trip')}
                                >
                                    {t('Trip Booking')}
                                </button>
                                <button
                                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === 1 ? 'btn-active' : ''}`}
                                    style={{ width: '12rem' }}
                                    type="button"
                                    onClick={() => handleButtonClick('property')}
                                >
                                    {t('Property Booking')}
                                </button>
                                <button
                                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === 2 ? 'btn-active' : ''}`}
                                    style={{ width: '12rem' }}
                                    type="button"
                                    onClick={() => handleButtonClick('ratings')}
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

                        {/* Trip Booking Tab */}
                        {content === 0 && (
                            <div style={{ margin: '1rem' }}>
                                <div className="mc-table-responsive">
                                    <table className="mc-table">
                                        <thead className="mc-table-head primary">
                                            <tr>
                                                <th><div className="mc-table-check"><p>{t("sno")}</p></div></th>
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
                                                filteredTripdetails.map((item, index) => (
                                                    <tr key={index}>
                                                        <td title="id"><div className="mc-table-check"><p>{index + 1}</p></div></td>
                                                        <td>
                                                            <AnchorComponent to={`${APP_PREFIX_PATH}/view-trip/${encode(item.trip_id)}`} title="View" className="material-icons view">
                                                                visibility
                                                            </AnchorComponent>
                                                        </td>
                                                        <td>#{item.random_booking_id || 'NA'}</td>
                                                        <td>{item.boat_name_english || 'NA'}</td>
                                                        <td>{item.date || 'NA'}</td>
                                                        <td>{item.hours || 'NA'}</td>
                                                        <td>{item.booking_time || 'NA'}</td>
                                                        <td>{renderBookingStatus(item.trip_status)}</td>
                                                        <td>{item.total_amount || 'NA'}</td>
                                                        <td>{item.transaction_id || 'NA'}</td>
                                                        <td>{item.createtime || 'NA'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Property Booking Tab */}
                        {content === 1 && (
                            <div style={{ margin: '1rem' }}>
                                <div className="mc-table-responsive">
                                    <table className="mc-table">
                                        <thead className="mc-table-head primary">
                                            <tr>
                                                <th><div className="mc-table-check"><p>{t("sno")}</p></div></th>
                                                {/* <th>{t("Action")}</th> */}
                                                <th>{t("Booking ID")}</th>
                                                <th>{t("Property Name")}</th>
                                                <th>{t("Check-in Date")}</th>
                                                <th>{t("Check-out Date")}</th>
                                                <th>{t("Total Nights")}</th>
                                                <th>{t("Max Child")}</th>
                                                <th>{t("Max Adult")}</th>
                                                <th>{t("Status")}</th>
                                                <th>{t("Total Amount")}</th>
                                                <th>{t("Transaction ID")}</th>
                                                <th>{t("Booking Date & Time")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="mc-table-body even">
                                            {filteredPropertyBookings && filteredPropertyBookings.length > 0 ? (
                                                filteredPropertyBookings.map((item, index) => (
                                                    <tr key={index}>
                                                        <td title="id"><div className="mc-table-check"><p>{index + 1}</p></div></td>
                                                        {/* <td>
                                                            <AnchorComponent 
                                                                to={`${APP_PREFIX_PATH}/view-property-booking/${encode(item.property_booking_id)}`} 
                                                                title="View" 
                                                                className="material-icons view"
                                                            >
                                                                visibility
                                                            </AnchorComponent>
                                                        </td> */}
                                                        <td>#{item.booking_random_id || 'NA'}</td>
                                                        <td>{item.property_name_english || 'NA'}</td>
                                                        <td>{item.checkin_date || 'NA'}</td>
                                                        <td>{item.checkout_date || 'NA'}</td>
                                                        <td>{item.total_nights || 'NA'}</td>
                                                        <td>{item.max_child || 'NA'}</td>
                                                        <td>{item.max_adult || 'NA'}</td>
                                                        <td>{renderBookingStatus(item.booking_status)}</td>
                                                        <td>{item.total_amount || 'NA'}</td>
                                                        <td>{item.transaction_id || 'NA'}</td>
                                                        <td>{item.createtime || 'NA'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Ratings Tab */}
                        {content === 2 && (
                            <div style={{ margin: '1rem' }}>
                                <div className="mc-table-responsive">
                                    <table className="mc-table">
                                        <thead className="mc-table-head primary">
                                            <tr>
                                                <th><div className="mc-table-check"><p>{t("sno")}</p></div></th>
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
                                                filteredRatings.map((item, index) => (
                                                    <tr key={index}>
                                                        <td title="id"><div className="mc-table-check"><p>{index + 1}</p></div></td>
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
                                                    <td colSpan="11" style={{ textAlign: 'center' }}>No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </div>
        </PageLayout>
    )
}