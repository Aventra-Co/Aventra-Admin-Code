import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Dropdown } from "react-bootstrap";
import countries from "../../assets/data/countries.json";

export default function CountriesCardComponent() {

    const { t } = useContext(TranslatorContext)
    
    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('country_keywords')}</h4>
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
            <ul className="mc-countries-card-list thin-scrolling">
                {countries.map((country, index) => (
                    <li key={ index } className="mc-countries-card-item">
                        <div>
                            <img src={ country.src } alt={ country.alt } />
                            <h6>
                                <span>{ country.name.title }</span>
                                { country.name.text }
                            </h6>
                        </div>
                        <h6><span>{ country.sales.title }</span>{ country.sales.text }</h6>
                        <h6><span>{ country.bounce.title }</span>{ country.bounce.text }</h6>
                    </li>
                ))}
            </ul>
        </div>
    )
}