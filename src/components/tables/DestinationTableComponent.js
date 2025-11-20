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
import './TripTableComponenet.css';
import { SyncLoader } from "react-spinners";


export default function DestinationTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [Destination, setDestination] = useState([]);
    const [DeleteId, setDeleteId] = useState('');
    const [loading, setLoading] = useState(false);

    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = Destination.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.destination_english?.toLowerCase().includes(lowercasedTerm) ||
            user.destination_arabic?.toLowerCase().includes(lowercasedTerm) ||
            // user.destination_french?.toLowerCase().includes(lowercasedTerm) ||
            // user.destination_italian?.toLowerCase().includes(lowercasedTerm) ||
            // user.destination_korean?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchDestination = () => {
        setLoading(true);
        axios.get(API_URL + "/fetch_destination_details")
            .then((response) => {

                setDestination(response.data.destination_arr || []);
                setLoading(false)


            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };









    useEffect(() => {
        fetchDestination();
    }, []);

    const handleUserAction = (action, destination_id) => {
        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(destination_id);

        }
    }

    const DeleteDestination = () => {
        if (DeleteId) {
            axios.post(API_URL + '/delete_destination', { destination_id: DeleteId }).then((res) => {

                if (res.data.success) {
                    setsuccessModel(true);
                    setTimeout(() => {
                        fetchDestination();
                        setsuccessModel(false);
                    }, 2000);
                }
            }).catch((error) => {
                console.log(error);

            })
        }
    }

    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };
    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };




    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };



    return (
        <>

            <Row xs={1} sm={2} xl={4} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        // label={t('search_by')}
                        icon="Search"
                        placeholder={`${t('search_here')}`}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <Link to={APP_PREFIX_PATH + '/add-destination'}>
                        <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }}> <AddIcon className="me-2" /> {t("Add Destination")} </button></Link>
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

                                <th>{t("Image")}</th>
                                <th>{t("Destination English")}</th>
                                <th>{t("Destination Arabic")}</th>
                                {/* <th>{t("Destination French")}</th>
                                <th>{t("Destination Italian")}</th>
                                <th>{t("Destination Korean")}</th> */}
                                <th>{t("CREATE DATE & TIME")}</th>
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

                                            <Link to={APP_PREFIX_PATH + `/edit-destination/${encode(item.destination_id)}`}>
                                                <ButtonComponent title="Edit" className="material-icons edit">edit</ButtonComponent></Link>
                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item.destination_id)}>delete</ButtonComponent>
                                        </div>
                                    </td>
                                    <td title={item.destination_image}>

                                        <div className="mc-table-profile">
                                            <img
                                                src={item.destination_image ? `${IMAGE_PATH}${item.destination_image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                onClick={() => handleImageClick(item.destination_image ? `${IMAGE_PATH}${item.destination_image}` : `${IMAGE_PATH}Placeholder.webp`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleImageClick(item.destination_image ? `${IMAGE_PATH}${item.destination_image}` : `${IMAGE_PATH}Placeholder.webp`);
                                                    }
                                                }}
                                                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                                role="button" // Add role="button" to indicate interactive element
                                                tabIndex={0}
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
                                                    <img src={enlargedImage} alt="Enlarged Profile" className="enlarged-image" style={{ width: '30rem', height: '30rem', borderRadius: '5px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td>{item.destination_english || 'NA'}</td>
                                    <td>{item.destination_arabic || 'NA'}</td>
                                    {/* <td>{item.destination_french || 'NA'}</td>
                                    <td>{item.destination_italian || 'NA'}</td>
                                    <td>{item.destination_korean || 'NA'}</td> */}

                                    <td>{item.createtime || 'NA'}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table >


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
                            <p>Destination deleted successfully.</p>
                            <Modal.Footer>

                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>are your sure!</h3>
                            <p>Want to delete this destination?</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); DeleteDestination(); }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}