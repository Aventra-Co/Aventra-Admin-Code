import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Dropdown } from "react-bootstrap";
import ClientsTableComponent from "../tables/ClientsTableComponent";
import clients from "../../assets/data/clients.json"

export default function ClientsCardComponent() {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('popular_clients')}</h4>
                <Dropdown bsPrefix="mc-dropdown">
                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                        <i className='material-icons'>more_horiz</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>edit</i><span>{t('edit')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>delete</i><span>{t('delete')}</span></button>
                        <button type='button' className='mc-dropdown-menu'><i className='material-icons'>download</i><span>{t('download')}</span></button>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <ClientsTableComponent 
                thead={clients.thead} 
                tbody={clients.tbody} 
            />
        </div>
    )
}