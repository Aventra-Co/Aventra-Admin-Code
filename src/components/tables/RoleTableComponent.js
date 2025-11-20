import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal } from "react-bootstrap";
import { ButtonComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { SyncLoader } from 'react-spinners'


export default function RoleTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [role, setRole] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertModal, setAlertModal] = useState(false);
    const [DeleteId, setDeleteId] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    var navigate = useNavigate();

    const filteredUsers = role.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.role_english?.toLowerCase().includes(lowercasedTerm) ||
            user.role_arabic?.toLowerCase().includes(lowercasedTerm) ||
            // user.role_french?.toLowerCase().includes(lowercasedTerm) ||
            // user.role_italian?.toLowerCase().includes(lowercasedTerm) ||
            // user.role_korean?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchServiceDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_all_role")
            .then((response) => {
                setRole(response.data.role_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchServiceDetails();
    }, []);

    const handleUserAction = (action, item) => {
        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(item.role_id);
        }
        if(action === 'edit') {
            navigate(APP_PREFIX_PATH + `/edit-role/${encode(item.role_id)}`)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = () => {
        axios.post(API_URL + '/delete_role', { role_id: DeleteId }).then((res) => {
            if (res.data.success) {
                setsuccessModel(true);
                fetchServiceDetails();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }
        })
    }


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
                    <Link to={APP_PREFIX_PATH + '/add-role'}>
                        <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }}> <AddIcon className="me-2" /> {t("Add Role")} </button></Link>
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
                            <th>{t("role english")}</th>
                            <th>{t("role arabic")}</th>
                            {/* <th>{t("role french")}</th>
                            <th>{t("role italian")}</th>
                            <th>{t("role korean")}</th> */}
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
                                       
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => handleUserAction('edit', item)}>edit</ButtonComponent>

                                        <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>
                                    </div>
                                </td>
                                <td>
                                    <span>{item.role_english || 'NA'}</span> 
                                </td>
                                <td><span>{item.role_arabic || 'NA'}</span></td>
                                {/* <td><span>{item.role_french || 'NA'}</span></td>
                                <td><span>{item.role_italian || 'NA'}</span></td>
                                <td><span>{item.role_korean || 'NA'}</span></td> */}

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
                        <p>{t('Role deleted successfully.')}</p>
                        <Modal.Footer>

                        </Modal.Footer>
                    </div>
                </Modal>

                <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                    <div className="mc-alert-modal">
                        <i className="material-icons">new_releases</i>
                        <h3>{t("Delete Confirmation")}</h3>
                        <p>{t("Are you sure, you want to delete this role?")}</p>
                        <Modal.Footer>
                            <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                            <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); handleDelete() }}>{t('delete')}</ButtonComponent>
                        </Modal.Footer>
                    </div>
                </Modal >
            </div >
            )}
        </>
    );
}
