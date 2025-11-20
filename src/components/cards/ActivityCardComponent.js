import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnchorComponent } from "../elements";
import { Dropdown } from "react-bootstrap";
import activities from "../../assets/data/activities.json";

export default function ActivityCardComponent() {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('recent_activities')}</h4>
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
            <ul className="mc-activity-card-list thin-scrolling">
                {activities.map((activity, index)=> (
                    <li key={ index } className="mc-activity-card-item">
                        <div className="mc-activity-card-title">
                            <h6 className="mc-divide-title">{activity.title}</h6>
                            <small>{ activity.time }</small>
                        </div>
                        <div className="mc-activity-card-body">
                            {activity.text && <p className="mc-activity-card-text">{ activity.text }</p> }
                            {activity.media &&
                                <div className="mc-activity-card-media">
                                    <img src={ activity.media.src } alt={ activity.media.alt } />
                                    <h6>{ activity.media.name }</h6>
                                </div>
                            }
                            { activity.button && <AnchorComponent to={ activity.button.path } className="mc-btn primary sm">{ activity.button.label }</AnchorComponent> }
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}