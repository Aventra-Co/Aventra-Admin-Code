import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { LabelFieldComponent } from "../fields";
import { Row, Col, Dropdown } from "react-bootstrap";
import PaginationComponent from "../PaginationComponent";
import ProductsTableComponent from "../tables/ProductsTableComponent";
import products from "../../assets/data/products.json";


export default function ProductsCardComponent() {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-card">
            <div className="mc-card-header">
                <h4 className="mc-card-title">{t('best_selling_products')}</h4>
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
                        label={t('category_by')}
                        option={["mans", "womans", "kids", "accessory"]}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
                <Col>
                    <LabelFieldComponent
                        label={t('brand_by')}
                        option={["ecstasy", "freeland", "rongdhonu"]}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
                <Col>
                    <LabelFieldComponent
                        type="search"
                        label={t('search_by')}
                        placeholder={t('id') + ' / ' + t('name') + ' / ' + t('category') + ' / ' + t('brand')}
                        labelDir="label-col"
                        fieldSize="mb-4 w-100 h-md"
                    />
                </Col>
            </Row>
            <ProductsTableComponent 
                thead={products.thead} 
                tbody={products.tbody} 
            />
            <PaginationComponent />
        </div>
    )
}