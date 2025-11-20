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
import { BeatLoader, SyncLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
export default function EditTripType() {
    const { trip_type_id } = useParams();
    const [alertModal, setAlertModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [TripError, setTripError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [tripTypeEnglish, settripTypeEnglish] = useState('');
    const [tripTypeArabic, settripTypeArabic] = useState('');
    const [image, setImage] = useState(null);
    const [vectorImage, setVectorImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [currentVectorImage, setCurrentVectorImage] = useState('');
    // const [tripTypeFrench, settripTypeFrench] = useState('');
    // const [tripTypeItalian, settripTypeItalian] = useState('');
    // const [tripTypeKorean, settripTypeKorean] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        axios.get(API_URL + `/fetch_trip_type_by_id?trip_type_id=${trip_type_id}`).then((response) => {
            if (response.data.success) {
                setLoading(false);
                settripTypeEnglish(response.data.trip_type_arr[0].name_english);
                settripTypeArabic(response.data.trip_type_arr[0].name_arabic);
                setCurrentImage(response.data.trip_type_arr[0].image || '');
                setCurrentVectorImage(response.data.trip_type_arr[0].vector_image || '');
                // settripTypeFrench(response.data.trip_type_arr[0].name_french);
                // settripTypeItalian(response.data.trip_type_arr[0].name_italian);
                // settripTypeKorean(response.data.trip_type_arr[0].name_korean);
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const handlesubmit = () => {
        let errors = {}
        if (!tripTypeEnglish) {
            errors.tripTypeEnglish = 'Please enter Activity in enlish'
        }
        if (!tripTypeArabic) {
            errors.tripTypeArabic = 'Please enter Activity in arabic'
        }
        // if (!tripTypeFrench) {
        //     errors.tripTypeFrench = 'Please enter Activity in french'
        // }
        // if (!tripTypeItalian) {
        //     errors.tripTypeItalian = 'Please enter Activity in italian'
        // }
        // if (!tripTypeKorean) {
        //     errors.tripTypeKorean = 'Please enter Activity in korean '
        // }

        if (Object.keys(errors).length > 0) {
            setTripError(errors)
            return
        }
        setLoading1(true);
        const formData = new FormData();
        formData.append("trip_type_id", trip_type_id);
        formData.append("name_english", tripTypeEnglish);
        formData.append("name_arabic", tripTypeArabic);

        // Append image files if they exist
        if (image) {
            formData.append("image", image);
        }
        if (vectorImage) {
            formData.append("vector_image", vectorImage);
        }

        // formData.append("name_french", tripTypeFrench);
        // formData.append("name_italian", tripTypeItalian);
        // formData.append("name_korean", tripTypeKorean);

        axios.post(API_URL + '/edit_trip_type', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.success) {
                setLoading1(false);
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-trip-type')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                setLoading1(false);
                let updatedErrors = { ...errors };
                updatedErrors.tripTypeEnglish = 'Activity already exist';
                setTripError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Edit-Trip-Type</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Activity')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-trip-type'}`} className="mc-breadcrumb-link">{t('Activity')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Edit Activity')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            {loading ? (
                <div className="d-flex align-items-center" style={{ height: '40vh' }}>
                    <SyncLoader animation="border" color="#086861" variant="primary" style={{ marginLeft: '40%' }} />
                </div>
            ) : (
                <div className="container">
                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Activity English
                            </label>
                            <Form.Control type="text" placeholder='Enter Activity in english' value={tripTypeEnglish} onChange={(e) => {
                                settripTypeEnglish(e.target.value)
                                setTripError((prev) => ({ ...prev, tripTypeEnglish: "" }));
                            }}
                                isInvalid={TripError.tripTypeEnglish}
                            />
                            <Form.Control.Feedback type="invalid">
                                {TripError.tripTypeEnglish}
                            </Form.Control.Feedback>
                        </div>

                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Activity Arabic
                            </label>
                            <Form.Control type="text"
                                placeholder='Enter Activity in arabic'
                                value={tripTypeArabic} onChange={(e) => {
                                    settripTypeArabic(e.target.value)
                                    setTripError((prev) => ({ ...prev, tripTypeArabic: "" }));
                                }}
                                isInvalid={TripError.tripTypeArabic}
                            />
                            <Form.Control.Feedback type="invalid">
                                {TripError.tripTypeArabic}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="image" className="form-label">
                                Activity Image
                            </label>
                            <Form.Control
                                type="file"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            {currentImage && !image && (
                                <div className="mt-2">
                                    <p>Current Image:</p>
                                    <img
                                        src={`${IMAGE_PATH}/${currentImage}`}
                                        alt="Current Activity"
                                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className='col-md-6'>
                            <label htmlFor="vectorImage" className="form-label">
                                Vector Image
                            </label>
                            <Form.Control
                                type="file"
                                id="vectorImage"
                                onChange={(e) => setVectorImage(e.target.files[0])}
                            />
                            {currentVectorImage && !vectorImage && (
                                <div className="mt-2">
                                    <p>Current Vector Image:</p>
                                    <img
                                        src={`${IMAGE_PATH}/${currentVectorImage}`}
                                        alt="Current Vector"
                                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Activity French
                            </label>
                            <Form.Control type="text" placeholder='Enter Activity in french' value={tripTypeFrench} onChange={(e) => {
                                settripTypeFrench(e.target.value)
                                setTripError((prev) => ({ ...prev, tripTypeFrench: "" }));
                            }}
                                isInvalid={TripError.tripTypeFrench}
                            />
                            <Form.Control.Feedback type="invalid">
                                {TripError.tripTypeFrench}
                            </Form.Control.Feedback>
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Activity Italian
                            </label>
                            <Form.Control type="text"
                                placeholder='Enter Activity in italian'
                                value={tripTypeItalian} onChange={(e) => {
                                    settripTypeItalian(e.target.value)
                                    setTripError((prev) => ({ ...prev, tripTypeItalian: "" }));
                                }}
                                isInvalid={TripError.tripTypeItalian}
                            />
                            <Form.Control.Feedback type="invalid">
                                {TripError.tripTypeItalian}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                    <div className='row m-2'>
                        <div className='col-md-6'>
                            <label htmlFor="categoryDescription" className="form-label">
                                Activity Korean
                            </label>
                            <Form.Control type="text" placeholder='Enter Activity in korean' value={tripTypeKorean} onChange={(e) => {
                                settripTypeKorean(e.target.value)
                                setTripError((prev) => ({ ...prev, tripTypeKorean: "" }));
                            }}
                                isInvalid={TripError.tripTypeKorean}
                            />
                            <Form.Control.Feedback type="invalid">
                                {TripError.tripTypeKorean}
                            </Form.Control.Feedback>
                        </div>
                    </div> */}

                    <button className="btn btn-dark"
                        style={{
                            marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                        }}
                        onClick={handlesubmit}
                    > {loading1 ? <BeatLoader color="#fff" size={8} /> : 'Edit'}
                    </button>
                </div>
            )}
            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Activity updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}