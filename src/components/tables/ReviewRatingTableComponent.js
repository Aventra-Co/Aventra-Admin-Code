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
    const [role, setRole] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertModal, setAlertModal] = useState(false);

    const [viewModal, setviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const [DeleteId, setDeleteId] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = role.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.user_name?.toLowerCase().includes(lowercasedTerm) ||
            user.boat_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchServiceDetails = () => {
        axios.get(API_URL + "/fetch_all_rating_review")
            .then((response) => {
                setRole(response.data.rating_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchServiceDetails();
    }, []);

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
        axios.post(API_URL + '/delete_ratings', { rating_review_id: DeleteId }).then((res) => {
            if (res.data.success) {
                setsuccessModel(true);
                fetchServiceDetails();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        })
    }

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
            </Row>

            <div className="mc-table-responsive">
                <table className="mc-table">
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
                                    <span>
                                        {item.total_rating ? (
                                            [...Array(item.total_rating)].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>

                                {/* <td> <span>{item.captain || 'NA'}</span></td>
                                <td> <span>{item.clean || 'NA'}</span></td>
                                <td> <span>{item.time || 'NA'}</span></td>
                                <td> <span>{item.hospitality || 'NA'}</span></td>
                                <td> <span>{item.equipment || 'NA'}</span></td>
                                <td> <span>{item.food || 'NA'}</span></td>
                                <td> <span>{item.entertainment || 'NA'}</span></td> */}

                                <td>
                                    <span>
                                        {item.captain ? (
                                            [...Array(Math.round(item.captain))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.clean ? (
                                            [...Array(Math.round(item.clean))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.time ? (
                                            [...Array(Math.round(item.time))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.hospitality ? (
                                            [...Array(Math.round(item.hospitality))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.equipment ? (
                                            [...Array(Math.round(item.equipment))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.food ? (
                                            [...Array(Math.round(item.food))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {item.entertainment ? (
                                            [...Array(Math.round(item.entertainment))].map((_, index) => (
                                                <i key={index} className="material-icons star-icon">star</i>
                                            ))
                                        ) : (
                                            "NA"
                                        )}
                                    </span>
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
                </table>

                <PaginationComponent
                    totalEntries={filteredUsers.length}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />

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
                </Modal >

                <Modal show={viewModal} onHide={() => setviewModal(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">visibility</i>
                        <h3>{t("Review Details")}</h3>
                        {selectedReview && (
                            <div className="review-details">
                                <p><strong>{t("User Name")}:</strong> {selectedReview.user_name || 'NA'}</p>
                                <p><strong>{t("Boat Name")}:</strong> {selectedReview.boat_name_english || 'NA'}</p>
                                {/* <p><strong>{t("Rating")}:</strong> 
                                    {selectedReview.total_rating ? (
                                        [...Array(selectedReview.total_rating)].map((_, index) => (
                                            <i key={index} className="material-icons star-icon">star</i>
                                        ))
                                    ) : "NA"}
                                </p> */}
                                {/* <p><strong>{t("Time")}:</strong> {selectedReview.time || 'NA'}</p>
                                <p><strong>{t("Clean")}:</strong> {selectedReview.clean || 'NA'}</p>
                                <p><strong>{t("Hospitality")}:</strong> {selectedReview.hospitality || 'NA'}</p>
                                <p><strong>{t("Captain")}:</strong> {selectedReview.captain || 'NA'}</p>
                                <p><strong>{t("Food")}:</strong> {selectedReview.food || 'NA'}</p>
                                <p><strong>{t("Entertainment")}:</strong> {selectedReview.food || 'NA'}</p>
                                <p><strong>{t("Equipment")}:</strong> {selectedReview.food || 'NA'}</p> */}
                                <p><strong>{t("Total Rating")}:</strong> {selectedReview.total_rating || 'NA'}</p>
                                <p><strong>{t("Review")}:</strong> {selectedReview.review || 'NA'}</p>
                                <p><strong>{t("Created Time")}:</strong> {selectedReview.createtime || 'NA'}</p>
                            </div>
                        )}
                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setviewModal(false)}>{t('close')}</ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal >
            </div >
        </>
    );
}