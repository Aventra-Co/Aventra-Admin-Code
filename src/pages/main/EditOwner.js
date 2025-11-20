import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Modal, Form } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import moment from "moment";

export default function EditOwner() {
    const { user_id } = useParams();
    const [alertModal, setAlertModal] = useState(false);
    const [ownerError, setownerError] = useState({
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        image: '',
        merchantId: '',
        companyName: ''
    });
    const { t } = useContext(TranslatorContext);
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [mobile, setmobile] = useState('');
    const [dob, setdob] = useState('');
    const [gender, setgender] = useState('');
    const [image, setimage] = useState('');
    const [merchantId, setmerchantId] = useState('');
    const [companyName, setcompanyName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + `/fetch_owner_by_id?user_id=${user_id}`).then((res) => {
            if (res.data.success) {
                let data = res.data.user_arr[0];
                setfname(data.f_name || "");
                setlname(data.l_name || "");
                setmobile(data.mobile || "");
                setemail(data.email || "");
                setdob(data.dob ? moment(data.dob).format("YYYY-MM-DD") : "");
                setgender(data.gender.toString() || "");
                setmerchantId(data.merchant_id || "");
                setcompanyName(data.owner_company_name || "");
            }
        }).catch(error => {
            console.error("Error fetching owner data:", error);
        });
    }, [user_id]);

    const handlesubmit = (e) => {
        e.preventDefault();
        let errors = {};

        if (!fname.trim()) {
            errors.fname = 'Please Enter Username';
        }
        if (!lname) {
            errors.lname = 'Please enter last name';
        }
        if (!email) {
            errors.email = 'Please enter email';
        }
        if (!mobile) {
            errors.mobile = 'Please enter mobile';
        }
        if (!dob) {
            errors.dob = 'Please enter dob';
        }
        if (!gender) {
            errors.gender = 'Please select gender';
        }
        if (!merchantId) {
            errors.merchantId = 'Please enter merchant ID';
        }
        if (!companyName) {
            errors.companyName = 'Please enter company name';
        }

        if (Object.keys(errors).length > 0) {
            setownerError(errors);
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("f_name", fname);
        formData.append("l_name", lname);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("merchant_id", merchantId);
        formData.append("owner_company_name", companyName);
        if (image) {
            formData.append("image", image);
        }

        axios.post(API_URL + '/edit_owner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-owners');
                }, 2000);
            }
            else if (response.data.key === 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.mobile = response.data.msg;
                setownerError(updatedErrors);
            }
        }).catch((error) => {
            console.error("Error updating owner:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
            }
        });
    };

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
                        <h3 className="mc-breadcrumb-title">{t('Edit Owner')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-owners'}`} className="mc-breadcrumb-link">{t('manage owner')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('edit owner')}</li>
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
                            <Form.Control
                                type="text"
                                placeholder='Enter User Name'
                                value={fname || ' '}
                                disabled
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
                            <Form.Control
                                type="text"
                                placeholder='Enter Full Name'
                                value={lname}
                                onChange={(e) => {
                                    setlname(e.target.value);
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
                            <Form.Control
                                type="Number"
                                placeholder='Enter mobile'
                                value={mobile}
                                onChange={(e) => {
                                    setmobile(e.target.value);
                                    setownerError((prev) => ({ ...prev, mobile: "" }));
                                }}
                                readOnly
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
                            <Form.Control
                                type="text"
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => {
                                    setemail(e.target.value);
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
                                Merchant ID
                            </label>
                            <Form.Control
                                type="text"
                                placeholder='Enter Merchant ID'
                                value={merchantId}
                                onChange={(e) => {
                                    setmerchantId(e.target.value);
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
                            <Form.Control
                                type="text"
                                placeholder='Enter Company Name'
                                value={companyName}
                                onChange={(e) => {
                                    setcompanyName(e.target.value);
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
                            <Form.Control
                                type="date"
                                placeholder='Enter first name'
                                value={dob}
                                onChange={(e) => {
                                    setdob(e.target.value);
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
                            <Form.Select
                                id="gender"
                                value={gender}
                                onChange={(e) => {
                                    setgender(e.target.value);
                                    setownerError((prev) => ({ ...prev, gender: "" }));
                                }}
                                isInvalid={ownerError.gender}
                            >
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
                                Upload Image
                            </label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                isInvalid={!!ownerError.image}
                            />
                            <Form.Control.Feedback type="invalid">
                                {ownerError.image}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark"
                        style={{
                            marginLeft: '20px',
                            background: '#19918F',
                            border: 'none',
                            marginBottom: '5rem'
                        }}
                    >
                        Edit
                    </button>
                </div>
            </form>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Confirmation</h3><br />
                    <p>Owner has been updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageLayout>
    );
}