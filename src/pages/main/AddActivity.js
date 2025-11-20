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

export default function AddActivity() {
    const [alertModal, setAlertModal] = useState(false);
    const [activityError, setactivityError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [activityEnglish, setactivityEnglish] = useState('');
    const [activityArabic, setactivityArabic] = useState('');
    const [activityFrench, setactivityFrench] = useState('');
    const [activityItalian, setactivityItalian] = useState('');
    const [activityKorean, setactivityKorean] = useState('');
    const [image, setimage] = useState('');

    const navigate = useNavigate();

    const handlesubmit = () => {
        let errors = {}
        if (!activityEnglish) {
            errors.activityEnglish = 'Please enter activity in english'
        }
        if (!activityArabic) {
            errors.activityArabic = 'Please enter activity in arabic'
        }
        if (!activityFrench) {
            errors.activityFrench = 'Please enter activity in french'
        }
        if (!activityItalian) {
            errors.activityItalian = 'Please enter activity in italian'
        }
        if (!activityKorean) {
            errors.activityKorean = 'Please enter activity in korean '
        }

        if (!image) {
            errors.image = 'Please select image'
        }


        if (Object.keys(errors).length > 0) {
            setactivityError(errors)
            return
        }
        const formData = new FormData();
        formData.append("activity_english", activityEnglish);
        formData.append("activity_arabic", activityArabic);
        formData.append("activity_french", activityFrench);
        formData.append("activity_italian", activityItalian);
        formData.append("activity_korean", activityKorean);
        formData.append("image", image);

        axios.post(API_URL + '/add_activity', formData).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-activity')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.activityEnglish = 'Activity already exist';
                setactivityError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);

        })

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setactivityError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setactivityError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setactivityError((prev) => ({ ...prev, image: "" }));
            setimage(file);
        }
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Add Water Activity')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-activity'}`} className="mc-breadcrumb-link">{t('water activty')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Add Water Activity')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="container">

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                         Activity English
                        </label>
                        <Form.Control type="text" placeholder='Enter activity in english' value={activityEnglish} onChange={(e) => {
                            setactivityEnglish(e.target.value)
                            setactivityError((prev) => ({ ...prev, activityEnglish: "" }));
                        }}
                            isInvalid={activityError.activityEnglish}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.activityEnglish}
                        </Form.Control.Feedback>
                    </div>



                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                        Activity Arabic
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter activity in arabic'
                            value={activityArabic} onChange={(e) => {
                                setactivityArabic(e.target.value)
                                setactivityError((prev) => ({ ...prev, activityArabic: "" }));
                            }}

                            isInvalid={activityError.activityArabic}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.activityArabic}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                        Activity French
                        </label>
                        <Form.Control type="text" placeholder='Enter activity in french' value={activityFrench} onChange={(e) => {
                            setactivityFrench(e.target.value)
                            setactivityError((prev) => ({ ...prev, activityFrench: "" }));
                        }}
                            isInvalid={activityError.activityFrench}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.activityFrench}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                        Activity Italian
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter activity in italian'
                            value={activityItalian} onChange={(e) => {
                                setactivityItalian(e.target.value)
                                setactivityError((prev) => ({ ...prev, activityItalian: "" }));
                            }}
                            isInvalid={activityError.activityItalian}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.activityItalian}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                        Activity Korean
                        </label>
                        <Form.Control type="text" placeholder='Enter activity in korean' value={activityKorean} onChange={(e) => {
                            setactivityKorean(e.target.value)
                            setactivityError((prev) => ({ ...prev, activityKorean: "" }));
                        }}
                            isInvalid={activityError.activityKorean}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.activityKorean}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                        Activity Image
                        </label>
                        <Form.Control type="file" onChange={handleImageChange}
                            isInvalid={activityError.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {activityError.image}
                        </Form.Control.Feedback>
                    </div>
                </div>

                <button className="btn btn-dark"
                    style={{
                        marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                    }}
                    onClick={handlesubmit}
                >
                    ADD
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Activity added successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}