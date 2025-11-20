import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import { Helmet } from "react-helmet-async";
export default function EditDestination() {
    const { destination_id } = useParams();
    const [alertModal, setAlertModal] = useState(false);
    const [DestinationError, setDestinationError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [destinationEnglish, setdestinationEnglish] = useState('');
    const [destinationArabic, setdestinationArabic] = useState('');
    const [image, setimage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + `/get_destination_by_id?destination_id=${destination_id}`).then((response) => {
            if (response.data.success) {
                setdestinationEnglish(response.data.destination_arr[0].destination_english);
                setdestinationArabic(response.data.destination_arr[0].destination_arabic);
            }
        }).catch((error) => {
            console.log(error);

        })
    }, [])

    const handlesubmit = () => {
        let errors = {}
        if (!destinationEnglish) {
            errors.destinationEnglish = 'Please enter destination in enlish'
        }
        if (!destinationArabic) {
            errors.destinationArabic = 'Please enter destination in arabic'
        }

        if (Object.keys(errors).length > 0) {
            setDestinationError(errors)
            return
        }
        const formData = new FormData();
        formData.append("destination_id", destination_id);
        formData.append("destination_english", destinationEnglish);
        formData.append("destination_arabic", destinationArabic);
        formData.append("image", image);

        axios.post(API_URL + '/edit_destination', formData).then((response) => {
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
            <Helmet>
                <title>Aventra | Edit-Destination</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Destination')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-destination'}`} className="mc-breadcrumb-link">{t('destination')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Edit Destination')}</li>
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
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Destination Image
                        </label>
                        <Form.Control type="file" onChange={(e) => setimage(e.target.files[0])}
                        />
                    </div>
                </div>

                <button className="btn btn-dark"
                    style={{
                        marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                    }}
                    onClick={handlesubmit}
                >
                    EDIT
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Destination updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}