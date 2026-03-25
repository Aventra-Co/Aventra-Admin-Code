import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form, Nav } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { SyncLoader } from 'react-spinners'
import Swal from 'sweetalert2';

export default function BannerTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [BannerDetails, setBannerDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [AddModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [image, setImage] = useState(null)
    const [bannerId, setbannerId] = useState('')
    const [imagelink, setImageLink] = useState('')
    const [editImage, seteditImage] = useState(null)
    const [editLink, seteditLink] = useState('')
    const [bannerError, setbannerError] = useState('')
    const [msg, setmsg] = useState('')
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [ownerName, setownerName] = useState('')
    const [activeTab, setActiveTab] = useState('boat'); // 'boat' or 'property'

    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = BannerDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.link?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm) ||
            user.l_name?.toLowerCase().includes(lowercasedTerm) ||
            user.random_id?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchBanner = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_banner")
            .then((response) => {
                setBannerDetails(response.data.banner_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching banner details:', error);
            });
    };

    const [ownerDetails, setownerDetails] = useState([]);
    const fetchOwnerDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/get_all_owners")
            .then((response) => {
                setownerDetails(response.data.owner_arr || []);
                setOwners(response.data.owner_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching owner details:', error);
            });
    };

    const [ownerTrips, setownerTrips] = useState([]);
    const fetchOwnerTrips = (userId) => {
        if (!userId) {
            setownerTrips([]);
            return;
        }

        axios.get(API_URL + `/get_owner_trip?user_id=${userId}`)
            .then((response) => {
                setownerTrips(response.data.trip_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching owner trips:', error);
            });
    };

    const [propertyAds, setPropertyAds] = useState([]);
    const fetchPropertyAds = (userId) => {
        if (!userId) {
            setPropertyAds([]);
            return;
        }

        axios.get(API_URL + `/get_property_ads?user_id=${userId}`)
            .then((response) => {
                setPropertyAds(response.data.data || []);
            })
            .catch((error) => {
                console.error('Error fetching property ads:', error);
            });
    };

    useEffect(() => {
        fetchBanner();
        fetchOwnerDetails();
    }, []);

    function formatDate(dateStr) {
        if (!dateStr) return 'NA';
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    }

    const handleUserAction = (action, item) => {
        if (action == 'edit') {
            setEditModal(true)
            seteditLink(item.link)
            setbannerId(item.banner_id)
            setOwnerId(item.user_id)
            setTripId(item.trip_id)
            setStartDate(item.start_date)
            setEndDate(item.end_date)
            setownerName(item.l_name);
            setOwnername1(item.l_name);
            
            // Set promotion type based on whether user_id exists
            setPromotionType(item.user_id ? 1 : 0);
            
            // Set entity type based on item.entity_type
            if (item.entity_type === 0) {
                setActiveTab('boat');
                // Fetch trips for the selected owner if it's an owner promotion
                if (item.user_id) {
                    fetchOwnerTrips(item.user_id);
                }
            } else if (item.entity_type === 1) {
                setActiveTab('property');
                // Fetch property ads for the selected owner
                if (item.user_id) {
                    fetchPropertyAds(item.user_id);
                }
            }
        }
        else if (action == 'delete') {
            setAlertModal(true);
            setbannerId(item.banner_id)
        }
    }

    const [ownername1, setOwnername1] = useState('');
    const handleEditBanner = () => {
        const error = {};

        if (promotionType === 0) {
            // General promotion validation
            if (!editLink) error.editLink = "Please enter image link";
        } else {
            // Owner promotion validation
            if (!ownerId) error.ownerId = "Please select an owner";
            if (!tripId) error.tripId = activeTab === 'boat' ? "Please select a trip" : "Please select a property ad";
        }

        if (!startDate) error.startDate = "Please select start date";
        if (!endDate) error.endDate = "Please select end date";

        if (promotionType === 0 && editLink && !/^(https?:\/\/)/.test(editLink)) {
            error.editLink = "Please enter a valid URL";
        }

        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            error.endDate = "End date must be after start date";
        }

        setbannerError(error);
        if (Object.keys(error).length > 0) return;

        const formData = new FormData();
        formData.append('banner_id', bannerId);
        formData.append('type', promotionType);
        formData.append('entity_type', activeTab === 'boat' ? 0 : 1);

        if (promotionType === 0) {
            formData.append('link', editLink);
        } else {
            formData.append('user_id', ownerId);
            formData.append('trip_id', tripId); // For boat: trip_id, for property: property_ad_id
        }

        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        if (editImage) formData.append('image', editImage);

        axios.post(API_URL + '/edit_banner', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            if (response.data.success) {
                setmsg(response.data.msg);
                fetchBanner();
                setEditModal(false);
                setStartDate('');
                setEndDate('');
                setOwnerId('');
                setTripId('');
                setPromotionType(0);
                setActiveTab('boat');

                Swal.fire({
                    title: 'Success!',
                    text: 'Promotion updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745'
                });
            }
        }).catch(error => {
            console.error('Edit failed:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.msg || "Failed to update promotion",
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Form fields state
    const [ownerId, setOwnerId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tripId, setTripId] = useState('');
    const [promotionType, setPromotionType] = useState(0);

    const [owners, setOwners] = useState([]);

    const handleAddBanner = () => {
        const errors = {};

        if (promotionType === 0) {
            if (!imagelink) errors.imagelink = "Please enter Promotion Link";
        } else {
            if (!ownerId) errors.ownerId = "Please select an owner";
            if (!tripId) errors.tripId = activeTab === 'boat' ? "Please select a trip" : "Please select a property ad";
        }

        if (!startDate) errors.startDate = "Please select start date";
        if (!endDate) errors.endDate = "Please select end date";
        if (!image) errors.image = "Please select an image";

        if (promotionType === 0 && imagelink && !/^(https?:\/\/)/.test(imagelink)) {
            errors.imagelink = "Please enter a valid URL starting with http:// or https://";
        }

        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            errors.endDate = "End date must be after start date";
        }

        if (Object.keys(errors).length > 0) {
            setbannerError(errors);
            return;
        }

        const formData = new FormData();
        formData.append('type', promotionType);
        formData.append('entity_type', activeTab === 'boat' ? 0 : 1);

        if (promotionType === 0) {
            formData.append('link', imagelink);
        } else {
            formData.append('user_id', ownerId);
            formData.append('trip_id', tripId);
        }

        formData.append('image', image);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);

        axios.post(API_URL + '/add_banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.success) {
                setmsg(response.data.msg);
                fetchBanner();
                setImageLink('');
                setImage(null);
                setStartDate('');
                setEndDate('');
                setOwnerId('');
                setTripId('');
                setPromotionType(0);
                setActiveTab('boat');
                setAddModal(false);

                Swal.fire({
                    title: 'Success!',
                    text: 'Promotion added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745'
                });
            }
        }).catch(error => {
            console.error('Error adding banner:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.msg || "Failed to add promotion",
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setbannerError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setbannerError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setbannerError((prev) => ({ ...prev, image: "" }));
            setImage(file);
        }
    };

    const handleDelete = () => {
        axios.post(API_URL + '/delete_banner', { banner_id: bannerId }).then((response) => {
            if (response.data.success) {
                setmsg(response.data.msg);
                fetchBanner();
                setsuccessModel(true);

                Swal.fire({
                    title: 'Success!',
                    text: 'Promotion deleted successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745'
                });

                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        }).catch(error => {
            console.error('Delete failed:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.msg || "Failed to delete promotion",
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });
        });
    }

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };
    
    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };

    // Reset form when switching tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setTripId('');
        setownerTrips([]);
        setPropertyAds([]);
    };

    // Custom tab styles for better design
    const tabStyle = {
        navTabs: {
            borderBottom: '2px solid #dee2e6',
            marginBottom: '20px',
            padding: '0 10px'
        },
        navItem: {
            marginBottom: '-2px'
        },
        navLink: {
            border: 'none',
            borderBottom: '2px solid transparent',
            color: '#6c757d',
            fontWeight: '500',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        navLinkActive: {
            borderBottom: '2px solid #2b77e5',
            color: '#2b77e5',
            backgroundColor: 'transparent'
        }
    };

    return (
        <>
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
                <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }} onClick={() => setAddModal(true)} > 
                        <AddIcon className="me-2" /> {t("Add Promotion")} 
                    </button>
                </Col>
            </Row>

            {loading ? (
                <div className="d-flex align-items-center" style={{ height: '40vh' }}>
                    <SyncLoader animation="border" color="#086861" variant="primary" style={{ marginLeft: '40%' }} />
                </div>
            ) : (
                <div className="mc-table-responsive">
                    <table className="mc-table">
                        <thead className="mc-table-head primary">
                            <tr>
                                <th>
                                    <div className="mc-table-check">
                                        <p>{t("sno")}</p>
                                    </div>
                                </th>
                                <th>{t("actions")}</th>
                                <th>{t("image")}</th>
                                <th>{t("Promotion Type")}</th>
                                <th>{t("Entity Type")}</th>
                                <th>{t("URL")}</th>
                                <th>{t("owner name")}</th>
                                <th>{t("Owner Ads")}</th>
                                <th>{t("Start date")}</th>
                                <th>{t("End date")}</th>
                                <th>{t("createtime")}</th>
                            </tr>
                        </thead>
                        <tbody className="mc-table-body even">
                            {currentUsers?.map((item, index) => (
                                <tr key={index}>
                                    <td title="id">
                                        <div className="mc-table-check">
                                            <p>{indexOfFirstEntry + index + 1}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="mc-table-action">
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => { handleUserAction('edit', item) }}>edit</ButtonComponent>
                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>
                                        </div>
                                    </td>
                                    <td title={item.country_image}>
                                        <div className="mc-table-profile">
                                            <img
                                                src={item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                onClick={() => handleImageClick(item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleImageClick(item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`);
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
                                                    <img src={enlargedImage} alt="Enlarged Profile" className="enlarged-image" style={{ width: '30rem', height: '30rem', borderRadius: '5px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <span>{item.type == 0 ? "General" : "Owner" || 'NA'}</span>
                                    </td>

                                    <td>
                                        <span>
                                            {item.entity_type === 0 ? "Boat" : 
                                             item.entity_type === 1 ? "Property" : "NA"}
                                        </span>
                                    </td>

                                    <td>
                                        <span>{item.link || 'NA'}</span>
                                    </td>
                                    <td>
                                        {item.user_id ? (
                                            <Link to={`${APP_PREFIX_PATH}/owner-view/${encode(item.user_id)}`} style={{ color: '#2b77e5', textDecoration: 'none' }}>
                                                {item.l_name}
                                            </Link>
                                        ) : (
                                            <span>{item.l_name || 'General'}</span>
                                        )}
                                    </td>
                                    <td>
                                        <span>
                                            {item.random_id || 
                                             item.property_ad_id || 
                                             (item.entity_type === 1 ? 'Property Ad' : 'NA')}
                                        </span>
                                    </td>

                                    <td>
                                        <span>{formatDate(item.start_date) || 'NA'}</span>
                                    </td>
                                    <td>
                                        <span>{formatDate(item.end_date) || 'NA'}</span>
                                    </td>

                                    <td>{item.createtime || 'NA'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <PaginationComponent
                        totalEntries={filteredUsers.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                    {/* Edit Modal */}
                    <Modal show={editModal} onHide={() => setEditModal(false)} backdrop="static" size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{t('Edit Promotion')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mc-user-modal">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('Promotion Type')} <span className="text-danger">*</span></Form.Label>
                                    <div className="d-flex">
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label={t('General Promotion')}
                                            name="promotionType"
                                            checked={promotionType === 0}
                                            onChange={() => setPromotionType(0)}
                                            className="me-4"
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label={t('Owner Promotion')}
                                            name="promotionType"
                                            checked={promotionType === 1}
                                            onChange={() => setPromotionType(1)}
                                        />
                                    </div>
                                </Form.Group>

                                {/* Tabs for Boat/Property - Always visible */}
                                <div style={tabStyle.navTabs}>
                                    <ul className="nav" style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={tabStyle.navItem}>
                                            <div
                                                style={{
                                                    ...tabStyle.navLink,
                                                    ...(activeTab === 'boat' ? tabStyle.navLinkActive : {})
                                                }}
                                                onClick={() => handleTabChange('boat')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleTabChange('boat')}
                                            >
                                                Boat
                                            </div>
                                        </li>
                                        <li style={tabStyle.navItem}>
                                            <div
                                                style={{
                                                    ...tabStyle.navLink,
                                                    ...(activeTab === 'property' ? tabStyle.navLinkActive : {})
                                                }}
                                                onClick={() => handleTabChange('property')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleTabChange('property')}
                                            >
                                                Property
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="row">
                                    {promotionType === 0 ? (
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t('Promotion Link')} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editLink}
                                                    onChange={(e) => {
                                                        seteditLink(e.target.value);
                                                        setbannerError(prev => ({ ...prev, editLink: "" }));
                                                    }}
                                                    isInvalid={!!bannerError.editLink}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {bannerError.editLink}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>{t('Select Owner')} <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select
                                                        value={ownerId}
                                                        onChange={(e) => {
                                                            const selectedOwnerId = e.target.value;
                                                            setOwnerId(selectedOwnerId);
                                                            setbannerError(prev => ({ ...prev, ownerId: "" }));
                                                            setTripId('');
                                                            
                                                            if (selectedOwnerId) {
                                                                if (activeTab === 'boat') {
                                                                    fetchOwnerTrips(selectedOwnerId);
                                                                } else {
                                                                    fetchPropertyAds(selectedOwnerId);
                                                                }
                                                            } else {
                                                                setownerTrips([]);
                                                                setPropertyAds([]);
                                                            }
                                                        }}
                                                        isInvalid={!!bannerError.ownerId}
                                                    >
                                                        <option value="">{t('Select Owner')}</option>
                                                        {owners.map(owner => (
                                                            <option key={owner.user_id} value={owner.user_id}>
                                                                {owner.l_name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {bannerError.ownerId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        {activeTab === 'boat' ? t('Select Trip') : t('Select Property Ad')} 
                                                        <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={tripId}
                                                        onChange={(e) => {
                                                            setTripId(e.target.value);
                                                            setbannerError(prev => ({ ...prev, tripId: "" }));
                                                        }}
                                                        isInvalid={!!bannerError.tripId}
                                                        disabled={!ownerId}
                                                    >
                                                        <option value="">
                                                            {activeTab === 'boat' ? t('Select Trip') : t('Select Property Ad')}
                                                        </option>
                                                        {activeTab === 'boat' 
                                                            ? ownerTrips.map(trip => (
                                                                <option key={trip.trip_id} value={trip.trip_id}>
                                                                    {trip.random_id}
                                                                </option>
                                                            ))
                                                            : propertyAds.map(ad => (
                                                                <option key={ad.property_ad_id} value={ad.property_ad_id}>
                                                                    {ad.title || ad.property_ad_id}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {bannerError.tripId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('Start Date')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={startDate}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    setStartDate(e.target.value);
                                                    setbannerError(prev => ({ ...prev, startDate: "" }));
                                                }}
                                                isInvalid={!!bannerError.startDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {bannerError.startDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('End Date')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={endDate}
                                                min={startDate || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    setEndDate(e.target.value);
                                                    setbannerError(prev => ({ ...prev, endDate: "" }));
                                                }}
                                                isInvalid={!!bannerError.endDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {bannerError.endDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('Promotion Image')}</Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => seteditImage(e.target.files[0])}
                                    />
                                </Form.Group>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="mt-1">
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { 
                                setEditModal(false); 
                                setStartDate(''); 
                                setEndDate(''); 
                                setOwnerId(''); 
                                setTripId(''); 
                                setPromotionType(0);
                                setActiveTab('boat');
                            }}>
                                {t('Cancel')}
                            </ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-success" onClick={handleEditBanner}>
                                {t('Update')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </Modal>

                    {/* Add Modal */}
                    <Modal show={AddModal} onHide={() => setAddModal(false)} backdrop="static" size="lg" style={{ marginBottom: '0px' }}>
                        <Modal.Header closeButton style={{ marginBottom: '0px' }}>
                            <Modal.Title style={{ marginBottom: '0px' }}>{t('Add New Promotion')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mc-user-modal">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('Promotion Type')} <span className="text-danger">*</span></Form.Label>
                                    <div className="d-flex">
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label={t('General Promotion')}
                                            name="promotionType"
                                            checked={promotionType === 0}
                                            onChange={() => setPromotionType(0)}
                                            className="me-4"
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label={t('Owner Promotion')}
                                            name="promotionType"
                                            checked={promotionType === 1}
                                            onChange={() => setPromotionType(1)}
                                        />
                                    </div>
                                </Form.Group>

                                {/* Tabs for Boat/Property - Always visible */}
                                <div style={tabStyle.navTabs}>
                                    <ul className="nav" style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={tabStyle.navItem}>
                                            <div
                                                style={{
                                                    ...tabStyle.navLink,
                                                    ...(activeTab === 'boat' ? tabStyle.navLinkActive : {})
                                                }}
                                                onClick={() => handleTabChange('boat')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleTabChange('boat')}
                                            >
                                                Boat
                                            </div>
                                        </li>
                                        <li style={tabStyle.navItem}>
                                            <div
                                                style={{
                                                    ...tabStyle.navLink,
                                                    ...(activeTab === 'property' ? tabStyle.navLinkActive : {})
                                                }}
                                                onClick={() => handleTabChange('property')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleTabChange('property')}
                                            >
                                                Property
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="row">
                                    {promotionType === 0 ? (
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t('Promotion Link')} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="https://example.com"
                                                    value={imagelink}
                                                    onChange={(e) => {
                                                        setImageLink(e.target.value);
                                                        setbannerError(prev => ({ ...prev, imagelink: "" }));
                                                    }}
                                                    isInvalid={!!bannerError.imagelink}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {bannerError.imagelink}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>{t('Select Owner')} <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select
                                                        value={ownerId}
                                                        onChange={(e) => {
                                                            const selectedOwnerId = e.target.value;
                                                            setOwnerId(selectedOwnerId);
                                                            setbannerError(prev => ({ ...prev, ownerId: "" }));
                                                            setTripId('');
                                                            
                                                            if (selectedOwnerId) {
                                                                if (activeTab === 'boat') {
                                                                    fetchOwnerTrips(selectedOwnerId);
                                                                } else {
                                                                    fetchPropertyAds(selectedOwnerId);
                                                                }
                                                            } else {
                                                                setownerTrips([]);
                                                                setPropertyAds([]);
                                                            }
                                                        }}
                                                        isInvalid={!!bannerError.ownerId}
                                                    >
                                                        <option value="">{t('Select Owner')}</option>
                                                        {owners.map(owner => (
                                                            <option key={owner.user_id} value={owner.user_id}>
                                                                {owner.l_name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {bannerError.ownerId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        {activeTab === 'boat' ? t('Select Trip') : t('Select Property Ad')} 
                                                        <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={tripId}
                                                        onChange={(e) => {
                                                            setTripId(e.target.value);
                                                            setbannerError(prev => ({ ...prev, tripId: "" }));
                                                        }}
                                                        isInvalid={!!bannerError.tripId}
                                                        disabled={!ownerId}
                                                    >
                                                        <option value="">
                                                            {activeTab === 'boat' ? t('Select Trip') : t('Select Property Ad')}
                                                        </option>
                                                        {activeTab === 'boat' 
                                                            ? ownerTrips.map(trip => (
                                                                <option key={trip.trip_id} value={trip.trip_id}>
                                                                    {trip.captain_name_english}-{trip.random_id}
                                                                </option>
                                                            ))
                                                            : propertyAds.map(ad => (
                                                                <option key={ad.property_ad_id} value={ad.property_ad_id}>
                                                                    {ad.property_name_english || ad.random_booking_id}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {bannerError.tripId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('Start Date')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={startDate}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    setStartDate(e.target.value);
                                                    setbannerError(prev => ({ ...prev, startDate: "" }));
                                                }}
                                                isInvalid={!!bannerError.startDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {bannerError.startDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t('End Date')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={endDate}
                                                min={startDate || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    setEndDate(e.target.value);
                                                    setbannerError(prev => ({ ...prev, endDate: "" }));
                                                }}
                                                isInvalid={!!bannerError.endDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {bannerError.endDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>

                                <Form.Group className="mb-0">
                                    <Form.Label>{t('Promotion Image')} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        isInvalid={!!bannerError.image}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {bannerError.image}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            {image && (
                                <div className="text-center mt-3">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Banner Preview"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '100px' }}
                                    />
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer className="mt-1">
                            <ButtonComponent
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setAddModal(false);
                                    setImageLink('');
                                    setImage(null);
                                    setStartDate('');
                                    setEndDate('');
                                    setOwnerId('');
                                    setTripId('');
                                    setPromotionType(0);
                                    setActiveTab('boat');
                                    setownerName('')
                                    setbannerError({})
                                }}
                            >
                                {t('Cancel')}
                            </ButtonComponent>
                            <ButtonComponent
                                type="button"
                                className="btn btn-success"
                                onClick={handleAddBanner}
                            >
                                {t('Save Banner')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={successModel} onHide={() => setsuccessModel(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                            <h3>{t('success')}</h3><br />
                            <p>{msg}</p>
                            <Modal.Footer>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>{t("Delete Confirmation")}</h3>
                            <p>Are you sure, you want to delete this banner?</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete() }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>
                </div>
            )}
        </>
    );
}