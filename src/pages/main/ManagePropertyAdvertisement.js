/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Col, Modal, Form, Row } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { decode, encode } from 'base-64'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function ManagePropertyAdvertisement() {
  const { user_id } = useParams()
  const [alertModal, setAlertModal] = useState(false)
  const [ownerError, setOwnerError] = useState({})
  const { t } = useContext(TranslatorContext)

  // Form State
  const [formData, setFormData] = useState({
    property_id: '',
    guard_name_english: '',
    guard_name_arabic: '',
    guard_number: '',
    gender: '',
    country_id: '',
    city_id: '',
    destination_id: '',
    address: '',
    max_adult: '',
    max_child: '',
    description_english: '',
    description_arabic: '',
    description_french: '',
    description_italian: '',
    description_korean: '',
    one_day_price: '',
    one_day_active: false,
    weekday_price: '',
    weekday_active: false,
    weekend_price: '',
    weekend_active: false,
    full_week_price: '',
    full_week_active: false,
    discount_percentage: '',
    coupon_code: '',
    coupon_discount: '',
    free_cancel_days: '',
    pet_friendly: '',
    selectedAmenities: []
  })

  // Loading states
  const [loading, setLoading] = useState({
    amenities: true,
    countries: true,
    destinations: true,
    properties: true,
    cities: false
  })

  // Data states
  const [amenities, setAmenities] = useState([])
  const [countryDetails, setCountryDetails] = useState([])
  const [cityDetails, setCityDetails] = useState([])
  const [destinationDetails, setDestinationDetails] = useState([])
  const [propertyDetails, setPropertyDetails] = useState([])
  const [images, setImages] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [LocError, setLocError] = useState('')
  const [error, setError] = useState({})

  const navigate = useNavigate()

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setOwnerError(prev => ({ ...prev, [field]: '' }))
  }

  // Handle checkbox for price periods
  const handlePricePeriodChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  // Handle location selection
  const handleLocationChange = async (value) => {
    if (!value) {
      handleInputChange('address', '');
      setLatitude('');
      setLongitude('');
      return;
    }

    handleInputChange('address', value.label);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ placeId: value.value.place_id });
      if (response.results[0]) {
        const { lat, lng } = response.results[0].geometry.location;
        setLatitude(lat());
        setLongitude(lng());
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      setLocError('Failed to fetch location details.');
    }
  }

  // Handle image upload
  const handleImageChange = event => {
    const files = Array.from(event.target.files)
    setImages(files)
    setOwnerError(prev => ({ ...prev, image: '' }))
  }

  // Handle cover image upload
  const handleCoverImageChange = event => {
    const file = event.target.files[0]
    setCoverImage(file)
    setOwnerError(prev => ({ ...prev, coverImage: '' }))
  }

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('Fetching initial data...');
        
        const [
          amenitiesRes,
          countriesRes,
          destinationsRes,
          propertiesRes
        ] = await Promise.all([
          axios.get(API_URL + '/get_all_amenities'),
          axios.get(API_URL + '/fetch_coutry_list'),
          axios.get(API_URL + '/fetch_destination_details'),
          axios.get(API_URL + `/fetch_property_data_by_id?user_id=${decode(user_id)}`)
        ])

        console.log('Amenities response:', amenitiesRes.data.data);
        console.log('Countries response:', countriesRes.data.country_arr);
        console.log('Destinations response:', destinationsRes.data);
        console.log('Properties response:', propertiesRes.data);

        // Set amenities - the data is in the 'data' property directly
        if (amenitiesRes.data && amenitiesRes.data.data && Array.isArray(amenitiesRes.data.data)) {
          setAmenities(amenitiesRes.data.data);
          setLoading(prev => ({ ...prev, amenities: false }));
        } else {
          console.error('Unexpected amenities data structure:', amenitiesRes.data);
          setAmenities([]);
          setLoading(prev => ({ ...prev, amenities: false }));
        }

        // Set countries
        if (countriesRes.data && countriesRes.data.country_arr && Array.isArray(countriesRes.data.country_arr)) {
          setCountryDetails(countriesRes.data.country_arr);
          setLoading(prev => ({ ...prev, countries: false }));
        } else {
          console.error('Unexpected countries data structure:', countriesRes.data);
          setCountryDetails([]);
          setLoading(prev => ({ ...prev, countries: false }));
        }

        // Set destinations
        if (destinationsRes.data && destinationsRes.data.destination_arr && Array.isArray(destinationsRes.data.destination_arr)) {
          setDestinationDetails(destinationsRes.data.destination_arr);
          setLoading(prev => ({ ...prev, destinations: false }));
        } else {
          console.error('Unexpected destinations data structure:', destinationsRes.data);
          setDestinationDetails([]);
          setLoading(prev => ({ ...prev, destinations: false }));
        }

        // Set properties
        if (propertiesRes.data && propertiesRes.data.data && Array.isArray(propertiesRes.data.data)) {
          setPropertyDetails(propertiesRes.data.data);
          setLoading(prev => ({ ...prev, properties: false }));
        } else {
          console.error('Unexpected properties data structure:', propertiesRes.data);
          setPropertyDetails([]);
          setLoading(prev => ({ ...prev, properties: false }));
        }

      } catch (error) {
        console.error('Error fetching initial data:', error)
        setLoading({
          amenities: false,
          countries: false,
          destinations: false,
          properties: false,
          cities: false
        })
      }
    }

    if (user_id) {
      fetchInitialData();
    }
  }, [user_id])

  // Fetch cities based on country
  useEffect(() => {
    if (formData.country_id) {
      setLoading(prev => ({ ...prev, cities: true }));
      axios.get(API_URL + `/fetch_city_for_trip_list?country_id=${formData.country_id}`)
        .then(response => {
          console.log('Cities response:', response.data);
          if (response.data && response.data.city_arr && Array.isArray(response.data.city_arr)) {
            setCityDetails(response.data.city_arr);
          } else {
            setCityDetails([]);
          }
          setLoading(prev => ({ ...prev, cities: false }));
          handleInputChange('city_id', '')
        })
        .catch(error => {
          console.error('Error fetching cities:', error)
          setCityDetails([])
          setLoading(prev => ({ ...prev, cities: false }));
        })
    } else {
      setCityDetails([])
      setLoading(prev => ({ ...prev, cities: false }));
      handleInputChange('city_id', '')
    }
  }, [formData.country_id])

  // Validation function
  const validateForm = () => {
    let errors = {}
    let isValid = true

    // Required fields validation
    if (!formData.property_id) {
      errors.property_id = 'Please select a property'
      isValid = false
    }

    if (!formData.guard_name_english) {
      errors.guard_name_english = 'Please enter guard name in English'
      isValid = false
    }

    if (!formData.guard_number) {
      errors.guard_number = 'Please enter guard number'
      isValid = false
    } else if (Number(formData.guard_number) < 0) {
      errors.guard_number = 'Please enter valid guard number'
      isValid = false
    }

    if (formData.gender === '') {
      errors.gender = 'Please select gender'
      isValid = false
    }

    if (!formData.country_id) {
      errors.country_id = 'Please select nationality'
      isValid = false
    }

    if (!formData.destination_id) {
      errors.destination_id = 'Please select destination'
      isValid = false
    }

    if (!formData.city_id) {
      errors.city_id = 'Please select city'
      isValid = false
    }

    if (!formData.address) {
      errors.address = 'Please enter property location'
      isValid = false
    }

    if (!formData.max_adult) {
      errors.max_adult = 'Please enter max number of adults'
      isValid = false
    } else if (Number(formData.max_adult) < 0) {
      errors.max_adult = 'Please enter valid number'
      isValid = false
    }

    if (!formData.max_child) {
      errors.max_child = 'Please enter max number of children'
      isValid = false
    } else if (Number(formData.max_child) < 0) {
      errors.max_child = 'Please enter valid number'
      isValid = false
    }

    if (!formData.description_english) {
      errors.description_english = 'Please enter description in English'
      isValid = false
    }

    // Price validation based on active periods
    // if (formData.one_day_active && !formData.one_day_price) {
    //   errors.one_day_price = 'Please enter one day price'
    //   isValid = false
    // } else if (formData.one_day_price && Number(formData.one_day_price) < 0) {
    //   errors.one_day_price = 'Please enter valid price'
    //   isValid = false
    // }

    if (formData.weekday_active && !formData.weekday_price) {
      errors.weekday_price = 'Please enter weekday price'
      isValid = false
    } else if (formData.weekday_price && Number(formData.weekday_price) < 0) {
      errors.weekday_price = 'Please enter valid price'
      isValid = false
    }

    if (formData.weekend_active && !formData.weekend_price) {
      errors.weekend_price = 'Please enter weekend price'
      isValid = false
    } else if (formData.weekend_price && Number(formData.weekend_price) < 0) {
      errors.weekend_price = 'Please enter valid price'
      isValid = false
    }

    if (formData.full_week_active && !formData.full_week_price) {
      errors.full_week_price = 'Please enter full week price'
      isValid = false
    } else if (formData.full_week_price && Number(formData.full_week_price) < 0) {
      errors.full_week_price = 'Please enter valid price'
      isValid = false
    }

    // Coupon validation
    if (formData.coupon_code) {
      const codeRegex = /^[A-Za-z0-9]{8}$/
      if (!codeRegex.test(formData.coupon_code)) {
        errors.coupon_code = 'Coupon code must be exactly 8 characters (A-Z, 0-9)'
        isValid = false
      }
    }

    if (!formData.free_cancel_days) {
      errors.free_cancel_days = 'Please enter free cancel days'
      isValid = false
    } else if (Number(formData.free_cancel_days) < 0) {
      errors.free_cancel_days = 'Please enter valid number'
      isValid = false
    }

    if (formData.pet_friendly === '') {
      errors.pet_friendly = 'Please select pet friendly option'
      isValid = false
    }

    // Image validation
    if (!coverImage) {
      errors.coverImage = 'Please select cover image'
      isValid = false
    }

    if (!images || images.length === 0) {
      errors.image = 'Please select at least one side image'
      isValid = false
    }

    setError(errors)
    setOwnerError(errors)
    return isValid
  }

  // Form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const formDataObj = new FormData()

    // Append all form fields
    formDataObj.append('property_id', formData.property_id)
    formDataObj.append('user_id', decode(user_id))
    formDataObj.append('guard_name_english', formData.guard_name_english)
    formDataObj.append('guard_name_arabic', formData.guard_name_arabic || '')
    formDataObj.append('guard_number', formData.guard_number)
    formDataObj.append('gender', formData.gender)
    formDataObj.append('country_id', formData.country_id)
    formDataObj.append('city_id', formData.city_id)
    formDataObj.append('destination_id', formData.destination_id)
    formDataObj.append('address', formData.address)
    formDataObj.append('latitude', latitude)
    formDataObj.append('longitude', longitude)
    formDataObj.append('max_adult', formData.max_adult)
    formDataObj.append('max_child', formData.max_child)
    formDataObj.append('description_english', formData.description_english)
    formDataObj.append('description_arabic', formData.description_arabic || '')
    formDataObj.append('description_french', formData.description_french || '')
    formDataObj.append('description_italian', formData.description_italian || '')
    formDataObj.append('description_korean', formData.description_korean || '')

    // Price periods
    formDataObj.append('one_day_price', formData.one_day_price || 0)
    formDataObj.append('one_day_active', formData.one_day_active ? 1 : 0)
    formDataObj.append('weekday_price', formData.weekday_price || 0)
    formDataObj.append('weekday_active', formData.weekday_active ? 1 : 0)
    formDataObj.append('weekend_price', formData.weekend_price || 0)
    formDataObj.append('weekend_active', formData.weekend_active ? 1 : 0)
    formDataObj.append('full_week_price', formData.full_week_price || 0)
    formDataObj.append('full_week_active', formData.full_week_active ? 1 : 0)

    // Other fields
    formDataObj.append('discount_percentage', formData.discount_percentage || 0)
    formDataObj.append('coupon_code', formData.coupon_code || '')
    formDataObj.append('coupon_discount', formData.coupon_discount || 0)
    formDataObj.append('free_cancel_days', formData.free_cancel_days)
    formDataObj.append('pet_friendly', formData.pet_friendly)

    // Amenities
    if (formData.selectedAmenities && formData.selectedAmenities.length > 0) {
      formDataObj.append('amenity_arr', JSON.stringify(formData.selectedAmenities))
    }

    // Add images
    images.forEach(img => {
      formDataObj.append('image', img)
    })

    // Add cover image
    if (coverImage) {
      formDataObj.append('coverImage', coverImage)
    }

    // Submit to API
    axios.post(API_URL + '/add_advertisement_property_admin', formDataObj)
      .then(response => {
        if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${user_id}`)
          }, 2000)
        } else {
          if (response.data.key) {
            setOwnerError(prev => ({ ...prev, [response.data.key]: response.data.msg }))
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.data.msg,
              icon: 'error',
              confirmButtonText: 'OK',
            })
          }
        }
      })
      .catch(error => {
        console.error('Error submitting advertisement:', error)
        setOwnerError(prev => ({ ...prev, formError: 'Failed to submit advertisement' }))
      })
  }

  return (
    <PageLayout>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Add Property Advertisement')}</h3>
            <ul className='mc-breadcrumb-list'>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className='mc-breadcrumb-link'>
                  {t('home')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH + '/manage-owners'}`} className='mc-breadcrumb-link'>
                  {t('manage owner')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Add Property Advertisement')}</li>
            </ul>
          </div>
        </div>
      </Col>

      <div className='container'>
        {/* Image Upload Section */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='coverImage' className='form-label'>
              Please upload cover pics *
            </label>
            <Form.Control
              type='file'
              onChange={handleCoverImageChange}
              isInvalid={!!ownerError.coverImage}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.coverImage}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='images' className='form-label'>
              Please upload Side pics *
            </label>
            <Form.Control
              type='file'
              multiple
              onChange={handleImageChange}
              isInvalid={!!ownerError.image}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.image}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Guard Information */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='guard_name_english' className='form-label'>
              Enter Guard Name in English *
            </label>
            <Form.Control
              type='text'
              placeholder='Enter Guard Name in English'
              value={formData.guard_name_english}
              onChange={e => handleInputChange('guard_name_english', e.target.value)}
              isInvalid={!!ownerError.guard_name_english}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.guard_name_english}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='guard_name_arabic' className='form-label'>
              Enter Guard name in Arabic
            </label>
            <Form.Control
              type='text'
              placeholder='Enter Guard name in Arabic'
              value={formData.guard_name_arabic}
              onChange={e => handleInputChange('guard_name_arabic', e.target.value)}
              isInvalid={!!ownerError.guard_name_arabic}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.guard_name_arabic}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='guard_number' className='form-label'>
              Enter Guard Number *
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Guard Number'
              value={formData.guard_number}
              onChange={e => handleInputChange('guard_number', e.target.value)}
              isInvalid={!!ownerError.guard_number}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.guard_number}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='gender' className='form-label'>
              Gender *
            </label>
            <div className='d-flex gap-4 align-items-center mt-2'>
              <Form.Check
                type='radio'
                label='Male'
                name='gender'
                value='0'
                checked={formData.gender === '0'}
                onChange={e => handleInputChange('gender', e.target.value)}
                inline
              />
              <Form.Check
                type='radio'
                label='Female'
                name='gender'
                value='1'
                checked={formData.gender === '1'}
                onChange={e => handleInputChange('gender', e.target.value)}
                inline
              />
              <Form.Check
                type='radio'
                label='Other'
                name='gender'
                value='2'
                checked={formData.gender === '2'}
                onChange={e => handleInputChange('gender', e.target.value)}
                inline
              />
            </div>
            {ownerError.gender && (
              <div className='text-danger mt-1'>{ownerError.gender}</div>
            )}
          </div>
        </div>

        {/* Selection Fields */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='country_id' className='form-label'>
              Guard Nationality *
            </label>
            <Form.Select
              id='country_id'
              value={formData.country_id}
              onChange={e => handleInputChange('country_id', e.target.value)}
              isInvalid={!!ownerError.country_id}
            >
              <option value=''>Select Nationality</option>
              {loading.countries ? (
                <option value='' disabled>Loading countries...</option>
              ) : (
                countryDetails && countryDetails.length > 0 ? (
                  countryDetails.map(country => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.country_name}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>No countries available</option>
                )
              )}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.country_id}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='destination_id' className='form-label'>
              Choose destination *
            </label>
            <Form.Select
              id='destination_id'
              value={formData.destination_id}
              onChange={e => handleInputChange('destination_id', e.target.value)}
              isInvalid={!!ownerError.destination_id}
            >
              <option value=''>Select Destination</option>
              {loading.destinations ? (
                <option value='' disabled>Loading destinations...</option>
              ) : (
                destinationDetails && destinationDetails.length > 0 ? (
                  destinationDetails.map(dest => (
                    <option key={dest.destination_id} value={dest.destination_id}>
                      {dest.destination_english}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>No destinations available</option>
                )
              )}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.destination_id}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='property_id' className='form-label'>
              Choose property *
            </label>
            <Form.Select
              id='property_id'
              value={formData.property_id}
              onChange={e => handleInputChange('property_id', e.target.value)}
              isInvalid={!!ownerError.property_id}
            >
              <option value=''>Select Property</option>
              {loading.properties ? (
                <option value='' disabled>Loading properties...</option>
              ) : (
                propertyDetails && propertyDetails.length > 0 ? (
                  propertyDetails.map(property => (
                    <option key={property.property_id} value={property.property_id}>
                      {property.property_name_english}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>No properties available</option>
                )
              )}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.property_id}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='city_id' className='form-label'>
              Select City *
            </label>
            <Form.Select
              id='city_id'
              value={formData.city_id}
              onChange={e => handleInputChange('city_id', e.target.value)}
              isInvalid={!!ownerError.city_id}
              disabled={!formData.country_id || loading.cities}
            >
              <option value=''>Select City</option>
              {loading.cities ? (
                <option value='' disabled>Loading cities...</option>
              ) : (
                cityDetails && cityDetails.length > 0 ? (
                  cityDetails.map(city => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>
                    {formData.country_id ? 'No cities available' : 'Select a country first'}
                  </option>
                )
              )}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.city_id}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Location */}
        <div className='row m-2'>
          <div className='col-md-12'>
            <Form.Group className="form-group mb-4">
              <Form.Label>Property Location *</Form.Label>
              <GooglePlacesAutocomplete
                apiKey="AIzaSyCY1_Ncz7dVOoaddm4ZXGqoAdG7cd8_exE"
                selectProps={{
                  onChange: handleLocationChange,
                  placeholder: 'Search Location',
                  noOptionsMessage: () => null,
                  loadingMessage: () => null,
                }}
              />
              {ownerError.address && (
                <p className='text-danger mt-1'>{ownerError.address}</p>
              )}
            </Form.Group>
          </div>
        </div>

        {/* Max People */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='max_adult' className='form-label'>
              Max Number Of People (Adult) *
            </label>
            <Form.Control
              type='number'
              placeholder='Adult'
              value={formData.max_adult}
              onChange={e => handleInputChange('max_adult', e.target.value)}
              isInvalid={!!ownerError.max_adult}
              min="0"
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.max_adult}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='max_child' className='form-label'>
              Max Number Of People (Child) *
            </label>
            <Form.Control
              type='number'
              placeholder='Child'
              value={formData.max_child}
              onChange={e => handleInputChange('max_child', e.target.value)}
              isInvalid={!!ownerError.max_child}
              min="0"
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.max_child}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Descriptions */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='description_english' className='form-label'>
              Description in English *
            </label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder='Description in English'
              value={formData.description_english}
              onChange={e => handleInputChange('description_english', e.target.value)}
              isInvalid={!!ownerError.description_english}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.description_english}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='description_arabic' className='form-label'>
              Description in Arabic
            </label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder='Description in Arabic'
              value={formData.description_arabic}
              onChange={e => handleInputChange('description_arabic', e.target.value)}
              isInvalid={!!ownerError.description_arabic}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.description_arabic}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Additional Languages (Optional) */}
        {/* <div className='row m-2'>
          <div className='col-md-4'>
            <label htmlFor='description_french' className='form-label'>
              Description in French
            </label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Description in French'
              value={formData.description_french}
              onChange={e => handleInputChange('description_french', e.target.value)}
            />
          </div>
          <div className='col-md-4'>
            <label htmlFor='description_italian' className='form-label'>
              Description in Italian
            </label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Description in Italian'
              value={formData.description_italian}
              onChange={e => handleInputChange('description_italian', e.target.value)}
            />
          </div>
          <div className='col-md-4'>
            <label htmlFor='description_korean' className='form-label'>
              Description in Korean
            </label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Description in Korean'
              value={formData.description_korean}
              onChange={e => handleInputChange('description_korean', e.target.value)}
            />
          </div>
        </div> */}

        {/* Coupon Section */}
        <div className='row m-2'>
          <div className='col-md-4'>
            <label htmlFor='coupon_code' className='form-label'>
              Enter Coupon Code
            </label>
            <Form.Control
              type='text'
              placeholder='ABCDEFGH'
              value={formData.coupon_code}
              onChange={e => {
                const onlyLetters = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
                handleInputChange('coupon_code', onlyLetters)
              }}
              isInvalid={!!ownerError.coupon_code}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.coupon_code}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-4'>
            <label htmlFor='coupon_discount' className='form-label'>
              Enter Coupon Discount %
            </label>
            <Form.Control
              type='number'
              placeholder='Coupon Discount %'
              value={formData.coupon_discount}
              onChange={e => handleInputChange('coupon_discount', e.target.value)}
              isInvalid={!!ownerError.coupon_discount}
              min="0"
              max="100"
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.coupon_discount}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-4'>
            <label htmlFor='discount_percentage' className='form-label'>
              Discount %
            </label>
            <Form.Control
              type='number'
              placeholder='Discount %'
              value={formData.discount_percentage}
              onChange={e => handleInputChange('discount_percentage', e.target.value)}
              isInvalid={!!ownerError.discount_percentage}
              min="0"
              max="100"
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.discount_percentage}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Price Section */}
        <h4 className='mt-4 mb-3'>Price</h4>
        
        {/* One Day */}
        {/* <div className='row m-2 align-items-center'>
          <div className='col-md-6'>
            <Form.Check
              type='checkbox'
              label='One day (2pm till next day 12 afternoon)'
              checked={formData.one_day_active}
              onChange={e => handlePricePeriodChange('one_day_active', e.target.checked)}
            />
          </div>
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <span>Price</span>
              <Form.Control
                type='number'
                placeholder='Enter price in KWD'
                value={formData.one_day_price}
                onChange={e => handleInputChange('one_day_price', e.target.value)}
                disabled={!formData.one_day_active}
                isInvalid={!!ownerError.one_day_price}
                style={{ maxWidth: '200px' }}
              />
              <span>KWD</span>
            </div>
            <Form.Control.Feedback type='invalid'>
              {ownerError.one_day_price}
            </Form.Control.Feedback>
          </div>
        </div> */}

        {/* Weekday */}
        <div className='row m-2 align-items-center'>
          <div className='col-md-6'>
            <Form.Check
              type='checkbox'
              label='Weekday (Sun-Wed)'
              checked={formData.weekday_active}
              onChange={e => handlePricePeriodChange('weekday_active', e.target.checked)}
            />
          </div>
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <span>Price</span>
              <Form.Control
                type='number'
                placeholder='Enter price in KWD'
                value={formData.weekday_price}
                onChange={e => handleInputChange('weekday_price', e.target.value)}
                disabled={!formData.weekday_active}
                isInvalid={!!ownerError.weekday_price}
                style={{ maxWidth: '200px' }}
              />
              <span>KWD</span>
            </div>
            <Form.Control.Feedback type='invalid'>
              {ownerError.weekday_price}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Weekend */}
        <div className='row m-2 align-items-center'>
          <div className='col-md-6'>
            <Form.Check
              type='checkbox'
              label='Weekend (Thu-Sat)'
              checked={formData.weekend_active}
              onChange={e => handlePricePeriodChange('weekend_active', e.target.checked)}
            />
          </div>
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <span>Price</span>
              <Form.Control
                type='number'
                placeholder='Enter price in KWD'
                value={formData.weekend_price}
                onChange={e => handleInputChange('weekend_price', e.target.value)}
                disabled={!formData.weekend_active}
                isInvalid={!!ownerError.weekend_price}
                style={{ maxWidth: '200px' }}
              />
              <span>KWD</span>
            </div>
            <Form.Control.Feedback type='invalid'>
              {ownerError.weekend_price}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Full Week */}
        <div className='row m-2 align-items-center'>
          <div className='col-md-6'>
            <Form.Check
              type='checkbox'
              label='Full week (Sun-Sat)'
              checked={formData.full_week_active}
              onChange={e => handlePricePeriodChange('full_week_active', e.target.checked)}
            />
          </div>
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <span>Price</span>
              <Form.Control
                type='number'
                placeholder='Enter price in KWD'
                value={formData.full_week_price}
                onChange={e => handleInputChange('full_week_price', e.target.value)}
                disabled={!formData.full_week_active}
                isInvalid={!!ownerError.full_week_price}
                style={{ maxWidth: '200px' }}
              />
              <span>KWD</span>
            </div>
            <Form.Control.Feedback type='invalid'>
              {ownerError.full_week_price}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Amenities Section */}
        <h4 className='mt-4 mb-3'>What this place offers</h4>
        <div className='row m-2'>
          {loading.amenities ? (
            <div className='col-12'>
              <p className='text-muted'>Loading amenities...</p>
            </div>
          ) : (
            amenities && amenities.length > 0 ? (
              amenities.map(amenity => (
                <div className='col-md-3 mb-3' key={amenity.amenity_id}>
                  <Form.Check
                    type='checkbox'
                    id={`amenity-${amenity.amenity_id}`}
                    label={amenity.amenity_name}
                    value={amenity.amenity_id}
                    checked={formData.selectedAmenities.includes(amenity.amenity_id)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      const updated = e.target.checked
                        ? [...formData.selectedAmenities, value]
                        : formData.selectedAmenities.filter(id => id !== value)
                      handleInputChange('selectedAmenities', updated)
                    }}
                  />
                </div>
              ))
            ) : (
              <div className='col-12'>
                <p className='text-muted'>No amenities available</p>
              </div>
            )
          )}
        </div>

        {/* Pet Friendly */}
        <div className='row m-2'>
          <div className='col-md-12'>
            <label htmlFor='pet_friendly' className='form-label'>
              PET FRIENDLY *
            </label>
            <div className='d-flex gap-4 align-items-center'>
              <Form.Check
                type='radio'
                label='Yes'
                name='pet_friendly'
                value='1'
                checked={formData.pet_friendly === '1'}
                onChange={e => handleInputChange('pet_friendly', e.target.value)}
                inline
              />
              <Form.Check
                type='radio'
                label='No'
                name='pet_friendly'
                value='0'
                checked={formData.pet_friendly === '0'}
                onChange={e => handleInputChange('pet_friendly', e.target.value)}
                inline
              />
            </div>
            {ownerError.pet_friendly && (
              <div className='text-danger mt-1'>{ownerError.pet_friendly}</div>
            )}
          </div>
        </div>

        {/* Cancel Days */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='free_cancel_days' className='form-label'>
              CUSTOMER CANCEL DAYS *
            </label>
            <div className='d-flex align-items-center gap-3'>
              <span>Free to cancel before</span>
              <Form.Control
                type='number'
                style={{ maxWidth: '100px' }}
                value={formData.free_cancel_days}
                onChange={e => handleInputChange('free_cancel_days', e.target.value)}
                isInvalid={!!ownerError.free_cancel_days}
                min="0"
              />
              <span>Days</span>
            </div>
            <Form.Control.Feedback type='invalid'>
              {ownerError.free_cancel_days}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Submit Button */}
        <div className='row m-2 mt-4'>
          <div className='col-md-12'>
            <button
              className='btn btn-dark'
              style={{
                background: '#19918F',
                border: 'none',
                padding: '10px 40px',
                marginBottom: '5rem'
              }}
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={alertModal} onHide={() => setAlertModal(false)}>
        <div className='mc-alert-modal'>
          <i className='material-icons' style={{ color: 'green' }}>
            check_circle
          </i>
          <h3>Confirmation</h3>
          <br />
          <p>Property advertisement has been created successfully.</p>
          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  )
}