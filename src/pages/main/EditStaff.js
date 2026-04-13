import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Modal, Col } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import { Eye, EyeOff } from "react-feather";
import { encode } from "base-64";
export default function EditStaff() {
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
        manage_property: 0,
        view_property: 0
    });

    const [alertModal, setAlertModal] = useState(false);
    const { t } = useContext(TranslatorContext);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [staffData, setStaffData] = useState(null);

    const [staff_id, setStaff_id] = useState('');
    const [owner_id, setOwnerId] = useState('');

    const navigate = useNavigate();


    useEffect(() => {
        fetchRoles();
        getStaffData();
    }, []);


    const fetchRoles = () => {
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

    const getStaffData = () => {
        axios.get(API_URL + `/view_staff_detail?user_id=${user_id}`)
            .then((res) => {
                if (res.data.success) {
                    // alert("helllooo")

                    const data = res.data.staff_arr;
                    setStaffData(data);
                    setFname(data.f_name);
                    setLname(data.l_name);
                    setPassword(data.password);
                    setEmail(data.email);
                    setSelectedRoleId(data.role_id);
                    setExistingImage(data.staff_id);
                    setStaff_id(data.user_id)
                    setOwnerId(data.owner_id);
                    const staffPermissions = {
                        view_home: data.view_home || 0,
                        manage_home: data.manage_home || 0,
                        view_my_add: data.view_my_add || 0,
                        manage_my_add: data.manage_my_add || 0,
                        chat: data.chat || 0,
                        view_unavailability: data.view_unavailability || 0,
                        manage_unavailability: data.manage_unavailability || 0,
                        view_my_wallet: data.view_my_wallet || 0,
                        view_history: data.view_history || 0,
                        manage_property: data.manage_property || 0,
                        view_property: data.view_property || 0,
                    };
                    setPermissions(staffPermissions);
                }
            })
            .catch((error) => {
                console.error('Error fetching staff data:', error);
            });
    };


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = () => {
        let newErrors = {};

        if (!fname.trim()) {
            newErrors.fname = 'Please enter User Name';
        }
        if (!lname.trim()) {
            newErrors.lname = 'Please enter Full Name';
        }
        if (!email.trim()) {
            newErrors.email = 'Please enter email';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!selectedRoleId) {
            newErrors.role = 'Please select role';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("f_name", fname);
        formData.append("l_name", lname);
        formData.append("email", email);
        formData.append("staff_id", staff_id);
        formData.append("user_type", 2);

        if (password) {
            formData.append("password", password);
        }
        if (image) {
            formData.append("image", image);
        }
        formData.append("role_id", selectedRoleId);

        // Append permissions
        Object.keys(permissions).forEach(key => {
            formData.append(key, permissions[key]);
        });

        axios.post(API_URL + '/edit_staff_by_admin_side', formData)
            .then((response) => {
                if (response.data.success) {
                    setAlertModal(true);
                    setTimeout(() => {
                        setAlertModal(false);
                        navigate(APP_PREFIX_PATH + `/owner-view/${encode(owner_id)}`);
                    }, 2000);
                } else if (response.data.key === 'exist') {
                    setErrors(prev => ({ ...prev, email: response.data.msg }));
                }
            })
            .catch((error) => {
                console.error('Error updating staff:', error);
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, image: "Only image files are allowed!" }));
            return;
        }

        setErrors(prev => ({ ...prev, image: "" }));
        setImage(file);
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Staff')}</h3>
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
                            <li className="mc-breadcrumb-item">{t('Edit Staff')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            {/* <h1>  Abhi {staffData}  </h1> */}
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
                            disabled
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
                                    {role.role_english}
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
                        <label htmlFor="staffImage" className="form-label">
                            Choose Profile
                        </label>
                        {/* {existingImage && (
                            <div className="mb-2">
                                <img
                                    src={`${IMAGE_PATH}${existingImage}`}
                                    alt="Current Staff"
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                />
                            </div>
                        )} */}
                        <Form.Control
                            type="file"
                            id="staffImage"
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
                    UPDATE
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Confirmation</h3>
                    <p>Staff has been updated successfully.</p>
                </div>
            </Modal>
        </PageLayout>
    );
}