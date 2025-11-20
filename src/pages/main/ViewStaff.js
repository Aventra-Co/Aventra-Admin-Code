import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Card, Form } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from '../../constant/constant'
import { Helmet } from 'react-helmet-async'
export default function ViewStaff() {
  const { t } = useContext(TranslatorContext)
  const { user_id } = useParams()
  const [Data, setData] = useState('')
  const [showImagePopupOne, setShowImagePopupOne] = useState(false)
  const [enlargedImageOne, setEnlargedImageOne] = useState(null)
  const [content, setContent] = useState(0)
  const [permissions, setPermissions] = useState({
    view_home: 0,
    manage_home: 0,
    view_my_add: 0,
    manage_my_add: 0,
    chat: 0,
    view_unavailability: 0,
    manage_unavailability: 0,
    view_my_wallet: 0,
    view_history: 0
  })

  const [trips, setTrips] = useState([])
  const [unavailability, setUnavailability] = useState([])

  const contentTypes = {
    trips: 0,
    unavailability: 1
  }
  const handleButtonClick = contentType => {
    setContent(contentTypes[contentType])
  }
  const getData = () => {
    axios
      .get(API_URL + `/view_staff_by_id?user_id=${user_id}`)
      .then(res => {
        if (res.data.success) {
          console.log('res', res)

          setData(res.data.staff_arr[0])
          const staffPermissions = {
            view_home: res.data.staff_arr[0].view_home || 0,
            manage_home: res.data.staff_arr[0].manage_home || 0,
            view_my_add: res.data.staff_arr[0].view_my_add || 0,
            manage_my_add: res.data.staff_arr[0].manage_my_add || 0,
            chat: res.data.staff_arr[0].chat || 0,
            view_unavailability: res.data.staff_arr[0].view_unavailability || 0,
            manage_unavailability:
              res.data.staff_arr[0].manage_unavailability || 0,
            view_my_wallet: res.data.staff_arr[0].view_my_wallet || 0,
            view_history: res.data.staff_arr[0].view_history || 0
          }
          setPermissions(staffPermissions)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const staffData = () => {
    axios
      .get(API_URL + `/fetch_staff_trips_unavailability?user_id=${user_id}`)
      .then(response => {
        if (response.data.success) {
          setTrips(response.data.staffTrips || [])
          setUnavailability(response.data.unavailability || [])
        }
      })
      .catch()
  }

  useEffect(() => {
    getData()
    staffData()
  }, [])
  // const handleImageClick = imageUrl => {
  //   setEnlargedImage(imageUrl)
  //   setShowImagePopup(true)
  // }
  // const handleCloseImage = () => {
  //   setEnlargedImage(null)
  //   setShowImagePopup(false)
  // }

  useEffect(() => {
    getData()
    staffData()
  }, [])
  const handleImageClickOne = imageUrl => {
    setEnlargedImageOne(imageUrl)
    setShowImagePopupOne(true)
  }
  const handleCloseImageOne = () => {
    setEnlargedImageOne(null)
    setShowImagePopupOne(false)
  }

  return (
    <PageLayout>
      <Helmet>
        <title> Aventra | View-Staff</title>
      </Helmet>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Staff profile')}</h3>
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
                <Link
                  to={`${APP_PREFIX_PATH + '/view-staff'}`}
                  className='mc-breadcrumb-link'
                >
                  {t('manage staff')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('staff profile')}</li>
            </ul>
          </div>
        </div>
      </Col>
      <div className='mc-card p-lg-4'>
        <Row>
          <Col xl={12}>
            {/* <h6 className="mc-divide-title mb-0">{t('staff details')}</h6> */}
            <div className='mc-product-view-info-group'>
              <div className='col-lg-12 content'>
                <div className='mobile-view'>
                  <div className='row'>
                    <div className='col-lg-5'>
                      <h6 className='mt-0'>{t('User Name')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {Data.f_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-0'>{t('Full Name')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {Data.l_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'>{t('Owner Name')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {Data.owner_name}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'>{t('email')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>{Data.email}</span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'> {t('Role')} : &nbsp; </h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {Data.role_english}
                      </span>
                    </div>
                  </div>

                  {/* <div className="row">
                                        <div className="col-lg-5">
                                            <h6 className="mt-2">
                                                {t('Country')} : &nbsp;
                                            </h6>
                                        </div>
                                        <div className="col-lg-7">
                                            <span style={{ fontWeight: '400' }}>
                                                {Data.country_name || 'NA'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-5">
                                            <h6 className="mt-2">
                                                {t('City')} : &nbsp;
                                            </h6>
                                        </div>
                                        <div className="col-lg-7">
                                            <span style={{ fontWeight: '400' }}>{Data.city_name || 'NA'}</span>
                                        </div>
                                    </div> */}
                  {/* <div className="row">
                                        <div className="col-lg-5">
                                            <h6 className="mt-2">
                                                {t('Permission')} : &nbsp;
                                            </h6>
                                        </div>
                                        <div className="col-lg-7">
                                            <span style={{ fontWeight: '400' }}>
                                                {Object.keys(Data)
                                                    .filter(key => Data[key] === 1 && key.includes('_'))
                                                    .map(key => key.replace(/_/g, ' '))
                                                    .join(', ') || 'NA'}
                                            </span>
                                        </div>
                                    </div>
                                     */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'>{t('Permissions')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7 d-flex justify-content-between align-item-center flex-wrap'>
                      {/* <span style={{ fontWeight: '400' }}> */}
                      {Object.keys(permissions).map(permission => (
                        <div key={permission} className='form-check col-lg-6'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={`permission-${permission}`}
                            checked={permissions[permission] === 1}
                          />
                          <label
                            className='form-check-label'
                            htmlFor={`permission-${permission}`}
                          >
                            {permission.replace(/_/g, ' ')}
                          </label>
                        </div>
                      ))}
                      {/* </span> */}
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'>{t('createdatetime')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {Data.createtime}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6 className='mt-2'>{t('Staff ID')} : &nbsp;</h6>
                    </div>
                    <div className='col-lg-7'>
                      <img
                        src={`${IMAGE_PATH}${Data.staff_id}`}
                        alt='Profile'
                        style={{
                          width: '10rem',
                          height: '10rem',
                          borderRadius: '5%',
                          cursor: 'pointer'
                        }}
                        onClick={() =>
                          handleImageClickOne(
                            Data.staff_id
                              ? `${IMAGE_PATH}${Data.staff_id}`
                              : `${IMAGE_PATH}Placeholder.webp`
                          )
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleImageClickOne(
                              Data.staff_id
                                ? `${IMAGE_PATH}${Data.image}`
                                : `${IMAGE_PATH}Placeholder.webp`
                            )
                          }
                        }}
                      />

                      {showImagePopupOne && (
                        <div
                          className='enlarged-image-overlay'
                          onClick={handleCloseImageOne}
                          onKeyDown={e => {
                            if (e.key === 'Escape') {
                              handleCloseImageOne()
                            }
                          }}
                          role='button'
                          tabIndex={0}
                        >
                          <span
                            className='close-button'
                            onClick={handleCloseImageOne}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleCloseImageOne()
                              }
                            }}
                            role='button'
                            tabIndex={0}
                          >
                            &times;
                          </span>
                          <img
                            src={enlargedImageOne}
                            alt='Enlarged Profile'
                            className='enlarged-image'
                            style={{ width: '30rem', height: '30rem' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Card.Body className='mt-5'>
            <Form>
              <nav className='navbar navbar-expand-lg navbar-light navBar'>
                <div
                  className='container mobile'
                  id='container-div'
                  style={{
                    marginTop: '-2rem',
                    width: '22rem',
                    borderRadius: '5px',
                    marginLeft: '0rem'
                  }}
                >
                  <button
                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content == contentTypes.trips ? 'btn-active' : ''
                      }`}
                    style={{ width: '15rem' }}
                    type='button'
                    onClick={() => handleButtonClick('trips')}
                  >
                    {t('Trips')}
                  </button>
                  <button
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content == contentTypes.unavailability ? 'btn-active' : ''
                      }`}
                    style={{ width: '15rem' }}
                    type='button'
                    onClick={() => handleButtonClick('unavailability')}
                  >
                    {t('Unavailability')}
                  </button>
                </div>
              </nav>

              {content === 0 && (
                <div style={{ margin: '1rem' }}>
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
                          <th>{t('Trip id')}</th>

                          {/* <th>{t('trip name')}</th> */}
                          {/* <th>{t('destination')}</th> */}
                          <th>{t('boat name')}</th>
                          <th>{t('captain name')}</th>
                          <th>{t('Price per Hour')}</th>
                          <th>{t('Createtime')}</th>
                        </tr>
                      </thead>
                      <tbody className='mc-table-body even'>
                        {trips && trips.length > 0 ? (
                          trips.map((item, index) => (
                            <tr key={index}>
                              <td title='id'>
                                <div className='mc-table-check'>
                                  <p>{index + 1}</p>
                                </div>
                              </td>
                              <td>
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
                              <td>#{item.random_id || 'NA'}</td>
                              {/* <td>{item.trip_name_english || 'NA'}</td> */}

                              {/* <td>{item.destination_english || 'NA'}</td> */}
                              <td>{item.boat_name_english || 'NA'}</td>
                              <td>{item.captain_name_english || 'NA'}</td>
                              <td>{item.price_per_hour || 'NA'}</td>
                              <td>{item.createtime || 'NA'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='7' style={{ textAlign: 'center' }}>
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {content === 1 && (
                <div style={{ margin: '1rem' }}>
                  <div className='mc-table-responsive'>
                    <table className='mc-table'>
                      <thead className='mc-table-head primary'>
                        <tr>
                          <th>
                            <div className='mc-table-check'>
                              <p>{t('sno')}</p>
                            </div>
                          </th>

                          <th>{t('Date')}</th>
                          <th>{t('boat name')}</th>
                          <th>{t('type')}</th>
                          <th>{t('from time')}</th>
                          <th>{t('to time')}</th>
                          <th>{t('createtime')}</th>
                        </tr>
                      </thead>
                      <tbody className='mc-table-body even'>
                        {unavailability && unavailability.length > 0 ? (
                          unavailability.map((item, index) => (
                            <tr key={index}>
                              <td title='id'>
                                <div className='mc-table-check'>
                                  <p>{index + 1}</p>
                                </div>
                              </td>
                              <td>{item.date || 'NA'}</td>
                              <td>{item.boat_name_english || 'NA'}</td>
                              <td>
                                {item.type == 0
                                  ? 'Full Day'
                                  : 'Selected Hours' || 'NA'}
                              </td>
                              <td>{item.from_time || 'NA'}</td>
                              <td>{item.to_time || 'NA'}</td>
                              <td>{item.createtime || 'NA'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='7' style={{ textAlign: 'center' }}>
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Form>
          </Card.Body>
        </Row>
      </div>
    </PageLayout>
  )
}
