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

export default function ViewPropertyAdvertisement() {
  const { t } = useContext(TranslatorContext)
  const { property_ad_id } = useParams()
  const decode_property_ad_id = decode(property_ad_id)
  const [content, setContent] = useState(0)
  const [propertyData, setPropertyData] = useState(null)
  const [loadingProperty, setLoadingProperty] = useState(true)
  const [loadingRatings, setLoadingRatings] = useState(true)
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [ratings, setRatings] = useState([])

  const contentTypes = {
    images: 0,
    ratings: 1
  }

  const handleButtonClick = contentType => {
    setContent(contentTypes[contentType])
  }

  const fetchPropertyData = async () => {
    try {
      setLoadingProperty(true)
      const response = await axios.get(`${API_URL}/view_property_advertisements?property_ad_id=${decode(property_ad_id)}`)
      if (response.data.success) {
        setPropertyData(response.data.data)
      } else {
        Swal.fire('Error', response.data.msg || 'Failed to load property data', 'error')
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
      Swal.fire('Error', 'Failed to load property data', 'error')
    } finally {
      setLoadingProperty(false)
    }
  }

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true)
      // You can implement this API later
      // const response = await axios.get(`${API_URL}/get_property_ratings?property_ad_id=${property_ad_id}`)
      // if (response.data.success) {
      //   setRatings(response.data.rating_array || [])
      // } else {
      //   setRatings([])
      // }
      
      // For now, set empty ratings
      setTimeout(() => {
        setRatings([])
        setLoadingRatings(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setRatings([])
      setLoadingRatings(false)
    }
  }

  useEffect(() => {
    fetchPropertyData()
    fetchRatings()
  }, [property_ad_id])

  const handleImageClick = imageUrl => {
    setEnlargedImage(imageUrl)
    setShowImagePopup(true)
  }

  const handleCloseImage = () => {
    setEnlargedImage(null)
    setShowImagePopup(false)
  }

  const getGenderLabel = (gender) => {
    if (gender === 0) return 'Male'
    if (gender === 1) return 'Female'
    return 'NA'
  }

  if (loadingProperty) {
    return (
      <PageLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </PageLayout>
    )
  }

  if (!propertyData) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <h4>Property advertisement not found</h4>
          <Link to={`${APP_PREFIX_PATH}/property-advertisement`} className="btn btn-primary mt-3">
            Back to Property Advertisements
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
            <h3 className='mc-breadcrumb-title'>{t('Property Advertisement Details')}</h3>
            <ul className='mc-breadcrumb-list'>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH}/dashboard`} className='mc-breadcrumb-link'>
                  {t('home')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH}/property-advertisement`} className='mc-breadcrumb-link'>
                  {t('property advertisements')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('view property')}</li>
            </ul>
          </div>
        </div>
      </Col>

      <div className='mc-card p-lg-4'>
        <h6 className='mc-divide-title mb-3 ms-2'>{t('Property Details')}</h6>
        <div className='mc-product-view-info-group'>
          <div className='col-lg-12 content'>
            <div className='mobile-view'>
              {/* Two Column Layout for Property Details */}
              <Row>
                {/* Left Column */}
                <Col md={6}>
                  {/* Property Name (English) */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Property Name (English)')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.property_name_english || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Property Name (Arabic) */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Property Name (Arabic)')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.property_name_arabic || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Owner Name')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.name || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Guard Name */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Guard Name')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.guard_name_english || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Guard Number */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Guard Number')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.guard_number ? "+965 " + propertyData.guard_number : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Guard Gender */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Guard Gender')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {getGenderLabel(propertyData.gender)}
                      </span>
                    </div>
                  </div>

                  {/* Country */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Country')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.country_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* City */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('City')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.city_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Destination')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.destination_name || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Address')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.address || 'NA'}
                      </span>
                    </div>
                  </div>

                 {/* Max Adults */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Max Adults')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.max_adult || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Max Children */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Max Children')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.max_child || 'NA'}
                      </span>
                    </div>
                  </div>


                </Col>

                {/* Right Column */}
                <Col md={6}>
             

                 

                  {/* Amenities */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Amenities')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.amenity_names_string || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* One Day Price */}
                  {/* <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('One Day Price')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.lowest_price ? `${propertyData.lowest_price} KWD` : 'NA'}
                      </span>
                    </div>
                  </div> */}

                  {/* Weekday Price */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Weekday Price')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.weekday_price ? `${propertyData.weekday_price} KWD` : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Weekend Price */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Weekend Price')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.weekend_price ? `${propertyData.weekend_price} KWD` : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Full Week Price */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Full Week Price')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.full_week_price ? `${propertyData.full_week_price} KWD` : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Discount Percentage */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Discount Percentage')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.discount_percentage ? `${propertyData.discount_percentage}%` : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Coupon Code')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.coupon_code || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Discount */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Coupon Discount')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.coupon_discount ? `${propertyData.coupon_discount}%` : 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Free Cancel Days */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Free Cancel Days')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.free_cancel_days || 'NA'}
                      </span>
                    </div>
                  </div>

                  {/* Pet Friendly */}
                  <div className='row mt-2'>
                    <div className='col-lg-5'>
                      <h6>{t('Pet Friendly')}:</h6>
                    </div>
                    <div className='col-lg-7'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.pet_friendly === 1 ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Descriptions - Full Width Below */}
              <Row className='mt-4'>
                <Col md={12}>
                  <div className='row mt-2'>
                    <div className='col-lg-2'>
                      <h6>{t('Description (English)')}:</h6>
                    </div>
                    <div className='col-lg-10'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.description_english || 'NA'}
                      </span>
                    </div>
                  </div>

                  <div className='row mt-2'>
                    <div className='col-lg-2'>
                      <h6>{t('Description (Arabic)')}:</h6>
                    </div>
                    <div className='col-lg-10'>
                      <span style={{ fontWeight: '400' }}>
                        {propertyData.description_arabic || 'NA'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

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
                    <h6>{t('Property Images')}:</h6>
                  </div>
                  <div
                    className='row mt-2'
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      rowGap: '1rem'
                    }}
                  >
                    {propertyData.images && propertyData.images.length > 0 ? (
                      propertyData.images.map((item, index) => (
                        <div
                          key={index}
                          className='col-lg-3'
                          style={{ position: 'relative' }}
                        >
                          <img
                            src={
                              item.image_path
                                ? `${IMAGE_PATH}${item.image_path}`
                                : `${IMAGE_PATH}property-placeholder.jpg`
                            }
                            alt='Property'
                            style={{
                              width: '100%',
                              height: '10rem',
                              borderRadius: '5%',
                              cursor: 'pointer',
                              border: item.is_cover === 1 ? '3px solid gold' : 'none'
                            }}
                            onClick={() =>
                              handleImageClick(
                                item.image_path
                                  ? `${IMAGE_PATH}${item.image_path}`
                                  : `${IMAGE_PATH}property-placeholder.jpg`
                              )
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleImageClick(
                                  item.image_path
                                    ? `${IMAGE_PATH}${item.image_path}`
                                    : `${IMAGE_PATH}property-placeholder.jpg`
                                )
                              }
                            }}
                            role='button'
                            tabIndex={0}
                          />
                          {item.is_cover === 1 && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '20px',
                                background: 'gold',
                                color: 'black',
                                borderRadius: '4px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                            >
                              Cover
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-4">
                        <p>No images available for this property</p>
                      </div>
                    )}
                  </div>
                </Col>
              </div>
            )}

            {content === 1 && (
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

      {/* Image Popup Modal */}
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
            alt='Enlarged Property'
            className='enlarged-image'
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
          />
        </div>
      )}
    </PageLayout>
  )
}