import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col, Modal } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";

import { SyncLoader } from "react-spinners";

export default function ManageBookingComponent({ thead, tbody }) {
    const { t } = useContext(TranslatorContext);
    const [booking, setbooking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSlotsModal, setShowSlotsModal] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    // Function to format slots for table display
    const formatSlotsForTable = (slots) => {
        if (!slots || slots.length === 0) {
            return 'NA';
        }

        if (slots.length === 1) {
            return `${slots[0].start_time} - ${slots[0].end_time}`;
        }

        // For multiple slots, show first slot + count
        return `${slots[0].start_time} - ${slots[0].end_time} +${slots.length - 1} more`;
    };

    // Function to handle slot click
    const handleSlotClick = (slots) => {
        if (slots && slots.length > 0) {
            setSelectedSlots(slots);
            setShowSlotsModal(true);
        }
    };

    // Function to close modal
    const handleCloseModal = () => {
        setShowSlotsModal(false);
        setSelectedSlots([]);
    };

    const filteredUsers = booking.filter((user) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(lowercasedTerm) ||
            user.ownerName?.toLowerCase().includes(lowercasedTerm) ||
            user.trip_name_english?.toLowerCase().includes(lowercasedTerm) ||
            user.destination_english?.toLowerCase().includes(lowercasedTerm) ||
            user.random_booking_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.price_per_hour?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.hours?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.booking_time?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.transaction_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.total_amount?.toString().toLowerCase().includes(lowercasedTerm) ||
            user.date?.toLowerCase().includes(lowercasedTerm) ||
            user.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchbooking = () => {
        setLoading(true)
        axios.get(API_URL + "/fetch_booking")
            .then((response) => {
                setbooking(response.data.booking_arr || [])
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };

    useEffect(() => {
        fetchbooking();
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
                                <th>{t("trip booking id")}</th>
                                <th>{t("owner name")}</th>
                                <th>{t("trip price (KWD/Hr)")}</th>
                                <th>{t("Number of guests")}</th>
                                <th>{t("Booking Date")}</th>
                                <th>{t("Status")}</th>
                                <th>{t("Cancel Reason")}</th>
                                <th>{t("Booking Hours")}</th>
                                <th>{t("Booking Time")}</th>
                                <th>{t("Total Amount (KWD)")}</th>
                                <th>{t("transaction ID")}</th>
                                <th>{t("Slots")}</th>
                                <th>{t("Booked On")}</th>
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
                                        <td>
                                            <span>#{item.random_booking_id || 'NA'}</span>
                                        </td>
                                        <td>{item.ownerName || 'NA'}</td>
                                        <td>{item.price_per_hour || 'NA'}</td>
                                        <td>{item.ticket_count || 'NA'}</td>
                                        <td>{item.date || 'NA'}</td>
                                        <td>
                                            <p
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    backgroundColor:
                                                        item.trip_status === 0
                                                            ? '#FFF3CD'
                                                            : item.trip_status === 1
                                                                ? '#CCE5FF'
                                                                : item.trip_status === 2
                                                                    ? '#D4EDDA'
                                                                    : item.trip_status === 3
                                                                        ? '#F8D7DA'
                                                                        : '#E2E3E5',
                                                    color:
                                                        item.trip_status === 0
                                                            ? '#856404'
                                                            : item.trip_status === 1
                                                                ? '#004085'
                                                                : item.trip_status === 2
                                                                    ? '#155724'
                                                                    : item.trip_status === 3
                                                                        ? '#721c24'
                                                                        : '#383d41',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {item.trip_status === 0
                                                    ? 'Pending'
                                                    : item.trip_status === 1
                                                        ? 'Ongoing'
                                                        : item.trip_status === 2
                                                            ? 'Completed'
                                                            : item.trip_status === 3
                                                                ? 'Canceled'
                                                                : 'NA'}
                                            </p>
                                        </td>
                                        <td>{item.cancle_reason || 'NA'}</td>
                                        <td>{item.hours || 'NA'}</td>
                                        <td>{item.booking_time || 'NA'}</td>
                                        <td>{item.total_amount || 'NA'}</td>
                                        <td>{item.transaction_id || 'NA'} </td>
                                        <td>
                                            <span
                                                className={`${item.slots && item.slots.length > 0 ? 'clickable-slot' : ''}`}
                                                style={{
                                                    cursor: item.slots && item.slots.length > 0 ? 'pointer' : 'default',
                                                    color: item.slots && item.slots.length > 0 ? '#086861' : 'inherit',
                                                    fontWeight: item.slots && item.slots.length > 0 ? '500' : 'normal',
                                                    textDecoration: item.slots && item.slots.length > 0 ? 'underline' : 'none',
                                                }}
                                                onClick={() => handleSlotClick(item.slots)}
                                            >
                                                {formatSlotsForTable(item.slots)}
                                            </span>
                                        </td>
                                        <td>{item.createtime || 'NA'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="14" style={{ textAlign: 'center' }}>
                                        {t("no_data_available")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Slots Modal */}
                    <Modal show={showSlotsModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Booking Slots</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedSlots.length > 0 ? (
                                <div className="slots-list">
                                    <h6 className="mb-3">All Booked Slots:</h6>
                                    {selectedSlots.map((slot, index) => (
                                        <div
                                            key={slot.slot_id || index}
                                            className="slot-item mb-2 p-2"
                                            style={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <strong>Slot {index + 1}:</strong> {slot.start_time} - {slot.end_time}
                                                </span>
                                            </div>
                                            {slot.date && (
                                                <div className="text-muted small mt-1">
                                                    Date: {slot.date}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p>No slots available</p>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                className="btn btn-primary"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>

                    <PaginationComponent
                        totalEntries={filteredUsers.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div >
            )}

            {/* Add some CSS for better appearance */}
            <style jsx>{`
                .clickable-slot:hover {
                    color: #064e3b !important;
                    text-decoration: underline !important;
                }
                .slot-item:hover {
                    background-color: #e9ecef !important;
                }
            `}</style>
        </>
    );
}