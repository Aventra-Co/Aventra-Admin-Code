import React from "react";
import { DevicesChartComponent } from "../charts";
import { IconFieldComponent } from "../fields";

export default function DevicesCardComponent() {
    return (
        <div className="mc-card">
            <div className="mc-devices-card-head">
                <h5>visitors device</h5>
                <IconFieldComponent 
                    icon="calendar_month" 
                    option={["year 2021", "year 2020", "year 2019", "year 2018", "year 2017", "year 2016", "year 2015"]} 
                    classes="w-sm h-sm" 
                />
            </div>
            <DevicesChartComponent />
        </div>
    )
}