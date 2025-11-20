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
import { Helmet } from 'react-helmet-async'
export default function UserTabularReport() {
  const [userDetails, setUserDetails] = useState([])
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
  // const currentItems = Array.isArray(userDetails) ? userDetails.slice(indexOfFirstItem, indexOfLastItem) : [];
  const maxDate = moment().format('YYYY-MM-DD')
  const paginate = pageNumber => setCurrentPage(pageNumber)
  const handleActionChange = (index, action, user_id) => {
    setSelectedActions({ ...selectedActions, [index]: action })
    if (action === 'Delete') {
    } else if (action === 'View') {
      // Handle view action if needed
    }
  }
  const fetchUserDetails = () => {
    setToDateError('')
    setFromDateError('')
    console.log(fromDate, toDate)
    axios
      .post(API_URL + '/user_tabular_report', {
        from_date: fromDate,
        to_date: toDate
      })
      .then(response => {
        console.log('res', response)
        if (response.data.success) {
          setUserDetails(response.data.user_arr)
        } else {
          console.error('Error fetching user details:', response.data.msg)
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error)
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
    fetchUserDetails()
  }
  useEffect(() => {
    if (userDetails.length > 0) {
      console.log('First user image:', userDetails[0].image)
    }
  }, [userDetails])
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
      userDetails.map((user, index) => {
        const createDateTime = user.createtime
        return {
          'S. No.': index + 1,
          Name: user.name,
          'Profile Image': user.image
            ? `${IMAGE_PATH}${user.image}`
            : `${IMAGE_PATH}image-1720095670109.png`,
          Email: user.email,
          Mobile: user.mobile,
          'Create Date & Time': createDateTime
        }
      })
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'UserReport')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'UserReport.xlsx')
  }
  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | User-Report</title>
      </Helmet>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Customer report')}</h3>
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
                  {t('users')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('customer list')}</li>
            </ul>
          </div>
        </div>
      </Col>
      <div className='mc-card p-lg-4'>
        <Col xl={12}>
          <Card.Header>
            <Card.Title as='h5'>{t('customer report')}</Card.Title>
          </Card.Header>
          <br />
          <Card.Body>
            <Row>
              <Form className='d-inline-flex flex-wrap'>
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
                  <Form.Group className=' mr-5 mx-3 '>
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
              </Form>
            </Row>
          </Card.Body>
        </Col>
      </div>
      <div className='mc-card p-lg-4'>
        <Col xl={12}>
          {userDetails.length > 0 && (
            <Button
              variant='success'
              onClick={exportToExcel}
              className='mb-3'
              style={{ backgroundColor: '#5A6268', border: 'none' }}
            >
              Export to Excel
            </Button>
          )}
          {/* <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="mc-table-check">
                                            <p>{t("sno")}</p>
                                        </div>
                                    </th>
                                    <th>{t("image")}</th>
                                    <th>{t("name")}</th>
                                    <th>{t("email")}</th>
                                    <th>{t("mobile")}</th>
                                    <th>{t("status")}</th>
                                    <th>{t("createtime")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails && userDetails.length > 0 ? (
                                    userDetails.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{indexOfFirstItem + index + 1}</th>
                                            <td title={item.name}>
                                                <div className="mc-table-profile">
                                                    <img
                                                        src={item.image ? `${IMAGE_PATH}${item.image}` : `${IMAGE_PATH}placeholder.webp`}
                                                        alt="Profile"
                                                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <span>{item.name || 'NA'}</span>
                                            </td>
                                            <td>{item.email || 'NA'}</td>
                                            <td>{item.mobile || 'NA'}</td>
                                            <td>
                                                {item.active_flag === 1 ? (
                                                    <p className="mc-table-badge green" style={{ width: '80px', textAlign: 'center' }}>Activate</p>
                                                ) : (
                                                    <p className="mc-table-badge red">Deactivate</p>
                                                )}
                                            </td>
                                            <td>{formatDate(item.createtime) || 'NA'}</td>
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
                            totalEntries={userDetails.length}
                            entriesPerPage={entriesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </Card.Body> */}
          <div className='mc-table-responsive'>
            <table className='mc-table'>
              <thead className='mc-table-head primary'>
                <tr>
                  <th>
                    <div className='mc-table-check'>
                      <p>{t('sno')}</p>
                    </div>
                  </th>
                  <th>{t('image')}</th>
                  <th>{t('name')}</th>
                  <th>{t('mobile')}</th>
                  <th>{t('email')}</th>
                  <th>{t('status')}</th>
                  <th>{t('createtime')}</th>
                </tr>
              </thead>
              <tbody className='mc-table-body even'>
                {userDetails && userDetails.length > 0 ? (
                  <>
                    {' '}
                    {userDetails?.map((item, index) => (
                      <tr key={index}>
                        <td title='id'>
                          <div className='mc-table-check'>
                            <p>{indexOfFirstItem + index + 1}</p>
                          </div>
                        </td>
                        <td title={item.name}>
                          <div className='mc-table-profile'>
                            <img
                              src={
                                item.image
                                  ? `${IMAGE_PATH}${item.image}`
                                  : `${IMAGE_PATH}Placeholder.webp`
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
                        <td>
                          <span>{item.name || 'NA'}</span>
                        </td>
                        <td>{item.mobile || 'NA'}</td>
                        <td>{item.email || 'NA'}</td>
                        <td>
                          {item.active_flag === 1 ? (
                            <p
                              className='mc-table-badge green'
                              style={{ width: '80px', textAlign: 'center' }}
                            >
                              Active
                            </p>
                          ) : (
                            <p className='mc-table-badge red'>Deactive</p>
                          )}
                        </td>
                        <td>{formatDate(item.createtime) || 'NA'}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {' '}
                    <tr>
                      <td colSpan='9' className='text-center'>
                        {t('no_data_available')}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <PaginationComponent
              totalEntries={userDetails.length}
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
