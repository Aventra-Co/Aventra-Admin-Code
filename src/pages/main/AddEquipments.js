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

export default function AddEquipments() {
    const [alertModal, setAlertModal] = useState(false);
    const [equipmentError, setequipmentError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [equipmentEnglish, setequipmentEnglish] = useState('');
    const [equipmentArabic, setequipmentArabic] = useState('');
    const [equipmentFrench, setequipmentFrench] = useState('');
    const [equipmentItalian, setequipmentItalian] = useState('');
    const [equipmentKorean, setequipmentKorean] = useState('');
    const [image, setimage] = useState('');

    const navigate = useNavigate();

    const handlesubmit = () => {
        let errors = {}
        if (!equipmentEnglish) {
            errors.equipmentEnglish = 'Please enter equipment in english'
        }
        if (!equipmentArabic) {
            errors.equipmentArabic = 'Please enter equipment in arabic'
        }
        if (!equipmentFrench) {
            errors.equipmentFrench = 'Please enter equipment in french'
        }
        if (!equipmentItalian) {
            errors.equipmentItalian = 'Please enter equipment in italian'
        }
        if (!equipmentKorean) {
            errors.equipmentKorean = 'Please enter equipment in korean '
        }

        if (!image) {
            errors.image = 'Please select image'
        }


        if (Object.keys(errors).length > 0) {
            setequipmentError(errors)
            return
        }
        const formData = new FormData();
        formData.append("equipment_english", equipmentEnglish);
        formData.append("equipment_arabic", equipmentArabic);
        formData.append("equipment_french", equipmentFrench);
        formData.append("equipment_italian", equipmentItalian);
        formData.append("equipment_korean", equipmentKorean);
        formData.append("image", image);

        axios.post(API_URL + '/add_equipment', formData).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-equipments')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.equipmentEnglish = 'Equiment already exist';
                setequipmentError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);

        })

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setequipmentError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setequipmentError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setequipmentError((prev) => ({ ...prev, image: "" }));
            setimage(file);
        }
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Add Equipment')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-equipments'}`} className="mc-breadcrumb-link">{t('equipment')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Add Equipment')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="container">

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment English
                        </label>
                        <Form.Control type="text" placeholder='Enter equipments in english' value={equipmentEnglish} onChange={(e) => {
                            setequipmentEnglish(e.target.value)
                            setequipmentError((prev) => ({ ...prev, equipmentEnglish: "" }));
                        }}
                            isInvalid={equipmentError.equipmentEnglish}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.equipmentEnglish}
                        </Form.Control.Feedback>
                    </div>



                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment Arabic
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter equipments in arabic'
                            value={equipmentArabic} onChange={(e) => {
                                setequipmentArabic(e.target.value)
                                setequipmentError((prev) => ({ ...prev, equipmentArabic: "" }));
                            }}

                            isInvalid={equipmentError.equipmentArabic}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.equipmentArabic}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment French
                        </label>
                        <Form.Control type="text" placeholder='Enter equipments in french' value={equipmentFrench} onChange={(e) => {
                            setequipmentFrench(e.target.value)
                            setequipmentError((prev) => ({ ...prev, equipmentFrench: "" }));
                        }}
                            isInvalid={equipmentError.equipmentFrench}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.equipmentFrench}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment Italian
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter equipments in italian'
                            value={equipmentItalian} onChange={(e) => {
                                setequipmentItalian(e.target.value)
                                setequipmentError((prev) => ({ ...prev, equipmentItalian: "" }));
                            }}
                            isInvalid={equipmentError.equipmentItalian}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.equipmentItalian}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment Korean
                        </label>
                        <Form.Control type="text" placeholder='Enter equipments in korean' value={equipmentKorean} onChange={(e) => {
                            setequipmentKorean(e.target.value)
                            setequipmentError((prev) => ({ ...prev, equipmentKorean: "" }));
                        }}
                            isInvalid={equipmentError.equipmentKorean}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.equipmentKorean}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Equipment Image
                        </label>
                        <Form.Control type="file" onChange={handleImageChange}
                            isInvalid={equipmentError.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {equipmentError.image}
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
                    <p>Equipment added successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}