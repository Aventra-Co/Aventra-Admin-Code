import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { IconFieldComponent } from "../fields";
import { RevenueChartComponent } from "../charts";

export default function RevenueCardComponent() {

    const { t } = useContext(TranslatorContext)

    return (
        <div className="mc-card">
            <div className="mc-revenue-card-header">
                <h5 className="mc-card-title">{t('revenue_report')}</h5>
                <IconFieldComponent 
                    icon="calendar_month" 
                    option={["year 2021", "year 2020", "year 2019", "year 2018", "year 2017", "year 2016", "year 2015"]}  
                    classes="w-sm h-sm" 
                />
            </div>
            <div className="mc-revenue-card-group">
                <div className="mc-revenue-card-report">
                    <i className='material-icons blue'>cases</i>
                    <h3><span>{t('invested')}</span>3,387.67K</h3>
                </div>
                <div className="mc-revenue-card-report">
                    <i className='material-icons green'>bookmarks</i>
                    <h3><span>{t('earnings')}</span>2,856.35K</h3>
                </div>
                <div className="mc-revenue-card-report">
                    <i className='material-icons purple'>layers</i>
                    <h3><span>{t('expenses')}</span>1,994.12K</h3>
                </div>
            </div>
            <RevenueChartComponent />
        </div>
    )
}