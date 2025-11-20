import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import Select from 'react-select';
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import categoryImage from '../../assets/img/category.webp';
import './TripTableComponenet.css';
import { SyncLoader } from "react-spinners";


export default function ActivityTableComponent({ thead, tbody }) {
    
    var navigate = useNavigate();
    const { t } = useContext(TranslatorContext);
    const [activityDetails, setactivityDetails] = useState([]);
    const [DeleteId, setDeleteId] = useState('');
    const [loading, setLoading] = useState(false);

    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = activityDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.activity_english?.toLowerCase().includes(lowercasedTerm) ||
            user.activity_arabic?.toLowerCase().includes(lowercasedTerm) ||
            user.activity_french?.toLowerCase().includes(lowercasedTerm) ||
            user.activity_italian?.toLowerCase().includes(lowercasedTerm) ||
            user.activity_korean?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchActivity = () => {
        setLoading(true);
        axios.get(API_URL + "/fetch_activity_details")
            .then((response) => {
                setactivityDetails(response.data.activity_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };









    useEffect(() => {
        fetchActivity();
    }, []);

    const handleUserAction = (action, item) => {
        console.log('item',item);
        if (action === 'delete') {
            setAlertModal(true);
            setDeleteId(item.activity_id);

        }
        if(action === 'edit'){
        //    <Link to={APP_PREFIX_PATH + `/edit-activity/${encode(item.activity_id)}`}>
        //    <ButtonComponent title="Edit" className="material-icons edit">edit</ButtonComponent></Link>
             navigate(APP_PREFIX_PATH + `/edit-activity/${encode(item.activity_id)}` )
        }
    }

    const DeleteEquipment = () => {
        if (DeleteId) {
            axios.post(API_URL + '/delete_activity', { activity_id: DeleteId }).then((res) => {
                if (res.data.success) {
                    setsuccessModel(true);
                    setTimeout(() => {
                        fetchActivity();
                        setsuccessModel(false);
                    }, 2000);
                }
            }).catch((error) => {
                console.log(error);

            })
        }
    }



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };



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
                    <Link to={APP_PREFIX_PATH + '/add-activity'}>
                        <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }}> <AddIcon className="me-2" /> {t("Add Equipment")} </button></Link>
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
                                <th>{t("Activity English")}</th>
                                <th>{t("Activity Arabic")}</th>
                                <th>{t("Activity French")}</th>
                                <th>{t("Activity Italian")}</th>
                                <th>{t("Activity Korean")}</th>
                                <th>{t("CREATE DATE & TIME")}</th>
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
                                    <td title={item.activity_english}>
                                        <div className="mc-table-profile">
                                            <img
                                                src={item.activity_image ? `${IMAGE_PATH}${item.activity_image}` : `${IMAGE_PATH}scuba.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </td>
                                    <td>{item.activity_english || 'NA'}</td>
                                    <td>{item.activity_arabic || 'NA'}</td>
                                    <td>{item.activity_french || 'NA'}</td>
                                    <td>{item.activity_italian || 'NA'}</td>
                                    <td>{item.activity_korean || 'NA'}</td>
                                    <td>{item.createtime || 'NA'}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table >


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
                            <p>Activity deleted successfully.</p>
                            <Modal.Footer>

                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>are your sure!</h3>
                            <p>Want to delete this water activity?</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); DeleteEquipment(); }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}