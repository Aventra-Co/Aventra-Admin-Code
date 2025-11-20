import React, { useContext, useEffect, useState, useMemo } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { Card, Grid, Typography } from '@mui/material';
import axios from "axios";
import { Col } from 'react-bootstrap';
import './UserTabularReport';
import Chart from 'react-apexcharts';
import PaginationComponent from "../../components/PaginationComponent";
import { API_URL, IMAGE_PATH, APP_PREFIX_PATH } from "../../constant/constant";
import { t } from "i18next";

export default function DoctorAnalyticalReport() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(API_URL + '/get_doctor_analytical_count')
            .then((res) => {
                console.log('UserCount response:', res.data);
                if (res.data && res.data.doctor_count_arr) {
                    const data = res.data.doctor_count_arr;
                    const monthly = Array(12).fill(0);
                    const yearly = {
                        2024: 0, 2025: 0, 2026: 0, 2027: 0, 2028: 0
                    };

                    data.forEach((item) => {
                        if (item.month !== null) {
                            monthly[item.month - 1] = item.doctor_count;
                        }
                        if (item.year !== null) {
                            if (!yearly[item.year]) {
                                yearly[item.year] = 0;
                            }
                            yearly[item.year] += item.doctor_count;
                        }
                    });

                    setMonthlyData(monthly);
                    setYearlyData(Object.values(yearly));
                } else {
                    setError('Failed to fetch user counts');
                }
            })
            .catch((error) => {
                console.error('UserCount error:', error);
                setError('Failed to fetch user counts');
            });
    }, []);

    const monthlyOptions = {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        // Add more chart options as needed
    };

    const monthlySeries = [
        {
            name: 'Users',
            data: monthlyData,
        },
    ];

    const yearlyOptions = {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: ['2024', '2025', '2026', '2027', '2028'],
        },
        // Add more chart options as needed
    };

    const yearlySeries = [
        {
            name: 'Users',
            data: yearlyData,
        },
    ];

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('doctor_analytical_report')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item">
                                <Link to='#' className="mc-breadcrumb-link">{t('analytical')}</Link>
                            </li>
                            <li className="mc-breadcrumb-item">{t('doctor_analytical_list')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <Typography
                className="d-flex justify-content-center"
                style={{ marginTop: '30px', marginBottom: '30px', color: '#000' }}
                variant="h5"
                gutterBottom
            >
                {t("monthly_report_doctor")}
            </Typography>

            <Grid container>
                <Grid item xs={12} md={12}>
                    <Card sx={{ marginTop: '10px' }}>
                        <div className="chart p-4">
                            <Chart options={monthlyOptions} series={monthlySeries} type="bar" height={350} />
                        </div>
                    </Card>
                </Grid>

                <Typography className="" style={{ margin: '40px auto 0px', color: '#000' }} variant="h5" gutterBottom>
                    {t("yearly_report_doctor")}
                </Typography>

                <Grid item xs={12} md={12}>
                    <Card sx={{ marginTop: '10px' }}>
                        <div className="chart p-4">
                            <Chart options={yearlyOptions} series={yearlySeries} type="bar" height={350} />
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </PageLayout>
    );
}
