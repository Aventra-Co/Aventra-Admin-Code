import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Card, Spinner } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import { Form } from 'react-bootstrap'
import axios from 'axios'
import './UserProfilePage.css'
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from '../../constant/constant'
import Swal from 'sweetalert2'
import { decode } from 'base-64';

export default function TripViewPage() {
  const { t } = useContext(TranslatorContext)
  const { trip_id } = useParams()
  const decode_trip_id = decode(trip_id)
  const [content, setContent] = useState(0)
  const [tripData, setTripData] = useState(null)
  const [allAddons, setAllAddons] = useState([])
  const [tripAddons, setTripAddons] = useState([])
  const [selectedAddon, setSelectedAddon] = useState('all')
  const [loadingTrip, setLoadingTrip] = useState(true)
  const [loadingAddons, setLoadingAddons] = useState(true)
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [ratings, setRatings] = useState([])
  const [loadingRatings, setLoadingRatings] = useState(true)

  const contentTypes = {
    images: 0,
    addons: 1,
    ratings: 2
  }

  const handleButtonClick = contentType => {
    setContent(contentTypes[contentType])
  }

  const fetchTripData = async () => {
    try {
      setLoadingTrip(true)
      const response = await axios.get(`${API_URL}/fetch_trip_by_Id?trip_id=${trip_id}`)
      setTripData(response.data.trip_arr[0])
    } catch (error) {
      console.error('Error fetching trip data:', error)
      Swal.fire('Error', 'Failed to load trip data', 'error')
    } finally {
      setLoadingTrip(false)
    }
  }

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true)
      const response = await axios.get(`${API_URL}/get_rating_by_id?trip_id=${trip_id}`)
      if (response.data.success) {
        setRatings(response.data.rating_array || [])
      } else {
        setRatings([])
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setRatings([])
    } finally {
      setLoadingRatings(false)
    }
  }

  const fetchAllAddons = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_all_addons`)
      if (response.data.success) {
        setAllAddons(response.data.addonArray)
      }
    } catch (error) {
      console.error('Error fetching all addons:', error)
    }
  }

  const fetchTripAddons = async (addonId = null) => {
    try {
      setLoadingAddons(true)
      let url = `${API_URL}/fetch_view_trip_addons?trip_id=${decode_trip_id}`
      if (addonId && addonId !== 'all') {
        url += `&addon_id=${addonId}`
      }

      const response = await axios.get(url)
      if (response.data.success) {
        setTripAddons(response.data.data)
      } else {
        setTripAddons([])
      }
    } catch (error) {
      console.error('Error fetching trip addons:', error)
      setTripAddons([])
    } finally {
      setLoadingAddons(false)
    }
  }

  useEffect(() => {
    fetchTripData()
    fetchAllAddons()
    fetchTripAddons()
    fetchRatings()
  }, [trip_id])

  useEffect(() => {
    fetchTripAddons(selectedAddon === 'all' ? null : selectedAddon)
  }, [selectedAddon])

  const handleImageClick = imageUrl => {
    setEnlargedImage(imageUrl)
    setShowImagePopup(true)
  }

  const handleCloseImage = () => {
    setEnlargedImage(null)
    setShowImagePopup(false)
  }

  const handleRemoveImage = async image_id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this trip image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    })

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${API_URL}/delete_trip_image`, { image_id })
        if (response.data.success) {
          await fetchTripData()
          Swal.fire('Deleted!', 'Trip Image has been deleted.', 'success')
        } else {
          throw new Error(response.data.message || 'Failed to delete image')
        }
      } catch (error) {
        Swal.fire('Error', error.message || 'An error occurred while deleting.', 'error')
      }
    }
  }

  if (loadingTrip) {
    return (
      <PageLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </PageLayout>
    )
  }

  if (!tripData) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <h4>Trip not found</h4>
          <Link to={`${APP_PREFIX_PATH}/manage-trips`} className="btn btn-primary mt-3">
            Back to Trips
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Trip Details')}</h3>
            <ul className='mc-breadcrumb-list'>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH}/dashboard`} className='mc-breadcrumb-link'>
                  {t('home')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH}/manage-trips`} className='mc-breadcrumb-link'>
                  {t('trip')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('view trip')}</li>
            </ul>
          </div>
        </div>
      </Col>

      <div className='mc-card p-lg-4'>
        <Row>
          <Col xl={4}>
            <div className='mc-user-group'>
              <div className=''>
                <div className=''>
                  <img
                    src={
                      tripData.trip_image
                        ? `${IMAGE_PATH}${tripData.trip_image}`
                        : `${IMAGE_PATH}trip.webp`
                    }
                    alt='Trip'
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '5%',
                      cursor: 'pointer'
                    }}
                    onClick={() =>
                      handleImageClick(
                        tripData.trip_image
                          ? `${IMAGE_PATH}${tripData.trip_image}`
                          : `${IMAGE_PATH}trip.webp`
                      )
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleImageClick(
                          tripData.trip_image
                            ? `${IMAGE_PATH}${tripData.trip_image}`
                            : `${IMAGE_PATH}trip.webp`
                        )
                      }
                    }}
                    role='button'
                    tabIndex={0}
                  />

                  {showImagePopup && (
                    <div
                      className='enlarged-image-overlay'
                      onClick={handleCloseImage}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          handleCloseImage()
                        }
                      }}
                      role='button'
                      tabIndex={0}
                    >
                      <span
                        className='close-button'
                        onClick={handleCloseImage}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleCloseImage()
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        &times;
                      </span>
                      <img
                        src={enlargedImage}
                        alt='Enlarged Trip'
                        className='enlarged-image'
                        style={{ width: '30rem', height: '30rem' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col xl={8}>
            <h6 className='mc-divide-title mb-0 ms-2'>{t('Trip Details')}</h6>
            <div className='mc-product-view-info-group'>
              <div className='col-lg-12 content'>
                <div className='mobile-view'>
                  <div className='row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Captain Name In English')}:</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.captain_name_english || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Captain Name In Arabic')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.captain_name_arabic || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Owner Name')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.owner_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Captain Number')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.contact_number || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Gender')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.gender_lable || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip ID')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.random_id}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Boat Name')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.boat_name_english ? tripData.boat_name_english : 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Price (KWD/Hr)')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.price_per_hour ? tripData.price_per_hour : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Nationality')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.country ? tripData.country : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('City')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.city ? tripData.city : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Pickup Point')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.pickup_point ? tripData.pickup_point : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Destination')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.pickup_point ? tripData.destination_english : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Advertisement Type')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.advertisement_type == 0 ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip Type')} :</h6>
                    </div>
                    {/* <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.trip_type_name ? tripData.trip_type_name : 'NA'}
                      </span>
                    </div> */}
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.trip_type_names && tripData.trip_type_names.length > 0 ? (
                          tripData.trip_type_names.join(', ') // Display names separated by commas
                        ) : (
                          'NA'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Maximum People')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.max_people ? tripData.max_people : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Discount (%)')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.discount ? tripData.discount : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Coupon Code Discount (%)')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.coupon_discount ? tripData.coupon_discount : 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip Date')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.trip_date == 0
                          ? 'All Days'
                          : tripData.trip_date == 1
                            ? 'Selected Dates'
                            : 'Weekend (fri-sat)' || 'NA'}
                      </span>
                    </div>
                  </div>
                  {tripData.trip_date == 1 && (
                    <div className=' row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Dates')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {tripData.dates || 'NA'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip Time')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.trip_time == 0 ? 'Open Time' : 'Fixed Time'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('From Time')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.from_time || 'NA'}
                      </span>
                    </div>
                  </div>
                  {tripData.trip_time == 0 && (
                    <div className=' row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('To Time')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {tripData.to_time || 'NA'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Minimum Hours')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.minimum_hours || 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Idle Hours')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.idle_hours || 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Free to cancle (before)')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.free_to_cancel + ' Days' || 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Create Date & Time')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.createtime || 'NA'}
                      </span>
                    </div>
                  </div>
                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip Desciption English')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.description_english || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className=' row mt-2'>
                    <div className='col-lg-4'>
                      <h6>{t('Trip Desciption Arabic')} :</h6>
                    </div>
                    <div className='col-lg-8'>
                      <span style={{ fontWeight: '400' }}>
                        {tripData.description_arabic || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Include all other trip detail fields similarly */}
                  {/* ... */}

                </div>
              </div>
            </div>
          </Col>
        </Row>

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
                  className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.images ? 'btn-active' : ''
                    }`}
                  style={{ width: '15rem' }}
                  type='button'
                  onClick={() => handleButtonClick('images')}
                >
                  {t('Images')}
                </button>
                <button
                  className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.addons ? 'btn-active' : ''
                    }`}
                  style={{ width: '15rem' }}
                  type='button'
                  onClick={() => handleButtonClick('addons')}
                >
                  {t('Addons')}
                </button>
                <button
                  className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.ratings ? 'btn-active' : ''
                    }`}
                  style={{ width: '15rem' }}
                  type='button'
                  onClick={() => handleButtonClick('ratings')}
                >
                  {t('Ratings')}
                </button>
              </div>
            </nav>

            {content === 0 && (
              <div style={{ margin: '1rem' }}>
                <Col xl={12}>
                  <div className='col-lg-3'>
                    <h6>{t('Trip Images')}:</h6>
                  </div>
                  <div
                    className='row mt-2'
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      rowGap: '1rem'
                    }}
                  >
                    {tripData.trip_images && tripData.trip_images.length > 0 ? (
                      tripData.trip_images.map((item, index) => (
                        <div
                          key={index}
                          className='col-lg-3'
                          style={{ position: 'relative' }}
                        >
                          <img
                            src={
                              item.image
                                ? `${IMAGE_PATH}${item.image}`
                                : `${IMAGE_PATH}trip.webp`
                            }
                            alt='Trip'
                            style={{
                              width: '100%',
                              height: '10rem',
                              borderRadius: '5%',
                              cursor: 'pointer'
                            }}
                            onClick={() =>
                              handleImageClick(
                                item.image
                                  ? `${IMAGE_PATH}${item.image}`
                                  : `${IMAGE_PATH}trip.webp`
                              )
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleImageClick(
                                  item.image
                                    ? `${IMAGE_PATH}${item.image}`
                                    : `${IMAGE_PATH}trip.webp`
                                )
                              }
                            }}
                            role='button'
                            tabIndex={0}
                          />
                          <span
                            className='close-icon'
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '20px',
                              background: 'rgba(0, 0, 0, 0.53)',
                              color: 'white',
                              borderRadius: '50%',
                              padding: '5px 10px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                            onClick={() => handleRemoveImage(item.trip_image_id)}
                            role='button'
                            tabIndex={0}
                          >
                            &times;
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-4">
                        <p>No images available for this trip</p>
                      </div>
                    )}
                  </div>
                </Col>
              </div>
            )}

            {content === 1 && (
              <div style={{ margin: '1rem' }}>
                <div className="mb-3">
                  <Form.Select
                    value={selectedAddon}
                    onChange={(e) => setSelectedAddon(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="all">All Addons</option>
                    {allAddons.map((addon) => (
                      <option key={addon.addon_id} value={addon.addon_id}>
                        {addon.addon_name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {loadingAddons ? (
                  <div className="d-flex justify-content-center py-4">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className='mc-table-responsive'>
                    <table className='mc-table'>
                      <thead className='mc-table-head primary'>
                        <tr>
                          <th>S.No</th>
                          <th>{t('Addon Name')}</th>
                          <th>{t('Sub Category')}</th>
                          <th>{t('Price')}</th>
                          <th>{t('Created At')}</th>
                        </tr>
                      </thead>
                      <tbody className='mc-table-body even'>
                        {tripAddons.length > 0 ? (
                          tripAddons.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.addon_name || 'NA'}</td>
                              <td>{item.sub_category_name || 'NA'}</td>
                              <td>{item.price || 'NA'}</td>
                              <td>{item.createtime || 'NA'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='5' className="text-center py-4">
                              No addons found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {content === 2 && (
              <div style={{ margin: '1rem' }}>
                {loadingRatings ? (
                  <div className="d-flex justify-content-center py-4">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className='mc-table-responsive'>
                    <table className='mc-table'>
                      <thead className='mc-table-head primary'>
                        <tr>
                          <th>S.No</th>
                          <th>{t('User Name')}</th>
                          <th>{t('Rating')}</th>
                          <th>{t('Review')}</th>
                          <th>{t('Created At')}</th>
                        </tr>
                      </thead>
                      <tbody className='mc-table-body even'>
                        {ratings.length > 0 ? (
                          ratings.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.name || `${item.f_name} ${item.l_name}` || 'NA'}</td>
                              <td>
                                {item.total_rating
                                  ? '★'.repeat(Math.floor(item.total_rating)) + '☆'.repeat(5 - Math.floor(item.total_rating))
                                  : 'NA'}
                              </td>

                              <td>{item.review || 'NA'}</td>
                              <td>{item.createtime || 'NA'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='5' className="text-center py-4">
                              No ratings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}


          </Form>
        </Card.Body>
      </div>
    </PageLayout>
  )
}