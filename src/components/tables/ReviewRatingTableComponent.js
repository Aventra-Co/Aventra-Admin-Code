import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import Select from 'react-select';
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import categoryImage from '../../assets/img/category.webp';
import './ReviewRatingTableComponent.css'

export default function ReviewRatingTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [activeTab, setActiveTab] = useState('boat');
    const [boatRatings, setBoatRatings] = useState([]);
    const [propertyRatings, setPropertyRatings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertModal, setAlertModal] = useState(false);
    const [viewModal, setviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [DeleteId, setDeleteId] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const entriesPerPage = 5;

    const getCurrentData = () => {
        return activeTab === 'boat' ? boatRatings : propertyRatings;
    };

    const currentData = getCurrentData();

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = currentData.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        if (activeTab === 'boat') {
            return (
                user.user_name?.toLowerCase().includes(lowercasedTerm) ||
                user.boat_name_english?.toLowerCase().includes(lowercasedTerm) ||
                user.createtime?.toLowerCase().includes(lowercasedTerm)
            );
        } else {
            return (
                user.user_name?.toLowerCase().includes(lowercasedTerm) ||
                user.property_name_english?.toLowerCase().includes(lowercasedTerm) ||
                user.createtime?.toLowerCase().includes(lowercasedTerm) ||
                user.owner_name?.toLowerCase().includes(lowercasedTerm)
            );
        }
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchBoatRatings = () => {
        axios.get(API_URL + "/fetch_all_rating_review")
            .then((response) => {
                setBoatRatings(response.data.rating_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching boat ratings:', error);
            });
    };

    const fetchPropertyRatings = () => {
        axios.get(API_URL + "/fetch_all_property_rating_review")
            .then((response) => {
                setPropertyRatings(response.data.rating_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching property ratings:', error);
            });
    };

    useEffect(() => {
        fetchBoatRatings();
        fetchPropertyRatings();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm("");
    }, [activeTab]);

    const handleUserAction = (action, item) => {
        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(item.rating_review_id);
        }
        if (action === 'view') {
            setviewModal(true);
            setSelectedReview(item);
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = () => {
        const deleteEndpoint = activeTab === 'boat' 
            ? '/delete_ratings' 
            : '/delete_property_ratings';
            
        axios.post(API_URL + deleteEndpoint, { rating_review_id: DeleteId }).then((res) => {
            if (res.data.success) {
                setsuccessModel(true);
                if (activeTab === 'boat') {
                    fetchBoatRatings();
                } else {
                    fetchPropertyRatings();
                }
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        })
    }

    // Helper function to render stars based on rating value
    const renderStars = (rating) => {
        if (!rating || rating === 0) return "NA";
        
        const roundedRating = Math.round(rating);
        const stars = [];
        
        for (let i = 0; i < roundedRating; i++) {
            stars.push(<i key={i} className="material-icons star-icon">star</i>);
        }
        
        return stars;
    };

    // Render boat table columns
    const renderBoatTable = () => (
        <>
            <thead className="mc-table-head primary">
                <tr>
                    <th>{t("sno")}</th>
                    <th>{t("actions")}</th>
                    <th>{t("User Name")}</th>
                    <th>{t("Boat Name")}</th>
                    <th>{t("Rating")}</th>
                    <th>{t("Captain")}</th>
                    <th>{t("Clean")}</th>
                    <th>{t("Time")}</th>
                    <th>{t("Hospitality")}</th>
                    <th>{t("Equipment")}</th>
                    <th>{t("Food")}</th>
                    <th>{t("Entertainment")}</th>
                    <th>{t("Review")}</th>
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
                                <AnchorComponent
                                    title="View"
                                    type="button"
                                    onClick={() => handleUserAction('view', item)}
                                    className="material-icons view"
                                >
                                    visibility
                                </AnchorComponent>
                                <ButtonComponent
                                    type="button"
                                    className="material-icons delete"
                                    onClick={() => handleUserAction('delete', item)}
                                >
                                    delete
                                </ButtonComponent>
                            </div>
                        </td>
                        <td> <span>{item.user_name || 'NA'}</span></td>
                        <td>
                            <span>{item.boat_name_english || 'NA'}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.total_rating)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.captain)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.clean)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.time)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.hospitality)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.equipment)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.food)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.entertainment)}</span>
                        </td>
                        <td>
                            <span>
                                {item.review
                                    ? item.review.split(" ").slice(0, 5).join(" ") + (item.review.split(" ").length > 5 ? " ..." : "")
                                    : "NA"}
                            </span>
                        </td>
                        <td>{item.createtime || 'NA'}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    // Render property table columns
    const renderPropertyTable = () => (
        <>
            <thead className="mc-table-head primary">
                <tr>
                    <th>{t("sno")}</th>
                    <th>{t("actions")}</th>
                    <th>{t("User Name")}</th>
                    <th>{t("Property Name")}</th>
                    <th>{t("Owner Name")}</th>
                    <th>{t("Total Rating")}</th>
                    <th>{t("Clean")}</th>
                    <th>{t("Arrangements")}</th>
                    <th>{t("Review")}</th>
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
                                <AnchorComponent
                                    title="View"
                                    type="button"
                                    onClick={() => handleUserAction('view', item)}
                                    className="material-icons view"
                                >
                                    visibility
                                </AnchorComponent>
                                <ButtonComponent
                                    type="button"
                                    className="material-icons delete"
                                    onClick={() => handleUserAction('delete', item)}
                                >
                                    delete
                                </ButtonComponent>
                            </div>
                        </td>
                        <td> <span>{item.user_name || 'NA'}</span></td>
                        <td>
                            <span>{item.property_name_english || 'NA'}</span>
                        </td>
                        <td>
                            <span>{item.owner_name || 'NA'}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.total_rating)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.clean)}</span>
                        </td>
                        <td>
                            <span>{renderStars(item.arrangements)}</span>
                        </td>
                        <td>
                            <span>
                                {item.review
                                    ? item.review.split(" ").slice(0, 5).join(" ") + (item.review.split(" ").length > 5 ? " ..." : "")
                                    : "NA"}
                            </span>
                        </td>
                        <td>{item.createtime || 'NA'}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#121926',
                    fontWeight: '600',
                    fontFamily: 'Nunito',
                    lineHeight: '1.167',
                    marginBottom: '5px'
                }}>
                    {/* {t('Ratings & Reviews')} */}
                </p>
            </div>

            {/* Custom Tab Navigation */}
            <nav className='navbar navbar-expand-lg navbar-light navBar'>
                <div
                    className='container mobile'
                    id='container-div'
                    style={{
                        marginTop: '-2rem',
                        width: 'auto',
                        borderRadius: '5px',
                        marginLeft: '0rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}
                >
                    <button
                        type="button"
                        className={`btn btn-outline-success me-2 mb-2 btn-content ${activeTab === 'boat' ? 'btn-active' : ''}`}
                        style={{ width: '15rem' }}
                        onClick={() => {
                            setActiveTab('boat');
                            setSearchTerm('');
                            setCurrentPage(1);
                        }}
                    >
                        {t('Boat')}
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-success me-2 mb-2 btn-content ${activeTab === 'property' ? 'btn-active' : ''}`}
                        style={{ width: '15rem' }}
                        onClick={() => {
                            setActiveTab('property');
                            setSearchTerm('');
                            setCurrentPage(1);
                        }}
                    >
                        {t('Property')}
                    </button>
                </div>
            </nav>

            {/* Search Bar */}
            <Row xs={1} sm={2} xl={4} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
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

            {/* Table Content */}
            <div className="mc-table-responsive">
                <table className="mc-table">
                    {activeTab === 'boat' ? renderBoatTable() : renderPropertyTable()}
                </table>

                <PaginationComponent
                    totalEntries={filteredUsers.length}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            <Modal show={successModel} onHide={() => setsuccessModel(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>{t('success')}</h3><br />
                    <p>{t('Rating deleted successfully.')}</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>{t("Delete Confirmation")}</h3>
                    <p>{t("Are you sure, you want to delete this rating?")}</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete() }}>{t('delete')}</ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>

            <Modal show={viewModal} onHide={() => setviewModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">visibility</i>
                    <h3>{t("Review Details")}</h3>
                    {selectedReview && (
                        <div className="review-details">
                            <p><strong>{t("User Name")}:</strong> {selectedReview.user_name || 'NA'}</p>
                            {activeTab === 'boat' ? (
                                <>
                                    <p><strong>{t("Boat Name")}:</strong> {selectedReview.boat_name_english || 'NA'}</p>
                                    <p><strong>{t("Total Rating")}:</strong> {selectedReview.total_rating || 'NA'}</p>
                                    <p><strong>{t("Captain Rating")}:</strong> {selectedReview.captain || 'NA'}</p>
                                    <p><strong>{t("Clean Rating")}:</strong> {selectedReview.clean || 'NA'}</p>
                                    <p><strong>{t("Time Rating")}:</strong> {selectedReview.time || 'NA'}</p>
                                    <p><strong>{t("Hospitality Rating")}:</strong> {selectedReview.hospitality || 'NA'}</p>
                                    <p><strong>{t("Equipment Rating")}:</strong> {selectedReview.equipment || 'NA'}</p>
                                    <p><strong>{t("Food Rating")}:</strong> {selectedReview.food || 'NA'}</p>
                                    <p><strong>{t("Entertainment Rating")}:</strong> {selectedReview.entertainment || 'NA'}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>{t("Property Name")}:</strong> {selectedReview.property_name_english || 'NA'}</p>
                                    <p><strong>{t("Owner Name")}:</strong> {selectedReview.owner_name || 'NA'}</p>
                                    <p><strong>{t("Total Rating")}:</strong> {selectedReview.total_rating || 'NA'}</p>
                                    <p><strong>{t("Clean Rating")}:</strong> {selectedReview.clean || 'NA'}</p>
                                    <p><strong>{t("Arrangements Rating")}:</strong> {selectedReview.arrangements || 'NA'}</p>
                                </>
                            )}
                            <p><strong>{t("Review")}:</strong> {selectedReview.review || 'NA'}</p>
                            <p><strong>{t("Created Time")}:</strong> {selectedReview.createtime || 'NA'}</p>
                        </div>
                    )}
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setviewModal(false)}>{t('close')}</ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}