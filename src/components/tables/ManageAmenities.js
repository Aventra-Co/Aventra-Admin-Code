import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent } from "../elements";
import axios from "axios";
import { API_URL, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import AddIcon from '@mui/icons-material/Add';
import { SyncLoader } from 'react-spinners';
import Swal from 'sweetalert2';

export default function ManageAmenities() {
    const { t } = useContext(TranslatorContext);
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [amenityId, setAmenityId] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setSuccessModel] = useState(false);
    const [msg, setMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Add form states
    const [amenityName, setAmenityName] = useState("");
    const [amenityIconFile, setAmenityIconFile] = useState(null);
    const [amenityIconPreview, setAmenityIconPreview] = useState(null);
    
    // Edit form states
    const [editAmenityName, setEditAmenityName] = useState("");
    const [editAmenityIconFile, setEditAmenityIconFile] = useState(null);
    const [editAmenityIconPreview, setEditAmenityIconPreview] = useState(null);
    const [existingIcon, setExistingIcon] = useState("");
    
    // Error states
    const [amenityError, setAmenityError] = useState({});
    
    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredAmenities = amenities.filter((item) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            item.amenity_name?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentAmenities = filteredAmenities.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchAmenities = () => {
        setLoading(true);
        axios.get(API_URL + "/get_all_amenities")
            .then((response) => {
                if (response.data.success) {
                    setAmenities(response.data.data || []);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching amenities:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'edit') {
            setEditModal(true);
            setAmenityId(item.amenity_id);
            setEditAmenityName(item.amenity_name || "");
            setExistingIcon(item.amenity_icon || "");
            setEditAmenityIconPreview(item.amenity_icon ? `${IMAGE_PATH}/${item.amenity_icon}` : null);
        } else if (action === 'delete') {
            setAlertModal(true);
            setAmenityId(item.amenity_id);
        }
    };

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('amenity_id', amenityId);

        axios.post(API_URL + '/delete_amenity', formData)
            .then((res) => {
                if (res.data.success) {
                    setMsg(res.data.msg);
                    setAlertModal(false);
                    setSuccessModel(true);
                    fetchAmenities();
                    setTimeout(() => {
                        setSuccessModel(false);
                    }, 2000);
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: res.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete amenity',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    const handleAddIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAmenityIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAmenityIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setAmenityError((prev) => ({ ...prev, amenity_icon: "" }));
        }
    };

    const handleEditIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditAmenityIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditAmenityIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setAmenityError((prev) => ({ ...prev, editAmenityIcon: "" }));
        }
    };

    const handleEditAmenity = () => {
        let error = {};
        if (!editAmenityName) {
            error.editAmenityName = "Please enter amenity name";
        }
        
        if (Object.keys(error).length > 0) {
            setAmenityError(error);
            return;
        }

        const formData = new FormData();
        formData.append('amenity_id', amenityId);
        formData.append('amenity_name', editAmenityName);
        
        if (editAmenityIconFile) {
            formData.append('amenity_icon', editAmenityIconFile);
        }

        axios.post(API_URL + '/edit_amenity', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.success) {
                setMsg(response.data.msg);
                setEditAmenityName('');
                setEditAmenityIconFile(null);
                setEditAmenityIconPreview(null);
                setExistingIcon('');
                setEditModal(false);
                setSuccessModel(true);
                fetchAmenities();
                setTimeout(() => {
                    setSuccessModel(false);
                }, 2000);
            } else {
                if (response.data.key) {
                    let updatedErrors = { ...error };
                    updatedErrors[response.data.key] = response.data.msg;
                    setAmenityError(updatedErrors);
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
        }).catch(error => {
            console.error('Error updating amenity:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update amenity',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddAmenity = () => {
        let error = {};
        if (!amenityName) {
            error.amenityName = "Please enter amenity name";
        }
        if (!amenityIconFile) {
            error.amenity_icon = "Please select an icon";
        }
        
        if (Object.keys(error).length > 0) {
            setAmenityError(error);
            return;
        }

        const formData = new FormData();
        formData.append('amenity_name', amenityName);
        formData.append('amenity_icon', amenityIconFile);

        axios.post(API_URL + '/add_amenity', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.success) {
                setMsg(response.data.msg);
                setAmenityName('');
                setAmenityIconFile(null);
                setAmenityIconPreview(null);
                fetchAmenities();
                setAddModal(false);
                setSuccessModel(true);
                setTimeout(() => {
                    setSuccessModel(false);
                }, 2000);
            } else {
                if (response.data.key) {
                    let updatedErrors = { ...error };
                    updatedErrors[response.data.key] = response.data.msg;
                    setAmenityError(updatedErrors);
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
        }).catch(error => {
            console.error('Error adding amenity:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add amenity',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        });
    };

    const resetAddModal = () => {
        setAddModal(false);
        setAmenityError({});
        setAmenityName('');
        setAmenityIconFile(null);
        setAmenityIconPreview(null);
    };

    const resetEditModal = () => {
        setEditModal(false);
        setAmenityError({});
        setEditAmenityName('');
        setEditAmenityIconFile(null);
        setEditAmenityIconPreview(null);
        setExistingIcon('');
    };

    // Helper function to render stars (if needed for ratings)
    const renderStars = (rating) => {
        if (!rating || rating === 0) return "NA";
        const roundedRating = Math.round(rating);
        const stars = [];
        for (let i = 0; i < roundedRating; i++) {
            stars.push(<i key={i} className="material-icons star-icon" style={{ fontSize: '18px', color: '#ffc107' }}>star</i>);
        }
        return stars;
    };

    return (
        <>
            {/* <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#121926',
                    fontWeight: '600',
                    fontFamily: 'Nunito',
                    lineHeight: '1.167',
                    marginBottom: '5px'
                }}>
                    {t('Manage Amenities')}
                </p>
            </div> */}

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
                        <AddIcon className="me-2" /> {t("Add Amenity")}
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
                                <th>{t("Icon")}</th>
                                <th>{t("Amenity Name")}</th>
                            </tr>
                        </thead>
                        <tbody className="mc-table-body even">
                            {currentAmenities?.map((item, index) => (
                                <tr key={index}>
                                    <td title="id">
                                        <div className="mc-table-check">
                                            <p>{indexOfFirstEntry + index + 1}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="mc-table-action">
                                            <ButtonComponent 
                                                title="Edit" 
                                                className="material-icons edit" 
                                                onClick={() => { handleUserAction('edit', item) }}
                                            >
                                                edit
                                            </ButtonComponent>
                                            <ButtonComponent 
                                                type="button" 
                                                className="material-icons delete" 
                                                onClick={() => handleUserAction('delete', item)}
                                            >
                                                delete
                                            </ButtonComponent>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {item.amenity_icon ? (
                                            <img 
                                                src={`${IMAGE_PATH}/${item.amenity_icon}`} 
                                                alt={item.amenity_name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <span>NA</span>
                                        )}
                                    </td>
                                    <td>
                                        <span>{item.amenity_name || 'NA'}</span>
                                    </td>
                                 </tr>
                            ))}
                        </tbody>
                     </table>

                    <PaginationComponent
                        totalEntries={filteredAmenities.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                    {/* Edit Modal */}
                    <Modal show={editModal} onHide={resetEditModal} size="lg">
                        <div className="mc-user-modal">
                            <h4 className="mb-3">{t('Edit Amenity')}</h4>

                              <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Amenity Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter amenity name"
                                    value={editAmenityName}
                                    onChange={(e) => {
                                        setEditAmenityName(e.target.value);
                                        setAmenityError((prev) => ({ ...prev, editAmenityName: "" }));
                                    }}
                                    isInvalid={!!amenityError.editAmenityName}
                                    maxLength={50}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {amenityError.editAmenityName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            {/* Icon Preview */}
                            <div className="text-start mb-3">
                                <label className="fw-bold mb-2">Current Icon</label>
                                {editAmenityIconPreview ? (
                                    <div>
                                        <img 
                                            src={editAmenityIconPreview} 
                                            alt="Preview" 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : existingIcon ? (
                                    <div>
                                        <img 
                                            src={`${IMAGE_PATH}/${existingIcon}`} 
                                            alt="Current Icon" 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        backgroundColor: '#f0f0f0', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        borderRadius: '8px'
                                    }}>
                                        <span style={{ color: '#999' }}>No Icon</span>
                                    </div>
                                )}
                            </div>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Amenity Icon')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditIconChange}
                                    isInvalid={!!amenityError.editAmenityIcon}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {amenityError.editAmenityIcon}
                                </Form.Control.Feedback>
                            </Form.Group>

                          
                            
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={resetEditModal}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleEditAmenity}>
                                    {t('update')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    {/* Add Modal */}
                    <Modal show={addModal} onHide={resetAddModal} backdrop="static" size="lg">
                        <div className="mc-user-modal">
                            <h4 className="mb-3">{t('Add New Amenity')}</h4>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Amenity Name')} <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter amenity name')}
                                    maxLength={50}
                                    value={amenityName}
                                    onChange={(e) => {
                                        setAmenityName(e.target.value);
                                        setAmenityError((prev) => ({ ...prev, amenityName: "" }));
                                    }}
                                    isInvalid={!!amenityError.amenityName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {amenityError.amenityName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            {/* Icon Preview */}
                            <div className="text-start mb-3">
                                <label className="fw-bold mb-2">Icon Preview</label>
                                {amenityIconPreview ? (
                                    <div>
                                        <img 
                                            src={amenityIconPreview} 
                                            alt="Preview" 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        backgroundColor: '#f0f0f0', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        borderRadius: '8px'
                                    }}>
                                        <span style={{ color: '#999' }}>No Icon</span>
                                    </div>
                                )}
                            </div>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Amenity Icon')} <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddIconChange}
                                    isInvalid={!!amenityError.amenity_icon}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {amenityError.amenity_icon}
                                </Form.Control.Feedback>
                            </Form.Group>

                            
                            
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={resetAddModal}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleAddAmenity}>
                                    {t('add')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    {/* Success Modal */}
                    <Modal show={successModel} onHide={() => setSuccessModel(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                            <h3>{t('success')}</h3><br />
                            <p>{msg}</p>
                            <Modal.Footer></Modal.Footer>
                        </div>
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>{t("delete amenity")}</h3>
                            <p>{t("Are you sure, you want to delete this amenity?")}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>
                                    {t('close')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete(); }}>
                                    {t('delete')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>
                </div>
            )}
        </>
    );
}