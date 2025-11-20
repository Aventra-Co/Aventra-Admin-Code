import React, { useContext } from "react";
import PaginationComponent from "../PaginationComponent";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { TranslatorContext } from "../../context/Translator";
import { DealsTableComponent } from "../tables";
import { Row, Col, Dropdown } from "react-bootstrap";
import deals from "../../assets/data/deals.json";

export default function DealsCardComponent() {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('deals_performance')}</h4>
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
            <Row xs={1} sm={2} xl={4}>
                <Col>
                    <LabelFieldComponent
                        label={t('show_by')}
                        option={["12 row", "24 row", "36 row"]}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
                <Col>
                    <LabelFieldComponent
                        label={t('status_by')}
                        option={["won leads", "new leads", "open leads", "lost leads"]}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
                <Col>
                    <LabelFieldComponent
                        label={t('brand_by')}
                        type="date"
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        label={t('search_by')}
                        placeholder={t('id') + ' / ' + t('name') + ' / ' + t('email')}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
            </Row>
            <DealsTableComponent 
                thead={ deals.thead } 
                tbody={ deals.tbody } 
            />
            <PaginationComponent />
        </div>
    )
}