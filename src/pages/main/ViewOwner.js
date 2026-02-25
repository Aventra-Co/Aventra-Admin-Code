import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Card, Form } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import { encode } from 'base-64'
import { decode } from 'base-64'
import { AnchorComponent, ButtonComponent } from '../../components/elements'
import './UserProfilePage.css'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { API_URL, IMAGE_PATH, APP_PREFIX_PATH } from '../../constant/constant'
import { SyncLoader } from 'react-spinners'
import LabelFieldComponent from '../../components/fields/LabelFieldComponent'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet-async'
import { 
  Box
} from '@mui/material'

export default function ViewOwner() {
  const { t } = useContext(TranslatorContext)
  const [content, setContent] = useState(0)
  const [unavailabilitySubTab, setUnavailabilitySubTab] = useState('boat') // 'boat' or 'property'
  const { user_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [Data, setData] = useState('')
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [staff, setStaff] = useState([])
  const [boat, setboat] = useState([])
  const [properties, setProperties] = useState([])
  const [propertyAdvertisements, setPropertyAdvertisements] = useState([])
  const [trips, settrips] = useState([])
  const [Ratings, setRatings] = useState([])
  const [boatUnavailability, setBoatUnavailability] = useState([])
  const [propertyUnavailability, setPropertyUnavailability] = useState([])
  const [loadingUnavailability, setLoadingUnavailability] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  const contentTypes = {
    staff: 0,
    boat: 1,
    property: 2,
    propertyAdvertisement: 3,
    trip: 4,
    ratings: 5,
    unavailability: 6,
    bookings: 7
  }

  const handleButtonClick = contentType => {
    setContent(contentTypes[contentType])
    setSearchTerm('')
  }

  const handleUnavailabilitySubTabChange = (subTab) => {
    setUnavailabilitySubTab(subTab)
    setSearchTerm('')
  }

  const handleStaffDelete = userId => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this staff member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_staff_by_admin_side`, { staff_id: userId })
          .then(response => {
            if (response.data.success) {
              setStaff(prevStaff =>
                prevStaff.filter(user => user.user_id !== userId)
              )
              Swal.fire(
                'Deleted!',
                'The staff member has been deleted.',
                'success'
              )
            } else {
              Swal.fire('Error', 'Failed to delete staff member.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handleBoatDelete = boat_id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Boat?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_boat_admin_side`, { boat_id: boat_id })
          .then(response => {
            if (response.data.success) {
              setboat(prevBoats =>
                prevBoats.filter(boat => boat.boat_id !== boat_id)
              )
              Swal.fire('Deleted!', 'The Boat has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Boat.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handlePropertyDelete = property_id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_property`, { property_id: property_id })
          .then(response => {
            if (response.data.success) {
              setProperties(prevProperties =>
                prevProperties.filter(property => property.property_id !== property_id)
              )
              Swal.fire('Deleted!', 'The Property has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Property.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handlePropertyAdvertisementDelete = property_ad_id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Property Advertisement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_property_advertisement`, { property_ad_id: property_ad_id })
          .then(response => {
            if (response.data.success) {
              setPropertyAdvertisements(prevAds =>
                prevAds.filter(ad => ad.property_ad_id !== property_ad_id)
              )
              Swal.fire('Deleted!', 'The Property Advertisement has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Property Advertisement.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handleTripDelete = trip_id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Trip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_trip`, { trip_id: trip_id })
          .then(response => {
            if (response.data.success) {
              settrips(prevTrips =>
                prevTrips.filter(trip => trip.trip_id !== trip_id)
              )
              Swal.fire('Deleted!', 'The Trip has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Trip.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handleBoatUnavailabilityDelete = (unavailability_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Boat Unavailability?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_unavailability`, { unavailability_id: unavailability_id })
          .then(response => {
            if (response.data.success) {
              setBoatUnavailability(prev => 
                prev.filter(item => item.unavailability_id !== unavailability_id)
              )
              Swal.fire('Deleted!', 'The Boat Unavailability has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Unavailability.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const handlePropertyUnavailabilityDelete = (unavailability_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete this Property Unavailability?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      dangerMode: true
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(API_URL + `/delete_unavailability`, { unavailability_id: unavailability_id })
          .then(response => {
            if (response.data.success) {
              setPropertyUnavailability(prev => 
                prev.filter(item => item.unavailability_id !== unavailability_id)
              )
              Swal.fire('Deleted!', 'The Property Unavailability has been deleted.', 'success')
            } else {
              Swal.fire('Error', 'Failed to delete Unavailability.', 'error')
            }
          })
          .catch(error => {
            Swal.fire('Error', 'An error occurred while deleting.', 'error')
          })
      }
    })
  }

  const getData = () => {
    setLoading(true)
    axios
      .get(API_URL + `/fetch_owner_by_id?user_id=${user_id}`)
      .then(res => {
        if (res.data.success) {
          setData(res.data.user_arr[0])
          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fetchBoatUnavailability = () => {
    setLoadingUnavailability(true)
    axios
      .get(API_URL + `/get_unavailability_admin?user_id=${decode(user_id)}&entity_type=0`)
      .then(response => {
        if (response.data.success) {
          setBoatUnavailability(response.data.unavailability || [])
        }
        setLoadingUnavailability(false)
      })
      .catch(error => {
        console.error('Error fetching boat unavailability:', error)
        setBoatUnavailability([])
        setLoadingUnavailability(false)
      })
  }

  const fetchPropertyUnavailability = () => {
    setLoadingUnavailability(true)
    axios
      .get(API_URL + `/get_unavailability_admin?user_id=${decode(user_id)}&entity_type=1`)
      .then(response => {
        if (response.data.success) {
          setPropertyUnavailability(response.data.unavailability || [])
        }
        setLoadingUnavailability(false)
      })
      .catch(error => {
        console.error('Error fetching property unavailability:', error)
        setPropertyUnavailability([])
        setLoadingUnavailability(false)
      })
  }

  const fetchOwnerRelatedData = () => {
    axios
      .get(API_URL + `/fetch_owner_related_data?user_id=${user_id}`)
      .then(response => {
        if (response.data.success) {
          setStaff(
            response.data.staff === 'NA' ? [] : response.data.staff || []
          )
          setboat(response.data.boat === 'NA' ? [] : response.data.boat || [])
          settrips(
            response.data.trips === 'NA' ? [] : response.data.trips || []
          )
          setRatings(
            response.data.Ratings && response.data.Ratings[0] === 'N'
              ? []
              : response.data.Ratings || []
          )
        }
      })
      .catch()
  }

  const fetchProperties = () => {
    axios
      .get(API_URL + `/fetch_property_data_by_id?user_id=${decode(user_id)}`)
      .then(response => {
        if (response.data.success) {
          setProperties(response.data.data || [])
        }
      })
      .catch(error => {
        console.error('Error fetching properties:', error)
        setProperties([])
      })
  }

  const fetchPropertyAdvertisements = () => {
    axios
      .get(API_URL + `/get_all_owner_advertisements?user_id=${decode(user_id)}`)
      .then(response => {
        if (response.data.success) {
          setPropertyAdvertisements(response.data.data || [])
        }
      })
      .catch(error => {
        console.error('Error fetching property advertisements:', error)
        setPropertyAdvertisements([])
      })
  }

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true)
      const response = await axios.get(`${API_URL}/fetch_booking_by_user?user_id=${decode(user_id)}`)
      if (response.data.success) {
        setBookings(response.data.booking_arr || [])
      } else {
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    getData()
    fetchOwnerRelatedData()
    fetchProperties()
    fetchPropertyAdvertisements()
    fetchBoatUnavailability()
    fetchPropertyUnavailability()
    fetchBookings()
  }, [])

  const handleImageClick = imageUrl => {
    setEnlargedImage(imageUrl)
    setShowImagePopup(true)
  }

  const handleCloseImage = () => {
    setEnlargedImage(null)
    setShowImagePopup(false)
  }

  const filteredstaff = staff.filter(user => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      user.f_name?.toLowerCase().includes(lowercasedTerm) ||
      user.l_name?.toLowerCase().includes(lowercasedTerm) ||
      user.role_english?.toLowerCase().includes(lowercasedTerm) ||
      (user.email &&
        String(user.email).toLowerCase().includes(lowercasedTerm)) ||
      (user.createtime &&
        String(user.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredboat = boat.filter(user => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (user.boat_name_english &&
        String(user.boat_name_english)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (user.boat_registration_number &&
        String(user.boat_registration_number)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (user.toilet &&
        String(user.toilet).toLowerCase().includes(lowercasedTerm)) ||
      (user.cabins &&
        String(user.cabins).toLowerCase().includes(lowercasedTerm)) ||
      (user.boat_capacity &&
        String(user.boat_capacity).toLowerCase().includes(lowercasedTerm)) ||
      (user.boat_size &&
        String(user.boat_size).toLowerCase().includes(lowercasedTerm)) ||
      (user.boat_year &&
        String(user.boat_year).toLowerCase().includes(lowercasedTerm)) ||
      (user.createtime &&
        String(user.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredProperties = properties.filter(property => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (property.property_name_english &&
        String(property.property_name_english)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (property.property_id &&
        String(property.property_id).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredPropertyAdvertisements = propertyAdvertisements.filter(ad => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (ad.property_name_english &&
        String(ad.property_name_english).toLowerCase().includes(lowercasedTerm)) ||
      (ad.guard_name_english &&
        String(ad.guard_name_english).toLowerCase().includes(lowercasedTerm)) ||
      (ad.address &&
        String(ad.address).toLowerCase().includes(lowercasedTerm)) ||
      (ad.one_day_price &&
        String(ad.one_day_price).toLowerCase().includes(lowercasedTerm)) ||
      (ad.createtime &&
        String(ad.createtime).toLowerCase().includes(lowercasedTerm)) ||
      (ad.random_booking_id &&
        String(ad.random_booking_id).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredtrips = trips.filter(user => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (user.boat_name_english &&
        String(user.boat_name_english)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (user.price_per_hour &&
        String(user.price_per_hour).toLowerCase().includes(lowercasedTerm)) ||
      (user.captain_name_english &&
        String(user.captain_name_english)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (user.random_id &&
        String(user.random_id).toLowerCase().includes(lowercasedTerm)) ||
      (user.createtime &&
        String(user.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredRatings = Ratings.filter(user => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (user.review &&
        String(user.review).toLowerCase().includes(lowercasedTerm)) ||
      (user.entertainment &&
        String(user.entertainment).toLowerCase().includes(lowercasedTerm)) ||
      (user.equipment &&
        String(user.equipment).toLowerCase().includes(lowercasedTerm)) ||
      (user.food && String(user.food).toLowerCase().includes(lowercasedTerm)) ||
      (user.hospitality &&
        String(user.hospitality).toLowerCase().includes(lowercasedTerm)) ||
      (user.captain &&
        String(user.captain).toLowerCase().includes(lowercasedTerm)) ||
      (user.captain &&
        String(user.captain).toLowerCase().includes(lowercasedTerm)) ||
      (user.clean &&
        String(user.clean).toLowerCase().includes(lowercasedTerm)) ||
      (user.time && String(user.time).toLowerCase().includes(lowercasedTerm)) ||
      (user.name && String(user.name).toLowerCase().includes(lowercasedTerm)) ||
      (user.trip_name_english &&
        String(user.trip_name_english)
          .toLowerCase()
          .includes(lowercasedTerm)) ||
      (user.createtime &&
        String(user.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredBoatUnavailability = boatUnavailability.filter(item => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (item.to_time &&
        String(item.to_time).toLowerCase().includes(lowercasedTerm)) ||
      (item.from_time &&
        String(item.from_time).toLowerCase().includes(lowercasedTerm)) ||
      (item.entity_name &&
        String(item.entity_name).toLowerCase().includes(lowercasedTerm)) ||
      (item.date && String(item.date).toLowerCase().includes(lowercasedTerm)) ||
      String(item.type == 0 ? 'Full Day' : 'Selected Hours')
        .toLowerCase()
        .includes(lowercasedTerm) ||
      (item.createtime &&
        String(item.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredPropertyUnavailability = propertyUnavailability.filter(item => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (item.to_time &&
        String(item.to_time).toLowerCase().includes(lowercasedTerm)) ||
      (item.from_time &&
        String(item.from_time).toLowerCase().includes(lowercasedTerm)) ||
      (item.entity_name &&
        String(item.entity_name).toLowerCase().includes(lowercasedTerm)) ||
      (item.date && String(item.date).toLowerCase().includes(lowercasedTerm)) ||
      String(item.type == 0 ? 'Full Day' : 'Selected Hours')
        .toLowerCase()
        .includes(lowercasedTerm) ||
      (item.createtime &&
        String(item.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  const filteredBookings = bookings.filter(booking => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      (booking.name && String(booking.name).toLowerCase().includes(lowercasedTerm)) ||
      (booking.random_booking_id && String(booking.random_booking_id).toLowerCase().includes(lowercasedTerm)) ||
      (booking.ownerName && String(booking.ownerName).toLowerCase().includes(lowercasedTerm)) ||
      (booking.price_per_hour && String(booking.price_per_hour).toLowerCase().includes(lowercasedTerm)) ||
      (booking.date && String(booking.date).toLowerCase().includes(lowercasedTerm)) ||
      (booking.booking_time && String(booking.booking_time).toLowerCase().includes(lowercasedTerm)) ||
      (booking.total_amount && String(booking.total_amount).toLowerCase().includes(lowercasedTerm)) ||
      (booking.transaction_id && String(booking.transaction_id).toLowerCase().includes(lowercasedTerm)) ||
      (booking.createtime && String(booking.createtime).toLowerCase().includes(lowercasedTerm))
    )
  })

  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | Owner-View</title>
      </Helmet>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Owner Details')}</h3>
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
                  to={`${APP_PREFIX_PATH + '/manage-owners'}`}
                  className='mc-breadcrumb-link'
                >
                  {t('owners')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('owner list')}</li>
            </ul>
          </div>
        </div>
      </Col>

      {loading ? (
        <div className='d-flex align-items-center' style={{ height: '40vh' }}>
          <SyncLoader
            animation='border'
            color='#086861'
            variant='primary'
            style={{ marginLeft: '40%' }}
          />
        </div>
      ) : (
        <div className='mc-card p-lg-4'>
          <Row>
            <Col xl={5}>
              <h6 className='mc-divide-title mb-4'>{t('')}</h6>
              <div className='mc-user-group'>
                <img
                  src={
                    Data && Data.image
                      ? `${IMAGE_PATH}${Data.image}`
                      : `${IMAGE_PATH}Placeholder.webp`
                  }
                  alt='Profile'
                  style={{
                    width: '15rem',
                    height: '15rem',
                    borderRadius: '5%',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    handleImageClick(
                      Data.image
                        ? `${IMAGE_PATH}${Data.image}`
                        : `${IMAGE_PATH}Placeholder.webp`
                    )
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleImageClick(
                        Data.image
                          ? `${IMAGE_PATH}${Data.image}`
                          : `${IMAGE_PATH}Placeholder.webp`
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
                      alt='Enlarged Profile'
                      className='enlarged-image'
                      style={{ width: '30rem', height: '30rem' }}
                    />
                  </div>
                )}
              </div>
            </Col>
            <Col xl={7}>
              <h6 className='mc-divide-title mb-4'>{t('Owner Details')}</h6>
              <div className='mc-product-view-info-group'>
                <div className='col-lg-12 content'>
                  <div className='mobile-view'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <h6>{t('User Name')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.f_name}</span>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Full Name')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.l_name}</span>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('email')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.email}</span>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('mobile')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.mobile}</span>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('DOB')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.dob}</span>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Merchant Id')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.merchant_id}</span>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Company Name')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>{Data.owner_company_name}</span>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Gender')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {Data.gender == 0 ? 'Male' : Data.gender == 1 ? 'Female' : 'Company' || 'other'}
                        </span>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Create Date & Time')} :</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {Data.createtime || 'NA'}
                        </span>
                      </div>
                    </div>
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
                    type="button"
                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.staff ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('staff')
                      setSearchTerm('')
                    }}
                  >
                    {t('Staff')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.boat ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('boat')
                      setSearchTerm('')
                    }}
                  >
                    {t('Boat')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.property ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('property')
                      setSearchTerm('')
                    }}
                  >
                    {t('Property')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.propertyAdvertisement ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('propertyAdvertisement')
                      setSearchTerm('')
                    }}
                  >
                    {t('Advertisement')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.trip ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('trip')
                      setSearchTerm('')
                    }}
                  >
                    {t('Trips')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.ratings ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('ratings')
                      setSearchTerm('')
                    }}
                  >
                    {t('ratings')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.unavailability ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('unavailability')
                      setSearchTerm('')
                    }}
                  >
                    {t('Unavailability')}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.bookings ? 'btn-active' : ''}`}
                    style={{ width: '15rem' }}
                    onClick={() => {
                      handleButtonClick('bookings')
                      setSearchTerm('')
                    }}
                  >
                    {t('Bookings')}
                  </button>
                </div>
              </nav>

              {content === 0 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      <Link to={APP_PREFIX_PATH + `/add-staff/${user_id}`}>
                        <button
                          type="button"
                          style={{
                            background: '#2b77e5',
                            padding: '7px 13px',
                            color: '#fff',
                            borderRadius: '5px'
                          }}
                        >
                          {' '}
                          <AddIcon className='me-2' /> {t('Add Staff')}{' '}
                        </button>
                      </Link>
                    </Col>
                  </Row>
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
                            <th>{t('Action')}</th>
                            <th>{t('image')}</th>
                            <th>{t('User Name')}</th>
                            <th>{t('Full Name')}</th>
                            <th>{t('Role')}</th>
                            <th>{t('email')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredstaff && filteredstaff.length > 0 ? (
                            filteredstaff.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                <td>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/view-staff/${encode(
                                      item.user_id
                                    )}`}
                                    title='View'
                                    className='material-icons view'
                                  >
                                    visibility
                                  </AnchorComponent>

                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/edit-staff/${encode(
                                      item.user_id
                                    )}`}
                                    title='Edit'
                                    className='material-icons edit'
                                  >
                                    <ButtonComponent
                                      title='Edit'
                                      className='material-icons edit'
                                    >
                                      edit
                                    </ButtonComponent>
                                  </AnchorComponent>

                                  <AnchorComponent
                                    onClick={() => {
                                      handleStaffDelete(item.user_id)
                                    }}
                                    title='Delete'
                                    className='material-icons delete'
                                  >
                                    delete
                                  </AnchorComponent>
                                </td>

                                <td title={item.name}>
                                  <div className='mc-table-profile'>
                                    <img
                                      src={
                                        item.staff_id
                                          ? `${IMAGE_PATH}${item.staff_id}`
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

                                <td>{item.f_name || 'NA'}</td>
                                <td>{item.l_name || 'NA'}</td>
                                <td>{item.role_english || 'NA'}</td>
                                <td>{item.email || 'NA'}</td>
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
                </>
              )}

              {content === 1 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      <Link to={APP_PREFIX_PATH + `/add-boat/${user_id}`}>
                        <button
                          type="button"
                          style={{
                            background: '#2b77e5',
                            padding: '7px 13px',
                            color: '#fff',
                            borderRadius: '5px'
                          }}
                        >
                          {' '}
                          <AddIcon className='me-2' /> {t('Add Boat')}{' '}
                        </button>
                      </Link>
                    </Col>
                  </Row>

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
                            <th>{t('Action')}</th>
                            <th>{t('Boat Name')}</th>
                            <th>{t('Boat Brand')}</th>
                            <th>{t('Boat Registration No.')}</th>
                            <th>{t('Boat Year')}</th>
                            <th>{t('Boat Size')}</th>
                            <th>{t('Boat Capacity')}</th>
                            <th>{t('Cabins')}</th>
                            <th>{t('Toilet')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredboat && filteredboat.length > 0 ? (
                            filteredboat.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                <td>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/edit-boat/${encode(
                                      item.boat_id
                                    )}`}
                                    title='Edit'
                                    className='material-icons edit'
                                  >
                                    edit
                                  </AnchorComponent>

                                  <AnchorComponent
                                    onClick={() =>
                                      handleBoatDelete(item.boat_id)
                                    }
                                    title='Delete'
                                    className='material-icons delete'
                                  >
                                    delete
                                  </AnchorComponent>
                                </td>
                                <td>{item.boat_name_english || 'NA'}</td>
                                <td>{item.boat_brand || 'NA'}</td>
                                <td>{item.boat_registration_number || 'NA'}</td>
                                <td>{item.boat_year || 'NA'}</td>
                                <td>{item.boat_size || 'NA'}</td>
                                <td>{item.boat_capacity || 'NA'}</td>
                                <td>{item.cabins || 'NA'}</td>
                                <td>{item.toilet || 'NA'}</td>
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
                </>
              )}

              {content === 2 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      <Link to={APP_PREFIX_PATH + `/add-property/${user_id}`}>
                        <button
                          type="button"
                          style={{
                            background: '#2b77e5',
                            padding: '7px 13px',
                            color: '#fff',
                            borderRadius: '5px'
                          }}
                        >
                          {' '}
                          <AddIcon className='me-2' /> {t('Add Property')}{' '}
                        </button>
                      </Link>
                    </Col>
                  </Row>

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
                            <th>{t('Action')}</th>
                            <th>{t('Property Name')}</th>
                            <th>{t('No of Rooms')}</th>
                            <th>{t('No of Halls')}</th>
                            <th>{t('No of Washrooms')}</th>
                            <th>{t('Pool')}</th>
                            <th>{t('Address')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredProperties && filteredProperties.length > 0 ? (
                            filteredProperties.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                <td>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/edit-property/${encode(
                                      item.property_id
                                    )}`}
                                    title='Edit'
                                    className='material-icons edit'
                                  >
                                    edit
                                  </AnchorComponent>

                                  <AnchorComponent
                                    onClick={() =>
                                      handlePropertyDelete(item.property_id)
                                    }
                                    title='Delete'
                                    className='material-icons delete'
                                  >
                                    delete
                                  </AnchorComponent>
                                </td>
                                <td>{item.property_name_english || 'NA'}</td>
                                <td>{item.no_of_rooms || 'NA'}</td>
                                <td>{item.no_of_halls || 'NA'}</td>
                                <td>{item.no_of_washroom || 'NA'}</td>
                                <td>{item.pool || 'NA'}</td>
                                <td>{item.property_address || 'NA'}</td>
                                <td>{item.createtime || 'NA'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan='9' style={{ textAlign: 'center' }}>
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {content === 3 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      <Link to={APP_PREFIX_PATH + `/add-property-advertisement/${user_id}`}>
                        <button
                          type="button"
                          style={{
                            background: '#2b77e5',
                            padding: '7px 13px',
                            color: '#fff',
                            borderRadius: '5px'
                          }}
                        >
                          {' '}
                          <AddIcon className='me-2' /> {t('Add Advertisement')}{' '}
                        </button>
                      </Link>
                    </Col>
                  </Row>

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
                            <th>{t('Action')}</th>
                            <th>{t('Property Name')}</th>
                            <th>{t('Guard Name')}</th>
                            <th>{t('Address')}</th>
                            <th>{t('Price (1 Day)')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredPropertyAdvertisements && filteredPropertyAdvertisements.length > 0 ? (
                            filteredPropertyAdvertisements.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                {/* <td>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/edit-property-advertisement/${user_id}/${encode(
                                      item.property_ad_id
                                    )}`}
                                    title='Edit'
                                    className='material-icons edit'
                                  >
                                    edit
                                  </AnchorComponent>

                                  <AnchorComponent
                                    onClick={() =>
                                      handlePropertyAdvertisementDelete(item.property_ad_id)
                                    }
                                    title='Delete'
                                    className='material-icons delete'
                                  >
                                    delete
                                  </AnchorComponent>
                                </td> */}

                                <td>
  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
    {/* View Button */}
    <AnchorComponent
      to={`${APP_PREFIX_PATH}/view-property-advertisement/${encode(item.property_ad_id)}`}
      title='View'
      className='material-icons visibility'
      style={{ 
        color: '#1E88E5',
        fontSize: '20px',
        cursor: 'pointer',
        '&:hover': {
          color: '#0D47A1'
        }
      }}
    >
      visibility
    </AnchorComponent>

    {/* Edit Button */}
    <AnchorComponent
      to={`${APP_PREFIX_PATH}/edit-property-advertisement/${user_id}/${encode(item.property_ad_id)}`}
      title='Edit'
      className='material-icons edit'
      style={{ color: '#28a745' }}
    >
      edit
    </AnchorComponent>

    {/* Delete Button */}
    <AnchorComponent
      onClick={() => handlePropertyAdvertisementDelete(item.property_ad_id)}
      title='Delete'
      className='material-icons delete'
      style={{ color: '#dc3545' }}
    >
      delete
    </AnchorComponent>
  </Box>
</td>
                                <td>{item.property_name_english || 'NA'}</td>
                                <td>{item.guard_name_english || 'NA'}</td>
                                <td>{item.address || 'NA'}</td>
                                <td>{item.one_day_price ? `${item.one_day_price} KWD` : 'NA'}</td>
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
                </>
              )}

              {content === 4 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      <Link to={APP_PREFIX_PATH + `/add-trip/${user_id}`}>
                        <button
                          type="button"
                          style={{
                            background: '#2b77e5',
                            padding: '7px 13px',
                            color: '#fff',
                            borderRadius: '5px'
                          }}
                        >
                          {' '}
                          <AddIcon className='me-2' /> {t('Add Trip')}{' '}
                        </button>
                      </Link>
                    </Col>
                  </Row>
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
                            <th>{t('Action')}</th>
                            <th>{t('trip Image')}</th>
                            <th>{t('Trip Id')}</th>
                            <th>{t('Boat name')}</th>
                            <th>{t('Captain name')}</th>
                            <th>{t('Price per hours')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredtrips && filteredtrips.length > 0 ? (
                            filteredtrips.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                <td>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/view-trip/${encode(
                                      item.trip_id
                                    )}`}
                                    title='View'
                                    className='material-icons view'
                                  >
                                    visibility
                                  </AnchorComponent>
                                  <AnchorComponent
                                    to={`${APP_PREFIX_PATH}/edit-trip/${encode(
                                      item.trip_id
                                    )}`}
                                    title='Edit'
                                    className='material-icons edit'
                                  >
                                    edit
                                  </AnchorComponent>
                                  <AnchorComponent
                                    onClick={() =>
                                      handleTripDelete(item.trip_id)
                                    }
                                    title='Delete'
                                    className='material-icons delete'
                                  >
                                    delete
                                  </AnchorComponent>
                                </td>
                                <td title={item.boat_name_english}>
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
                                <td>{item.boat_name_english || 'NA'}</td>
                                <td>{item.captain_name_english || 'NA'}</td>
                                <td>{item.price_per_hour || 'NA'}</td>
                                <td>{item.createtime || 'NA'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan='8' style={{ textAlign: 'center' }}>
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              
              {content === 5 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                  </Row>
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
                            <th>{t('user_name')}</th>
                            <th>{t('Trip Name')}</th>
                            <th>{t('Time')}</th>
                            <th>{t('Clean')}</th>
                            <th>{t('Captain')}</th>
                            <th>{t('Hospitality')}</th>
                            <th>{t('Food')}</th>
                            <th>{t('Equipment')}</th>
                            <th>{t('Entertainment')}</th>
                            <th>{t('review')}</th>
                            <th>{t('createtime')}</th>
                          </tr>
                        </thead>
                        <tbody className='mc-table-body even'>
                          {filteredRatings && filteredRatings.length > 0 ? (
                            filteredRatings.map((item, index) => (
                              <tr key={index}>
                                <td title='id'>
                                  <div className='mc-table-check'>
                                    <p>{index + 1}</p>
                                  </div>
                                </td>
                                <td>{item.name || 'NA'}</td>
                                <td>{item.trip_name_english || 'NA'}</td>
                                <td>{item.time || 'NA'}</td>
                                <td>{item.clean || 'NA'}</td>
                                <td>{item.captain || 'NA'}</td>
                                <td>{item.hospitality || 'NA'}</td>
                                <td>{item.food || 'NA'}</td>
                                <td>{item.equipment || 'NA'}</td>
                                <td>{item.entertainment || 'NA'}</td>
                                <td>{item.review || 'NA'}</td>
                                <td>{item.createtime || 'NA'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan='12' style={{ textAlign: 'center' }}>
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              
              {content === 6 && (
                <>
                  {/* Sub-tabs for Boat/Property Unavailability */}
                  <div className="mb-3">
                    <nav className="nav nav-pills nav-fill">
                      <button
                        type="button"
                        className={`nav-link ${unavailabilitySubTab === 'boat' ? 'active' : ''}`}
                        onClick={() => handleUnavailabilitySubTabChange('boat')}
                        style={{
                          backgroundColor: unavailabilitySubTab === 'boat' ? '#19918F' : 'transparent',
                          color: unavailabilitySubTab === 'boat' ? '#fff' : '#19918F',
                          border: '1px solid #19918F',
                          marginRight: '10px',
                          borderRadius: '5px'
                        }}
                      >
                        Boat Unavailability
                      </button>
                      <button
                        type="button"
                        className={`nav-link ${unavailabilitySubTab === 'property' ? 'active' : ''}`}
                        onClick={() => handleUnavailabilitySubTabChange('property')}
                        style={{
                          backgroundColor: unavailabilitySubTab === 'property' ? '#19918F' : 'transparent',
                          color: unavailabilitySubTab === 'property' ? '#fff' : '#19918F',
                          border: '1px solid #19918F',
                          borderRadius: '5px'
                        }}
                      >
                        Property Unavailability
                      </button>
                    </nav>
                  </div>

                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search_here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                    <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
                      {unavailabilitySubTab === 'boat' ? (
                        <Link to={APP_PREFIX_PATH + `/add-unavailability/${user_id}`}>
                          <button
                            type="button"
                            style={{
                              background: '#2b77e5',
                              padding: '7px 13px',
                              color: '#fff',
                              borderRadius: '5px'
                            }}
                          >
                            {' '}
                            <AddIcon className='me-2' /> {t('Add Boat Unavailability')}{' '}
                          </button>
                        </Link>
                      ) : (
                        <Link to={APP_PREFIX_PATH + `/add-property-unavailability/${user_id}`}>
                          <button
                            type="button"
                            style={{
                              background: '#2b77e5',
                              padding: '7px 13px',
                              color: '#fff',
                              borderRadius: '5px'
                            }}
                          >
                            {' '}
                            <AddIcon className='me-2' /> {t('Add Property Unavailability')}{' '}
                          </button>
                        </Link>
                      )}
                    </Col>
                  </Row>

                  <div style={{ margin: '1rem' }}>
                    {loadingUnavailability ? (
                      <div className="d-flex justify-content-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className='mc-table-responsive'>
                        {unavailabilitySubTab === 'boat' ? (
                          // Boat Unavailability Table
                          <table className='mc-table'>
                            <thead className='mc-table-head primary'>
                              <tr>
                                <th>
                                  <div className='mc-table-check'>
                                    <p>{t('sno')}</p>
                                  </div>
                                </th>
                                <th>{t('Action')}</th>
                                <th>{t('Date')}</th>
                                <th>{t('Boat Name')}</th>
                                <th>{t('Type')}</th>
                                <th>{t('From Time')}</th>
                                <th>{t('To Time')}</th>
                                <th>{t('Created')}</th>
                              </tr>
                            </thead>
                            <tbody className='mc-table-body even'>
                              {filteredBoatUnavailability && filteredBoatUnavailability.length > 0 ? (
                                filteredBoatUnavailability.map((item, index) => (
                                  <tr key={index}>
                                    <td title='id'>
                                      <div className='mc-table-check'>
                                        <p>{index + 1}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <AnchorComponent
                                        to={`${APP_PREFIX_PATH}/edit-unavailability/${encode(
                                          item.unavailability_id
                                        )}`}
                                        title='Edit'
                                        className='material-icons edit'
                                      >
                                        edit
                                      </AnchorComponent>
                                      <AnchorComponent
                                        onClick={() =>
                                          handleBoatUnavailabilityDelete(item.unavailability_id)
                                        }
                                        title='Delete'
                                        className='material-icons delete'
                                      >
                                        delete
                                      </AnchorComponent>
                                    </td>
                                    <td>{item.date || 'NA'}</td>
                                    <td>{item.entity_name || 'NA'}</td>
                                    <td>
                                      {item.type == 0 ? 'Full Day' : 'Selected Hours'}
                                    </td>
                                    <td>{item.type == 0 ? '00:00' : item.from_time || 'NA'}</td>
                                    <td>{item.type == 0 ? '23:59' : item.to_time || 'NA'}</td>
                                    <td>{item.createtime || 'NA'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan='8' style={{ textAlign: 'center' }}>
                                    No boat unavailability data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        ) : (
                          // Property Unavailability Table
                          <table className='mc-table'>
                            <thead className='mc-table-head primary'>
                              <tr>
                                <th>
                                  <div className='mc-table-check'>
                                    <p>{t('sno')}</p>
                                  </div>
                                </th>
                                <th>{t('Action')}</th>
                                <th>{t('Date')}</th>
                                <th>{t('Property Name')}</th>
                                <th>{t('Type')}</th>
                                <th>{t('From Time')}</th>
                                <th>{t('To Time')}</th>
                                <th>{t('Created')}</th>
                              </tr>
                            </thead>
                            <tbody className='mc-table-body even'>
                              {filteredPropertyUnavailability && filteredPropertyUnavailability.length > 0 ? (
                                filteredPropertyUnavailability.map((item, index) => (
                                  <tr key={index}>
                                    <td title='id'>
                                      <div className='mc-table-check'>
                                        <p>{index + 1}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <AnchorComponent
                                        to={`${APP_PREFIX_PATH}/edit-property-unavailability/${encode(
                                          item.unavailability_id
                                        )}`}
                                        title='Edit'
                                        className='material-icons edit'
                                      >
                                        edit
                                      </AnchorComponent>
                                      <AnchorComponent
                                        onClick={() =>
                                          handlePropertyUnavailabilityDelete(item.unavailability_id)
                                        }
                                        title='Delete'
                                        className='material-icons delete'
                                      >
                                        delete
                                      </AnchorComponent>
                                    </td>
                                    <td>{item.date || 'NA'}</td>
                                    <td>{item.entity_name || 'NA'}</td>
                                    <td>
                                      {item.type == 0 ? 'Full Day' : 'Selected Hours'}
                                    </td>
                                    <td>{item.type == 0 ? '00:00' : item.from_time || 'NA'}</td>
                                    <td>{item.type == 0 ? '23:59' : item.to_time || 'NA'}</td>
                                    <td>{item.createtime || 'NA'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan='8' style={{ textAlign: 'center' }}>
                                    No property unavailability data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {content === 7 && (
                <>
                  <Row
                    xs={1}
                    sm={2}
                    xl={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Col className='mt-3 '>
                      <LabelFieldComponent
                        type='search'
                        icon='Search'
                        placeholder={`${t('search here')}`}
                        labelDir='label-col'
                        fieldSize='mb-4 w-100 h-md'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                  </Row>
                  <div style={{ margin: '1rem' }}>
                    {loadingBookings ? (
                      <div className="d-flex justify-content-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className='mc-table-responsive'>
                        <table className='mc-table'>
                          <thead className='mc-table-head primary'>
                            <tr>
                              <th>
                                <div className='mc-table-check'>
                                  <p>{t("sno")}</p>
                                </div>
                              </th>
                              <th>{t("user name")}</th>
                              <th>{t("booking id")}</th>
                              <th>{t("owner name")}</th>
                              <th>{t("price (KWD/Hr)")}</th>
                              <th>{t("Booking Date")}</th>
                              <th>{t("Status")}</th>
                              <th>{t("Cancel Reason")}</th>
                              <th>{t("Hours")}</th>
                              <th>{t("Booking Time")}</th>
                              <th>{t("Total Amount")}</th>
                              <th>{t("transaction ID")}</th>
                              <th>{t("Booked On")}</th>
                            </tr>
                          </thead>
                          <tbody className='mc-table-body even'>
                            {filteredBookings.length > 0 ? (
                              filteredBookings.map((item, index) => (
                                <tr key={index}>
                                  <td title="id">
                                    <div className="mc-table-check">
                                      <p>{index + 1}</p>
                                    </div>
                                  </td>
                                  <td>{item.name || 'NA'}</td>
                                  <td>
                                    <span>#{item.random_booking_id || 'NA'}</span>
                                  </td>
                                  <td>{item.ownerName || 'NA'}</td>
                                  <td>{item.price_per_hour || 'NA'}</td>
                                  <td>{item.date || 'NA'}</td>
                                  <td>
                                    <p
                                      style={{
                                        padding: '4px 12px',
                                        borderRadius: '999px',
                                        backgroundColor:
                                          item.cancle_status === 0 ? '#D4EDDA' : '#F8D7DA',
                                        color:
                                          item.cancle_status === 0 ? '#155724' : '#721c24',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        display: 'inline-block',
                                      }}
                                    >
                                      {item.cancle_status === 0 ? 'Confirmed' : 'Cancelled'}
                                    </p>
                                  </td>
                                  <td>{item.cancle_reason || 'NA'}</td>
                                  <td>{item.hours || 'NA'}</td>
                                  <td>{item.booking_time || 'NA'}</td>
                                  <td>{item.total_amount || 'NA'}</td>
                                  <td>{item.transaction_id || 'NA'}</td>
                                  <td>{item.createtime || 'NA'}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="13" style={{ textAlign: 'center' }}>
                                  {t("no_data_available")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Form>
          </Card.Body>
        </div>
      )}
    </PageLayout>
  )
}