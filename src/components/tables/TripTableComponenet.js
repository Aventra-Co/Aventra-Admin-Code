import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import {  AnchorComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import './TripTableComponenet.css';
import { SyncLoader } from "react-spinners";
export default function TripTableComponenet({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [tripDetails, settripDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const filteredUsers = tripDetails.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.trip_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.boat_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.captain_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.pickup_point?.toLowerCase().includes(lowercasedTerm) ||
            user.price_per_hour?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.random_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const fetchAppointmentDetails = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_all_trips")
            .then((response) => {
                if (response.data.success) {
                    settripDetails(response.data.trip_arr || []);
                    setLoading(false)
                }
            })
            .catch((error) => {
                console.error('Error fetching trip details:', error);
            });
    };
    useEffect(() => {
        fetchAppointmentDetails();
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
                                <th>{t("actions")}</th>
                                <th>{t("Image")}</th>
                                <th>{t("Trip ID")}</th>
                                {/* <th>{t("Trip Name")}</th> */}
                                <th>{t("Boat Name")}</th>
                                <th>{t("Captain Name")}</th>
                                <th>{t("Pickup Point")}</th>
                                <th>{t("Price (KWD/Hr)")}</th>
                                <th>{t("Create Date & Time")}</th>
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
                                            <AnchorComponent to={`${APP_PREFIX_PATH}/view-trip/${encode(item.trip_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                                            {/* <AnchorComponent title="check" className="material-icons check" style={{ background: '#19d90d', color: '#fff' }}> check</AnchorComponent> */}
                                        </div>
                                    </td>
                                    <td title={item.service_name}>
                                        <div className="mc-table-profile">
                                            <img
                                                src={item.trip_image ? `${IMAGE_PATH}${item
                                                    .trip_image}` : `${IMAGE_PATH}trip.webp`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </td>
                                    < td >
                                        <span>#{item.random_id || 'NA'}</span>
                                    </td>
                                    <td>{item.boat_name_english || 'NA'}</td>
                                    <td>{item.captain_name_english || 'NA'}</td>
                                    <td>{item.pickup_point || 'NA'}</td>
                                    <td>{(item.price_per_hour) || 'NA'}</td>
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
                </div >
            )}
        </>
    );
}
