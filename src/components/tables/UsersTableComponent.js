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
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { SyncLoader } from "react-spinners";

export default function UsersTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [blockModal, setBlockModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activatedeactivate, setactivatedeactivate] = useState('');
    const [ModelDescription, setModelDescription] = useState('');

    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = userDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.name?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.email?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.mobile?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toString().toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchUserDetails = () => {

        setLoading(true)
        axios.get(API_URL + "/get_manage_users")
            .then((response) => {
                if (response.data.success) {
                    setLoading(false)
                    setUserDetails(response.data.user_arr || [])
                };
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleUserAction = (action, user_id, active_flag) => {
        if (action === "block") {
            setactivatedeactivate(user_id);
            setModelDescription(
                active_flag === 1 ? (t("deactivate_acc")) : (t("activate_acc"))
            );
            setBlockModal(true);
        }
    }

    const ActivateDeactivate = () => {
        axios.post(API_URL + '/activate_deactivate_user', { user_id: activatedeactivate }).then((res) => {

            if (res.data.success) {
                fetchUserDetails();
            }


        }).catch((error) => {
            console.log(error);

        })
    }


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>

            <Row xs={1} sm={2} xl={4}>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        // label={t('search_by')}
                        placeholder={`${t('search here')}`}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                        value={searchTerm}
                        onChange={handleSearch}
                        icon="Search"
                    />
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
                                <th>{t("name")}</th>
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

                                            <AnchorComponent to={`${APP_PREFIX_PATH}/user-profile/${encode(item.user_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                                            {/* <ButtonComponent title="Edit" className="material-icons edit" onClick={() => setEditModal(true, setUserData(item))}>edit</ButtonComponent> */}
                                            {/* <ButtonComponent title="Block" className="material-icons block" onClick={() => handleUserAction('block', item.user_id, item.active_flag)}>block</ButtonComponent> */}

                                            {item.active_flag === 0 ? (
                                                <AnchorComponent
                                                    title="inactive"
                                                    className="material-icons inactive"
                                                    style={{ background: 'rgb(255 223 223)', color: 'red', lineHeight: '15px' }}
                                                    onClick={() => { handleUserAction('block', item.user_id, item.active_flag) }}
                                                >
                                                    <ToggleOffIcon />

                                                </AnchorComponent>
                                            ) : (
                                                <AnchorComponent
                                                    title="active"
                                                    className="material-icons active"
                                                    style={{ background: '#d4ffd4', color: 'green', lineHeight: '15px' }}
                                                    onClick={() => { handleUserAction('block', item.user_id, item.active_flag) }}
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
                                        <span>{item.name || 'NA'}</span>
                                    </td>
                                    {/* <td>+965 {item.mobile || 'NA'}</td> */}
                                    <td> {item.mobile != 0 ? "+965 " + item.mobile : "NA"}</td>
                                    <td>{item.email || 'NA'}</td>
                                    <td>
                                        {item.active_flag === 1 ? (
                                            <p className="mc-table-badge green" style={{ width: '80px', textAlign: 'center' }}>Active</p>
                                        ) : (
                                            <p className="mc-table-badge red">Deactive</p>
                                        )}
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




                    <Modal show={blockModal} onHide={() => setBlockModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>are your sure!</h3>
                            <p>{ModelDescription}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setBlockModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setBlockModal(false); ActivateDeactivate() }}>{t('Ok')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal>
                </div>
            )}
        </>
    );
}
