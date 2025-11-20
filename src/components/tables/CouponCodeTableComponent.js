import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent } from "../elements";
import axios from "axios";
import { API_URL} from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import AddIcon from '@mui/icons-material/Add';


export default function CouponCodeTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [role, setRole] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertModal, setAlertModal] = useState(false);
    const [DeleteId, setDeleteId] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [coupon_id, setCouponId] = useState("");
    const [dateError, setDateError] = useState("");

    const [successAddCouponModel, setsuccessAddCouponModel] = useState(false);
    const [successEditCouponModel, setsuccessEditCouponModel] = useState(false);

    const [addModel, setAddModel] = useState(false);
    const [couponCode, setCouponCode] = useState("");

    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = role.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.coupon_code?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;

        if (start_date && selectedEndDate < start_date) {
            setDateError("End Date cannot be before Start Date.");
        } else {
            setDateError("");
        }

        setEndDate(selectedEndDate);
    };


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchServiceDetails = () => {
        axios.get(API_URL + "/fetch_all_Coupon")
            .then((response) => {
                setRole(response.data.role_arr || []);
                // console.log(response.data.service_arr);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchServiceDetails();
    }, []);


    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Converts 01-03-2025 to 2025-03-01
    };

    const handleUserAction = (action, item) => {
        console.log('item : ', item);

        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(item.coupon_id);
        }
        if (action === 'edit') {

            setStartDate(formatDate(item.start_date));
            setEndDate(formatDate(item.end_date));
            setCouponCode(item.coupon_code);
            setCouponId(item.coupon_id);
            setEditModal(true);
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = () => {
        axios.post(API_URL + '/delete_coupon_code', { coupon_id: DeleteId }).then((res) => {
            if (res.data.success) {
                setsuccessModel(true);
                fetchServiceDetails();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        })
    }


    const generateCouponCode = (length = 8) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let coupon = '';
        for (let i = 0; i < length; i++) {
            coupon += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return coupon;
    };


    const handleAddCoupon1 = () => {

        const newCode = generateCouponCode();
        setCouponCode(newCode);
        console.log("Generated Coupon Code:", newCode);

    };

    const handleAddCoupon = () => {

        axios.post(API_URL + '/add_coupon_code', { coupon_code: couponCode, start_date: start_date, end_date: end_date }).then((res) => {
            if (res.data.success) {
                setsuccessAddCouponModel(true);
                fetchServiceDetails();
                setStartDate("");
                setEndDate("");
                setTimeout(() => {
                    setsuccessAddCouponModel(false);
                }, 2000);
            }
        })

    };

    const handleEditCoupon = () => {

        axios.post(API_URL + '/edit_coupon_code', { coupon_code: couponCode, start_date: start_date, end_date: end_date, coupon_id: coupon_id }).then((res) => {
            if (res.data.success) {
                setsuccessEditCouponModel(true);
                fetchServiceDetails();
                setStartDate("");
                setEndDate("");
                setTimeout(() => {
                    setsuccessEditCouponModel(false);
                }, 2000);
            }
        })

    };

    return (
        <>

            <Row xs={1} sm={2} xl={4} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        icon="Search"
                        placeholder={`${t('search_here')}`}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    {/* <Link to={APP_PREFIX_PATH + '/add-role'}> */}
                    <button
                        onClick={() => { setAddModel(true); setCouponCode("") }}
                        style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }}   > <AddIcon className="me-2" /> {t("Add Coupon Code")}
                    </button>
                    {/* </Link> */}
                </Col>
            </Row>

            <div className="mc-table-responsive">
                <table className="mc-table">
                    <thead className="mc-table-head primary">
                        <tr>
                            <th>
                                <div className="mc-table-check">
                                    <p>{t("sno")}</p>
                                </div>
                            </th>
                            <th>{t("actions")}</th>
                            <th>{t("Coupon Code")}</th>
                            <th>{t("Start Date")}</th>
                            <th>{t("End Date")}</th>
                            <th>{t("Status")}</th>
                            <th>{t("createtime")}</th>
                        </tr>
                    </thead>
                    <tbody className="mc-table-body even">
                        {currentUsers?.map((item, index) => (
                            <tr key={index}>
                                <td title="id">
                                    <div className="mc-table-check">
                                        <p>{indexOfFirstEntry + index + 1}</p>
                                    </div>
                                </td>

                                <td>
                                    <div className="mc-table-action">
                                        <ButtonComponent
                                            type="button"
                                            className="material-icons edit"
                                            onClick={() => handleUserAction('edit', item)}
                                        >
                                            edit
                                        </ButtonComponent>

                                        <ButtonComponent
                                            type="button"
                                            className="material-icons delete"
                                            onClick={() => handleUserAction('delete', item)}
                                        >
                                            delete
                                        </ButtonComponent>
                                    </div>
                                </td>

                                <td>
                                    <span>{item.coupon_code || 'NA'}</span>
                                </td>
                                <td>
                                    <span>{item.start_date || 'NA'}</span>
                                </td>

                                <td>
                                    <span>{item.end_date || 'NA'}</span>
                                </td>

                                <td>
                                    <span>{item.status_lable || 'NA'}</span>
                                </td>

                                <td>{item.createtime || 'NA'}</td>
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

                <Modal show={successModel} onHide={() => setsuccessModel(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                        <h3>{t('success')}</h3><br />
                        <p>{t('Coupon Code deleted successfully.')}</p>
                        <Modal.Footer>

                        </Modal.Footer>
                    </div>
                </Modal>

                <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <h3>{t("Delete Confirmation")}</h3>
                        <p>{t("Are you sure, you want to delete this Coupon Code?")}</p>
                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete() }}>{t('delete')}</ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal >



                {/* <Modal show={addModel} onHide={() => setAddModel(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <h3>{t("Generate Coupon Code")}</h3>
                        <p>{t("Coupon Code:")} <strong>{couponCode}</strong></p>

                        <ButtonComponent type="button" className="btn btn-primary" onClick={() => { handleAddCoupon1(); }}>{t('Generate')}</ButtonComponent>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Start Date")}</Form.Label>
                            <Form.Control type="date" value={start_date} onChange={(e) => { setStartDate(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("End Date")}</Form.Label>
                            <Form.Control type="date" value={end_date} onChange={(e) => { setEndDate(e.target.value) }} />
                        </Form.Group>
                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAddModel(false)}>{t('close')}</ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-success" onClick={() => { setAddModel(false); handleAddCoupon(); }}>{t('Add')}</ButtonComponent>

                        </Modal.Footer>
                    </div>
                </Modal> */}

                <Modal show={addModel} onHide={() => {
                    setAddModel(false); setStartDate("");
                    setEndDate("");
                }}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <h3>{t("Generate Coupon Code")}</h3>
                        <p>{t("Coupon Code:")} <strong>{couponCode}</strong></p>

                        <ButtonComponent type="button" className="btn btn-primary" onClick={() => { handleAddCoupon1(); }}>
                            {t('Generate')}
                        </ButtonComponent>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Start Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={start_date}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setEndDate("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("End Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={end_date}
                                min={start_date}
                                onChange={(e) => { setEndDate(e.target.value) }}
                                disabled={!start_date}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => {
                                setAddModel(false); setStartDate("");
                                setEndDate("");
                            }}>
                                {t('close')}
                            </ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-success"
                                onClick={() => { setAddModel(false); handleAddCoupon(); }}
                                disabled={!start_date || !end_date || !couponCode}
                            >
                                {t('Add')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal>

                {/* <Modal show={editModal} onHide={() => {
                    setEditModal(false); setStartDate("");
                    setEndDate("");
                }}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Coupon Code")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={couponCode}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Start Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={start_date}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("End Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={end_date}
                                min={start_date}
                                onChange={(e) => { setEndDate(e.target.value) }}
                                disabled={!start_date}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => {
                                setEditModal(false); setStartDate("");
                                setEndDate("");
                            }}>
                                {t('close')}
                            </ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-success"
                                onClick={() => { setEditModal(false); handleEditCoupon(); }}
                                disabled={!start_date || !end_date || !couponCode}
                            >
                                {t('Edit')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal> */}



                <Modal show={editModal} onHide={() => {
                    setEditModal(false);
                    setStartDate("");
                    setEndDate("");
                    setDateError("");
                }}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Coupon Code")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={couponCode}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Start Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={start_date}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setEndDate(""); // Reset end date when start date changes
                                    setDateError(""); // Reset validation message
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("End Date")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={end_date}
                                min={start_date} // Prevent selecting a past date
                                onChange={handleEndDateChange}
                                disabled={!start_date}
                            />
                            {dateError && <small className="text-danger">{dateError}</small>}
                        </Form.Group>

                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => {
                                setEditModal(false);
                                setStartDate("");
                                setEndDate("");
                                setDateError("");
                            }}>
                                {t('close')}
                            </ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-success"
                                onClick={() => { setEditModal(false); handleEditCoupon(); }}
                                disabled={!start_date || !end_date || dateError}
                            >
                                {t('Edit')}
                            </ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal>

                <Modal show={successAddCouponModel} onHide={() => setsuccessAddCouponModel(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                        <h3>{t('success')}</h3><br />
                        <p>{t('Coupon Code Created successfully.')}</p>
                        <Modal.Footer>

                        </Modal.Footer>
                    </div>
                </Modal>


                <Modal show={successEditCouponModel} onHide={() => setsuccessEditCouponModel(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                        <h3>{t('success')}</h3><br />
                        <p>{t('Coupon Code Updated successfully.')}</p>
                        <Modal.Footer>

                        </Modal.Footer>
                    </div>
                </Modal>




            </div >
        </>
    );
}