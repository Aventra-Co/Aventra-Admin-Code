import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import { TranslatorContext } from "../../context/Translator";
import { ButtonComponent, AnchorComponent } from "../../components/elements";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";
import './LoginPage.css';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import Authentication from "../Authentication/auth";
import pattern from '../../../src/assets/img/pattern.webp'
import logo from '../../../src/assets/img/Frame 1707480072.png'

export default function LoginPage() {
    const { t } = useContext(TranslatorContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
    const [password, setPassword] = useState(localStorage.getItem('rememberedPassword') || '');
    const [user_type, setUserType] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [userTypeError, setUserTypeError] = useState("");

    const [modalShow, setModalShow] = useState(false);


    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail');
        const storedPassword = localStorage.getItem('rememberedPassword');
        if (storedEmail) {
            setEmail(storedEmail.trim());
            setRememberMe(true);
        }
        if (storedPassword) {
            setPassword(storedPassword.trim());
        }
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!email) {
            setEmailError(t("enter your email"));
            hasError = true;
        }
        if (!password) {
            setPasswordError(t("enter your password"));
            hasError = true;
        }

        if (hasError) return;

        const payload = { email, password };
        console.log(payload)
        try {
            const res = await axios.post(API_URL + "/sign_in", payload);
            if (res.data.key === 'email') {
                setEmailError(t("email not correct"));
                return;
            } else if (res.data.key === 'password') {
                setPasswordError(t("password not correct"));
                return;
            } else if (res.data.success) {
                const user = res.data.UserData[0];
                sessionStorage.setItem('token1', res.data.token);
                sessionStorage.setItem('admin_id', user.user_id);
                sessionStorage.setItem('admin_name', user.name);
                sessionStorage.setItem('admin_email', user.email);
                sessionStorage.setItem('admin_mobile', user.mobile);
                sessionStorage.setItem('user_type', user.user_type);

                sessionStorage.setItem('user_arrdata', JSON.stringify({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    address: user.address
                }));

                localStorage.setItem('user_arr_data', JSON.stringify({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    address: user.address
                }));

                const sessionDuration = 15 * 60 * 1000;
                const expirationTime = new Date().getTime() + sessionDuration;
                sessionStorage.setItem('expirationTime', expirationTime);

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', user.email);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }
                navigate(APP_PREFIX_PATH + '/dashboard');



            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mc-auth">
            <Authentication />
            <img src={pattern} alt="pattern" className="mc-auth-pattern" />
            <div className="mc-auth-group">
                <form className="mc-auth-form" onSubmit={handleSignIn}>
                    <LogoComponent
                        src={logo}
                        alt="logo"
                        href="/app/admin/"
                        className="mc-auth-logo"
                        style={{ width: '55px' }}
                    />

                    {/* Email Field */}
                    <IconFieldComponent
                        icon="email"
                        type="email"
                        classes="w-100 h-sm"
                        placeholder={t('enter your email')}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        maxLength={100}
                    />
                    <div className="d-flex justify-content-left">
                        <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                            {emailError}
                        </p>
                    </div>

                    {/* Password Field */}
                    <IconFieldComponent
                        icon="lock"
                        type="password"
                        classes="w-100 h-sm"
                        placeholder={t('enter your password')}
                        passwordVisible={true}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                        maxLength={16}
                    />
                    <div className="d-flex justify-content-left">
                        <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                            {passwordError}
                        </p>
                    </div>

                    {/* Role Field */}
                    {/* <div className="select-dropdown d-flex align-items-center w-100 h-sm">
                        <span className="icon-field">
                            <i className="material-icons">verified_user</i>
                        </span>

                        <select
                            className="form-control selected"
                            value={user_type}
                            onChange={(e) => {
                                setUserType(e.target.value);
                                setUserTypeError('');
                            }}
                        >
                            <option value="">{t("select_role")}</option>
                            <option value="0">{t("admin")}</option>
                            <option value="2">{t("hospital_admin")}</option>
                        </select>
                    </div> */}

                    <div className="d-flex justify-content-left">
                        <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                            {userTypeError}
                        </p>
                    </div>

                    <div className="custom-control custom-checkbox text-start mb-4 mt-1">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="rememberMe">
                            &nbsp;&nbsp; {t("Remember me")}
                        </label>
                    </div>

                    {/* Sign In Button */}
                    <ButtonComponent className='mc-auth-btn h-sm' type='submit'>
                        {t('sign in')}
                    </ButtonComponent>

                    <AnchorComponent className="mc-auth-forgot" to={`${APP_PREFIX_PATH}/forgot-password`}>
                        {t('forgot password')}
                    </AnchorComponent>
                </form>
            </div>

            <Modal show={modalShow} onHide={() => setModalShow(false)} className="custom-modal">
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center">
                        {t("login")}
                        <hr className="my-2" style={{ borderTop: '2px solid #007bff', width: '100%' }} />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="lead mb-4">{t("login successfully")}</p>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    {/* <button className="btn btn-primary px-4" onClick={() => setModalShow(false)}>
            Close
        </button> */}
                </Modal.Footer>
            </Modal>

        </div>
    );
}
