import React, { useContext, useState, useEffect } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Modal, Form, Button } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import { Eye, EyeOff } from "react-feather";
import { decode } from 'base-64';
import { Helmet } from "react-helmet-async";
export default function EditSubAdmin() {
    const { user_id } = useParams();
    const decode_user_id = decode(user_id);
    const permissionsList = [
        { id: 1, name: "manage users" },
        { id: 2, name: "Manage Owners" },
        { id: 3, name: "Manage Staff" },
        { id: 4, name: "manage role" },
        { id: 5, name: "manage promotions" },
        { id: 6, name: "manage country" },
        { id: 7, name: "manage city" },
        { id: 8, name: "manage activity" },
        { id: 9, name: "Manage Trips" },
        { id: 10, name: "manage addons" },
        { id: 11, name: "addons subcategory" },
        { id: 12, name: "manage booking" },
        { id: 13, name: "manage commision" },
        { id: 14, name: "manage earning" },
        { id: 15, name: "manage coupon code" },
        { id: 16, name: "manage review ratings" },
        { id: 17, name: "manage content" },
        { id: 18, name: "manage broadcast" },
        { id: 19, name: "manage contactus" },
        { id: 20, name: "tabular report" },
        { id: 21, name: "analytical report" },
        { id: 22, name: "manage destination" }
    ];

    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [alertModal, setAlertModal] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useContext(TranslatorContext);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubAdminData = async () => {
            try {
                const response = await axios.get(`${API_URL}/fetch_subadmin_by_id?user_id=${decode(user_id)}`);
                if (response.data.success && response.data.result) {
                    const data = response.data.result;

                    // Set form data
                    setFormData({
                        name: data.name || '',
                        email: data.email || ''
                    });

                    // Set existing image if available
                    if (data.image) {
                        setExistingImage(`${IMAGE_PATH}${data.image}`);
                    }

                    // Initialize all permissions as false first
                    const initialPermissions = permissionsList.reduce((acc, permission) => {
                        acc[permission.id] = false;
                        return acc;
                    }, {});

                    // Set selected permissions if they exist
                    if (data.privileges) {
                        const privilegeIds = data.privileges.split(',').map(Number);
                        privilegeIds.forEach(id => {
                            if (initialPermissions.hasOwnProperty(id)) {
                                initialPermissions[id] = true;
                            }
                        });
                    }

                    setSelectedPermissions(initialPermissions);
                }
            } catch (error) {
                console.error('Error fetching subadmin data:', error);
                setErrors({ fetchError: 'Failed to load subadmin data' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubAdminData();
    }, []);

    const togglePermission = (id) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Please enter name';
        if (!formData.email.trim()) newErrors.email = 'Please enter email';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const privilegeIds = Object.entries(selectedPermissions)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
            .join(',');

        const apiFormData = new FormData();
        apiFormData.append("user_id", decode_user_id);
        apiFormData.append("name", formData.name);
        apiFormData.append("email", formData.email);
        if (image) {
            apiFormData.append("image", image);
        }
        apiFormData.append("privileges", privilegeIds);

        try {
            const response = await axios.post(`${API_URL}/edit_subadmin`, apiFormData);
            if (response.data.success) {
                setAlertModal(true);
            } else if (response.data.key === 'Exist') {
                setErrors(prev => ({ ...prev, email: 'Sub Admin with this email already exists' }));
            } else {
                setErrors(prev => ({ ...prev, submit: response.data.msg || 'Failed to update sub admin' }));
            }
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, submit: 'Failed to update sub admin. Please try again.' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors(prev => ({ ...prev, image: "Only image files are allowed!" }));
            } else {
                setErrors(prev => ({ ...prev, image: "" }));
                setImage(file);
                setExistingImage(URL.createObjectURL(file));
            }
        }
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

    if (errors.fetchError) {
        return (
            <PageLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="alert alert-danger">{errors.fetchError}</div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Edit-Sub-Admin</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Sub-Admin')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">
                                    {t('home')}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH + '/manage-sub-admin'}`} className="mc-breadcrumb-link">
                                    {t('manage sub-admin')}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">{t('Edit Sub-Admin')}</li>
                        </ul>
                    </div>
                </div>
            </Col>

            <div className="container">
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder='Enter name'
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className='col-md-6'>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder='Enter email'
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <div className='row m-2'>
                    <div className='col-md-12'>
                        <Form.Group controlId="formImage">
                            <Form.Label>Profile Image</Form.Label>
                            {existingImage && (
                                <div className="mb-2">
                                    <img
                                        src={existingImage}
                                        alt="Current profile"
                                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                        className="img-thumbnail"
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                isInvalid={!!errors.image}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.image}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                {existingImage ? 'Upload new image to replace current' : 'Upload profile image'}
                            </Form.Text>
                        </Form.Group>
                    </div>
                </div>

                <div className='row m-2 mt-4'>
                    <div className="col-12">
                        <h5>Permissions</h5>
                        <hr />
                        <p className="text-muted">Select the permissions for this sub-admin</p>
                    </div>

                    {permissionsList.map((permission) => (
                        <div className="col-md-3 mb-3" key={permission.id}>
                            <Form.Check
                                type="checkbox"
                                id={`perm-${permission.id}`}
                                label={permission.name}
                                checked={selectedPermissions[permission.id] || false}
                                onChange={() => togglePermission(permission.id)}
                            />
                        </div>
                    ))}
                </div>

                <div className="row m-2">
                    <div className="col-12 text-end">
                        <Button
                            variant="primary"
                            style={{ background: '#19918F', border: 'none', marginBottom: '50px' }}
                            onClick={handleSubmit}
                            disabled={!!errors.submit}
                        >
                            UPDATE SUB ADMIN
                        </Button>
                        {errors.submit && (
                            <div className="text-danger mt-2">{errors.submit}</div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    <i className="material-icons text-success" style={{ fontSize: '48px' }}>check_circle</i>
                    <h4 className="mt-3">Success</h4>
                    <p>Sub Admin updated successfully.</p>
                    <Button
                        variant="success"
                        onClick={() => {
                            setAlertModal(false);
                            navigate(APP_PREFIX_PATH + '/manage-sub-admin');
                        }}
                    >
                        OK
                    </Button>
                </Modal.Body>
            </Modal>
        </PageLayout>
    );
}