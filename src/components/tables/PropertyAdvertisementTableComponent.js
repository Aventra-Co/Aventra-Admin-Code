import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnchorComponent } from "../elements";
import axios from "axios";
import { encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import './TripTableComponenet.css';
import { SyncLoader } from "react-spinners";

export default function PropertyAdvertisementTableComponent() {
    const { t } = useContext(TranslatorContext);
    const [propertyAds, setPropertyAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const entriesPerPage = 50;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

    const filteredPropertyAds = propertyAds.filter((item) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            item.property_name_english?.toLowerCase().includes(lowercasedTerm) ||
            item.guard_name_english?.toLowerCase().includes(lowercasedTerm) ||
            item.country_name?.toLowerCase().includes(lowercasedTerm) ||
            item.city_name?.toLowerCase().includes(lowercasedTerm) ||
            item.destination_name?.toLowerCase().includes(lowercasedTerm) ||
            item.random_booking_id?.toString().toLowerCase().includes(lowercasedTerm) ||
            item.one_day_price?.toString().toLowerCase().includes(lowercasedTerm) ||
            item.createtime?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const currentPropertyAds = filteredPropertyAds.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchPropertyAdvertisements = () => {
        setLoading(true);
        axios.get(API_URL + "/get_all_property_advertisement")
            .then((response) => {
                if (response.data.success) {
                    setPropertyAds(response.data.data || []);
                } else {
                    setPropertyAds([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching property advertisements:', error);
                setPropertyAds([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPropertyAdvertisements();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Get cover image URL
    const getCoverImage = (images) => {
        if (!images || images.length === 0) return null;
        const coverImage = images.find(img => img.is_cover === 1);
        return coverImage ? coverImage.image_path : images[0]?.image_path;
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
                                <th>{t("actions")}</th>
                                <th>{t("Image")}</th>
                                {/* <th>{t("Property ID")}</th> */}
                                <th>{t("Property Name")}</th>
                                <th>{t("Guard Name")}</th>
                                <th>{t("Location")}</th>
                                <th>{t("Price (1 Day)")}</th>
                                <th>{t("Price (Week Day)")}</th>
                                <th>{t("Price (Weekend)")}</th>
                                <th>{t("Price (FullWeek)")}</th>
                                <th>{t("Create Date & Time")}</th>
                            </tr>
                        </thead>
                        <tbody className="mc-table-body even">
                            {currentPropertyAds && currentPropertyAds.length > 0 ? (
                                currentPropertyAds.map((item, index) => {
                                    const coverImage = getCoverImage(item.images);
                                    const location = [item.country_name, item.city_name, item.destination_name]
                                        .filter(Boolean)
                                        .join(', ') || 'NA';

                                    return (
                                        <tr key={item.property_ad_id || index}>
                                            <td title="id">
                                                <div className="mc-table-check">
                                                    <p>{indexOfFirstEntry + index + 1}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="mc-table-action">
                                                    <AnchorComponent 
                                                        to={`${APP_PREFIX_PATH}/view-property-advertisement/${encode(item.property_ad_id.toString())}`} 
                                                        title="View" 
                                                        className="material-icons view"
                                                    >
                                                        visibility
                                                    </AnchorComponent>
                                                </div>
                                            </td>
                                            <td title={item.property_name_english}>
                                                <div className="mc-table-profile">
                                                    <img
                                                        src={coverImage ? `${IMAGE_PATH}${coverImage}` : `${IMAGE_PATH}property-placeholder.jpg`}
                                                        alt={item.property_name_english}
                                                        style={{ 
                                                            width: '50px', 
                                                            height: '50px', 
                                                            borderRadius: '50%', 
                                                            objectFit: 'cover' 
                                                        }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `${IMAGE_PATH}property-placeholder.jpg`;
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        
                                            <td>{item.property_name_english || 'NA'}</td>
                                            <td>{item.guard_name_english || 'NA'}</td>
                                            <td>{location}</td>
                                            <td>
                                                {item.one_day_price ? `${item.one_day_price} KWD` : 'NA'}
                                            </td>
                                            <td>
                                                {item.weekday_price ? `${item.weekday_price} KWD` : 'NA'}
                                            </td>
                                            <td>
                                                {item.weekend_price ? `${item.weekend_price} KWD` : 'NA'}
                                            </td>
                                            <td>
                                                {item.full_week_price ? `${item.full_week_price} KWD` : 'NA'}
                                            </td>
                                            <td>{item.createtime || 'NA'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>
                                        {t("no_data_available")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <PaginationComponent
                        totalEntries={filteredPropertyAds.length}
                        entriesPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}