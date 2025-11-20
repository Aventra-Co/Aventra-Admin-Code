import React, { useContext } from "react"
import { TranslatorContext } from "../../context/Translator";
import { Dropdown } from "react-bootstrap"

export default function EcommerceCardComponent({ variant, trend, number, title, icon, percent }) {

    const { t } = useContext(TranslatorContext)

    return (
        <div className={`mc-ecommerce-card ${ variant }`}>
            <i className="mc-ecommerce-card-trend material-icons">{ trend }</i>
            <div className="mc-ecommerce-card-head">
                <h4 className="mc-ecommerce-card-meta">
                    <span>{ title }</span>
                    { number }
                </h4>
                <i className="mc-ecommerce-card-icon material-icons">{ icon }</i>
            </div>
            <div className="mc-ecommerce-card-foot">
                <div className="mc-ecommerce-card-compare">
                    <mark>+ { percent }%</mark>
                    <span>{t('last_month')}</span>
                </div>
                <Dropdown bsPrefix="mc-dropdown">
                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                        <i className='material-icons'>more_vert</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_day')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_week')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_month')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>history</i><span>{t('last_year')}</span></button>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}