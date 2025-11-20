import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import { Col } from "react-bootstrap";
import Chart from "react-apexcharts";
import { API_URL, APP_PREFIX_PATH } from "../../constant/constant";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
export default function EarningAnalyticalReport() {
    const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
    const [yearlyData, setYearlyData] = useState(new Array(5).fill(0)); // 2024 - 2028
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/get_earning_analytics_report`, {
                params: { action: "get_earning_analytics_report" }
            })
            .then((res) => {
                if (res.data && res.data.data) {
                    const data = res.data.data;

                    // ✅ Fix: Correct API keys and initialize monthly data
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthly = Array(12).fill(0);

                    data.month_report_arr.forEach((item) => {
                        const monthIndex = monthNames.indexOf(item.month);
                        if (monthIndex !== -1) {
                            monthly[monthIndex] = item.month_trip_arr || 0; // ✅ Fix: Correct key
                        }
                    });

                    setMonthlyData(monthly);

                    // ✅ Fix: Ensure yearly data from 2024 - 2028
                    const yearly = new Array(5).fill(0); // Default array for 5 years (2024-2028)
                    data.year_report_arr.forEach((item) => {
                        const yearIndex = item.year - 2024; // Map to index (2024 -> 0, 2025 -> 1, etc.)
                        if (yearIndex >= 0 && yearIndex < 5) {
                            yearly[yearIndex] = item.year_trip_arr || 0;
                        }
                    });

                    setYearlyData(yearly);
                } else {
                    setError("Failed to fetch earning analytics data");
                }
            })
            .catch((error) => {
                console.error("Earning Analytics Report Error:", error);
                setError("Failed to fetch earning analytics data");
            });
    }, []);

    const monthlyOptions = {
        chart: { type: "bar" },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    };

    const monthlySeries = [{ name: "Earning", data: monthlyData }];

    const yearlyOptions = {
        chart: { type: "bar" },
        xaxis: { categories: ['2024', '2025', '2026', '2027', '2028'] },
    };

    const yearlySeries = [{ name: "Earning", data: yearlyData }];

    return (
        <PageLayout>
            <Helmet>
                <title>Aventra | Earning-Analytical-Report</title>
            </Helmet>
            <Col xl={12}>
                <div className="mc-card">
                    <div className="mc-breadcrumb">
                        <h3 className="mc-breadcrumb-title">{t("Earning Analytical Report")}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item">
                                <Link to={`${APP_PREFIX_PATH}/dashboard`} className="mc-breadcrumb-link">
                                    {t("home")}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">
                                <Link to="#" className="mc-breadcrumb-link">
                                    {t("analytical")}
                                </Link>
                            </li>
                            <li className="mc-breadcrumb-item">{t("owner_analytical_list")}</li>
                        </ul>
                    </div>
                </div>
            </Col>

            <Typography
                className="d-flex justify-content-center"
                style={{ marginTop: "30px", marginBottom: "30px", color: "#000" }}
                variant="h5"
                gutterBottom
            >
                {t("Monthly Report Earning")}
            </Typography>

            <Grid container>
                <Grid item xs={12} md={12}>
                    <Card sx={{ marginTop: "10px" }}>
                        <div className="chart p-4">
                            <Chart options={monthlyOptions} series={monthlySeries} type="bar" height={350} />
                        </div>
                    </Card>
                </Grid>

                <Typography
                    className=""
                    style={{ margin: "40px auto 0px", color: "#000" }}
                    variant="h5"
                    gutterBottom
                >
                    {t("Yearly Report Earning")}
                </Typography>

                <Grid item xs={12} md={12}>
                    <Card sx={{ marginTop: "10px" }}>
                        <div className="chart p-4">
                            <Chart options={yearlyOptions} series={yearlySeries} type="bar" height={350} />
                        </div>
                    </Card>
                </Grid>
            </Grid>

            {error && (
                <Typography color="error" align="center" style={{ marginTop: "20px" }}>
                    {error}
                </Typography>
            )}
        </PageLayout>
    );
}
