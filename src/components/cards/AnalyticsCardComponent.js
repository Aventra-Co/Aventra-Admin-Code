import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { AnalyticsChartComponent } from "../charts";
import { Dropdown } from "react-bootstrap";
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import axios from "axios";


export default function AnalyticsCardComponent({ digit, label, variant, dataSet, dataKey }) {
    const { t } = useContext(TranslatorContext)

   


    return (
        <>
            <div className={`mc-analytics-card ${variant.name}`}>
                <div className="mc-analytics-card-group">
                    <div className="mc-analytics-card-content">
                        <h3>{label}</h3><br />
                        <p>{digit}</p>
                    </div>

                </div>
                <AnalyticsChartComponent
                    dataSet={dataSet}
                    dataKey={dataKey}
                    variant={variant.color}
                />
            </div>


        </>


    )
}