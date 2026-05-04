import React, { useContext, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal } from 'react-bootstrap';
import { ButtonComponent, AnchorComponent } from "../../components/elements";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";
import { API_URL, APP_PREFIX_PATH, LOGO_URL } from "../../constant/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'

export default function ForgotPasswordPage() {
    const { t } = useContext(TranslatorContext);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic email validation
        if (!email || email.trim() === '') {
            setEmailError(t("enter your email"));
            return;
        }

        // Email format validation (basic regex example)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError(t("please enter valid email"));
            return;
        }

        // Send email as an object to the server
        axios.post(API_URL + '/forgot_password', { email })
            .then((response) => {

                if (!response.data.success) {
                    setEmailError(t("email not correct"));
                    return;
                }

                if (response.data.success) {
                    setShowModal(true);
                    setModalTitle(t('forgot password'));
                    setModalMessage(t('reset link sent successfully'));
                    localStorage.setItem('email', email);

                    setTimeout(() => {
                        setShowModal(false);
                        navigate(APP_PREFIX_PATH + '/');
                    }, 2000);
                }



            })
            .catch((error) => {
                console.log(error);

            });

        setEmailError('');
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className="mc-auth">
            <img
                className="mc-auth-pattern"
                src={LOGO_URL}
                alt="pattern"
            />
            <div className="mc-auth-group">

                <form className="mc-auth-form" onSubmit={handleSubmit}>
                    <LogoComponent
                        src={LOGO_URL}
                        alt="logo"
                        href={`${APP_PREFIX_PATH}/ecommerce`}
                        className="mc-auth-logo"
                    />
                    <h4 className="mc-auth-title">{t('forgot password')}</h4>
                    <IconFieldComponent
                        icon="email"
                        type="email"
                        classes="h-sm"
                        placeholder={t("enter your email")}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                    />
                    {emailError && (
                        <div className="d-flex justify-content-left">
                            <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                                {emailError}
                            </p>
                        </div>
                    )}
                    <br />
                    <ButtonComponent className="mc-auth-btn h-sm" type="submit">
                        {t('send link')}
                    </ButtonComponent>
                </form>
                <div className="mc-auth-navigate">
                    <span>{t('remember the password')}?</span>
                    <AnchorComponent to={`${APP_PREFIX_PATH}/`}>{t('login')}</AnchorComponent>
                </div>
            </div>


            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );
}
