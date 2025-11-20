import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import { Row, Col } from "react-bootstrap";
import AddIcon from '@mui/icons-material/Add';
// import AddOnImage from '../../assets/img/addon.webp';
import { SyncLoader } from 'react-spinners'
import { LabelFieldComponent } from "../../components/fields";
import { PaginationComponent } from "../../components";
import { AnchorComponent, ButtonComponent } from "../../components/elements";
import { useNavigate } from 'react-router-dom'
import { encode } from 'base-64';

export default function AddOns() {
    const { t } = useContext(TranslatorContext);
    const navigate = useNavigate()
    const [AddOnDetails, setAddOnDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addOnId, setAddOnId] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [AddModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [msg, setmsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [addOnName, setAddOnName] = useState('');
    const [addOnNameArabic, setAddOnNameArabic] = useState('');
    const [editAddOnName, setEditAddOnName] = useState("");
    const [editAddOnNameArabic, setEditAddOnNameArabic] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [image, setImage] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [editPreviewImage, setEditPreviewImage] = useState(null);
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredUsers = AddOnDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.addon_name?.toLowerCase().includes(lowercasedTerm) ||
            user.addon_name_arabic?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchAddOnDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/get_all_addons")
            .then((response) => {
                setAddOnDetails(response.data.addonArray || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching addon details:', error);
            });
    };

    useEffect(() => {
        fetchAddOnDetails();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'edit') {
            setEditModal(true);
            setAddOnId(item.addon_id);
            setEditAddOnName(item.addon_name);
            setEditAddOnNameArabic(item.addon_name_arabic);
            setEditPreviewImage(item.image ? `${API_URL}/uploads/${item.image}` : null);
        }
        else if (action === 'delete') {
            setAlertModal(true);
            setAddOnId(item.addon_id);
        } else if (action === 'view') {
            navigate(`${APP_PREFIX_PATH}/view-addons/${encode(item.addon_id)}`)
        }
    }

    const AddOnDelete = () => {
        axios.post(API_URL + '/delete_addons', { addon_id: addOnId }).then((res) => {
            if (res.data.success) {
                setmsg(res.data.msg);
                setAlertModal(false)
                setsuccessModel(true);
                fetchAddOnDetails();
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
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            setEditPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleEditAddOn = () => {
        let errors = {}
        if (!editAddOnName) {
            errors.editAddOnName = "Please enter addon name"
        }
        if (!editAddOnNameArabic) {
            errors.editAddOnNameArabic = "Please enter addon name arabic"
        }
        if (Object.keys(errors).length > 0) {
            setError(errors)
            return
        }

        const formData = new FormData();
        formData.append('addon_id', addOnId)
        formData.append('addon_name', editAddOnName)
        formData.append('addon_name_arabic', editAddOnNameArabic)
        if (editImage) {
            formData.append('image', editImage)
        }

        axios.post(API_URL + '/edit_addons', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key == 'Exists') {
                let updatedErrors = { ...errors };
                updatedErrors.editAddOnName = 'Addon name already exist.';
                setError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            fetchAddOnDetails();
            setEditModal(false);
            setEditImage(null);
            setEditPreviewImage(null);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);
        })
            .catch(error => {
                console.error('Error updating addon:', error);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddAddOn = () => {
        let errors = {}
        if (!addOnName) {
            errors.addOnName = "Please enter addon name"
        }
        if (!addOnNameArabic) {
            errors.addOnNameArabic = "Please enter addon name arabic"
        }
        if (Object.keys(errors).length > 0) {
            setError(errors)
            return
        }

        const formData = new FormData();
        formData.append('addon_name', addOnName)
        formData.append('addon_name_arabic', addOnNameArabic)
        if (image) {
            formData.append('image', image)
        }

        axios.post(API_URL + '/add_addons', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key === 'Exists') {
                let updatedErrors = { ...errors };
                updatedErrors.addOnName = 'Addon name already exist.';
                setError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            setAddOnName('')
            setAddOnNameArabic('')
            setImage(null)
            setPreviewImage(null)
            fetchAddOnDetails();
            setAddModal(false);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);
        })
            .catch(error => {
                console.error('Error adding addon:', error);
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
                        <AddIcon className="me-2" /> {t("Add AddOn")}
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
                                <th>{t("AddOn name arabic")}</th>
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
                                            <AnchorComponent to={`${APP_PREFIX_PATH}/view-addons/${encode(item.addon_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => { handleUserAction('edit', item) }}>edit</ButtonComponent>
                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>
                                        </div>
                                    </td>
                                    <td><span>{item.addon_name || 'NA'}</span></td>
                                    <td><span>{item.addon_name_arabic || 'NA'}</span></td>
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

                    <Modal show={editModal} onHide={() => { setEditModal(false); setEditImage(null); setEditPreviewImage(null); }}>
                        <div className="mc-user-modal">
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                                {/* {editPreviewImage && (
                                    <div className="mt-2">
                                        <img 
                                            src={editPreviewImage} 
                                            alt="Preview" 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                        />
                                    </div>
                                )} */}
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter addon name')}
                                    maxLength={25}
                                    value={editAddOnName}
                                    onChange={(e) => {
                                        setEditAddOnName(e.target.value)
                                        setError((prev) => ({ ...prev, editAddOnName: "" }));
                                    }}
                                    isInvalid={!!error.editAddOnName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.editAddOnName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Name Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter addon name arabic')}
                                    maxLength={25}
                                    value={editAddOnNameArabic}
                                    onChange={(e) => {
                                        setEditAddOnNameArabic(e.target.value)
                                        setError((prev) => ({ ...prev, editAddOnNameArabic: "" }));
                                    }}
                                    isInvalid={!!error.editAddOnNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.editAddOnNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setEditModal(false); setError(''); setEditImage(null); setEditPreviewImage(null); }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleEditAddOn}>
                                    {t('update')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >

                    <Modal show={AddModal} onHide={() => { setAddModal(false); setImage(null); setPreviewImage(null); }} backdrop="static">
                        <div className="mc-user-modal">
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Image')}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <div className="mt-2">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter addon name')}
                                    maxLength={25}
                                    value={addOnName}
                                    onChange={(e) => {
                                        setAddOnName(e.target.value)
                                        setError((prev) => ({ ...prev, addOnName: "" }));
                                    }}
                                    isInvalid={!!error.addOnName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.addOnName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('AddOn Name Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter addon name arabic')}
                                    maxLength={25}
                                    value={addOnNameArabic}
                                    onChange={(e) => {
                                        setAddOnNameArabic(e.target.value)
                                        setError((prev) => ({ ...prev, addOnNameArabic: "" }));
                                    }}
                                    isInvalid={!!error.addOnNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.addOnNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setAddModal(false); setError(''); setAddOnName(''); setAddOnNameArabic(''); setImage(null); setPreviewImage(null); }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleAddAddOn}>
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
                            <h3>{t("delete addon")}</h3>
                            <p>{t("Are you sure, you want to delete this addon?")}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); AddOnDelete(); }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}