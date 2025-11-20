import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Col, Card } from 'react-bootstrap';
import PageLayout from '../../layouts/PageLayout';
import axios from 'axios';
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from '../../constant/constant';
import { decode } from 'base-64';
import { Helmet } from 'react-helmet-async';
export default function ViewSubAdmin() {
    const { t } = useContext(TranslatorContext);
    const { user_id } = useParams();
    const [data, setData] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Permission mapping from IDs to names
    // Updated permission mapping from IDs to names
    const permissionMap = {
        1: "manage users",
        2: "Manage Owners",
        3: "Manage Staff",
        4: "manage role",
        5: "manage promotions",
        6: "manage country",
        7: "manage city",
        8: "manage activity",
        9: "Manage Trips",
        10: "manage addons",
        11: "addons subcategory",
        12: "manage booking",
        13: "manage commision",
        14: "manage earning",
        15: "manage coupon code",
        16: "manage review ratings",
        17: "manage content",
        18: "manage broadcast",
        19: "manage contactus",
        20: "tabular report",
        21: "analytical report",
        22: "manage destination"
    };

    const fetchSubAdminData = async () => {
        try {
            const response = await axios.get(`${API_URL}/fetch_subadmin_by_id?user_id=${decode(user_id)}`);
            if (response.data.success) {
                setData(response.data.result);
            } else {
                setError(response.data.msg || 'Failed to fetch sub-admin data');
            }
        } catch (err) {
            console.error('Error fetching subadmin data:', err);
            setError('Failed to load sub-admin data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdminData();
    }, [user_id]);

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };

    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };

    if (isLoading) {
        return (
            <PageLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="alert alert-danger">{error}</div>
                </div>
            </PageLayout>
        );
    }

    if (!data) {
        return (
            <PageLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="alert alert-warning">No sub-admin data found</div>
                </div>
            </PageLayout>
        );
    }

    // Convert privileges string to array of permission names
    const privilegesArray = data.privileges
        ? data.privileges.split(',').map(id => permissionMap[id.trim()] || `Unknown Permission (${id})`)
        : [];

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | view-sub-admin</title>
            </Helmet>
            <Col xl={12}>
                <div className='mc-card'>
                    <div className='mc-breadcrumb'>
                        <h3 className='mc-breadcrumb-title'>{t('Sub-Admin Profile')}</h3>
                        <ul className='mc-breadcrumb-list'>
                            <li className='mc-breadcrumb-item'>
                                <Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className='mc-breadcrumb-link'>
                                    {t('home')}
                                </Link>
                            </li>
                            <li className='mc-breadcrumb-item'>
                                <Link to={`${APP_PREFIX_PATH + '/manage-sub-admin'}`} className='mc-breadcrumb-link'>
                                    {t('manage sub-admin')}
                                </Link>
                            </li>
                            <li className='mc-breadcrumb-item'>{t('sub-admin profile')}</li>
                        </ul>
                    </div>
                </div>
            </Col>

            <div className='mc-card p-lg-4'>
                <div className='mc-product-view-info-group'>
                    <div className='col-lg-12 content'>
                        <div className='mobile-view'>
                            <div className='row mt-2'>
                                <div className='col-lg-3'>
                                    <h6 className='mt-0'>{t('Profile Image')}:</h6>
                                </div>
                                <div className='col-lg-9'>
                                    <img
                                        src={data.image ? `${IMAGE_PATH}${data.image}` : `${IMAGE_PATH}default-user.png`}
                                        alt='Profile'
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            objectFit: 'cover'
                                        }}
                                        onClick={() => handleImageClick(`${IMAGE_PATH}${data.image}`)}
                                    />
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col-lg-3'>
                                    <h6 className='mt-0'>{t('Name')}:</h6>
                                </div>
                                <div className='col-lg-9'>
                                    <span style={{ fontWeight: '400' }}>{data.name || 'NA'}</span>
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col-lg-3'>
                                    <h6 className='mt-0'>{t('Email')}:</h6>
                                </div>
                                <div className='col-lg-9'>
                                    <span style={{ fontWeight: '400' }}>{data.email || 'NA'}</span>
                                </div>
                            </div>



                            <div className='row mt-3'>
                                <div className='col-lg-3'>
                                    <h6 className='mt-0'>{t('Privileges')}:</h6>
                                </div>
                                <div className='col-lg-9'>
                                    {privilegesArray.length > 0 ? (
                                        <div className="d-flex flex-wrap">
                                            {privilegesArray.map((privilege, index) => (
                                                <div key={index} className="me-3 mb-2">
                                                    <span className="badge bg-primary">{privilege}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ fontWeight: '400' }}>No privileges assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showImagePopup && (
                <div
                    className='enlarged-image-overlay'
                    onClick={handleCloseImage}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            handleCloseImage();
                        }
                    }}
                    role='button'
                    tabIndex={0}
                >
                    <span
                        className='close-button'
                        onClick={handleCloseImage}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCloseImage();
                            }
                        }}
                        role='button'
                        tabIndex={0}
                    >
                        &times;
                    </span>
                    <img
                        src={enlargedImage}
                        alt='Enlarged Profile'
                        className='enlarged-image'
                        style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </PageLayout>
    );
}