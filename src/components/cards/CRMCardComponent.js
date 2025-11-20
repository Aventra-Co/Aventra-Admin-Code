import React from "react";
import { CRMChartComponent } from "../charts";

export default function CRMCardComponent({ variant, content, status, dataKey, dataSet }) {
    return (
        <div className="mc-crm-card">
            <div className="mc-crm-card-group">
                <i className={`material-icons ${ variant.name }`}>{ content.icon }</i>
                <h3>{ content.value }</h3>
                <p>{ content.label }</p>
                <span className={ status.icon }>
                    <small>{ status.value }</small>
                    <small>{ status.label }</small>
                </span>
            </div>
            <CRMChartComponent 
                dataKey={ dataKey }
                dataSet={ dataSet }
                variant={ variant }
            />
        </div>
    )
}