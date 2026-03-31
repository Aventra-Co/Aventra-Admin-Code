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


export default function DeletedUserTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
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
            user.name?.toLowerCase().includes(lowercasedTerm) ||
            user.email?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchUserDetails = () => {

        axios.get(API_URL + "/fetch_deleted_users")
            .then((response) => {
                setUserDetails(response.data.user_arr || []);
                console.log(response.data.user_arr || []);
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
                active_flag === 1 ? 'you want to deactivate this account?' : 'you want to activate this account?'
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
                        icon="Search"
                        placeholder={`${t('search_here')}`}
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
                            <th>
                                <div className="mc-table-check">
                                    <p>{t("sno")}</p>
                                </div>
                            </th>
                            <th>{t("actions")}</th>
                            <th>{t("image")}</th>
                            <th>{t("name")}</th>
                            <th>{t("email")}</th>
                            <th>{t("delete_reason")}</th>
                            {/* <th>{t("status")}</th> */}
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
                                        <AnchorComponent
                                            to={`${APP_PREFIX_PATH}/user-profile/${encode(item.user_id)}?sidebar=deleted-users`}
                                            title="View"
                                            className="material-icons view"
                                        >
                                            visibility
                                        </AnchorComponent>
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
                                <td>{item.email || 'NA'}</td>
                                <td>{item.delete_reason || 'NA'}</td>
                                {/* <td>
                                    {item.active_flag === 1 ? (
                                        <p className="mc-table-badge green" style={{ width: '80px', textAlign: 'center' }}>Activate</p>
                                    ) : (
                                        <p className="mc-table-badge red">Deactivate</p>
                                    )}
                                </td> */}
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
        </>
    );
}
