/* eslint-disable no-useless-escape */
import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import moment from "moment";
import { Eye, EyeOff } from "react-feather";

export default function AddOwner() {

    const [showPassword, setShowPassword] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [ownerError, setownerError] = useState({
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        password: '',
        image: '',
        merchantId: '',
        companyName: ''
    });
    const { t } = useContext(TranslatorContext)
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [mobile, setmobile] = useState('');
    const [dob, setdob] = useState('');
    const [gender, setgender] = useState('');
    const [password, setpassword] = useState('');
    const [image, setimage] = useState('');
    const [merchantId, setmerchantId] = useState('');
    const [companyName, setcompanyName] = useState('');
    const [insurance, setinsurance] = useState('0');

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@(mailinator\.com|gmail\.com)$/;
        return re.test(email);
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        let errors = {}
        // const usernamePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-_\/]{8,}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-_\/]{6,}$/;
        if (!fname.trim()) {
            errors.fname = 'Please Enter Username';
        } else if (fname.length < 6) {
            errors.fname = 'Username must include at least 6 characters long';
        }
        if (!lname) {
            errors.lname = 'Please Enter Full Name'
        }
        if (!email.trim()) {
            errors.email = 'Please Enter Email';
        }
        // else if (!validateEmail(email)) {
        //     errors.email = 'Please Enter a valid Email';
        // }
        if (!mobile) {
            errors.mobile = 'Please Enter Mobile'
        }
        if (!dob) {
            errors.dob = 'Please Enter DOB '
        }
        if (!gender) {
            errors.gender = 'Please Select Gender'
        }
        if (!password) {
            errors.password = 'Please Enter Password';
        } else if (!passwordPattern.test(password)) {
            errors.password = 'password must include uppercase, lowercase, number, special character, and be at least 6 characters long';
        }
        if (!image) {
            errors.image = 'Please Select Image'
        }
        if (!merchantId) {
            errors.merchantId = 'Please Enter Merchant ID'
        }
        if (!companyName) {
            errors.companyName = 'Please Enter Company Name'
        }
        if (insurance === '' || isNaN(Number(insurance)) || Number(insurance) < 0) {
            errors.insurance = 'Please enter a valid insurance amount (0 or more)'
        }

        if (Object.keys(errors).length > 0) {
            setownerError(errors)
            return
        }
        const formData = new FormData();
        formData.append("f_name", fname);
        formData.append("l_name", lname);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("password", password);
        formData.append("image", image);
        formData.append("merchant_id", merchantId);
        formData.append("owner_company_name", companyName);
        formData.append("insurance_per_owner", insurance === '' ? 0 : insurance);

        axios.post(API_URL + '/add_owner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-owners')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.mobile = response.data.msg;
                setownerError(updatedErrors);
                return;
            }
            else if (response.data.key == 'user_name_exist') {
                let updatedErrors = { ...errors };
                updatedErrors.fname = response.data.msg;
                setownerError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                console.log("Error response:", error.response.data);
            }
        })
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setownerError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setownerError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setownerError((prev) => ({ ...prev, image: "" }));
            setimage(file);
        }
    };
    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Add Owner')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-owners'}`} className="mc-breadcrumb-link">{t('manage owner')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('add owner')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <form onSubmit={handlesubmit}>
                <div className="container">
                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                User Name
                            </label>
                            <Form.Control type="text" placeholder='Enter User Name' value={fname} onChange={(e) => {
                                setfname(e.target.value)
                                setownerError((prev) => ({ ...prev, fname: "" }));
                            }}
                                isInvalid={ownerError.fname}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.fname}
                            </Form.Control.Feedback>
                        </div>

                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Full Name
                            </label>
                            <Form.Control type="text"
                                placeholder='Enter Full Name'
                                value={lname} onChange={(e) => {
                                    setlname(e.target.value)
                                    setownerError((prev) => ({ ...prev, lname: "" }));
                                }}

                                isInvalid={ownerError.lname}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.lname}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Mobile
                            </label>
                            <Form.Control type="Number" placeholder='Enter mobile' value={mobile} onChange={(e) => {
                                setmobile(e.target.value)
                                setownerError((prev) => ({ ...prev, mobile: "" }));
                            }}
                                isInvalid={ownerError.mobile}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.mobile}
                            </Form.Control.Feedback>
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Email
                            </label>
                            <Form.Control type="text"
                                placeholder='Enter email'
                                value={email} onChange={(e) => {
                                    setemail(e.target.value)
                                    setownerError((prev) => ({ ...prev, email: "" }));
                                }}
                                isInvalid={ownerError.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.email}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Merchant Id
                            </label>
                            <Form.Control type="text" placeholder='Enter merchant Id' value={merchantId} onChange={(e) => {
                                setmerchantId(e.target.value)
                                setownerError((prev) => ({ ...prev, merchantId: "" }));
                            }}
                                isInvalid={ownerError.merchantId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.merchantId}
                            </Form.Control.Feedback>
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Company Name
                            </label>
                            <Form.Control type="text"
                                placeholder='Enter company name'
                                value={companyName} onChange={(e) => {
                                    setcompanyName(e.target.value)
                                    setownerError((prev) => ({ ...prev, companyName: "" }));
                                }}
                                isInvalid={ownerError.companyName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.companyName}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                DOB
                            </label>
                            <Form.Control type="date" placeholder='Enter first name' value={dob} onChange={(e) => {
                                setdob(e.target.value)
                                setownerError((prev) => ({ ...prev, dob: "" }));
                            }}
                                isInvalid={ownerError.dob}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.dob}
                            </Form.Control.Feedback>
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Gender
                            </label>
                            <Form.Select id="gender" onChange={(e) => {
                                setgender(e.target.value)
                                setownerError((prev) => ({ ...prev, gender: "" }));
                            }} isInvalid={ownerError.gender}>
                                <option value="">Select Gender</option>
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                                <option value="2">Company</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {ownerError.gender}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Password
                            </label>
                            <Form.Control type={showPassword ? "text" : "password"} placeholder='Enter password'
                                value={password} onChange={(e) => {
                                    setpassword(e.target.value)
                                    setownerError((prev) => ({ ...prev, password: "" }));
                                }}
                                isInvalid={ownerError.password}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer", position: 'absolute', top: '72.55%', left: '55.2%', color: 'black' }}
                            >
                                {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                            </span>
                            <Form.Control.Feedback type="invalid">
                                {ownerError.password}
                            </Form.Control.Feedback>
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Upload Image
                            </label>
                            <Form.Control type="file"
                                onChange={handleImageChange}
                                isInvalid={!!ownerError.image}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.image}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="insurancePerOwner" className="form-label">
                                Insurance per Owner
                            </label>
                            <Form.Control
                                id="insurancePerOwner"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder='Enter insurance amount'
                                value={insurance}
                                onChange={(e) => {
                                    setinsurance(e.target.value)
                                    setownerError((prev) => ({ ...prev, insurance: "" }));
                                }}
                                isInvalid={ownerError.insurance}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.insurance}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-dark"
                        style={{
                            marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                        }}
                    >
                        ADD
                    </button>
                </div>
            </form>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Confirmation</h3><br />
                    <p>Owner has been created successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}