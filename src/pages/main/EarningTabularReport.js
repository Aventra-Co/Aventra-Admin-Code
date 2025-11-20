import React, { useContext, useEffect, useState, useMemo } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import { encode } from 'base-64'
import JoditEditor from 'jodit-react'
import './UserTabularReport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import moment from 'moment'
import PaginationComponent from '../../components/PaginationComponent'
import { API_URL, IMAGE_PATH, APP_PREFIX_PATH } from '../../constant/constant'
import { t } from 'i18next'
import { AnchorComponent } from '../../components/elements'
import { Helmet } from 'react-helmet-async'
export default function EarningTabularReport () {
  const [tripDetails, setTripDetails] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedActions, setSelectedActions] = useState({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [fromdateError, setFromDateError] = useState('')
  const [todateError, setToDateError] = useState('')
  const [EqualError, setEqualError] = useState('')

  const entriesPerPage = 5
  const handlePageChange = pageNumber => setCurrentPage(pageNumber)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  // const currentItems = Array.isArray(tripDetails) ? tripDetails.slice(indexOfFirstItem, indexOfLastItem) : [];
  const maxDate = moment().format('YYYY-MM-DD')
  const paginate = pageNumber => setCurrentPage(pageNumber)

  const handleActionChange = (index, action, user_id) => {
    setSelectedActions({ ...selectedActions, [index]: action })
    if (action === 'Delete') {
    } else if (action === 'View') {
      // Handle view action if needed
    }
  }

  const fetchtripDetails = () => {
    setToDateError('')
    setFromDateError('')
    console.log(fromDate, toDate)

    axios
      .post(API_URL + '/earning_tabular_report', {
        //getEarningTabularList this name API i Created in Controlled File

        from_date: fromDate,
        to_date: toDate
      })
      .then(response => {
        console.log('res', response)
        if (response.data.success) {
          setTripDetails(response.data.trip_arr)
        } else {
          console.error('Error fetching trip details:', response.data.msg)
        }
      })
      .catch(error => {
        console.error('Error fetching trip details:', error)
      })
  }

  const handleViewReport = () => {
    let hasError = false
    if (!fromDate) {
      setFromDateError(t('please_select_from_date'))
      hasError = true
    } else {
      setFromDateError('')
    }

    if (!toDate) {
      setToDateError(t('please_select_to_date'))
      hasError = true
    } else {
      setToDateError('')
    }
    if (hasError) {
      return
    }
    if (toDate < fromDate) {
      setEqualError(t('equal_date'))
      return
    }

    fetchtripDetails()
  }

  useEffect(() => {
    if (tripDetails.length > 0) {
      console.log('First user image:', tripDetails[0].image)
    }
  }, [tripDetails])

  const formatDate = date => {
    const padTo2Digits = num => num.toString().padStart(2, '0')
    const formattedDate = new Date(date)
    const day = padTo2Digits(formattedDate.getDate())
    const month = padTo2Digits(formattedDate.getMonth() + 1)
    const year = formattedDate.getFullYear()
    let hours = formattedDate.getHours()
    const minutes = padTo2Digits(formattedDate.getMinutes())
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    const strHours = padTo2Digits(hours)

    return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tripDetails.map((user, index) => {
        const createDateTime = user.createtime

        return {
          'S. No.': index + 1,
          'Trip Name': user.trip_name_english,
          'Destination Name': user.destination_english,
          'Boat Name': user.boat_name_english,
          'Captain Name': user.captain_name_english,
          'Price (KWD/Hr)': user.total_amount || 'NA',
          'Advertisement Type':
            user.advertisement_type == 0 ? 'Private' : 'Public' || 'NA',
          Country: user.country,
          City: user.city,
          'Trip Type': user.trip_type_name,
          'Pickup Point': user.pickup_point,
          'Maximum People': user.max_people,
          Description: user.description_english,
          'Coupon Code Discount': user.coupon_discount,
          Discount: user.discount,
          'Trip Date':
            user.trip_date == 0
              ? 'All Days'
              : user.trip_date == 2
              ? ' Weekends (fri-sat)'
              : 'Selected Dates',
          'Selected Dates': user.dates,
          'Trip Time': user.trip_time == 0 ? 'Open Time' : 'Fixed Time',
          'From Time': user.from_time,
          'To Time': user.to_time,
          'Minimum Hours': user.minimum_hours,
          'Idle Hours': user.idle_hours,
          'Free To Cancel (Before Days)': user.free_to_cancel,
          'Create Date & Time': createDateTime
        }
      })
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'TripReport')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'EarningReport.xlsx')
  }

  return (
    <PageLayout>

    <Helmet>
      <title>By Boat | Earning-Tabular-Report</title>
    </Helmet>

      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Earning Report')}</h3>
            <ul className='mc-breadcrumb-list'>
              <li className='mc-breadcrumb-item'>
                <Link
                  to={`${APP_PREFIX_PATH + '/dashboard'}`}
                  className='mc-breadcrumb-link'
                >
                  {t('home')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>
                <Link to='#' className='mc-breadcrumb-link'>
                  {t('trip')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Trip List')}</li>
            </ul>
          </div>
        </div>
      </Col>
      <div className='mc-card p-lg-4'>
        <Col xl={12}>
          <Card.Header>
            <Card.Title as='h5'>{t('Earning Report')}</Card.Title>
          </Card.Header>
          <br />
          <Card.Body>
            <Form className=' flex-wrap'>
              <Row>
                <Col sm={5}>
                  <Form.Group className=' '>
                    <Form.Label className='mb-0'>{t('from')}:</Form.Label>
                    <Form.Control
                      className='mx-2'
                      type='date'
                      max={maxDate}
                      value={fromDate}
                      onChange={e => {
                        setFromDate(e.target.value)
                        setFromDateError('')
                      }}
                    />
                  </Form.Group>
                  <p
                    style={{
                      color: 'red',
                      marginLeft: '10px',
                      marginTop: '10px'
                    }}
                  >
                    {fromdateError}
                  </p>
                </Col>

                <Col sm={5}>
                  <Form.Group className=' mr-5 mx-0 '>
                    <Form.Label className='mb-0'>{t('to')}:</Form.Label>
                    <Form.Control
                      className='mx-2'
                      type='date'
                      max={maxDate}
                      value={toDate}
                      onChange={e => {
                        setToDate(e.target.value)
                        setToDateError('')
                        setEqualError('')
                      }}
                    />
                  </Form.Group>
                  <p
                    style={{
                      color: 'red',
                      marginLeft: '24px',
                      marginTop: '10px'
                    }}
                  >
                    {todateError}
                  </p>
                  <p style={{ color: 'red', marginLeft: '24px' }}>
                    {EqualError}
                  </p>
                </Col>
                <Col sm={2}>
                  <Form.Group className='d-inline-flex mx-3'>
                    <Button
                      className='mb-0 mt-4'
                      onClick={handleViewReport}
                      style={{ width: '150px' }}
                    >
                      {t('view_report')}
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Col>
      </div>
      <div className='mc-card p-lg-4'>
        {/* <Col xl={12}>
                    {tripDetails.length > 0 && (
                        <Button variant="success" onClick={exportToExcel} className="mb-3" style={{ backgroundColor: '#5A6268', border: 'none' }}>
                            {t("export_to_excel")}
                        </Button>
                    )}

                    <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="mc-table-check">
                                            <p>{t("sno")}</p>
                                        </div>
                                    </th>
                                    <th>{t("Trip Name")}</th>
                                    <th>{t("Destination Name")}</th>
                                    <th>{t("Boat Name")}</th>
                                    <th>{t("Captain Name")}</th>
                                    <th>{t("Price (KWD/Hr)")}</th>
                                    <th>{t("createtime")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tripDetails && tripDetails.length > 0 ? (
                                    tripDetails.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{indexOfFirstItem + index + 1}</th>
                                            <td>
                                                <span>{item.trip_name_english || 'NA'}</span>
                                            </td>
                                            <td>{item.destination_english || 'NA'}</td>
                                            <td>{item.captain_name_english || 'NA'}</td>
                                            <td>{item.boat_name_english || 'NA'}</td>
                                            <td>{item.price_per_hour || 'NA'}</td>
                                            <td>{item.createtime || 'NA'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            {t("no_data_available")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <PaginationComponent
                            totalEntries={tripDetails.length}
                            entriesPerPage={entriesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </Card.Body>
                </Col> */}

        <div className='mc-card p-lg-4'>
          <Col xl={12}>
            {tripDetails.length > 0 && (
              <Button
                variant='success'
                onClick={exportToExcel}
                className='mb-3'
                style={{ backgroundColor: '#5A6268', border: 'none' }}
              >
                {t('export_to_excel')}
              </Button>
            )}
            <div className='mc-table-responsive'>
              <table className='mc-table'>
                <thead className='mc-table-head primary'>
                  <tr>
                    <th>
                      <div className='mc-table-check'>
                        <p>{t('sno')}</p>
                      </div>
                    </th>
                    <th>{t('actions')}</th>
                    <th>{t('Image')}</th>
                    {/* <th>{t('Trip ID')}</th> */}
                    <th>{t("Transaction Id")}</th>
                    <th>{t('Boat Name')}</th>
                    {/* <th>{t('Captain Name')}</th> */}
                    <th>{t('Pickup Point')}</th>
                    <th>{t('Price (KWD/Hr)')}</th>
                    <th>{t('Create Date & Time')}</th>
                  </tr>
                </thead>
                <tbody className='mc-table-body even'>
                  {tripDetails.length > 0 && tripDetails ? (
                    <>
                      {tripDetails?.map((item, index) => (
                        <tr key={index}>
                          <td title='id'>
                            <div className='mc-table-check'>
                              <p>{indexOfFirstItem + index + 1}</p>
                            </div>
                          </td>
                          <td>
                            <div className='mc-table-action'>
                              <AnchorComponent
                                to={`${APP_PREFIX_PATH}/view-trip/${encode(
                                  item.trip_id
                                )}`}
                                title='View'
                                className='material-icons view'
                              >
                                visibility
                              </AnchorComponent>
                            </div>
                          </td>
                          <td title={item.service_name}>
                            <div className='mc-table-profile'>
                              <img
                                src={
                                  item.trip_image
                                    ? `${IMAGE_PATH}${item.trip_image}`
                                    : `${IMAGE_PATH}trip.webp`
                                }
                                alt='Profile'
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </td>
                          {/* <td>
                            <span>#{item.random_id || 'NA'}</span>
                          </td> */}
                          <td>{item.transaction_id || 'NA'}</td>
                          <td>{item.boat_name_english || 'NA'}</td>
                          {/* <td>{item.captain_name_english || 'NA'}</td> */}
                          <td>{item.pickup_point || 'NA'}</td>
                          <td>{item.total_amount || 'NA'}</td>
                          <td>{item.createtime || 'NA'}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {' '}
                      <tr>
                        <td colSpan='10' className='text-center'>
                          {t('no_data_available')}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
              <PaginationComponent
                totalEntries={tripDetails.length}
                entriesPerPage={entriesPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </Col>
        </div>
      </div>
    </PageLayout>
  )
}
