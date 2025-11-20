import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { SalesChartComponent } from "../charts";
import { Dropdown } from "react-bootstrap";

export default function SalesCardComponent () {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-sales-card">
            <div className="mc-sales-card-group">
                <div className="mc-card-header">
                    <h4 className="mc-card-title">{t('total_sales')}</h4>
                    <Dropdown bsPrefix="mc-dropdown">
                        <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                            <i className='material-icons'>more_horiz</i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="mc-dropdown-paper">
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_day')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_week')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_month')}</span></button>
                            <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_year')}</span></button>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='mc-sales-card-amount trending_up green'>
                    <h3>$3,787,681.00</h3>
                    <p>
                        40.63%
                        <i className='material-icons'>trending_up</i>
                    </p>
                </div>
                <p className="mc-sales-card-compare">$3,578.90 in {t('last_month')}</p>
            </div>
            <SalesChartComponent />
        </div>
    );
}