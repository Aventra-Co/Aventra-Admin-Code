/* eslint-disable no-undef */
import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnchorComponent } from "../elements";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import './Table.css';
import axios from "axios";


export default function StaffTableComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [staffDetails, setStaffDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = staffDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.owner_name?.toLowerCase().includes(lowercasedTerm) ||
            user.name?.toLowerCase().includes(lowercasedTerm) ||
            user.email?.toLowerCase().includes(lowercasedTerm) ||
            user.mobile?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.clinic_name?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });



    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    console.log('currentUsers', currentUsers);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);


    const fetchAllStaff = () => {
        axios.get(API_URL + '/fetch_all_staff').then((response) => {
            if (response.data.success) {
                setStaffDetails(response.data.staff_arr)
                console.log(response.data);

            }
        }).catch((error) => {
            console.log(error);

        })
    }


    useEffect(() => {
        fetchAllStaff()
    }, []);



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
                {/* <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <button style={{ background: '#2b77e5', padding: '7px 13px', color: '#fff', borderRadius: '5px' }} onClick={() => setAddModal(true)} > <AddIcon className="me-2" /> {t("add_doctor")} </button>
                </Col> */}
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
                            <th>{t("owner name")}</th>
                            <th>{t("User Name")}</th>
                            <th>{t("Full Name")}</th>
                            {/* <th>{t("mobile")}</th> */}
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

                                        <AnchorComponent to={`${APP_PREFIX_PATH}/view-staff/${encode(item.user_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                                    </div>
                                </td>
                                <td title={item.name}>
                                    <div className="mc-table-profile">
                                        <img
                                            src={item.image ? `${IMAGE_PATH}${item.
                                                image}` : `${IMAGE_PATH}Placeholder.webp`}
                                            alt="Profile"
                                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <span>{item.owner_name || 'NA'}</span>
                                </td>
                                <td>{item.f_name || 'NA'}</td>
                                <td>{item.l_name || 'NA'}</td>
                                {/* <td>+965 {item.mobile || 'NA'}</td> */}
                                <td>{item.email || 'NA'}</td>
                                <td><p style={{ margin: 'auto', width: '80px', textAlign: 'center' }} className={item.active_flag === 0 ? 'mc-table-badge red' : 'mc-table-badge green'}>{item.active_flag == 0 ? 'Deactive' : 'Active'}</p></td>
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
            </div >
        </>
    );
}
