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
import { Helmet } from "react-helmet-async";
export default function EditRole() {
    const { role_id } = useParams();
    const [alertModal, setAlertModal] = useState(false);
    const [RoleError, setRoleError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [roleEnglish, setroleEnglish] = useState('');
    const [roleArabic, setroleArabic] = useState('');
    // const [roleFrench, setroleFrench] = useState('');
    // const [roleItalian, setroleItalian] = useState('');
    // const [roleKorean, setroleKorean] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + `/fetch_role_by_id?role_id=${role_id}`).then((response) => {
            if (response.data.success) {
                setroleEnglish(response.data.role_arr[0].role_english)
                setroleArabic(response.data.role_arr[0].role_arabic)
                // setroleFrench(response.data.role_arr[0].role_french)
                // setroleItalian(response.data.role_arr[0].role_italian)
                // setroleKorean(response.data.role_arr[0].role_korean)
            }
        }).catch()
    }, [])

    const handlesubmit = () => {
        let errors = {}
        if (!roleEnglish) {
            errors.roleEnglish = 'Please enter role in enlish'
        }
        if (!roleArabic) {
            errors.roleArabic = 'Please enter role in arabic'
        }
        // if (!roleFrench) {
        //     errors.roleFrench = 'Please enter role in french'
        // }
        // if (!roleItalian) {
        //     errors.roleItalian = 'Please enter role in italian'
        // }
        // if (!roleKorean) {
        //     errors.roleKorean = 'Please enter role in korean '
        // }

        if (Object.keys(errors).length > 0) {
            setRoleError(errors)
            return
        }
        const formData = new FormData();
        formData.append("role_id", role_id);
        formData.append("role_english", roleEnglish);
        formData.append("role_arabic", roleArabic);
        // formData.append("role_french", roleFrench);
        // formData.append("role_italian", roleItalian);
        // formData.append("role_korean", roleKorean);

        axios.post(API_URL + '/edit_role', formData).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-role')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.roleEnglish = 'Role already exist.';
                setRoleError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);

        })

    }

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Edit-Role</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Role')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-role'}`} className="mc-breadcrumb-link">{t('manage owner')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Edit role')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="container">

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Role English
                        </label>
                        <Form.Control type="text" placeholder='Enter role in english' value={roleEnglish} onChange={(e) => {
                            setroleEnglish(e.target.value)
                            setRoleError((prev) => ({ ...prev, roleEnglish: "" }));
                        }}
                            isInvalid={RoleError.roleEnglish}
                        />
                        <Form.Control.Feedback type="invalid">
                            {RoleError.roleEnglish}
                        </Form.Control.Feedback>
                    </div>

                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Role Arabic
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter role in arabic'
                            value={roleArabic} onChange={(e) => {
                                setroleArabic(e.target.value)
                                setRoleError((prev) => ({ ...prev, roleArabic: "" }));
                            }}
                            isInvalid={RoleError.roleArabic}
                        />
                        <Form.Control.Feedback type="invalid">
                            {RoleError.roleArabic}
                        </Form.Control.Feedback>
                    </div>
                </div>
                {/* <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Role French
                        </label>
                        <Form.Control type="text" placeholder='Enter role in french' value={roleFrench} onChange={(e) => {
                            setroleFrench(e.target.value)
                            setRoleError((prev) => ({ ...prev, roleFrench: "" }));
                        }}
                            isInvalid={RoleError.roleFrench}
                        />
                        <Form.Control.Feedback type="invalid">
                            {RoleError.roleFrench}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Role Italian
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter role in italian'
                            value={roleItalian} onChange={(e) => {
                                setroleItalian(e.target.value)
                                setRoleError((prev) => ({ ...prev, roleItalian: "" }));
                            }}
                            isInvalid={RoleError.roleItalian}
                        />
                        <Form.Control.Feedback type="invalid">
                            {RoleError.roleItalian}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Role Korean
                        </label>
                        <Form.Control type="text" placeholder='Enter role in korean' value={roleKorean} onChange={(e) => {
                            setroleKorean(e.target.value)
                            setRoleError((prev) => ({ ...prev, roleKorean: "" }));
                        }}
                            isInvalid={RoleError.roleKorean}
                        />
                        <Form.Control.Feedback type="invalid">
                            {RoleError.roleKorean}
                        </Form.Control.Feedback>
                    </div>
                </div> */}

                <button className="btn btn-dark"
                    style={{
                        marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                    }}
                    onClick={handlesubmit}
                >
                    Edit
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Role updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}