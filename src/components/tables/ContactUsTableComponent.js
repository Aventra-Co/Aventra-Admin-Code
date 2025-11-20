import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import { API_URL } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import './ContactUsTableComponent.css';
import ReplyIcon from '@mui/icons-material/Reply';

export default function ContactUsTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [ContactUs, setContactUs] = useState([]);
    const [alertModal, setAlertModal] = useState(false);
    const [Messages, setMessages] = useState('');
    const [query, setquery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');



    const filteredUsers = ContactUs.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const statusText = user.status === 1 ? 'replied' : 'pending';

        return (
            user.name?.toLowerCase().includes(lowercasedTerm) ||
            user.email?.toLowerCase().includes(lowercasedTerm) ||
            user.message?.toLowerCase().includes(lowercasedTerm) ||
            user.reply_datetime?.toLowerCase().includes(lowercasedTerm) ||
            statusText.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchServiceDetails = () => {
        axios.get(API_URL + "/get_contact_us_details")
            .then((response) => {
                setContactUs(response.data.contact_us_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    const handleActionChnage = (action, item) => {
        if (action === 'view') {
            fetchMessages(item.contact_id);
            setquery(item.message)
            setAlertModal(true);
        }
        if (action === 'reply') {
            setSelectedUser(item);
            setShowModal(true);
            setName(item.name);
            setEmail(item.email);
            setError('');
        }

    };


    const closeModal = () => {
        setShowModal(false);

    };

    const fetchMessages = (contact_id) => {
        axios
            .post(API_URL + '/get_contact_us_reply', { contact_id })
            .then((response) => {
                if (response.data.success) {

                    setMessages(response.data.reply_arr[0]?.reply || 'No reply available');

                } else {
                    console.error('Failed to fetch messages:', response.data.msg);
                }
            })
            .catch((error) => {
                console.log('Error fetching messages:', error);
            });
    };

    useEffect(() => {
        fetchServiceDetails();
    }, []);

    const sendReplyEmail = () => {
        if (!name || !email || !message) {
            setError(t("all_field_required"));
            return;
        }
        setShowModal(false);

        if (selectedUser && selectedUser.email) {
            const { contact_id } = selectedUser;
            const email = selectedUser.email
            axios
                .post(API_URL + '/send_reply', { contact_id, reply: message, email })
                .then((response) => {
                    if (response.data.success) {

                        fetchServiceDetails();
                        setShowModal(false);
                        setError('');

                    } else {
                        console.log('Failed to send email:', response.data.msg);
                    }
                })
                .catch((error) => {
                    console.log('Error sending email:', error);
                });
        } else {
            console.log("No user selected or user's email is invalid");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const formatDate = (date) => {
        const padTo2Digits = (num) => num.toString().padStart(2, '0');
        const formattedDate = new Date(date);
        const day = padTo2Digits(formattedDate.getDate());
        const month = padTo2Digits(formattedDate.getMonth() + 1);
        const year = formattedDate.getFullYear();
        let hours = formattedDate.getHours();
        const minutes = padTo2Digits(formattedDate.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = padTo2Digits(hours);

        return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
    };

    return (
        <>
            <Row xs={1} sm={2} xl={4} className="d-flex justify-content-between align-items-center">
                <Col>
                    <LabelFieldComponent
                        type="search"
                        // label={t('search_by')}
                        icon="Search"
                        placeholder={t('search_here')}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>

            <div className="mc-table-responsive">
                <table className="mc-table">
                    <thead className="mc-table-head primary">
                        <tr>
                            <th><div className="mc-table-check"><p>{t("sno")}</p></div></th>
                            <th>{t("actions")}</th>
                            <th>{t("name")}</th>
                            <th>{t("email")}</th>
                            <th>{t("messages")}</th>
                            <th>{t("status")}</th>
                            <th>{t("reply_date_time")}</th>
                        </tr>
                    </thead>
                    <tbody className="mc-table-body even">
                        {currentUsers.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="mc-table-check"><p>{indexOfFirstEntry + index + 1}</p></div>
                                </td>
                                <td>
                                    <div className="mc-table-action">
                                        <AnchorComponent
                                            onClick={() => handleActionChnage('view', item)}
                                            title="View"
                                            className="material-icons view"
                                        >
                                            visibility
                                        </AnchorComponent>

                                        <AnchorComponent
                                            title="inactive"
                                            onClick={() => handleActionChnage('reply', item)}
                                            className="material-icons inactive"
                                            style={{ background: '#d4ffd4', color: 'green', lineHeight: '13px' }}
                                        >
                                            <ReplyIcon style={{ width: '20px' }} />
                                        </AnchorComponent>
                                    </div>
                                </td>
                                <td>{item.name || 'NA'}</td>
                                <td>{item.email || 'NA'}</td>
                                <td>{item.message || 'NA'}</td>
                                <td>
                                    {item.status === 0
                                        ? <span className="status-pending">Pending</span>
                                        : <span className="status-replied">Replied</span>}
                                </td>
                                <td>{formatDate(item.reply_datetime)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <PaginationComponent
                    totalEntries={filteredUsers.length}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />

                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header>
                        <Modal.Title>{t("reply_message")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("name")}</Form.Label>
                                <Form.Control type="text" value={name} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("email")}</Form.Label>
                                <Form.Control type="email" value={email} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("messages")}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder={t("please_enter_msg")}
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                        {error && <span style={{ color: 'red' }}>{error}</span>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            {t("close")}
                        </Button>
                        <Button variant="primary" onClick={sendReplyEmail}>
                            {t("reply")}
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Alert Modal */}
                <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">mail_outline</i>
                        <h4>{t('messages')}</h4><br />
                        <p><strong>Message:</strong> {query}</p>
                        <p><strong>Reply:</strong> {Messages}</p>
                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>
                                {t('close_popup')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
        </>
    );
}
