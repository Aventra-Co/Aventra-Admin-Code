import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col, Tab, Tabs, Form, Modal } from "react-bootstrap";
import { LegendFieldComponent, LegendTextareaComponent, IconFieldComponent } from "../../components/fields";
import { ButtonComponent } from "../../components/elements";
import { FileUploadComponent } from "../../components";
import PageLayout from "../../layouts/PageLayout";
import { API_URL, IMAGE_PATH } from "../../constant/constant";
import axios from "axios";
import Placeholder from './placeholder/placeholder.webp';
import HeaderLayout from "../../layouts/HeaderLayout";


export default function AdminProfilePage() {

    const { t } = useContext(TranslatorContext);




    const [adminDetails, setadminDetails] = useState({});
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [email1, setemail1] = useState("");
    const [mobile, setmobile] = useState('');
    const [image, setImage] = useState('');
    const [preview, setpreview] = useState(Placeholder);
    const [OldPassword, setOldPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [OldPasswordError, setOldPasswordError] = useState('');
    const [NewPasswordError, setNewPasswordError] = useState('');
    const [ConfirmPasswordError, setConfirmPasswordError] = useState('');
    const [nameError, setnameError] = useState('');
    const [emailError, setemailError] = useState('');
    const [mobileError, setmobileError] = useState('');

    // pop up message
    const [Msg, setMsg] = useState('');

    const fetchAdminDetails = () => {
        const user_id = sessionStorage.getItem('admin_id');

        if (!user_id) {
            console.error('Admin ID not found in sessionStorage');
            return;
        }
        console.log('OldPassword Abhi :', OldPassword);
        axios
            .get(`${API_URL}/fetch_admin_profile`, {
                params: {
                    user_id: user_id,
                },
            })
            .then((res) => {
                if (res.data.success) {
                    const adminData = res.data.info;
                    setadminDetails(adminData);
                    setname(res.data.info.name ? res.data.info.name : adminData.name);
                    setemail(res.data.info.email ? res.data.info.email : adminData.email);
                    setmobile(res.data.info.mobile ? res.data.info.mobile : adminData.mobile);
                    setImage(res.data.info.image ? res.data.info.image : adminData.image);
                    setemail1(res.data.info.email ? res.data.info.email : adminData.email)

                } else {
                    console.error('No admin data found');
                }
            })
            .catch((error) => {
                console.error('Error fetching admin data', error);
            });
    };




    const handleFileUpload = (file) => {
        // console.log("Fole....", file);

        setSelectedImage(file);
        setpreview(URL.createObjectURL(file));
    };

    const handleUpdate = () => {

        let hasError = false;
        if (!name || name == "" || name == null) {
            setnameError(t("enter your name"));
            hasError = true;
        }
        if (!email || email == "" || email == null) {
            setemailError(t("enter your email"));
            hasError = true;
        }
        if (!mobile || mobile == "" || mobile == null) {
            setmobileError(t("enter mobile"));
            hasError = true;
        }

        if (hasError) {
            return;
        }
        const user_id = sessionStorage.getItem('admin_id');
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile', mobile);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        axios.post(API_URL + '/edit_admin_profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log('response', response)
            if (response.data.success) {
                setMsg(t("profile updated"));
                setModalShow(true);
                setTimeout(() => {
                    setModalShow(false);
                    fetchAdminDetails();
                }, 1000);
                console.log('Profile updated successfully');
            } else {

                console.log('Error updating profile', response.data.msg);
            }
        }).catch((error) => {
            console.log('error', error);
        });


    }

    const handlePasswordChange = () => {

        let hasError = false;
        if (!OldPassword) {
            setOldPasswordError(t("Please Enter Old Password"));
            hasError = true;
        }
        if (!NewPassword) {
            setNewPasswordError(t("Please Enter New Password"));
            hasError = true;
        }
        if (!ConfirmPassword) {
            setConfirmPasswordError(t("Please Enter Confirm Password"));
            hasError = true;
        }



        if (hasError) {
            return;
        }

        if (NewPassword != ConfirmPassword) {
            setConfirmPasswordError(t("password_equal"));
            return;
        }
        if (NewPassword.length < 6) {
            setNewPasswordError(t("password_less"));
            return;
        }
        const user_id = sessionStorage.getItem('admin_id');
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('old_password', OldPassword);
        formData.append('new_password', NewPassword);

        axios.post(API_URL + '/update_admin_password', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.key == "old_password") {
                setOldPasswordError(t("current_inccorect"));
                return;
            }
            if (response.data.key == "samePassword") {
                setConfirmPasswordError(t("New password can not be same as old password"));
                return;
            }
            if (response.data.success === false) {
                setOldPasswordError(t("Old Password is not correct"));
                return;
            }
            if (response.data.success) {
                setMsg(t("password_changed"));
                setModalShow(true);
                setTimeout(() => {
                    setModalShow(false);
                    fetchAdminDetails();
                }, 1000);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                console.log('Profile updated successfully');
            } else {

                console.log('Error updating profile', response.data.msg);
            }
        }).catch((error) => {
            console.log('error', error);
        });


    }




    useEffect(() => {
        fetchAdminDetails();
    }, []);

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };

    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className='mc-breadcrumb'>
                            <h3 className="mc-breadcrumb-title">{t('my_account')}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('home')}</Link></li>
                                <li className="mc-breadcrumb-item"><Link to='#' className="mc-breadcrumb-link">{t('users')}</Link></li>
                                <li className="mc-breadcrumb-item">{t('my_account')}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <Tabs defaultActiveKey="profile" id="mc" className="mc-tabs">
                            <Tab eventKey="profile" title={t('edit_profile')} className="mc-tabpane profile">
                                <div className="mc-tab-card">
                                    <h6 className="mc-tab-card-title">{t('profile')}</h6>
                                    <Row>
                                        <Col xl={4}>
                                            <div className="mc-user-avatar-upload">

                                                {adminDetails && (
                                                    <img
                                                        src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}
                                                        alt="Profile"
                                                        style={{ width: '15rem', height: '15rem', cursor: 'pointer', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px' }}
                                                        onClick={() => handleImageClick(adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`)}
                                                        role="button"
                                                        tabIndex={0}
                                                    />
                                                )}

                                                {showImagePopup && (
                                                    <div
                                                        className="enlarged-image-overlay"
                                                        onClick={handleCloseImage}
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <span className="close-button" onClick={handleCloseImage} role="button" tabIndex={0}>
                                                            &times;
                                                        </span>
                                                        <img src={enlargedImage} alt="Enlarged Profile" className="enlarged-image" style={{ width: '30rem', height: '30rem', objectFit: 'cover', borderRadius: '8px' }} />
                                                    </div>
                                                )}


                                            </div>
                                        </Col>
                                        <Col xl={8}>
                                            <Row>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="text"
                                                        title={t('fullname')}
                                                        value={name}
                                                        className="mb-2"
                                                        placeholder={t("enter your name")}
                                                        maxLength={25}  // Set the maximum length to 25 characters
                                                        onChange={(e) => {
                                                            setname(e.target.value);
                                                            setnameError('');
                                                        }}
                                                    />
                                                    <p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{nameError}</p>
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="text"
                                                        title={'email'}
                                                        value={email}
                                                        placeholder={t("enter your email")}
                                                        maxLength={25}
                                                        className="mb-2"
                                                        onChange={(e) => { setemail(e.target.value); setemailError('') }}
                                                    />
                                                    <p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{emailError}</p>
                                                </Col>
                                                <Col xl={12}>
                                                    <LegendFieldComponent
                                                        type="text"
                                                        title={t('mobile')}
                                                        value={mobile}
                                                        placeholder={t("enter_mobile")}
                                                        className="mb-2"
                                                        maxLength={16}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            const numericValue = inputValue.replace(/[^0-9]/g, '');
                                                            setmobile(numericValue);
                                                            setmobileError('');
                                                        }}
                                                    />
                                                    <p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{mobileError}</p>
                                                </Col>

                                                <Col xl={12}>
                                                    <div className="row">
                                                        <div className="col-lg-2">
                                                            <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '10px' }}>
                                                                <img
                                                                    src={preview}
                                                                    // src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}

                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}>

                                                                </img>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <FileUploadComponent icon="cloud_upload" text={t('upload')} onFileUpload={handleFileUpload} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <ButtonComponent className="mc-btn primary" icon="verified" onClick={handleUpdate} text={t('save_changes')} />
                            </Tab>




                            <Tab eventKey="password" title={t('change_password')} className="mc-tabpane password">
                                <div className="mc-tab-card">
                                    {/* <h6 className="mc-tab-card-title">{t('generate_password')}</h6> */}
                                    <Row>
                                        <Col xs={12} md={12}><IconFieldComponent icon="lock" type="password" placeholder={t('Enter your old password')}
                                            maxLength={16}
                                            value={OldPassword} onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError('') }} classes="w-100 h-lg mb-2" passwordVisible />
                                            <p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{OldPasswordError}</p>
                                        </Col>


                                        <Col xs={12} md={6}><IconFieldComponent icon="lock" type="password" placeholder={t('Enter new password')}
                                            maxLength={16}
                                            value={NewPassword} onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(''); setConfirmPasswordError('') }} setNew classes="w-100 h-lg mb-2" passwordVisible /><p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{NewPasswordError}</p></Col>


                                        <Col xs={12} md={6}><IconFieldComponent icon="lock" type="password" placeholder={t('Enter confirm password')}
                                            maxLength={16}
                                            value={ConfirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError('') }} classes="w-100 h-lg mb-2" passwordVisible />  <p className="mb-3" style={{ color: 'red', fontSize: '13px' }}>{ConfirmPasswordError}</p></Col>

                                    </Row>
                                </div>
                                <ButtonComponent className="mc-btn primary" icon="verified" onClick={handlePasswordChange} text={t('save_changes')} />
                            </Tab>

                        </Tabs>
                    </div>
                </Col>
            </Row>


            <Modal show={modalShow} onHide={() => setModalShow(false)} className="custom-modal">
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center">
                        Update
                        <hr className="my-2" style={{ borderTop: '2px solid #007bff', width: '100%' }} />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="lead mb-4">{Msg}</p>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                </Modal.Footer>
            </Modal>


            <HeaderLayout image={adminDetails.image} />
        </PageLayout>

    )
}