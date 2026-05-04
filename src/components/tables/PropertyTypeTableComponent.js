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

let propertyTypeImage = IMAGE_PATH + "doodlart.png"

export default function PropertyTypeTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [propertyTypeId, setPropertyTypeId] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [AddModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [msg, setmsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Add form states
    const [propertyTypeName, setPropertyTypeName] = useState("");
    const [propertyTypeNameArabic, setPropertyTypeNameArabic] = useState("");
    const [propertyTypeImageFile, setPropertyTypeImageFile] = useState(null);
    const [propertyTypeImagePreview, setPropertyTypeImagePreview] = useState(null);
    const [vectorImageFile, setVectorImageFile] = useState(null);
    const [vectorImagePreview, setVectorImagePreview] = useState(null);
    
    // Edit form states
    const [editPropertyTypeName, setEditPropertyTypeName] = useState("");
    const [editPropertyTypeNameArabic, setEditPropertyTypeNameArabic] = useState("");
    const [editPropertyTypeImageFile, setEditPropertyTypeImageFile] = useState(null);
    const [editPropertyTypeImagePreview, setEditPropertyTypeImagePreview] = useState(null);
    const [editVectorImageFile, setEditVectorImageFile] = useState(null);
    const [editVectorImagePreview, setEditVectorImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [existingVectorImage, setExistingVectorImage] = useState("");
    
    // Error states
    const [propertyTypeError, setPropertyTypeError] = useState({});
    
    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = propertyTypes.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.property_type_name?.toLowerCase().includes(lowercasedTerm) ||
            user.property_type_name_arabic?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchPropertyTypes = () => {
        setLoading(true);
        axios.get(API_URL + "/get_all_property_type")
            .then((response) => {
                if (response.data.success) {
                    setPropertyTypes(response.data.data || []);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching property types:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPropertyTypes();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'edit') {
            setEditModal(true);
            setPropertyTypeId(item.property_type_id);
            setEditPropertyTypeName(item.property_type_name || "");
            setEditPropertyTypeNameArabic(item.property_type_name_arabic || "");
            setExistingImage(item.property_type_image || "");
            setExistingVectorImage(item.vector_image || "");
            setEditPropertyTypeImagePreview(item.property_type_image ? `${IMAGE_PATH}/${item.property_type_image}` : null);
            setEditVectorImagePreview(item.vector_image ? `${IMAGE_PATH}/${item.vector_image}` : null);
        } else if (action === 'delete') {
            setAlertModal(true);
            setPropertyTypeId(item.property_type_id);
        }
    };

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('property_type_id', propertyTypeId);

        axios.post(API_URL + '/delete_property_type', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            if (res.data.success) {
                setmsg(res.data.msg);
                setAlertModal(false);
                setsuccessModel(true);
                fetchPropertyTypes();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleAddImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPropertyTypeImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPropertyTypeImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setPropertyTypeError((prev) => ({ ...prev, property_type_image: "" }));
        }
    };

    const handleAddVectorImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVectorImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVectorImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setPropertyTypeError((prev) => ({ ...prev, vector_image: "" }));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditPropertyTypeImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPropertyTypeImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setPropertyTypeError((prev) => ({ ...prev, editPropertyTypeImage: "" }));
        }
    };

    const handleEditVectorImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditVectorImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditVectorImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setPropertyTypeError((prev) => ({ ...prev, editVectorImage: "" }));
        }
    };

    const handleEditPropertyType = () => {
        let error = {};
        if (!editPropertyTypeName) {
            error.editPropertyTypeName = "Please enter property type name";
        }
        if (!editPropertyTypeNameArabic) {
            error.editPropertyTypeNameArabic = "Please enter property type name in Arabic";
        }
        
        if (Object.keys(error).length > 0) {
            setPropertyTypeError(error);
            return;
        }

        const formData = new FormData();
        formData.append('property_type_id', propertyTypeId);
        formData.append('property_type_name', editPropertyTypeName);
        formData.append('property_type_name_arabic', editPropertyTypeNameArabic);
        
        if (editPropertyTypeImageFile) {
            formData.append('property_type_image', editPropertyTypeImageFile);
        }
        if (editVectorImageFile) {
            formData.append('vector_image', editVectorImageFile);
        }

        axios.post(API_URL + '/edit_property_type', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.success) {
                setmsg(response.data.msg);
                setEditPropertyTypeName('');
                setEditPropertyTypeNameArabic('');
                setEditPropertyTypeImageFile(null);
                setEditPropertyTypeImagePreview(null);
                setEditVectorImageFile(null);
                setEditVectorImagePreview(null);
                setExistingImage('');
                setExistingVectorImage('');
                setEditModal(false);
                setsuccessModel(true);
                fetchPropertyTypes();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            } else {
                if (response.data.key) {
                    let updatedErrors = { ...error };
                    updatedErrors[response.data.key] = response.data.msg;
                    setPropertyTypeError(updatedErrors);
                }
            }
        }).catch(error => {
            console.error('Error updating property type:', error);
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddPropertyType = () => {
        let error = {};
        if (!propertyTypeName) {
            error.propertyTypeName = "Please enter property type name";
        }
        if (!propertyTypeNameArabic) {
            error.propertyTypeNameArabic = "Please enter property type name in Arabic";
        }
        if (!propertyTypeImageFile) {
            error.property_type_image = "Please select an image";
        }
        if (!vectorImageFile) {
            error.vector_image = "Please select a vector image";
        }
        
        if (Object.keys(error).length > 0) {
            setPropertyTypeError(error);
            return;
        }

        const formData = new FormData();
        formData.append('property_type_name', propertyTypeName);
        formData.append('property_type_name_arabic', propertyTypeNameArabic);
        formData.append('property_type_image', propertyTypeImageFile);
        formData.append('vector_image', vectorImageFile);

        axios.post(API_URL + '/add_property_type', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.success) {
                setmsg(response.data.msg);
                setPropertyTypeName('');
                setPropertyTypeNameArabic('');
                setPropertyTypeImageFile(null);
                setPropertyTypeImagePreview(null);
                setVectorImageFile(null);
                setVectorImagePreview(null);
                fetchPropertyTypes();
                setAddModal(false);
                setsuccessModel(true);
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            } else {
                if (response.data.key) {
                    let updatedErrors = { ...error };
                    updatedErrors[response.data.key] = response.data.msg;
                    setPropertyTypeError(updatedErrors);
                }
            }
        }).catch(error => {
            console.error('Error adding property type:', error);
        });
    };

    const resetAddModal = () => {
        setAddModal(false);
        setPropertyTypeError({});
        setPropertyTypeName('');
        setPropertyTypeNameArabic('');
        setPropertyTypeImageFile(null);
        setPropertyTypeImagePreview(null);
        setVectorImageFile(null);
        setVectorImagePreview(null);
    };

    const resetEditModal = () => {
        setEditModal(false);
        setPropertyTypeError({});
        setEditPropertyTypeName('');
        setEditPropertyTypeNameArabic('');
        setEditPropertyTypeImageFile(null);
        setEditPropertyTypeImagePreview(null);
        setEditVectorImageFile(null);
        setEditVectorImagePreview(null);
        setExistingImage('');
        setExistingVectorImage('');
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
                        <AddIcon className="me-2" /> {t("Add property type")}
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
                                <th>{t("Image")}</th>
                                <th>{t("Vector Image")}</th>
                                <th>{t("Property Type Name")}</th>
                                <th>{t("Property Type Name Arabic")}</th>
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
                                        {item.property_type_image ? (
                                            <img 
                                                src={`${IMAGE_PATH}/${item.property_type_image}`} 
                                                alt={item.property_type_name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <span>NA</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {item.vector_image ? (
                                            <img 
                                                src={`${IMAGE_PATH}/${item.vector_image}`} 
                                                alt={item.property_type_name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <span>NA</span>
                                        )}
                                    </td>
                                    <td>
                                        <span>{item.property_type_name || 'NA'}</span>
                                    </td>
                                    <td>
                                        <span>{item.property_type_name_arabic || 'NA'}</span>
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
                    <Modal show={editModal} onHide={resetEditModal} size="lg">
                        <div className="mc-user-modal">
                            <h4 className="mb-3">{t('Edit Property Type')}</h4>
                            
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter property type name"
                                    value={editPropertyTypeName}
                                    onChange={(e) => {
                                        setEditPropertyTypeName(e.target.value);
                                        setPropertyTypeError((prev) => ({ ...prev, editPropertyTypeName: "" }));
                                    }}
                                    isInvalid={!!propertyTypeError.editPropertyTypeName}
                                    maxLength={50}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.editPropertyTypeName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Name Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter property type name in Arabic"
                                    value={editPropertyTypeNameArabic}
                                    onChange={(e) => {
                                        setEditPropertyTypeNameArabic(e.target.value);
                                        setPropertyTypeError((prev) => ({ ...prev, editPropertyTypeNameArabic: "" }));
                                    }}
                                    isInvalid={!!propertyTypeError.editPropertyTypeNameArabic}
                                    maxLength={50}
                                    dir="rtl"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.editPropertyTypeNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Property Type Image Preview */}0
                            {/* <div className="text-center mb-3">
                                <label className="fw-bold">Property Type Image</label>
                                {editPropertyTypeImagePreview ? (
                                    <div>
                                        <img 
                                            src={editPropertyTypeImagePreview} 
                                            alt="Preview" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : existingImage ? (
                                    <div>
                                        <img 
                                            src={`${IMAGE_PATH}/${existingImage}`} 
                                            alt="Current" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <img 
                                            src={propertyTypeImage} 
                                            alt="Default" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </div> */}

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    isInvalid={!!propertyTypeError.editPropertyTypeImage}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.editPropertyTypeImage}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Vector Image Preview */}
                            {/* <div className="text-center mb-3">
                                <label className="fw-bold">Vector Image</label>
                                {editVectorImagePreview ? (
                                    <div>
                                        <img 
                                            src={editVectorImagePreview} 
                                            alt="Vector Preview" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : existingVectorImage ? (
                                    <div>
                                        <img 
                                            src={`${IMAGE_PATH}/${existingVectorImage}`} 
                                            alt="Current Vector" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <img 
                                            src={propertyTypeImage} 
                                            alt="Default Vector" 
                                            style={{ width: '100px', height: '100px', marginTop: '3px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </div> */}

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Vector Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditVectorImageChange}
                                    isInvalid={!!propertyTypeError.editVectorImage}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.editVectorImage}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={resetEditModal}>
                                    {t('close popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleEditPropertyType}>
                                    {t('update')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    {/* Add Modal */}
                    <Modal show={AddModal} onHide={resetAddModal} backdrop="static" size="lg">
                        <div className="mc-user-modal">
                            <h4 className="mb-3">{t('Add Property Type')}</h4>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Name')} *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter property type name')}
                                    maxLength={50}
                                    value={propertyTypeName}
                                    onChange={(e) => {
                                        setPropertyTypeName(e.target.value);
                                        setPropertyTypeError((prev) => ({ ...prev, propertyTypeName: "" }));
                                    }}
                                    isInvalid={!!propertyTypeError.propertyTypeName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.propertyTypeName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Name Arabic')} *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter property type name in Arabic')}
                                    maxLength={50}
                                    value={propertyTypeNameArabic}
                                    onChange={(e) => {
                                        setPropertyTypeNameArabic(e.target.value);
                                        setPropertyTypeError((prev) => ({ ...prev, propertyTypeNameArabic: "" }));
                                    }}
                                    isInvalid={!!propertyTypeError.propertyTypeNameArabic}
                                    dir="rtl"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.propertyTypeNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Property Type Image')} *</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddImageChange}
                                    isInvalid={!!propertyTypeError.property_type_image}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.property_type_image}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Vector Image')} *</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddVectorImageChange}
                                    isInvalid={!!propertyTypeError.vector_image}
                                />
                                <Form.Text className="text-muted">
                                    Recommended size: 200px x 200px (Max: 2MB)
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {propertyTypeError.vector_image}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={resetAddModal}>
                                    {t('close popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleAddPropertyType}>
                                    {t('add')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    {/* Success Modal */}
                    <Modal show={successModel} onHide={() => setsuccessModel(false)}>
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
                            <h3>{t("delete property type")}</h3>
                            <p>{t("Are you sure you want to delete this property type?")}</p>
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