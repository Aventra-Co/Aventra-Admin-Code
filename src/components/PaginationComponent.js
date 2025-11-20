import React, { useContext } from "react";
import { TranslatorContext } from "../context/Translator";

export default function PaginationComponent({ totalEntries, entriesPerPage, currentPage, onPageChange }) {
    const { t, n, currentLanguage } = useContext(TranslatorContext);

    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Calculate page range to display (5 pages at a time)
    const pagesToShow = 5;
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    // Adjust the start and end pages if we're near the beginning or end
    if (currentPage <= halfPagesToShow) {
        endPage = Math.min(totalPages, pagesToShow);
    } else if (currentPage + halfPagesToShow >= totalPages) {
        startPage = Math.max(1, totalPages - pagesToShow + 1);
    }

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <div className="mc-paginate">
            <p className="mc-paginate-title">
                {t('showing')}
                <b> {n((currentPage - 1) * entriesPerPage + 1)} </b>
                {t('to')}
                <b> {n(Math.min(currentPage * entriesPerPage, totalEntries))} </b>
                {t('of')}
                <b> {n(totalEntries)} </b>
                {t('results')}
            </p>
            <ul className="mc-paginate-list">
                <li
                    className={`mc-paginate-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageClick(currentPage - 1)}
                >
                    {currentLanguage?.dir === "ltr" ?
                        <i className="material-icons">chevron_left</i>
                        : <i className="material-icons">chevron_right</i>
                    }
                </li>
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <li
                        key={startPage + index}
                        className={`mc-paginate-item ${currentPage === startPage + index ? 'active' : ''}`}
                        onClick={() => handlePageClick(startPage + index)}
                    >
                        {n(startPage + index)}
                    </li>
                ))}
                <li
                    className={`mc-paginate-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageClick(currentPage + 1)}
                >
                    {currentLanguage?.dir === "ltr" ?
                        <i className="material-icons">chevron_right</i>
                        : <i className="material-icons">chevron_left</i>
                    }
                </li>
            </ul>
        </div>
    );
}
