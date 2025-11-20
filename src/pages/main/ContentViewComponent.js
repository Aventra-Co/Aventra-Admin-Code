import React, { useContext, useEffect, useState, useMemo } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import { Row, Col, Modal } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import JoditEditor from 'jodit-react';
import './UserProfilePage.css';
import './ContentView.css';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
export default function ContentViewComponent() {
    const [modalShow, setModalShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [emptyContent, setEmptyContent] = useState('');
    const [content, setContent] = useState(0);

    // Content states organized by type and language
    const [contentData, setContentData] = useState({
        about: {
            english: '',
            arabic: '',
            french: '',
            italian: '',
            korean: ''
        },
        privacy: {
            english: '',
            arabic: '',
            french: '',
            italian: '',
            korean: ''
        },
        terms: {
            english: '',
            arabic: '',
            french: '',
            italian: '',
            korean: ''
        },
        android: '',
        ios: '',
        share: ''
    });

    // Content type mapping
    const contentTypes = {
        'about us': 0,
        'privacy policy': 1,
        'terms and condition': 2,
        'android app url': 3,
        'ios app url': 4,
        'share message': 5,
        'about arabic': 8,
        'privacy policy arabic': 9,
        'terms and condition arabic': 10,
        'about french': 11,
        'about italian': 12,
        'about korean': 13,
        'privacy policy french': 15,
        'privacy policy italian': 16,
        'privacy policy korean': 17,
        'terms and condition french': 18,
        'terms and condition italian': 19,
        'terms and condition korean': 20,
    };

    // Editor configuration
    const editorConfig = useMemo(() => ({
        readonly: false,
        placeholder: '',
        defaultActionOnPaste: 'insert_as_html',
        buttons: [
            'bold', 'italic', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', '|',
            'outdent', 'indent', 'align', '|',
            'hr', '|', 'fullsize', 'brush', '|',
            'table', 'link', '|',
            'undo', 'redo'
        ],
        statusbar: false,
        toolbarAdaptive: false
    }), []);

    // Fetch content on component mount
    useEffect(() => {
        fetchInitialContent();
    }, []);

    const fetchInitialContent = async () => {
        try {
            const responses = await Promise.all([
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['about us']}`),
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['privacy policy']}`),
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['terms and condition']}`),
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['android app url']}`),
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['ios app url']}`),
                axios.get(`${API_URL}/fetch_content?content_type=${contentTypes['share message']}`)
            ]);

            setContentData(prev => ({
                ...prev,
                about: {
                    english: responses[0].data.res[0]?.content_english || '',
                    arabic: responses[0].data.res[0]?.content_arabic || '',
                    french: responses[0].data.res[0]?.content_french || '',
                    italian: responses[0].data.res[0]?.content_italian || '',
                    korean: responses[0].data.res[0]?.content_korean || ''
                },
                privacy: {
                    english: responses[1].data.res[0]?.content_english || '',
                    arabic: responses[1].data.res[0]?.content_arabic || '',
                    french: responses[1].data.res[0]?.content_french || '',
                    italian: responses[1].data.res[0]?.content_italian || '',
                    korean: responses[1].data.res[0]?.content_korean || ''
                },
                terms: {
                    english: responses[2].data.res[0]?.content_english || '',
                    arabic: responses[2].data.res[0]?.content_arabic || '',
                    french: responses[2].data.res[0]?.content_french || '',
                    italian: responses[2].data.res[0]?.content_italian || '',
                    korean: responses[2].data.res[0]?.content_korean || ''
                },
                android: responses[3].data.res[0]?.content_english || '',
                ios: responses[4].data.res[0]?.content_english || '',
                share: responses[5].data.res[0]?.content_english || ''
            }));
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const handleInputChange = (field, value, language = 'english') => {
        if (['about', 'privacy', 'terms'].includes(field)) {
            setContentData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [language]: value
                }
            }));
        } else {
            setContentData(prev => ({
                ...prev,
                [field]: value
            }));
        }
        setEmptyContent('');
    };

    const handleBanner = async (contentType) => {
        let payload;
        let contentKey = contentType.split(' ')[0]; // 'android', 'ios', or 'share'

        switch (contentType) {
            case 'about us':
                payload = {
                    content: contentData.about.english,
                    content_arabic: contentData.about.arabic,
                    content_french: contentData.about.french,
                    content_italian: contentData.about.italian,
                    content_korean: contentData.about.korean,
                    content_type: contentTypes[contentType]
                };
                break;
            case 'privacy policy':
                payload = {
                    content: contentData.privacy.english,
                    content_arabic: contentData.privacy.arabic,
                    content_french: contentData.privacy.french,
                    content_italian: contentData.privacy.italian,
                    content_korean: contentData.privacy.korean,
                    content_type: contentTypes[contentType]
                };
                break;
            case 'terms and condition':
                payload = {
                    content: contentData.terms.english,
                    content_arabic: contentData.terms.arabic,
                    content_french: contentData.terms.french,
                    content_italian: contentData.terms.italian,
                    content_korean: contentData.terms.korean,
                    content_type: contentTypes[contentType]
                };
                break;
            case 'android app url':
            case 'ios app url':
            case 'share message':
                payload = {
                    content: contentData[contentKey],
                    content_type: contentTypes[contentType]
                };
                // For these simple fields, we should only validate the content field
                if (!contentData[contentKey]?.trim()) {
                    setEmptyContent(t("this_field_cannt_empty"));
                    return;
                }
                break;
            default:
                return;
        }

        // Validate required fields for complex content types
        if (['about us', 'privacy policy', 'terms and condition'].includes(contentType)) {
            const { content, content_arabic, content_french, content_italian, content_korean } = payload;
            if (!content.trim() || !content_arabic.trim() || !content_french.trim() || !content_italian.trim() || !content_korean.trim()) {
                setEmptyContent(t("this_field_cannt_empty"));
                return;
            }
        }

        try {
            const response = await axios.post(`${API_URL}/update_content`, payload);
            if (response.data.success) {
                setToastMessage(`${contentType} ${t("updated successfully")}`);
                setModalShow(true);
                setTimeout(() => setModalShow(false), 2000);
                setEmptyContent('');
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setToastMessage(error.message || t("update_failed"));
            setModalShow(true);
            setTimeout(() => setModalShow(false), 2000);
            setEmptyContent(t("update_failed"));
        }
    };

    const handleButtonClick = (contentType) => {
        setContent(contentTypes[contentType]);
    };

    // Helper function to render language buttons
    const renderLanguageButtons = (contentKey, contentIds) => {
        return (
            <div className="lagnuge">
                <button
                    className={`btn me-0 ms-2 btn-contentt ${content === contentIds.english ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleButtonClick(contentKey === 'about' ? 'about us' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition')}
                >
                    {t("english")}
                </button>
                <button
                    className={`btn me-0 btn-contentt ${content === contentIds.arabic ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleButtonClick(`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} arabic`)}
                >
                    {t("arabic")}
                </button>
                {/* <button
                    className={`btn me-0 btn-contentt ${content === contentIds.french ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleButtonClick(`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} french`)}
                >
                    {t("french")}
                </button>
                <button
                    className={`btn me-0 btn-contentt ${content === contentIds.italian ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleButtonClick(`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} italian`)}
                >
                    {t("italian")}
                </button>
                <button
                    className={`btn me-0 btn-contentt ${content === contentIds.korean ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleButtonClick(`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} korean`)}
                >
                    {t("korean")}
                </button> */}
            </div>
        );
    };

    // Helper function to render editor section
    const renderEditorSection = (title, contentKey, language) => {
        return (
            <div>
                {renderLanguageButtons(contentKey, {
                    english: contentTypes[`${contentKey === 'about' ? 'about us' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'}`],
                    arabic: contentTypes[`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} arabic`],
                    french: contentTypes[`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} french`],
                    italian: contentTypes[`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} italian`],
                    korean: contentTypes[`${contentKey === 'about' ? 'about' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'} korean`]
                })}
                <br />
                <span>{title}</span>
                <JoditEditor
                    value={contentData[contentKey][language]}
                    config={editorConfig}
                    onChange={(value) => handleInputChange(contentKey, value, language)}
                />
                <p style={{ color: 'red' }}>{emptyContent}</p><br />
                <button
                    className="btn"
                    onClick={() => handleBanner(`${contentKey === 'about' ? 'about us' :
                        contentKey === 'privacy' ? 'privacy policy' : 'terms and condition'}`)}
                    style={{ backgroundColor: '#0F225D', color: 'white' }}
                >
                    {t("update")}
                </button>
            </div>
        );
    };

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Manage-Content</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('content_details')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">
                                    {t('home')}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">
                                <Link to='#' className="mc-breadcrumb-link">{t('content')}</Link>
                            </li>
                            <li className="mc-breadcrumb-item">{t('content_list')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="mc-card p-lg-4">
                <Row>
                    <Col xl={12}>
                        <nav className="mt-4 navbar navbar-expand-lg navbar-light navBar">
                            <div className="container navbar-responsive">
                                <button
                                    className={`btn me-0 ms-0 btn-contentt ${[0, 8, 11, 12, 13].includes(content) ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('about us')}
                                >
                                    {t("about")}
                                </button>
                                <button
                                    className={`btn me-0 btn-contentt ${[1, 9, 15, 16, 17].includes(content) ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('privacy policy')}
                                >
                                    {t("privacy")}
                                </button>
                                <button
                                    className={`btn me-0 btn-contentt ${[2, 10, 18, 19, 20].includes(content) ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('terms and condition')}
                                >
                                    {t("terms")}
                                </button>
                                <button
                                    className={`btn me-0 btn-contentt ${content === 3 ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('android app url')}
                                >
                                    {t("android")}
                                </button>
                                <button
                                    className={`btn me-0 btn-contentt ${content === 4 ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('ios app url')}
                                >
                                    {t("ios")}
                                </button>
                                <button
                                    className={`btn me-0 btn-contentt ${content === 5 ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => handleButtonClick('share message')}
                                >
                                    {t("send_message")}
                                </button>
                            </div>
                        </nav>
                        <br />
                        <div className="user-details">
                            {/* About Us Sections */}
                            {content === 0 && renderEditorSection(t("about"), 'about', 'english')}
                            {content === 8 && renderEditorSection("معلومات عنا", 'about', 'arabic')}
                            {content === 11 && renderEditorSection("À PROPOS DE NOUS", 'about', 'french')}
                            {content === 12 && renderEditorSection("CHI SIAMO", 'about', 'italian')}
                            {content === 13 && renderEditorSection("회사 소개", 'about', 'korean')}

                            {/* Privacy Policy Sections */}
                            {content === 1 && renderEditorSection(t("privacy"), 'privacy', 'english')}
                            {content === 9 && renderEditorSection("سياسة الخصوصية", 'privacy', 'arabic')}
                            {content === 15 && renderEditorSection("POLITIQUE DE CONFIDENTIALITÉ", 'privacy', 'french')}
                            {content === 16 && renderEditorSection("POLITICA SULLA RISERVATEZZA", 'privacy', 'italian')}
                            {content === 17 && renderEditorSection("개인정보 보호정책", 'privacy', 'korean')}

                            {/* Terms and Conditions Sections */}
                            {content === 2 && renderEditorSection(t("terms"), 'terms', 'english')}
                            {content === 10 && renderEditorSection("الشروط والأحكام", 'terms', 'arabic')}
                            {content === 18 && renderEditorSection("CONDITIONS D'UTILISATION", 'terms', 'french')}
                            {content === 19 && renderEditorSection("TERMINI DI UTILIZZO", 'terms', 'italian')}
                            {content === 20 && renderEditorSection("이용 약관", 'terms', 'korean')}

                            {/* Simple Input Sections */}
                            {content === 3 && (
                                <div>
                                    <span>{t("android")}</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={contentData.android}
                                        onChange={(e) => handleInputChange('android', e.target.value)}
                                        placeholder={t("android")}
                                    />
                                    <p style={{ color: 'red' }}>{emptyContent}</p><br />
                                    <button
                                        className="btn"
                                        onClick={() => handleBanner('android app url')}
                                        style={{ backgroundColor: '#0F225D', color: 'white' }}
                                    >
                                        {t("update")}
                                    </button>
                                </div>
                            )}

                            {content === 4 && (
                                <div>
                                    <span>{t("ios")}</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={contentData.ios}
                                        onChange={(e) => handleInputChange('ios', e.target.value)}
                                        placeholder={t("ios")}
                                    />
                                    <p style={{ color: 'red' }}>{emptyContent}</p><br />
                                    <button
                                        className="btn"
                                        onClick={() => handleBanner('ios app url')}
                                        style={{ backgroundColor: '#0F225D', color: 'white' }}
                                    >
                                        {t("update")}
                                    </button>
                                </div>
                            )}

                            {content === 5 && (
                                <div>
                                    <span>{t("send_message")}</span>
                                    <textarea
                                        className="form-control"
                                        value={contentData.share}
                                        onChange={(e) => handleInputChange('share', e.target.value)}
                                        placeholder={t("send_message")}
                                        rows="3"
                                    />
                                    <p style={{ color: 'red' }}>{emptyContent}</p><br />
                                    <button
                                        className="btn"
                                        onClick={() => handleBanner('share message')}
                                        style={{ backgroundColor: '#0F225D', color: 'white' }}
                                    >
                                        {t("update")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>


                <Modal show={modalShow} onHide={() => setModalShow(false)} className="custom-modal">
                    <Modal.Header className="border-0">
                        <Modal.Title className="w-100 text-center">
                            {t("update")}
                            <hr className="my-2" style={{ borderTop: '2px solid #007bff', width: '100%' }} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <p className="lead mb-4">{toastMessage}</p>
                    </Modal.Body>
                    <Modal.Footer className="border-0 justify-content-center"></Modal.Footer>
                </Modal>
            </div>
        </PageLayout>
    );
}