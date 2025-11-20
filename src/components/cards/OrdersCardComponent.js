import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Dropdown } from "react-bootstrap";
import { OrdersChartComponent } from "../charts";

export default function OrdersCardComponent() {

    const { t, n } = useContext(TranslatorContext)

    const orders = [
        { "name": "pending", "value": 547, "color": "purple", "icon": "pending" },
        { "name": "shipped", "value": 398, "color": "blue", "icon": "add_circle" },
        { "name": "recieved", "value": 605, "color": "green", "icon": "check_circle" },
        { "name": "cancelled", "value": 249, "color": "red", "icon": "cancel" },
        { "name": "refunded", "value": 176, "color": "yellow", "icon": "error" }
    ]

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('orders_overview')}</h4>
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

            <OrdersChartComponent chart={ orders } />

            <ul className="mc-order-card-list">
                {orders.map((order, index) => (
                    <li key={ index } className="mc-order-card-item">
                        <i className={`material-icons ${ order.color }`}>{ order.icon }</i>
                        <p>{t(order.name)}</p>
                        <h5>{n(order.value )}</h5>
                    </li>
                ))}
            </ul>
        </div>
    )
}