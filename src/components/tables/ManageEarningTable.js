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
import { SyncLoader } from "react-spinners";


export default function ManageEarningTable({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [earning, setearning] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


    const filteredUsers = earning.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(lowercasedTerm) ||
            user.ownername?.toLowerCase().includes(lowercasedTerm) ||

            user.trip_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.random_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.price_per_hour?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.hours?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.transaction_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.commission?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.admin_commission?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.owner_payment?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );



    });


    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchEarning = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_earning")
            .then((response) => {
                setearning(response.data.earning_arr || [])
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };




    useEffect(() => {
        fetchEarning();
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

                                <th>{t("user_name")}</th>
                                <th>{t("owner name")}</th>
                                <th>{t("trip id")}</th>
                                {/* <th>{t("trip name")}</th> */}
                                <th>{t("transaction ID")} (KWD)</th>
                                <th>{t("trip price (KWD/Hr)")}</th>
                                <th>{t("Booking Hours")}</th>
                                <th>{t("Total Amount")}</th>
                                <th>{t("commission")} (%)</th>
                                <th>{t("commission")} (KWD)</th>
                                <th>{t("Owner earning")} (KWD)</th>
                                <th>{t("transaction")}</th>
                            </tr>
                        </thead>
                        <tbody className="mc-table-body even">
                            {currentUsers && currentUsers.length > 0 ? (
                                currentUsers.map((item, index) => (
                                    <tr key={index}>
                                        <td title="id">
                                            <div className="mc-table-check">
                                                <p>{indexOfFirstEntry + index + 1}</p>
                                            </div>
                                        </td>
                                        <td>{item.name || 'NA'}</td>

                                        <td> {item.ownername || 'NA'}  </td>
                                        <td>
                                            <span>#{item.random_id || 'NA'}</span>
                                        </td>
                                        {/* <td>{item.trip_name_english || 'NA'}</td> */}
                                        <td>{item.transaction_id || 'NA'} </td>
                                        <td>{item.price_per_hour || 'NA'}</td>
                                        <td>{item.hours || 'NA'}</td>
                                        <td>{(item.price_per_hour * item.hours) || 'NA'}</td>
                                        <td>{item.commission}%</td>
                                        <td>{item.admin_commission || 'NA'}</td>
                                        <td>{item.owner_payment}</td>
                                        <td>{item.createtime || 'NA'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>
                                        {t("no_data_available")}
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>


                    <PaginationComponent
                        totalEntries={filteredUsers.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                </div >
            )}
        </>
    );
}
