import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import { encode } from 'base-64'
import './UserTabularReport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import moment from 'moment'
import PaginationComponent from '../../components/PaginationComponent'
import { API_URL, IMAGE_PATH, APP_PREFIX_PATH } from '../../constant/constant'
import { t } from 'i18next'
import { AnchorComponent } from '../../components/elements'
import { Helmet } from 'react-helmet-async'
export default function BroadcastTabularReport() {
  const [broadcastDetails, setBroadcastDetails] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedActions, setSelectedActions] = useState({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [fromdateError, setFromDateError] = useState('')
  const [todateError, setToDateError] = useState('')
  const [EqualError, setEqualError] = useState('')

  const entriesPerPage = 50
  const handlePageChange = pageNumber => setCurrentPage(pageNumber)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const maxDate = moment().format('YYYY-MM-DD')
  const paginate = pageNumber => setCurrentPage(pageNumber)

  const handleActionChange = (index, action, user_id) => {
    setSelectedActions({ ...selectedActions, [index]: action })
    if (action === 'Delete') {
    } else if (action === 'View') {
      // Handle view action if needed
    }
  }

  const fetchBroadcastDetails = () => {
    setToDateError('')
    setFromDateError('')
    console.log(fromDate, toDate)

    axios
      .post(API_URL + '/get_all_broadcast_message', {
        from_date: fromDate,
        to_date: toDate
      })
      .then(response => {
        console.log('res', response)
        if (response.data.success) {
          setBroadcastDetails(response.data.msgArray)
        } else {
          console.error('Error fetching broadcast details:', response.data.msg)
        }
      })
      .catch(error => {
        console.error('Error fetching broadcast details:', error)
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

    fetchBroadcastDetails()
  }

  useEffect(() => {
    if (broadcastDetails.length > 0) {
      console.log('First broadcast image:', broadcastDetails[0].image)
    }
  }, [broadcastDetails])

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

  const getNotificationTypeText = (type) => {
    switch (type) {
      case 0: return 'All Customers';
      case 1: return 'Selected Customers';
      case 2: return 'All Owners';
      case 3: return 'Selected Owners';
      default: return 'Unknown';
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      broadcastDetails.map((item, index) => {
        return {
          'S. No.': index + 1,
          'Title': item.title,
          'Message': item.message,
          'Notification Type': getNotificationTypeText(item.notification_type),
          'Image': item.image,
          'Date': item.createtime
        }
      })
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'BroadcastReport')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'BroadcastReport.xlsx')
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | Broadcast-Report</title>
      </Helmet>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Broadcast Report')}</h3>
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
                  {t('broadcast')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Broadcast List')}</li>
            </ul>
          </div>
        </div>
      </Col>
      <div className='mc-card p-lg-4'>
        <Col xl={12}>
          <Card.Header>
            <Card.Title as='h5'>{t('Broadcast Report')}</Card.Title>
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
        <Col xl={12}>
          {broadcastDetails.length > 0 && (
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
                  <th>{t('Image')}</th>
                  <th>{t('Title')}</th>
                  <th>{t('Message')}</th>
                  <th>{t('Notification Type')}</th>
                  {/* <th>{t('Sender')}</th>
                  <th>{t('Recipient')}</th> */}
                  <th>{t('Date')}</th>
                </tr>
              </thead>
              <tbody className='mc-table-body even'>
                {broadcastDetails.length > 0 && broadcastDetails ? (
                  <>
                    {broadcastDetails?.map((item, index) => (
                      <tr key={index}>
                        <td title='id'>
                          <div className='mc-table-check'>
                            <p>{indexOfFirstItem + index + 1}</p>
                          </div>
                        </td>
                        <td title={item.title}>
                          <div className='mc-table-profile'>
                            <img
                              src={
                                item.image
                                  ? `${IMAGE_PATH}${item.image}`
                                  : `${IMAGE_PATH}default-notification.png`
                              }
                              alt='Notification'
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </td>
                        <td>{item.title || 'NA'}</td>
                        <td>{item.message || 'NA'}</td>
                        {/* <td>{getNotificationTypeText(item.notification_type) || 'NA'}</td> */}
                        <td>
                          {item.notification_type === 0 ? 'All Customers' :
                            item.notification_type === 2 ? 'All Owners' :
                              item.other_user_name || 'Selected Users'}
                        </td>
                        <td>{item.createtime || 'NA'}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {' '}
                    <tr>
                      <td colSpan='8' className='text-center'>
                        {t('no_data_available')}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <PaginationComponent
              totalEntries={broadcastDetails.length}
              entriesPerPage={entriesPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </Col>
      </div>
    </PageLayout>
  )
}