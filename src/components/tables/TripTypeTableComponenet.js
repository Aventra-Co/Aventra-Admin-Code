import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal } from "react-bootstrap";
import { ButtonComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { SyncLoader } from 'react-spinners'


export default function TripTypeTableComponenet({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [loading, setLoading] = useState(false);
    const [tripType, settripType] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertModal, setAlertModal] = useState(false);
    const [DeleteId, setDeleteId] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    var navigate = useNavigate();

    const filteredUsers = tripType.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.name_arabic?.toLowerCase().includes(lowercasedTerm) ||
            // user.name_french?.toLowerCase().includes(lowercasedTerm) ||
            // user.name_italian?.toLowerCase().includes(lowercasedTerm) ||
            // user.name_korean?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchTripType = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_trip_type")
            .then((response) => {
                settripType(response.data.trip_type_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchTripType();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(item.trip_type_id);
        }
        if (action === 'edit') {
            //      {/* <Link to={APP_PREFIX_PATH + `/edit-trip-type/${encode(item.trip_type_id)}`}> */}
            // {/* <ButtonComponent title="Edit" className="material-icons edit">edit</ButtonComponent></Link> */}

            navigate(APP_PREFIX_PATH + `/edit-trip-type/${encode(item.trip_type_id)}`)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = () => {
        axios.post(API_URL + '/delete_trip_type', { trip_type_id: DeleteId }).then((res) => {
            if (res.data.success) {
                setsuccessModel(true);
                setTimeout(() => {
                    setsuccessModel(false);
                    fetchTripType();
                }, 2000);
            }
        }).catch((error) => {
            console.log(error);

        })
    }

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModal(true);
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
                    <Link to={APP_PREFIX_PATH + '/add-trip-type'}>
                        <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }}> <AddIcon className="me-2" /> {t("Add Activity")} </button></Link>
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
                                <th>{t("Vector Image")}</th>
                                <th>{t("Activity english")}</th>
                                <th>{t("Activity arabic")}</th>
                                {/* <th>{t("Activity french")}</th>
                                <th>{t("Activity italian")}</th>
                                <th>{t("Activity korean")}</th> */}
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
                                            {/* <Link to={APP_PREFIX_PATH + `/edit-trip-type/${encode(item.trip_type_id)}`}> */}
                                            {/* <ButtonComponent title="Edit" className="material-icons edit">edit</ButtonComponent></Link> */}
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => handleUserAction('edit', item)}>edit</ButtonComponent>

                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>
                                        </div>
                                    </td>
                                    <td>
                                        {item.image ? (
                                            <img
                                                src={item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Activity"
                                                style={{ width: '50px', height: '50px', cursor: 'pointer', borderRadius: '39px', objectFit: 'cover' }}
                                                onClick={() => handleImageClick(item.image)}
                                            />
                                        ) : 'NA'}
                                    </td>
                                    <td>
                                        {item.vector_image ? (
                                            <img
                                                src={item.vector_image ? `${IMAGE_PATH}${item.vector_image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Vector"
                                                style={{ width: '50px', height: '50px', cursor: 'pointer', borderRadius: '39px', objectFit: 'cover' }}
                                                onClick={() => handleImageClick(item.vector_image)}
                                            />
                                        ) : 'NA'}
                                    </td>
                                    <td>
                                        <span>{item.name_english || 'NA'}</span>
                                    </td>
                                    <td><span>{item.name_arabic || 'NA'}</span></td>
                                    {/* <td><span>{item.name_french || 'NA'}</span></td>
                                    <td><span>{item.name_italian || 'NA'}</span></td>
                                    <td><span>{item.name_korean || 'NA'}</span></td> */}

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

                    {/* Image Preview Modal */}
                    <Modal show={imageModal} onHide={() => setImageModal(false)} >
                        <Modal.Header closeButton style={{marginBottom:'0px'}}>
                            {/* <Modal.Title>{t("Image Preview")}</Modal.Title> */}
                        </Modal.Header>
                        <Modal.Body>
                            <img
                                src={selectedImage ? `${IMAGE_PATH}${selectedImage}` : `${IMAGE_PATH}Placeholder.webp`}
                                alt="Preview"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Modal.Body>
                    </Modal>

                    <Modal show={successModel} onHide={() => setsuccessModel(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                            <h3>{t('success')}</h3><br />
                            <p>{t('Activity deleted successfully.')}</p>
                            <Modal.Footer>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>{t("Delete Confirmation")}</h3>
                            <p>{t("Are you sure, you want to delete this Activity?")}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete() }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}
