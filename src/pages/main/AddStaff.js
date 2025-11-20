import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate } from "react-router-dom";
import { Form, Modal, Col } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { Eye, EyeOff } from "react-feather";
import { useParams } from "react-router-dom";

export default function AddStaff() {

    const { user_id } = useParams();
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [roleList, setRoleList] = useState([]);
    const [errors, setErrors] = useState({});

    const [permissions, setPermissions] = useState({
        view_home: 0,
        manage_home: 0,
        view_my_add: 0,
        manage_my_add: 0,
        chat: 0,
        view_unavailability: 0,
        manage_unavailability: 0,
        view_my_wallet: 0,
        view_history: 0,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const { t } = useContext(TranslatorContext);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');

    const navigate = useNavigate();

    const fetchServiceDetails = () => {
        axios.get(API_URL + "/fetch_all_role")
            .then((response) => {
                if (response.data.success && response.data.role_arr) {
                    setRoleList(response.data.role_arr);
                }
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });
    };

    useEffect(() => {
        fetchServiceDetails();
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@(mailinator\.com|gmail\.com)$/;
        return re.test(email);
    };


    const handleSubmit = () => {
        let newErrors = {};
        const usernamePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!fname.trim()) {
            newErrors.fname = 'Please enter Username';
        } else if (!usernamePattern.test(fname)) {
            newErrors.fname = 'Username must include uppercase, lowercase, number, special character, and be at least 6 characters long';
        }
        if (!lname.trim()) {
            newErrors.lname = 'Please enter Full name';
        }
        if (!email.trim()) {
            newErrors.email = 'Please enter email';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!password) {
            newErrors.password = 'Please enter password';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!image) {
            newErrors.image = 'Please choose profile';
        }
        if (!selectedRoleId) {
            newErrors.role = 'Please select role';
        }

        // if (!mobile) {
        //     newErrors.role = 'Please enter mobile';
        // }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("f_name", fname);
        formData.append("l_name", lname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        formData.append("role_id", selectedRoleId);
        formData.append("user_type", 2);
        // formData.append("mobile", mobile);

        // Append permissions
        Object.keys(permissions).forEach(key => {
            formData.append(key, permissions[key]);
        });

        axios.post(API_URL + '/add_staff_by_admin_side', formData)
            .then((response) => {
                if (response.data.key == "username") {
                    setErrors(prev => ({ fname: "User Name Alredy Exist" }));
                } else if (response.data.success) {
                    setAlertModal(true);
                    setTimeout(() => {
                        setAlertModal(false);
                        navigate(APP_PREFIX_PATH + `/owner-view/${user_id}`);
                    }, 2000);
                } else if (response.data.key === 'exist') {
                    setErrors(prev => ({ ...prev, email: response.data.msg }));
                }
            })
            .catch((error) => {
                console.error('Error adding staff:', error);
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setErrors(prev => ({ ...prev, image: "Please select an staff id!" }));
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
                        <h3 className="mc-breadcrumb-title">{t('Add Staff')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">
                                    {t('home')}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH + '/manage-owners'}`} className="mc-breadcrumb-link">
                                    {t('manage owner')}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">{t('Add Staff')}</li>
                        </ul>
                    </div>
                </div>
            </Col>

            <div className="container">
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="firstName" className="form-label">
                            User Name
                        </label>
                        <Form.Control
                            type="text"
                            id="firstName"
                            placeholder='Enter User name'
                            value={fname}
                            onChange={(e) => {
                                setFname(e.target.value);
                                setErrors(prev => ({ ...prev, fname: "" }));
                            }}
                            isInvalid={!!errors.fname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.fname}
                        </Form.Control.Feedback>
                    </div>

                    <div className='col-md-6'>
                        <label htmlFor="lastName" className="form-label">
                            Full Name
                        </label>
                        <Form.Control
                            type="text"
                            id="lastName"
                            placeholder='Enter Full name'
                            value={lname}
                            onChange={(e) => {
                                setLname(e.target.value);
                                setErrors(prev => ({ ...prev, lname: "" }));
                            }}
                            isInvalid={!!errors.lname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lname}
                        </Form.Control.Feedback>
                    </div>
                </div>

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="roleSelect" className="form-label">
                            Role
                        </label>
                        <Form.Select
                            id="roleSelect"
                            value={selectedRoleId}
                            onChange={(e) => {
                                setSelectedRoleId(e.target.value);
                                setErrors(prev => ({ ...prev, role: "" }));
                            }}
                            isInvalid={!!errors.role}
                        >
                            <option value="">Select a role</option>
                            {roleList.map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_english} {/* Using role_english for display */}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.role}
                        </Form.Control.Feedback>
                    </div>

                    <div className='col-md-6'>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <Form.Control
                            type="email"
                            id="email"
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: "" }));
                            }}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </div>
                </div>

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, password: "" }));
                                }}
                                isInvalid={!!errors.password}
                            />
                            <span
                                className="position-absolute end-0 top-50 translate-middle-y me-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </div>

                    <div className='col-md-6'>
                        <label htmlFor="staffId" className="form-label">
                            Choose Profile
                        </label>
                        <Form.Control
                            type="file"
                            id="staffId"
                            accept="image/*"
                            onChange={handleImageChange}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
                        </Form.Control.Feedback>
                    </div>
                </div>

                <div className='row m-2'>

                    {/* <div className='col-md-6'>
                        <label htmlFor="lastName" className="form-label">
                            Mobile
                        </label>
                        <Form.Control
                            type="text"
                            id="mobile"
                            placeholder='Enter mobile number'
                            value={mobile}
                            onChange={(e) => {
                                setMobile(e.target.value);
                                setErrors(prev => ({ ...prev, mobile: "" }));
                            }}
                            isInvalid={!!errors.mobile}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                        </Form.Control.Feedback>
                    </div> */}


                    <div className='col-md-12'>
                        <label className="form-label">Permissions</label>
                        <div className="d-flex flex-wrap gap-3">
                            {Object.keys(permissions).map((permission) => (
                                <div key={permission} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`permission-${permission}`}
                                        checked={permissions[permission] === 1}
                                        onChange={(e) => {
                                            setPermissions(prev => ({
                                                ...prev,
                                                [permission]: e.target.checked ? 1 : 0
                                            }));
                                        }}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`permission-${permission}`}
                                    >
                                        {permission.replace(/_/g, ' ')}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-dark mt-3 mb-5 mx-2"
                    style={{ background: '#19918F', border: 'none' }}
                    onClick={handleSubmit}
                >
                    ADD
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Confirmation</h3>
                    <p>Staff has been created successfully.</p>
                </div>
            </Modal>
        </PageLayout>
    );
}