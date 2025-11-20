import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../../components/PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../../components/fields/LabelFieldComponent";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import './Table.css';
import 'react-phone-input-2/lib/style.css';
import { SyncLoader } from 'react-spinners'


export default function OwnerTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const navigate = useNavigate();
    const [ownerDetails, setownerDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setuserId] = useState('')
    const [alertModal, setAlertModal] = useState(false);
    const [deleteModel, setdeleteModel] = useState(false);
    const [deleteModel1, setdeleteModel1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setstatus] = useState('')
    const [flag, setflag] = useState('')

    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = ownerDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.f_name?.toLowerCase().includes(lowercasedTerm) ||
            user.l_name?.toLowerCase().includes(lowercasedTerm) ||
            user.email?.toLowerCase().includes(lowercasedTerm) ||
            user.mobile?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchOwnerDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/get_all_owners")
            .then((response) => {
                setownerDetails(response.data.owner_arr || []);
                setLoading(false)

            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };


    useEffect(() => {
        fetchOwnerDetails();
    }, []);

    const handleUserAction = (action, user) => {
        if (action === "active") {
            setstatus('activate');
            setuserId(user.user_id);
            setflag(user.active_flag);
            setAlertModal(true);
        } else if (action === "deactive") {
            setstatus('deactivate');
            setuserId(user.user_id);
            setflag(user.active_flag);
            setAlertModal(true);
        }
        else if (action === 'edit') {
            navigate(APP_PREFIX_PATH + `/edit-owner/${encode(user.user_id)}`)
        }
        else if (action == 'delete') {
            setdeleteModel(true);
            setuserId(user.user_id);
        }
    }

    const OwnerActiveDeactive = () => {
        axios.post(API_URL + '/activate_deactivate_owner', { user_id: userId, flag: flag }).then((res) => {
            if (res.data.success) {
                fetchOwnerDetails();
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // delete owner function
    const deleteOwner = () => {
        if (userId) {
            axios.post(API_URL + '/delete_owner', { user_id: userId }).then((res) => {
                if (res.data.success) {
                    setdeleteModel1(true);
                    setTimeout(() => {
                        setdeleteModel1(false);
                    }, 2000);
                    fetchOwnerDetails();
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }


    return (
        <>

            <Row xs={1} sm={2} xl={4} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        // label={t('search_by')}
                        icon="Search"
                        placeholder={`${t('search_here')}`}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <Link to={APP_PREFIX_PATH + '/add-owner'}>
                        <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }} > <AddIcon className="me-2" /> {t("Add Owner")} </button></Link>
                </Col>
            </Row>





            {loading ? (
                <div className="d-flex align-items-center" style={{ height: '40vh' }}>
                    <SyncLoader animation="border" color="#086861" variant="primary" style={{ marginLeft: '40%' }} />
                </div>
            ) : (
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
                                <th>{t("image")}</th>
                                <th>{t("User Name")}</th>
                                <th>{t("Full Name")}</th>
                                <th>{t("mobile")}</th>
                                <th>{t("email")}</th>
                                <th>{t("status")}</th>
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

                                            <AnchorComponent to={`${APP_PREFIX_PATH}/owner-view/${encode(item.user_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => { handleUserAction('edit', item) }}>edit</ButtonComponent>

                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>

                                            {item.active_flag === 0 ? (
                                                <AnchorComponent
                                                    title="inactive"
                                                    className="material-icons inactive"
                                                    style={{ background: 'rgb(255 223 223)', color: 'red', lineHeight: '15px' }}
                                                    onClick={() => { setAlertModal(true); handleUserAction('active', item) }}
                                                >

                                                    <ToggleOffIcon />
                                                </AnchorComponent>
                                            ) : (
                                                <AnchorComponent
                                                    title="active"
                                                    className="material-icons active"
                                                    style={{ background: '#d4ffd4', color: 'green', lineHeight: '15px' }}
                                                    onClick={() => { setAlertModal(true); handleUserAction('deactive', item) }}
                                                >
                                                    <ToggleOnIcon />
                                                </AnchorComponent>
                                            )}

                                        </div>
                                    </td>
                                    <td title={item.name}>
                                        <div className="mc-table-profile">
                                            <img
                                                src={item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}Placeholder.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <span>{item.f_name || 'NA'}</span>
                                    </td>
                                    <td>
                                        <span>{item.l_name || 'NA'}</span>
                                    </td>
                                    
                                    <td>{item.mobile || 'NA'}</td>
                                    <td>{item.email || 'NA'}</td>
                                    <td  ><p style={{ margin: 'auto', width: '80px', textAlign: 'center' }} className={item.active_flag === 0 ? 'mc-table-badge red' : 'mc-table-badge green'}>{item.active_flag === 0 ? 'Deactive' : 'Active'}
                                    </p>
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


                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>Are you sure!</h3>
                            <p>Want to {status} this owner?</p>
                            <Modal.Footer>
                                <ButtonComponent
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setAlertModal(false)}
                                >
                                    {t('close')}
                                </ButtonComponent>
                                <ButtonComponent
                                    type="button"
                                    className={`btn ${status === 'activate' ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => {
                                        setAlertModal(false);
                                        OwnerActiveDeactive();
                                    }}
                                >
                                    {t('Ok')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={deleteModel} onHide={() => setdeleteModel(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>Are you sure!</h3>
                            <p>Want to delete this owner?</p>
                            <Modal.Footer>
                                <ButtonComponent
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setdeleteModel(false)}
                                >
                                    {t('close')}
                                </ButtonComponent>
                                <ButtonComponent
                                    type="button"
                                    className={`btn ${status === 'activate' ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => {
                                        setdeleteModel(false);
                                        deleteOwner();
                                    }}
                                >
                                    {t('Ok')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={deleteModel1} onHide={() => setdeleteModel1(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                            <h3>{t("success")}</h3><br />
                            <p>{t("Owner Deleted Successfully.")}</p>
                            <Modal.Footer>

                            </Modal.Footer>
                        </div>
                    </Modal>

                </div >
            )}
        </>
    );
}
