import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { API_URL, IMAGE_PATH } from "../../constant/constant";
import { Row, Col } from "react-bootstrap";
import AddIcon from '@mui/icons-material/Add';
import { SyncLoader } from 'react-spinners'
import { LabelFieldComponent } from "../../components/fields";
import { PaginationComponent } from "../../components";
import { ButtonComponent } from "../../components/elements";

export default function AddOnsSubcategory() {
    const { t } = useContext(TranslatorContext);
    const [AddOnSubcategoryDetails, setAddOnSubcategoryDetails] = useState([]);
    const [AllAddOns, setAllAddOns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addOnSubcategoryId, setAddOnSubcategoryId] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [AddModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [msg, setmsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [addOnId, setAddOnId] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [subCategoryNameArabic, setSubCategoryNameArabic] = useState('');
    const [subCategoryImage, setSubCategoryImage] = useState(null);
    const [editAddOnId, setEditAddOnId] = useState("");
    const [editSubCategoryName, setEditSubCategoryName] = useState("");
    const [editSubCategoryNameArabic, setEditSubCategoryNameArabic] = useState("");
    const [editSubCategoryImage, setEditSubCategoryImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [editPreviewImage, setEditPreviewImage] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = AddOnSubcategoryDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.addon_name?.toLowerCase().includes(lowercasedTerm) ||
            user.sub_category_name?.toLowerCase().includes(lowercasedTerm) ||
            user.sub_category_name_arabic?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchAddOnSubcategoryDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/get_addons_subcategory")
            .then((response) => {
                setAddOnSubcategoryDetails(response.data.addonSubCategoryArray || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching addon subcategory details:', error);
            });
    };

    const fetchAllAddOns = () => {
        axios.get(API_URL + "/get_all_addons")
            .then((response) => {
                setAllAddOns(response.data.addonArray || []);
            })
            .catch((error) => {
                console.error('Error fetching addons:', error);
            });
    };

    useEffect(() => {
        fetchAddOnSubcategoryDetails();
        fetchAllAddOns();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'edit') {
            setEditModal(true);
            setAddOnSubcategoryId(item.addon_subcategory_id);
            setEditAddOnId(item.addon_id);
            setEditSubCategoryName(item.sub_category_name);
            setEditSubCategoryNameArabic(item.sub_category_name_arabic);
            setEditPreviewImage(item.image ? `${IMAGE_PATH}${item.image}` : "");
        }
        else if (action === 'delete') {
            setAlertModal(true);
            setAddOnSubcategoryId(item.addon_subcategory_id);
        }
    }

    const AddOnSubcategoryDelete = () => {
        axios.post(API_URL + '/delete_addons_subcategory', { addon_subcategory_id: addOnSubcategoryId }).then((res) => {
            if (res.data.success) {
                setmsg(res.data.msg);
                setAlertModal(false)
                setsuccessModel(true);
                fetchAddOnSubcategoryDetails();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSubCategoryImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditSubCategoryImage(file);
            setEditPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleEditAddOnSubcategory = () => {
        let errors = {}
        if (!editAddOnId) {
            errors.editAddOnId = "Please select addon"
        }
        if (!editSubCategoryName) {
            errors.editSubCategoryName = "Please enter subcategory name"
        }
        if (!editSubCategoryNameArabic) {
            errors.editSubCategoryNameArabic = "Please enter subcategory name arabic"
        }
        if (Object.keys(errors).length > 0) {
            setError(errors)
            return
        }

        const formData = new FormData();
        formData.append('addon_subcategory_id', addOnSubcategoryId)
        formData.append('addon_id', editAddOnId)
        formData.append('sub_category_name', editSubCategoryName)
        formData.append('sub_category_name_arabic', editSubCategoryNameArabic)
        if (editSubCategoryImage) {
            formData.append('image', editSubCategoryImage)
        }

        axios.post(API_URL + '/edit_addons_subcategory', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key == 'Exists') {
                let updatedErrors = { ...errors };
                updatedErrors.editSubCategoryName = 'Subcategory name already exists for this addon.';
                setError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            fetchAddOnSubcategoryDetails();
            setEditModal(false);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);
        })
            .catch(error => {
                console.error('Error updating addon subcategory:', error);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddAddOnSubcategory = () => {
        let errors = {}
        if (!addOnId) {
            errors.addOnId = "Please select addon"
        }
        if (!subCategoryName) {
            errors.subCategoryName = "Please enter subcategory name"
        }
        if (!subCategoryNameArabic) {
            errors.subCategoryNameArabic = "Please enter subcategory name arabic"
        }
        if (!subCategoryImage) {
            errors.subCategoryImage = "Please upload an image"
        }
        if (Object.keys(errors).length > 0) {
            setError(errors)
            return
        }

        const formData = new FormData();
        formData.append('addon_id', addOnId)
        formData.append('sub_category_name', subCategoryName)
        formData.append('sub_category_name_arabic', subCategoryNameArabic)
        formData.append('image', subCategoryImage)

        axios.post(API_URL + '/add_addons_subcategory', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key === 'Exists') {
                let updatedErrors = { ...errors };
                updatedErrors.subCategoryName = 'Subcategory name already exists for this addon.';
                setError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            setAddOnId('')
            setSubCategoryName('')
            setSubCategoryNameArabic('')
            setSubCategoryImage(null)
            setPreviewImage('')
            fetchAddOnSubcategoryDetails();
            setAddModal(false);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);
        })
            .catch(error => {
                console.error('Error adding addon subcategory:', error);
            });
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
                    <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }} onClick={() => setAddModal(true)}>
                        <AddIcon className="me-2" /> {t("Add Subcategory")}
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
                                <th>{t("AddOn name")}</th>
                                <th>{t("Subcategory name")}</th>
                                <th>{t("Subcategory name arabic")}</th>
                                <th>{t("Image")}</th>
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
                                    <td><span>{item.addon_name || 'NA'}</span></td>
                                    <td><span>{item.sub_category_name || 'NA'}</span></td>
                                    <td><span>{item.sub_category_name_arabic || 'NA'}</span></td>
                                    <td>
                                        {item.image ? (
                                            <img
                                                src={item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : 'NA'}
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

                    <Modal show={editModal} onHide={() => setEditModal(false)}>
                        <div className="mc-user-modal">
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn')}</Form.Label>
                                <Form.Select
                                    value={editAddOnId}
                                    onChange={(e) => {
                                        setEditAddOnId(e.target.value);
                                        setError((prev) => ({ ...prev, editAddOnId: "" }));
                                    }}
                                    className={`form-select`}
                                    isInvalid={!!error.editAddOnId}
                                >
                                    <option value="">{t('Select AddOn')}</option>
                                    {AllAddOns.map((addon) => (
                                        <option key={addon.addon_id} value={addon.addon_id}>
                                            {addon.addon_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {error.editAddOnId}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Subcategory Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter subcategory name')}
                                    maxLength={25}
                                    value={editSubCategoryName}
                                    onChange={(e) => {
                                        setEditSubCategoryName(e.target.value)
                                        setError((prev) => ({ ...prev, editSubCategoryName: "" }));
                                    }}
                                    isInvalid={!!error.editSubCategoryName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.editSubCategoryName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Subcategory Name Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter subcategory name arabic')}
                                    maxLength={25}
                                    value={editSubCategoryNameArabic}
                                    onChange={(e) => {
                                        setEditSubCategoryNameArabic(e.target.value)
                                        setError((prev) => ({ ...prev, editSubCategoryNameArabic: "" }));
                                    }}
                                    isInvalid={!!error.editSubCategoryNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.editSubCategoryNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                                {editPreviewImage && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            src={editPreviewImage}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setEditModal(false); setError('') }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleEditAddOnSubcategory}>
                                    {t('update')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >

                    <Modal show={AddModal} onHide={() => setAddModal(false)} backdrop="static">
                        <div className="mc-user-modal">
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn')}</Form.Label>
                                <Form.Select
                                    value={addOnId}
                                    onChange={(e) => {
                                        setAddOnId(e.target.value);
                                        setError((prev) => ({ ...prev, addOnId: "" }));
                                    }}
                                    className={`form-select`}
                                    isInvalid={!!error.addOnId}
                                >
                                    <option value="">{t('Select AddOn')}</option>
                                    {AllAddOns.map((addon) => (
                                        <option key={addon.addon_id} value={addon.addon_id}>
                                            {addon.addon_name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {error.addOnId}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Subcategory Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter subcategory name')}
                                    maxLength={25}
                                    value={subCategoryName}
                                    onChange={(e) => {
                                        setSubCategoryName(e.target.value)
                                        setError((prev) => ({ ...prev, subCategoryName: "" }));
                                    }}
                                    isInvalid={!!error.subCategoryName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.subCategoryName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Subcategory Name Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter subcategory name arabic')}
                                    maxLength={25}
                                    value={subCategoryNameArabic}
                                    onChange={(e) => {
                                        setSubCategoryNameArabic(e.target.value)
                                        setError((prev) => ({ ...prev, subCategoryNameArabic: "" }));
                                    }}
                                    isInvalid={!!error.subCategoryNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.subCategoryNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    isInvalid={!!error.subCategoryImage}
                                />
                                {/* {previewImage && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )} */}
                                <Form.Control.Feedback type="invalid">
                                    {error.subCategoryImage}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setAddModal(false); setError(''); setAddOnId(''); setSubCategoryName(''); setSubCategoryNameArabic(''); setSubCategoryImage(null); setPreviewImage('') }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleAddAddOnSubcategory}>
                                    {t('add')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >

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
                            <h3>{t("delete addon subcategory")}</h3>
                            <p>{t("Are you sure, you want to delete this addon subcategory?")}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); AddOnSubcategoryDelete(); }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}