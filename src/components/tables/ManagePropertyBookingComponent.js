import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col, Modal } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { SyncLoader } from "react-spinners";

export default function ManagePropertyBookingComponent() {
    const { t } = useContext(TranslatorContext);
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 5;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    // Function to get booking status display
    const getBookingStatusDisplay = (status) => {
        switch(status) {
            case 0:
                return { label: 'Pending', bg: '#FFF3CD', color: '#856404' };
            case 1:
                return { label: 'Ongoing', bg: '#CCE5FF', color: '#004085' };
            case 2:
                return { label: 'Completed', bg: '#D4EDDA', color: '#155724' };
            case 3:
                return { label: 'Cancelled', bg: '#F8D7DA', color: '#721c24' };
            default:
                return { label: 'NA', bg: '#E2E3E5', color: '#383d41' };
        }
    };

    // Function to get payment status display
    const getPaymentStatusDisplay = (status) => {
        switch(status) {
            case 0:
                return { label: 'Pending', bg: '#FFF3CD', color: '#856404' };
            case 1:
                return { label: 'Completed', bg: '#D4EDDA', color: '#155724' };
            case 2:
                return { label: 'Failed', bg: '#F8D7DA', color: '#721c24' };
            default:
                return { label: 'NA', bg: '#E2E3E5', color: '#383d41' };
        }
    };

    // Function to get pricing type label
    const getPricingTypeLabel = (type) => {
        switch(type) {
            case 0:
                return 'One Day';
            case 1:
                return 'Weekday';
            case 2:
                return 'Weekend';
            case 3:
                return 'Full Week';
            default:
                return 'NA';
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            booking.user_name?.toLowerCase().includes(lowercasedTerm) ||
            booking.f_name?.toLowerCase().includes(lowercasedTerm) ||
            booking.property_name_english?.toLowerCase().includes(lowercasedTerm) ||
            booking.owner_name?.toLowerCase().includes(lowercasedTerm) ||
            booking.guard_name?.toLowerCase().includes(lowercasedTerm) ||
            booking.transaction_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            booking.total_amount?.toString().toLowerCase().includes(lowercasedTerm) ||
            booking.checkin_date?.toLowerCase().includes(lowercasedTerm) ||
            booking.checkout_date?.toLowerCase().includes(lowercasedTerm) ||
            booking.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentBookings = filteredBookings.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchPropertyBookings = () => {
        setLoading(true);
        axios.get(API_URL + "/get_all_property_booking")
            .then((response) => {
                if (response.data.success) {
                    setBookings(response.data.data || []);
                } else {
                    setBookings([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching property bookings:', error);
                setBookings([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPropertyBookings();
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
                                <th>{t("User Name")}</th>
                                <th>{t("Property Name")}</th>
                                <th>{t("Owner Name")}</th>
                                <th>{t("Guard Name")}</th>
                                {/* <th>{t("Pricing Type")}</th> */}
                                <th>{t("Check-in Date")}</th>
                                <th>{t("Check-out Date")}</th>
                                <th>{t("Days")}</th>
                                <th>{t("Adults")}</th>
                                <th>{t("Children")}</th>
                                <th>{t("Total Amount (KWD)")}</th>
                                <th>{t("Booking Status")}</th>
                                <th>{t("Payment Status")}</th>
                                <th>{t("Transaction ID")}</th>
                                <th>{t("Booking Date & Time")}</th>
                            </tr>
                        </thead>
                        <tbody className="mc-table-body even">
                            {currentBookings && currentBookings.length > 0 ? (
                                currentBookings.map((item, index) => {
                                    const bookingStatus = getBookingStatusDisplay(item.booking_status);
                                    const paymentStatus = getPaymentStatusDisplay(item.payment_status);
                                    
                                    return (
                                        <tr key={item.property_booking_id || index}>
                                            <td title="id">
                                                <div className="mc-table-check">
                                                    <p>{indexOfFirstEntry + index + 1}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span style={{ fontWeight: '500' }}>{item.user_name || item.f_name || 'NA'}</span>
                                                </div>
                                            </td>
                                            <td>{item.property_name_english || 'NA'}</td>
                                            <td>{item.owner_name || 'NA'}</td>
                                            <td>{item.guard_name || 'NA'}</td>
                                            {/* <td>
                                                <span
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '999px',
                                                        backgroundColor: '#E8EAF6',
                                                        color: '#3F51B5',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {getPricingTypeLabel(item.pricing_type)}
                                                </span>
                                            </td> */}
                                            <td>{item.checkin_date || 'NA'}</td>
                                            <td>{item.checkout_date || 'NA'}</td>
                                            <td style={{ textAlign: 'center' }}>{item.no_of_days || 'NA'}</td>
                                            <td style={{ textAlign: 'center' }}>{item.max_adult || 'NA'}</td>
                                            <td style={{ textAlign: 'center' }}>{item.max_child || 'NA'}</td>
                                            <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                                                {item.total_amount ? `${item.total_amount} KWD` : 'NA'}
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '999px',
                                                        backgroundColor: bookingStatus.bg,
                                                        color: bookingStatus.color,
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {bookingStatus.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '999px',
                                                        backgroundColor: paymentStatus.bg,
                                                        color: paymentStatus.color,
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {paymentStatus.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontFamily: 'monospace' }}>
                                                    {item.transaction_id || 'NA'}
                                                </span>
                                            </td>
                                            <td>{item.createtime || 'NA'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="16" style={{ textAlign: 'center' }}>
                                        {t("no_data_available")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <PaginationComponent
                        totalEntries={filteredBookings.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}