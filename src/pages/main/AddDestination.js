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

export default function AddDestination() {
    const [alertModal, setAlertModal] = useState(false);
    const [DestinationError, setDestinationError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [destinationEnglish, setdestinationEnglish] = useState(''); 
    const [destinationArabic, setdestinationArabic] = useState('');
    // Commented out other language states
    // const [destinationFrench, setdestinationFrench] = useState('');
    // const [destinationItalian, setdestinationItalian] = useState('');
    // const [destinationKorean, setdestinationKorean] = useState('');
    const [image, setimage] = useState('');

    const navigate = useNavigate();

    const handlesubmit = () => {
        let errors = {}
        if (!destinationEnglish) {
            errors.destinationEnglish = 'Please enter destination in enlish'
        }
        if (!destinationArabic) {
            errors.destinationArabic = 'Please enter destination in arabic'
        }
        // Commented out other language validations
        // if (!destinationFrench) {
        //     errors.destinationFrench = 'Please enter destination in french'
        // }
        // if (!destinationItalian) {
        //     errors.destinationItalian = 'Please enter destination in italian'
        // }
        // if (!destinationKorean) {
        //     errors.destinationKorean = 'Please enter destination in korean '
        // }

        if (!image) {
            errors.image = 'Please select image'
        }

        if (Object.keys(errors).length > 0) {
            setDestinationError(errors)
            return
        }
        const formData = new FormData();
        formData.append("destination_english", destinationEnglish);
        formData.append("destination_arabic", destinationArabic);
        // Commented out other language form data
        // formData.append("destination_french", destinationFrench);
        // formData.append("destination_italian", destinationItalian);
        // formData.append("destination_korean", destinationKorean);
        formData.append("image", image);

        axios.post(API_URL + '/add_destination', formData).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-destination')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.destinationEnglish = 'Destination already exist';
                setDestinationError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setDestinationError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setDestinationError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setDestinationError((prev) => ({ ...prev, image: "" }));
            setimage(file);
        }
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Add Destination')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-destination'}`} className="mc-breadcrumb-link">{t('destination')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Add Destination')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="container">
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination English
                        </label>
                        <Form.Control type="text" placeholder='Enter destination in english' value={destinationEnglish} onChange={(e) => {
                            setdestinationEnglish(e.target.value)
                            setDestinationError((prev) => ({ ...prev, destinationEnglish: "" }));
                        }}
                            isInvalid={DestinationError.destinationEnglish}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.destinationEnglish}
                        </Form.Control.Feedback>
                    </div>

                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination Arabic
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter destination in arabic'
                            value={destinationArabic} onChange={(e) => {
                                setdestinationArabic(e.target.value)
                                setDestinationError((prev) => ({ ...prev, destinationArabic: "" }));
                            }}
                            isInvalid={DestinationError.destinationArabic}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.destinationArabic}
                        </Form.Control.Feedback>
                    </div>
                </div>
                {/* Commented out French, Italian, and Korean input fields
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination French
                        </label>
                        <Form.Control type="text" placeholder='Enter destination in french' value={destinationFrench} onChange={(e) => {
                            setdestinationFrench(e.target.value)
                            setDestinationError((prev) => ({ ...prev, destinationFrench: "" }));
                        }}
                            isInvalid={DestinationError.destinationFrench}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.destinationFrench}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination Italian
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter destination in italian'
                            value={destinationItalian} onChange={(e) => {
                                setdestinationItalian(e.target.value)
                                setDestinationError((prev) => ({ ...prev, destinationItalian: "" }));
                            }}
                            isInvalid={DestinationError.destinationItalian}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.destinationItalian}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination Korean
                        </label>
                        <Form.Control type="text" placeholder='Enter destination in korean' value={destinationKorean} onChange={(e) => {
                            setdestinationKorean(e.target.value)
                            setDestinationError((prev) => ({ ...prev, destinationKorean: "" }));
                        }}
                            isInvalid={DestinationError.destinationKorean}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.destinationKorean}
                        </Form.Control.Feedback>
                    </div>
                */}
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination Image
                        </label>
                        <Form.Control type="file" onChange={handleImageChange}
                            isInvalid={DestinationError.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {DestinationError.image}
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
                    <h3>Confirmation</h3><br />
                    <p>Destination added successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}