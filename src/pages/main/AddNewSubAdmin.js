import React, { useContext, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate } from "react-router-dom";
import { Col, Modal, Form, Button } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { Eye, EyeOff } from "react-feather";

export default function AddNewSubAdmin() {
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
        { id: 22, name: "manage destination" },
        { id: 23, name: "manage property type" },
        { id: 24, name: "property advertisement" },
        { id: 25, name: "manage property booking" },
    ];

    const [selectedPermissions, setSelectedPermissions] = useState(
        permissionsList.reduce((acc, permission) => {
            acc[permission.id] = false;
            return acc;
        }, {})
    );

    const togglePermission = (index) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const [alertModal, setAlertModal] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useContext(TranslatorContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [image, setImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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

        if (!formData.name) newErrors.name = 'Please enter name';
        if (!formData.email) newErrors.email = 'Please enter email';
        if (!formData.mobile) newErrors.mobile = 'Please enter mobile number';
        if (!image) newErrors.image = 'Please select image';
        if (!formData.password) newErrors.password = 'Please enter password';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please enter confirm password';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const privilegeIds = Object.entries(selectedPermissions)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
            .join(',');

        const apiFormData = new FormData();
        apiFormData.append("name", formData.name);
        apiFormData.append("email", formData.email);
        apiFormData.append("mobile", formData.mobile);
        apiFormData.append("image", image);
        apiFormData.append("password", formData.password);
        apiFormData.append("privileges", privilegeIds);
        apiFormData.append("action", "add");

        try {
            const response = await axios.post(API_URL + '/add_subadmin', apiFormData);
            if (response.data.success) {
                setAlertModal(true);
            } else if (response.data.key === 'Exist') {
                setErrors(prev => ({ ...prev, email: 'Sub Admin with this email already exists' }));
            }
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, submit: 'Failed to create sub admin. Please try again.' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setErrors(prev => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setErrors(prev => ({ ...prev, image: "" }));
            setImage(file);
        }
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Add Sub-Admin')}</h3>
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
                            <li className="mc-breadcrumb-item">{t('Add Sub-Admin')}</li>
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
                    <div className='col-md-6'>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="password-input-group" style={{ position: 'relative' }}>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder='Enter password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Button
                                    variant="outline-secondary"
                                    className="password-toggle"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '0.375rem',
                                        background: 'transparent',
                                        border: 'none',
                                    }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} style={{ color: '#AAAAAAFF' }} /> : <Eye size={18} style={{ color: '#AAAAAAFF' }} />}
                                </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className='col-md-6'>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="password-input-group" style={{ position: 'relative' }}>
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder='Confirm password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Button
                                    variant="outline-secondary"
                                    className="password-toggle"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '0.375rem',
                                        background: 'transparent',
                                        border: 'none',
                                    }}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} style={{ color: '#AAAAAAFF' }} /> : <Eye size={18} style={{ color: '#AAAAAAFF' }} />}
                                </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <Form.Group controlId="formMobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="mobile"
                                placeholder='Enter mobile number'
                                value={formData.mobile}
                                onChange={handleChange}
                                isInvalid={!!errors.mobile}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mobile}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className='col-md-6'>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                isInvalid={!!errors.image}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.image}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <div className='row m-2 mt-4'>
                    <div className="col-12">
                        <h5>Permissions</h5>
                        <hr />
                    </div>

                    {permissionsList.map((permission) => (
                        <div className="col-md-3 mb-3" key={permission.id}>
                            <Form.Check
                                type="checkbox"
                                id={`perm-${permission.id}`}
                                label={permission.name}
                                checked={selectedPermissions[permission.id]}
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
                            ADD SUB ADMIN
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
                    <p>Sub Admin created successfully.</p>
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