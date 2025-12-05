import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { ButtonComponent, AnchorComponent } from "../../components/elements";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {

    const { t } = useContext(TranslatorContext);

    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [passwordError, setpasswordError] = useState("");
    const [confirmpasswordError, setconfirmpasswordError] = useState("");
    const [showModal, setshowModal] = useState(false);


    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;
        if (!password) {
            setpasswordError(t('please enter new password'));
            hasError = true
        }
        if (!confirmpassword) {
            setconfirmpasswordError(t('please enter confirm password'));
            hasError = true
        }

        if (password !== confirmpassword) {
            setconfirmpasswordError(t('password and confirm password are not same'));
            return;
        }


        if (hasError) {
            return;
        }
        if (password.length < 6 || confirmpassword.length < 6) {
            setconfirmpasswordError(t('password not less then 6 letters'));
            return;
        }


        axios.post(API_URL + '/forgot_password_change_password', { password }).then((res) => {

            if (res.data.success) {
                setshowModal(true);
                setTimeout(() => {
                    setshowModal(false);
                    navigate(APP_PREFIX_PATH + '/');
                }, 2000);
            }
        }).catch((error) => {
            console.log(error);

        })


    }

    return (
        <div className="mc-auth">
            <img src="https://aventra-co.com/app/server/logo/logo.png" alt="pattern" className="mc-auth-pattern" />
            <div className="mc-auth-group">
                <form className="mc-auth-form" onSubmit={handleSubmit}>
                    <LogoComponent
                        src="https://aventra-co.com/app/server/logo/logo.png"
                        alt="logo"
                        href="/2025/my_boat/admin/"
                        className="mc-auth-logo"
                        style={{ width: '60px' }}
                    />
                    <h3 className="mb-3">{t("create_new_password")}</h3>
                    {/* Password Field */}
                    <IconFieldComponent
                        icon="lock"
                        type="password"
                        classes="w-100 h-sm"
                        placeholder={t('enter_new_password')}
                        passwordVisible={true}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setpasswordError('') }}

                    />
                    <div className="d-flex justify-content-left">
                        <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                            {passwordError}
                        </p>
                    </div>

                    {/* confirm  Password Field */}
                    <IconFieldComponent
                        icon="lock"
                        type="password"
                        classes="w-100 h-sm"
                        placeholder={t('enter_confirm_password')}
                        passwordVisible={true}
                        value={confirmpassword}
                        onChange={(e) => { setconfirmPassword(e.target.value); setconfirmpasswordError('') }}
                    />
                    <div className="d-flex justify-content-left">
                        <p className="text-danger form-text" style={{ marginLeft: '5px', marginTop: '-20px' }}>
                            {confirmpasswordError}
                        </p>
                    </div><br />
                    <ButtonComponent className='mc-auth-btn h-sm' type='submit'>
                        {t('submit')}
                    </ButtonComponent>

                </form>
            </div>


            <Modal show={showModal} onHide={() => setshowModal(false)}>
                <Modal.Header >
                    <Modal.Title>{t("change_password")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t("chenged_successfully")}</Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    )
}