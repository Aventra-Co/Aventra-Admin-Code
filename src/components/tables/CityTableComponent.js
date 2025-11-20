import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent } from "../elements";
import axios from "axios";
import { API_URL } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import AddIcon from '@mui/icons-material/Add';
import CityImage from '../../assets/img/city.webp';
import { SyncLoader } from 'react-spinners'


export default function CityTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [CityDetails, setCityDetails] = useState([]);
    const [CountryDetails, setCountryDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cityId, setcityId] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [AddModal, setAddModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [successModel, setsuccessModel] = useState(false);
    const [msg, setmsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [countryName, setcountryName] = useState('');
    const [cityName, setcityName] = useState('');
    const [cityNameArabic, setcityNameArabic] = useState('');
    const [editcountryName, seteditcountryName] = useState("");
    const [editcityName, seteditcityName] = useState("");
    const [editcityNameArabic, seteditcityNameArabic] = useState("");
    const [countryError, setcountryError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = CityDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.city_name?.toLowerCase().includes(lowercasedTerm) ||
            user.country_name?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchCityDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_city_list")
            .then((response) => {
                setCityDetails(response.data.city_arr || []);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    const fetchCountryDetails = () => {

        axios.get(API_URL + "/fetch_coutry_list")
            .then((response) => {
                setCountryDetails(response.data.country_arr || []);

            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };


    useEffect(() => {
        fetchCityDetails();
        fetchCountryDetails();
    }, []);

    const handleUserAction = (action, item) => {

        if (action === 'edit') {
            setEditModal(true);
            setcityId(item.city_id);
            seteditcountryName(item.country_id);
            seteditcityName(item.city_name);
            seteditcityNameArabic(item.city_name_arabic);
        }
        else if (action === 'delete') {
            setAlertModal(true);
            setcityId(item.city_id);
        }
    }

    const CityDelete = () => {
        axios.post(API_URL + '/delete_city', { city_id: cityId }).then((res) => {
            if (res.data.success) {
                setmsg(res.data.msg);
                setAlertModal(false)
                setsuccessModel(true);
                fetchCityDetails();
                setTimeout(() => {
                    setsuccessModel(false);
                }, 2000);
            }

        }).catch((error) => {
            console.log(error);

        })
    }

    const handleEditCity = () => {
        let error = {}
        if (!editcountryName || editcountryName == '' || editcountryName == null) {
            error.editcountryName = "Please select country name"
        }
        if (!editcityName) {
            error.editcityName = "Please enter city name"
        }
        if (!editcityNameArabic) {
            error.editcityNameArabic = "Please enter city name arabic"
        }
        if (Object.keys(error).length > 0) {
            setcountryError(error)
            return
        }

        const formData = new FormData();
        formData.append('city_id', cityId)
        formData.append('country_id', editcountryName)
        formData.append('city_name', editcityName)
        formData.append('city_name_arabic', editcityNameArabic)

        axios.post(API_URL + '/edit_city', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key == 'exist') {
                let updatedErrors = { ...error };
                updatedErrors.editcityName = 'City name already exist.';
                setcountryError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            fetchCityDetails();
            setEditModal(false);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);



        })
            .catch(error => {

                console.error('Error updating clinic:', error);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    const handleAddCity = () => {
        let error = {}
        if (!countryName || countryName == '' || countryName == null) {
            error.countryName = "Please select country name"
        }
        if (!cityName) {
            error.cityName = "Please enter city name"
        }
        if (!cityNameArabic) {
            error.cityNameArabic = "Please enter city name arabic"
        }
        if (Object.keys(error).length > 0) {
            setcountryError(error)
            return
        }



        const formData = new FormData();
        formData.append('country_id', countryName)
        formData.append('city_name', cityName)
        formData.append('city_name_arabic', cityNameArabic)

        axios.post(API_URL + '/add_city', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.key === 'exist') {
                let updatedErrors = { ...error };
                updatedErrors.cityName = 'City name already exist.';
                setcountryError(updatedErrors);
                return;
            }
            setmsg(response.data.msg)
            setcountryName('')
            setcityName('')
            fetchCityDetails();
            setAddModal(false);
            setsuccessModel(true);
            setTimeout(() => {
                setsuccessModel(false);
            }, 2000);



        })
            .catch(error => {

                console.error('Error updating clinic:', error);
            });
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
                    <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }} onClick={() => setAddModal(true)} > <AddIcon className="me-2" /> {t("Add City")} </button>
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
                                <th>{t("Country name")}</th>
                                <th>{t("City name")}</th>
                                <th>{t("City name arabic")}</th>
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

                                            {/* <AnchorComponent to={`${APP_PREFIX_PATH}/doctor-view/${encode(item.doctor_id)}`} title="View" className="material-icons view">visibility</AnchorComponent> */}
                                            <ButtonComponent title="Edit" className="material-icons edit" onClick={() => { handleUserAction('edit', item) }}>edit</ButtonComponent>
                                            {/* <ButtonComponent title="Block" className="material-icons block" onClick={() => handleUserAction('block', item.user_id, item.active_flag)}>block</ButtonComponent> */}
                                            <ButtonComponent type="button" className="material-icons delete" onClick={() => handleUserAction('delete', item)}>delete</ButtonComponent>
                                        </div>
                                    </td>
                                    <td><span>{item.country_name || 'NA'}</span></td>
                                    <td><span>{item.city_name || 'NA'}</span></td>
                                    <td><span>{item.city_name_arabic || 'NA'}</span></td>
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

                    <Modal show={editModal} onHide={() => setEditModal(false)}>
                        <div className="mc-user-modal">
                            <img
                                src={CityImage}
                                alt="Profile"
                            />
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Country')}</Form.Label>
                                <Form.Select
                                    value={editcountryName}
                                    onChange={(e) => {
                                        seteditcountryName(e.target.value);
                                        setcountryError((prev) => ({ ...prev, editcountryName: "" }));
                                    }}
                                    className={`form-select`}
                                    isInvalid={!!countryError.editcountryName}
                                >
                                    <option value="" disabled>{t('Select country name')}</option>
                                    {CountryDetails.map((country) => (
                                        <option key={country.country_id} value={country.country_id}>
                                            {country.country_name}
                                        </option>
                                    ))}

                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {countryError.editcountryName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('City')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter city name')}
                                    maxLength={25}
                                    value={editcityName}
                                    onChange={(e) => {
                                        seteditcityName(e.target.value)
                                        setcountryError((prev) => ({ ...prev, editcityName: "" }));
                                    }}
                                    isInvalid={!!countryError.editcityName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {countryError.editcityName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('City Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter city name arabic')}
                                    maxLength={25}
                                    value={editcityNameArabic}
                                    onChange={(e) => {
                                        seteditcityNameArabic(e.target.value)
                                        setcountryError((prev) => ({ ...prev, editcityNameArabic: "" }));
                                    }}
                                    isInvalid={!!countryError.editcityNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {countryError.editcityNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setEditModal(false); setcountryError('') }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleEditCity}>
                                    {t('update')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >

                    <Modal show={AddModal} onHide={() => setAddModal(false)} backdrop="static">
                        <div className="mc-user-modal">
                            <img
                                src={CityImage}
                                alt="Profile"
                            />
                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('Country')}</Form.Label>
                                <Form.Select
                                    value={countryName}
                                    onChange={(e) => {
                                        setcountryName(e.target.value);
                                        setcountryError((prev) => ({ ...prev, countryName: "" }));
                                    }}
                                    className={`form-select`}
                                    isInvalid={!!countryError.countryName}
                                >
                                    <option value="" disabled>{t('Select country name')}</option>
                                    {CountryDetails.map((country) => (
                                        <option key={country.country_id} value={country.country_id}>
                                            {country.country_name}
                                        </option>
                                    ))}

                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {countryError.countryName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('City')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter city name')}
                                    maxLength={25}
                                    value={cityName}
                                    onChange={(e) => {
                                        setcityName(e.target.value)
                                        setcountryError((prev) => ({ ...prev, cityName: "" }));
                                    }}
                                    isInvalid={!!countryError.cityName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {countryError.cityName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group mb-4 ml-2">
                                <Form.Label>{t('City Arabic')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('Enter city name arabic')}
                                    maxLength={25}
                                    value={cityNameArabic}
                                    onChange={(e) => {
                                        setcityNameArabic(e.target.value)
                                        setcountryError((prev) => ({ ...prev, cityNameArabic: "" }));
                                    }}
                                    isInvalid={!!countryError.cityNameArabic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {countryError.cityNameArabic}
                                </Form.Control.Feedback>
                            </Form.Group>


                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => { setAddModal(false); setcountryError(''); setcountryName(''); setcityName('') }}>
                                    {t('close_popup')}
                                </ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-success" onClick={handleAddCity}>
                                    {t('add')}
                                </ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >

                    <Modal show={successModel} onHide={() => setsuccessModel(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                            <h3>{t('success')}</h3><br />
                            <p>{msg}</p>
                            <Modal.Footer>

                            </Modal.Footer>
                        </div>
                    </Modal>

                    <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                        <div className="mc-alert-modal">
                            <i className="material-icons">new_releases</i>
                            <h3>{t("delete city")}</h3>
                            <p>{t("Are you sure, you want to delete this city?")}</p>
                            <Modal.Footer>
                                <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAlertModal(false)}>{t('close')}</ButtonComponent>
                                <ButtonComponent type="button" className="btn btn-danger" onClick={() => { setAlertModal(false); CityDelete(); }}>{t('delete')}</ButtonComponent>
                            </Modal.Footer>
                        </div>
                    </Modal >
                </div >
            )}
        </>
    );
}
