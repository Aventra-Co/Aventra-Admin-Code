/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Col, Modal, Form } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { decode, encode } from 'base-64'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import DatePicker from 'react-multi-date-picker'
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function AddTrip() {
  const { user_id } = useParams()
  const [alertModal, setAlertModal] = useState(false)
  const [ownerError, setownerError] = useState({})
  const { t } = useContext(TranslatorContext)

  const [captainNameEnglish, setCaptainNameEnglish] = useState('')
  const [captainNameArabic, setCaptainNameArabic] = useState('')
  const [maxNumberofPeople, setMaxNumberofPeople] = useState('')
  const [captainNumber, setCaptainNumber] = useState('')
  const [discount, setDiscount] = useState('')
  const [couponDiscount, setCouponDiscount] = useState('')
  const [descriptionInEnglish, setDescriptionInEnglish] = useState('')
  const [descriptionInArabic, setDescriptionInArabic] = useState('')
  // const [image, setimage] = useState('')
  const [gender, setgender] = useState('')
  const [advertisementType, setAdvertisementType] = useState('')
  const [nationality, setNationality] = useState('')
  const [tripTypeSelected, setTripTypeSelected] = useState([])
  const [tripType, setTripType] = useState([])
  const [city, setCity] = useState('')
  const [pickupPoint, setPickupPoint] = useState('')
  const [selectedBoatId, setSeletedBoat] = useState('')
  const [slotPrice, setSlotPrice] = useState('')
  const [minimumHours, setMinimumHours] = useState('')
  const [IdleHours, setIdleHours] = useState('')
  const [cancleDay, setCancleDay] = useState('');
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  //   {
  //     "path": "/manage-coupon-code",
  //     "icon": "DiscountIcon",
  //     "text": "manage coupon code"
  // },
  // const [trip_time, setTripTime] = useState('')
  // const [trip_date_type, setTripDateType] = useState('')
  // const [trip_open_time, setTripOpenTime] = useState('')
  // const [trip_close_time, setTripCloseTime] = useState('')
  // const [trip_fixed_time, setTripFixedTime] = useState('')
  // const [trip_dated, setTripDated] = useState('')
  const [equipment_arr, setEquipment] = useState([])
  const [food_data, setFoodData] = useState([])
  const [entertainment, setEntertainment] = useState([])
  const [desctination_arr, setDesctinationData] = useState([])
  const [LocError, setlocError] = useState('')



  // Form State
  const [formData, setFormData] = useState({
    captainNameEnglish: '',
    captainNameArabic: '',
    maxNumberofPeople: '',
    captainNumber: '',
    discount: '',
    couponDiscount: '',
    descriptionInEnglish: '',
    descriptionInArabic: '',
    gender: '',
    advertisementType: '',
    nationality: '',
    city: '',
    tripTypeSelected: [],
    selectedBoatId: '',
    pickupPoint: '',
    slotPrice: '',
    minimumHours: '',
    IdleHours: '',
    cancleDay: '',
    trip_time: '',
    trip_date_type: '',
    trip_open_time: '',
    trip_close_time: '',
    trip_fixed_time: '',
    trip_dated: '',
    destination_id: '',
    coupon_code: '',
    start_date: '',
    end_date: ''
  });


  const handleTimeChange = (field, value) => {
    // Ensure minutes are always 00
    if (value) {
      const [hours, minutes] = value.split(':');
      const formattedTime = `${hours}:00`; // Force minutes to 00
      handleInputChange(field, formattedTime);
    } else {
      handleInputChange(field, value);
    }
  };

  // Dynamic addons state
  const [addons, setAddons] = useState({
    categories: [],
    items: {},
    selected: {}
  })

  const [image, setImage] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [countryDetails, setCountryDetails] = useState([])
  const [cityDetails, setCityDetails] = useState([])
  // const [tripType, setTripType] = useState([])
  const [boatData, setBoatData] = useState([])
  const [error, setError] = useState({})

  const navigate = useNavigate()

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setownerError(prev => ({ ...prev, [field]: '' }))
  }

  // Fetch all addon categories and items
  const fetchAddons = async () => {
    try {
      const response = await axios.get(API_URL + '/get_addons_subcategory')
      const categories = response.data.addonSubCategoryArray || []

      // Group items by category
      const itemsByCategory = {}
      categories.forEach(item => {
        if (!itemsByCategory[item.addon_name]) {
          itemsByCategory[item.addon_name] = []
        }
        itemsByCategory[item.addon_name].push({
          ...item,
          checkStatus: 0,
          price: ''
        })
      })

      setAddons({
        categories: Object.keys(itemsByCategory),
        items: itemsByCategory,
        selected: {}
      })

    } catch (error) {
      console.error('Error fetching addons:', error)
    }
  }


  // const handleChange = async (value) => {
  //   setPickupPoint(value);
  //   if (value) {
  //     try {
  //       const geocoder = new window.google.maps.Geocoder();
  //       const response = await geocoder.geocode({ placeId: value.value.place_id });
  //       if (response.results[0]) {
  //         const { lat, lng } = response.results[0].geometry.location;
  //         const latitude = lat();
  //         const longitude = lng();
  //         console.log('Latitude:', latitude, 'Longitude:', longitude);
  //         setLatitude(latitude);
  //         setLongitude(longitude);


  //         setaddTripError((prev) => ({ ...prev, addStartAddress: '' }));
  //       }
  //     } catch (err) {
  //       console.error('Error fetching place details:', err);
  //       setlocError('Failed to fetch location details.');
  //     }

  //     setlocError('');
  //   } else {
  //     setlocError('Please select a location.');
  //   }
  // };



  const handleChange = async (value) => {
    if (!value) {
      setPickupPoint('');
      handleInputChange('pickupPoint', '');
      setLatitude('');
      setLongitude('');
      return;
    }

    setPickupPoint(value);
    handleInputChange('pickupPoint', value.label);

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
      setlocError('Failed to fetch location details.');
    }
  };


  // Handle checkbox changes for addons
  const handleAddonCheckboxChange = (category, index) => {
    setAddons(prev => {
      const updatedItems = { ...prev.items }
      updatedItems[category][index].checkStatus =
        updatedItems[category][index].checkStatus === 0 ? 1 : 0

      // Reset price if unchecked
      if (updatedItems[category][index].checkStatus === 0) {
        updatedItems[category][index].price = ''
      }

      return {
        ...prev,
        items: updatedItems
      }
    })
  }

  // Handle price changes for addons
  const handleAddonPriceChange = (category, index, value) => {
    setAddons(prev => {
      const updatedItems = { ...prev.items }
      updatedItems[category][index].price = value
      return {
        ...prev,
        items: updatedItems
      }
    })
    // Clear any existing error for this field
    setError(prev => ({ ...prev, [`${category}_price_${index}`]: '' }))
  }

  // Handle image upload
  const handleImageChange = event => {
    const files = Array.from(event.target.files)
    setImage(files)
    setownerError(prev => ({ ...prev, image: '' }))
  }

  // Handle cover image upload
  const handleCoverImageChange = event => {
    const file = event.target.files[0]
    setCoverImage(file)
    setownerError(prev => ({ ...prev, coverImage: '' }))
  }

  // Form submission
  const handlesubmit = () => {
    let errors = {}
    let isValid = true

    // Validate addons with prices
    Object.entries(addons.items).forEach(([category, items]) => {
      items.forEach((item, index) => {
        if (item.checkStatus === 1 && (!item.price || item.price <= 0)) {
          errors[`${category}_price_${index}`] = 'Please enter a valid price!'
          isValid = false
        }
      })
    })

    // Coupon optional validations
    if (formData.coupon_code) {
      const code = String(formData.coupon_code).trim()
      // exactly 8 alphanumeric characters (A-Z, 0-9)
      const codeRegex = /^[A-Za-z0-9]{8}$/
      if (!codeRegex.test(code)) {
        errors.coupon_code = 'Coupon code must be exactly 8 characters (A-Z, 0-9)'
        isValid = false
      }
      if (!formData.start_date) {
        errors.start_date = 'Please select start date'
        isValid = false
      }
      if (!formData.end_date) {
        errors.end_date = 'Please select end date'
        isValid = false
      }
      if (formData.start_date && formData.end_date) {
        const sd = new Date(formData.start_date)
        const ed = new Date(formData.end_date)
        if (sd > ed) {
          errors.end_date = 'End date must be after start date'
          isValid = false
        }
      }
    }

    // Other validations (keep your existing validation logic)
    if (!formData.captainNameEnglish) {
      errors.captainNameEnglish = 'Please Enter Captain Name In English'
      isValid = false
    }


    if (!formData.pickupPoint) {
      errors.pickupPoint = 'Please Enter Pickup Point';
      isValid = false;
    }

    if (!formData.destination_id) {
      errors.destination_id = 'Please select a destination'
      isValid = false
    }

    // Core required field validations using formData
    const num = v => (v === '' || v === null || v === undefined ? NaN : Number(v))

    if (!formData.captainNameEnglish) { errors.captainNameEnglish = 'Please Enter Captain Name In English'; isValid = false }
    // if (!formData.captainNameArabic) { errors.captainNameArabic = 'Please Enter Captain Name Arabic'; isValid = false }
    if (!formData.captainNumber) { errors.captainNumber = 'Please Enter Captain Number'; isValid = false }
    else if (num(formData.captainNumber) < 0) { errors.captainNumber = 'Please Enter Valid Captain Number'; isValid = false }

    if (!formData.maxNumberofPeople) { errors.maxNumberofPeople = 'Please Enter Max Number of People'; isValid = false }
    else if (num(formData.maxNumberofPeople) < 0) { errors.maxNumberofPeople = 'Please Enter Valid Max Number of People'; isValid = false }

    if (!formData.gender && formData.gender !== 0) { errors.gender = 'Please Enter Gender'; isValid = false }
    if (!formData.advertisementType && formData.advertisementType !== 0) { errors.advertisementType = 'Please Enter Advertisement Type'; isValid = false }

    // if (!formData.couponDiscount) { errors.couponDiscount = 'Please Enter Coupon Discount'; isValid = false }
    // else if (num(formData.couponDiscount) < 0) { errors.couponDiscount = 'Please Enter Valid Coupon Discount'; isValid = false }

    // if (!formData.discount) { errors.discount = 'Please Enter Discount'; isValid = false }
    // else if (num(formData.discount) < 0) { errors.discount = 'Please Enter Valid Discount'; isValid = false }

    if (!formData.nationality) { errors.nationality = 'Please Enter Nationality'; isValid = false }
    if (!formData.city) { errors.city = 'Please Select City'; isValid = false }

    if (!formData.tripTypeSelected || formData.tripTypeSelected.length === 0) { errors.tripTypeSelected = 'Please Enter Trip Type'; isValid = false }

    if (!formData.selectedBoatId) { errors.selectedBoatId = 'Please Select Boat'; isValid = false }

    if (!formData.slotPrice) { errors.slotPrice = 'Please Enter Slot Price'; isValid = false }
    else if (num(formData.slotPrice) < 0) { errors.slotPrice = 'Please Enter valid Slot Price'; isValid = false }

    if (!formData.minimumHours) { errors.minimumHours = 'Please Enter Minimum Hours'; isValid = false }
    else if (num(formData.minimumHours) < 0) { errors.minimumHours = 'Please Enter Valid Minimum Hours'; isValid = false }

    if (!formData.IdleHours) { errors.IdleHours = 'Please Enter Idle Hours'; isValid = false }
    else if (num(formData.IdleHours) < 0) { errors.IdleHours = 'Please Enter Valid Idle Hours'; isValid = false }

    if (!formData.cancleDay) { errors.cancleDay = 'Please Enter Customer Cancle Day'; isValid = false }
    else if (num(formData.cancleDay) < 0) { errors.cancleDay = 'Please Enter Valid Customer Cancle Day'; isValid = false }

    if (!formData.descriptionInEnglish) { errors.descriptionInEnglish = 'Please Enter Description In English'; isValid = false }
    // if (!formData.descriptionInArabic) { errors.descriptionInArabic = 'Please Enter Description In Arabic'; isValid = false }

    if (!formData.pickupPoint) { errors.pickupPoint = 'Please Enter Pickup Point'; isValid = false }

    if (!formData.destination_id) { errors.destination_id = 'Please select a destination'; isValid = false }

    if (!image || image.length === 0) { errors.image = 'Please select image'; isValid = false }
    if (!coverImage) { errors.coverImage = 'Please select cover image'; isValid = false }

    // Trip time validation
    if (!formData.trip_time) {
      errors.trip_time = 'Please select trip time type'
      isValid = false
    }

    // Trip date type validation
    if (!formData.trip_date_type) {
      errors.trip_date_type = 'Please select trip date type'
      isValid = false
    }

    // Conditional validations based on trip time selection
    if (formData.trip_time === '0') {
      if (!formData.trip_open_time) {
        errors.trip_open_time = 'Please select open time'
        isValid = false
      }
      if (!formData.trip_close_time) {
        errors.trip_close_time = 'Please select close time'
        isValid = false
      }
    }

    if (formData.trip_time === '1' && !formData.trip_fixed_time) {
      errors.trip_fixed_time = 'Please select fixed time'
      isValid = false
    }

    if (formData.trip_date_type === '1' && !formData.trip_dated) {
      errors.trip_dated = 'Please select at least one date'
      isValid = false
    }


    if (!isValid) {
      setError(errors)
      setownerError(errors)
      return
    }

    // Prepare addon data for submission
    const addonData = {}
    Object.entries(addons.items).forEach(([category, items]) => {
      // Use consistent naming convention (plural with _arr)
      const backendCategoryName = `${category.toLowerCase()}s_arr`; // Note the 's' for plural

      addonData[backendCategoryName] = items
        .filter(item => item.checkStatus === 1)
        .map(item => ({
          addon_id: item.addon_id,
          addon_subcategory_id: item.addon_subcategory_id,
          price: item.price.toString(), // Ensure string format if backend expects it
          checked: 1,
          checkStatus: 1
        }));
    });

    // Create a new FormData instance
    const formDataObj = new FormData()

    // Add all your form fields
    formDataObj.append('captain_name_english', formData.captainNameEnglish)
    formDataObj.append('user_id', decode(user_id))
    formDataObj.append('captain_name_arabic', formData.captainNameArabic)
    formDataObj.append('trip_time', formData.trip_time)
    formDataObj.append('trip_close_time', formData.trip_close_time)
    formDataObj.append('trip_open_time', formData.trip_open_time)
    formDataObj.append('fixed_time', formData.trip_fixed_time)
    formDataObj.append('max_people', formData.maxNumberofPeople)
    formDataObj.append('contact_number', formData.captainNumber)
    formDataObj.append('discount', formData.discount)
    formDataObj.append('coupon_discount', formData.couponDiscount)
    formDataObj.append('description_english', formData.descriptionInEnglish)
    formDataObj.append('gender', formData.gender)
    formDataObj.append('description_arabic', formData.descriptionInArabic)
    formDataObj.append('country_id', formData.nationality)
    formDataObj.append('city_id', formData.city)
    formDataObj.append('trip_type_id', formData.tripTypeSelected)
    formDataObj.append('trip_date_type', formData.trip_date_type)
    formDataObj.append('advertisement_type', formData.advertisementType)
    formDataObj.append('boat_id', formData.selectedBoatId)
    formDataObj.append('pickup_point', formData.pickupPoint)
    formDataObj.append('latitude', latitude);
    formDataObj.append('longitude', longitude);
    formDataObj.append('price_per_hour', formData.slotPrice)
    formDataObj.append('minimum_hours', formData.minimumHours)
    formDataObj.append('idle_hours', formData.IdleHours)
    formDataObj.append('free_to_cancel', formData.cancleDay)
    formDataObj.append('trip_date', formData.trip_dated)
    formDataObj.append('destination_id', formData.destination_id)
    // Optional coupon fields
    formDataObj.append('coupon_code', formData.coupon_code)
    formDataObj.append('start_date', formData.start_date)
    formDataObj.append('end_date', formData.end_date)

    Object.entries(addonData).forEach(([key, value]) => {
      formDataObj.append(key, JSON.stringify(value));
    });

    // Add images
    image.forEach(img => {
      formDataObj.append('image', img)
    })

    // Add cover image
    if (coverImage) {
      formDataObj.append('coverImage', coverImage)
    }

    // Submit to API
    axios.post(API_URL + '/add_trip', formDataObj)
      .then(response => {
        if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${user_id}`)
          }, 2000)
        } else if (response.data.key === "capacity") {
          Swal.fire({
            title: 'Error!',
            text: 'Max people cannot exceed boat capacity',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        else if (response.data.key === "slot_error") {
          Swal.fire({
            title: 'Error!',
            text: response.data.error,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        else {
          setownerError(prev => ({ ...prev, ...response.data.errors }))
        }
      })
      .catch(error => {
        console.error('Error submitting trip:', error)
        setownerError(prev => ({ ...prev, formError: 'Failed to submit trip' }))
      })
  }

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          countriesRes,
          tripTypesRes,
          boatsRes,
          destinationsRes
        ] = await Promise.all([
          axios.get(API_URL + '/fetch_coutry_list'),
          axios.get(API_URL + '/fetch_trip_type'),
          axios.get(API_URL + `/fetch_boat_data_by_id?user_id=${decode(user_id)}`),
          axios.get(API_URL + '/fetch_destination_details')
        ])

        setCountryDetails(Array.isArray(countriesRes.data.country_arr) ? countriesRes.data.country_arr : [])
        setTripType(Array.isArray(tripTypesRes.data.trip_type_arr) ? tripTypesRes.data.trip_type_arr : [])
        setBoatData(Array.isArray(boatsRes.data.boat_arr) ? boatsRes.data.boat_arr : [])
        setDesctinationData(Array.isArray(destinationsRes.data.destination_arr) ? destinationsRes.data.destination_arr : [])

        // Fetch addons
        await fetchAddons()

      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchInitialData()
  }, [])



  useEffect(() => {
    // if (formData.nationality) {
    axios.get(API_URL + `/fetch_city_for_trip_list?country_id=1`)
      .then(response => {
        setCityDetails(response.data.city_arr || [])
        handleInputChange('city', '')
      })
      .catch(error => {
        console.error('Error fetching cities:', error)
      })
    // }
    //  else {
    //   setCityDetails([])
    //   handleInputChange('city', '')
    // }
  }, [])

  // Render addon sections dynamically
  const renderAddonSections = () => {
    return addons.categories.map(category => (
      <React.Fragment key={category}>
        <h4 style={{ marginLeft: '20px' }}>{category}</h4>
        <div className='row m-2'>
          {addons.items[category]?.map((item, index) => (
            <div className='col-md-6' key={item.addon_subcategory_id}>
              <label className='form-label'>
                {item.sub_category_name}
              </label>
              <div className='d-flex justify-content-between align-items-center' style={{ columnGap: '15px' }}>
                <input
                  type='checkbox'
                  checked={item.checkStatus === 1}
                  onChange={() => handleAddonCheckboxChange(category, index)}
                  style={{
                    width: '40px',
                    height: '42px',
                    borderRadius: '4px',
                    marginTop: '2px',
                    backgroundColor: item.checkStatus === 0 ? '#f0f0f0' : 'orange',
                    border: 'none'
                  }}
                />
                <Form.Control
                  type='number'
                  placeholder='Enter Price In KDW'
                  value={item.price}
                  onChange={e => handleAddonPriceChange(category, index, e.target.value)}
                  disabled={item.checkStatus === 0}
                  isInvalid={!!error[`${category}_price_${index}`]}
                />
                <Form.Control.Feedback type='invalid'>
                  {error[`${category}_price_${index}`]}
                </Form.Control.Feedback>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    ))
  }

  return (
    <PageLayout>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Add Trip')}</h3>
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
                  {t('manage owner')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Add Trip')}</li>
            </ul>
          </div>
        </div>
      </Col>
      <div className='container'>
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Captain Name In English
            </label>
            <Form.Control
              type='text'
              placeholder='Enter Captain Name In English'
              value={formData.captainNameEnglish}
              onChange={e => handleInputChange('captainNameEnglish', e.target.value)}
              isInvalid={!!ownerError.captainNameEnglish}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.captainNameEnglish}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Captain Name In Arabic
            </label>
            <Form.Control
              type='text'
              placeholder='Enter Captain Name In Arabic'
              value={formData.captainNameArabic}
              onChange={e => handleInputChange('captainNameArabic', e.target.value)}
              isInvalid={!!ownerError.captainNameArabic}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.captainNameArabic}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Captain Number
            </label>
            <Form.Control
              type='Number'
              placeholder='Enter Captain Number'
              value={formData.captainNumber}
              onChange={e => {
                handleInputChange('captainNumber', e.target.value)
              }}
              isInvalid={ownerError.captainNumber}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.captainNumber}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Max Number of People
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Max Number of People'
              value={formData.maxNumberofPeople}
              onChange={e => {
                handleInputChange('maxNumberofPeople', e.target.value)
              }}
              isInvalid={ownerError.maxNumberofPeople}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.maxNumberofPeople}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Gender
            </label>
            <Form.Select
              id='gender'
              value={formData.gender}
              onChange={e => {
                handleInputChange('gender', e.target.value)
              }}
              isInvalid={ownerError.gender}
            >
              <option value=''>Select Gender</option>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
              {/* <option value={2}>Other</option> */}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.gender}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Advertisement Type
            </label>
            <Form.Select
              id='gender'
              value={formData.advertisementType}
              onChange={e => {
                handleInputChange('advertisementType', e.target.value)
              }}
              isInvalid={ownerError.advertisementType}
            >
              <option value=''>Select Advertisement Type</option>
              <option value='0'>Private</option>
              <option value='1'>Public</option>
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.advertisementType}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Coupon Discount In %
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Coupon Discount In %'
              value={formData.couponDiscount}
              onChange={e => {
                handleInputChange('couponDiscount', e.target.value)
              }}
              isInvalid={ownerError.couponDiscount}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.couponDiscount}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Discount IN %
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Discount IN %'
              value={formData.discount}
              onChange={e => {
                handleInputChange('discount', e.target.value)
              }}
              isInvalid={ownerError.discount}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.discount}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Coupon fields (optional) */}
        <div className='row m-2'>
          <div className='col-md-4'>
            <label htmlFor='coupon_code' className='form-label'>
              Coupon Code (8 letters)
            </label>
            <Form.Control
              id='coupon_code'
              type='text'
              placeholder='ABCDEFGH'
              value={formData.coupon_code}
              onChange={e => {
                // Uppercase and strip non-letters, limit to 8
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
            <label htmlFor='start_date' className='form-label'>
              Start Date
            </label>
            <Form.Control
              id='start_date'
              type='date'
              value={formData.start_date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => handleInputChange('start_date', e.target.value)}
              isInvalid={!!ownerError.start_date}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.start_date}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-4'>
            <label htmlFor='end_date' className='form-label'>
              End Date
            </label>
            <Form.Control
              id='end_date'
              type='date'
              value={formData.end_date}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
              onChange={e => handleInputChange('end_date', e.target.value)}
              isInvalid={!!ownerError.end_date}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.end_date}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='nationality' className='form-label'>
              Nationality
            </label>
            <Form.Select
              id='nationality'
              value={formData.nationality}
              onChange={e => {
                handleInputChange('nationality', e.target.value)
              }}
              isInvalid={!!ownerError.nationality}
            >
              <option value='' disabled>
                {t('Select Nationality')}
              </option>
              {countryDetails.map(country => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.nationality}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='city' className='form-label'>
              City
            </label>
            <Form.Select
              id='city'
              value={formData.city}
              onChange={e => {
                handleInputChange('city', e.target.value)
              }}
              isInvalid={!!ownerError.city}
            // disabled={!formData.nationality}
            >
              <option value=''>
                {t('Select City')}
              </option>
              {cityDetails.map(city => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.city}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          {/* <div className='col-md-6'> */}
          {/* <label htmlFor='categoryDescription' className='form-label'> */}
          {/* Activity */}
          {/* </label>  */}
          {/* <Form.Select
              id='nationality'
              value={tripTypeSelected}
              onChange={e => {
                setTripType(e.target.value)
                setownerError(prev => ({ ...prev, tripTypeSelected: '' }))
              }}
              isInvalid={!!ownerError.tripTypeSelected}
            >
              <option value='' disabled>
                {t('Select Trip Type')}
              </option>
              {tripType.map(country => (
                <option key={country.trip_type_id} value={country.trip_type_id}>
                  {country.name_english}
                </option>
              ))}
            </Form.Select> */}

          {/* <Form.Select
              id='nationality'
              value={formData.tripTypeSelected}
              multiple   
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                handleInputChange('tripTypeSelected', selected)
              }}
              isInvalid={!!ownerError.tripTypeSelected}
            >
              <option value='' disabled>
                {t('Select Activity ')}
              </option>
              {tripType && Array.isArray(tripType) && tripType.map(type => (
                <option key={type.trip_type_id} value={type.trip_type_id}>
                  {type.name_english}
                </option>
              ))}
            </Form.Select>

            <Form.Control.Feedback type='invalid'>
              {ownerError.tripTypeSelected}
            </Form.Control.Feedback>
          </div> */}
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Activity
            </label>
            <Select
              isMulti
              options={tripType.map(type => ({
                value: type.trip_type_id,
                label: type.name_english
              }))}
              value={tripType.map(type => ({
                value: type.trip_type_id,
                label: type.name_english
              })).filter(type =>
                formData.tripTypeSelected.includes(type.value)
              )}
              onChange={selectedOptions => {
                const selectedValues = selectedOptions.map(option => option.value)
                handleInputChange('tripTypeSelected', selectedValues)
              }}
              placeholder="Select Activities..."
              className={ownerError.tripTypeSelected ? 'is-invalid' : ''}
              classNamePrefix="select"
            />
            {ownerError.tripTypeSelected && (
              <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                {ownerError.tripTypeSelected}
              </div>
            )}
          </div>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Boat
            </label>
            <Form.Select
              id='boat'
              value={formData.selectedBoatId}
              onChange={e => {
                handleInputChange('selectedBoatId', e.target.value)
              }}
              isInvalid={!!ownerError.selectedBoatId}
            >
              <option value='' disabled>
                {t('Select Boat')}
              </option>
              {boatData.map(country => (
                <option key={country.boat_id} value={country.boat_id}>
                  {country.boat_name_english}, {country.boat_year} (Capacity: {country.boat_capacity})
                </option>
              ))}
            </Form.Select>

            <Form.Control.Feedback type='invalid'>
              {ownerError.selectedBoatId}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='coverPics' className='form-label'>
              Images
            </label>
            <Form.Control
              type='file'
              multiple // Enable multiple file selection
              onChange={handleImageChange}
              isInvalid={!!ownerError.image}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.image}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='coverImage' className='form-label'>
              Cover Image
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
        </div>

        <div className='row m-2'>



          <div className='col-md-6'>
            <Form.Group className="form-group mb-4 ml-2">
              <Form.Label>Pickup point</Form.Label>
              <GooglePlacesAutocomplete
                apiKey="AIzaSyCY1_Ncz7dVOoaddm4ZXGqoAdG7cd8_exE"
                selectProps={{
                  onChange: handleChange,
                  placeholder: 'Search Location',
                  noOptionsMessage: () => null,
                  loadingMessage: () => null,
                }}
              />
              <p>{ownerError.pickupPoint}</p>
              {/* {addTripError.addStartAddress && (
                <p style={{ color: 'red', textAlign: "left" }}>{addTripError.addStartAddress}</p>
              )} */}
            </Form.Group>
          </div>


          {/* <div className='row m-2'> */}
          <div className='col-md-6'>
            <label htmlFor='destination' className='form-label'>
              Destination
            </label>
            <Form.Select
              id='destination'
              value={formData.destination_id}
              onChange={e => handleInputChange('destination_id', e.target.value)}
              isInvalid={!!ownerError.destination_id}
            >
              <option value='' disabled>
                Select Destination
              </option>
              {desctination_arr.map(destination => (
                <option key={destination.destination_id} value={destination.destination_id}>
                  {destination.destination_english}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.destination_id}
            </Form.Control.Feedback>
          </div>
          {/* </div> */}
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Slot Price
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Slot Price'
              value={formData.slotPrice}
              onChange={e => {
                handleInputChange('slotPrice', e.target.value)
              }}
              isInvalid={ownerError.slotPrice}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.slotPrice}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Minimum Hours
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Minimum Hours'
              value={formData.minimumHours}
              onChange={e => {
                handleInputChange('minimumHours', e.target.value)
              }}
              isInvalid={ownerError.minimumHours}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.minimumHours}
            </Form.Control.Feedback>
          </div>
        </div>


        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Description in English
            </label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder='Enter Description in English'
              value={formData.descriptionInEnglish}
              onChange={e => {
                handleInputChange('descriptionInEnglish', e.target.value)
              }}
              isInvalid={ownerError.descriptionInEnglish}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.descriptionInEnglish}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Description in Arabic
            </label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder='Enter Description in Arabic'
              value={formData.descriptionInArabic}
              onChange={e => {
                handleInputChange('descriptionInArabic', e.target.value)
              }}
              isInvalid={ownerError.descriptionInArabic}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.descriptionInArabic}
            </Form.Control.Feedback>
          </div>
        </div>

        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Idle Hours
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Idle hours'
              value={formData.IdleHours}
              onChange={e => {
                handleInputChange('IdleHours', e.target.value)
              }}
              isInvalid={ownerError.IdleHours}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.IdleHours}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Cancel Day
            </label>
            <Form.Control
              type='number'
              placeholder='Enter Cancel Day'
              value={formData.cancleDay}
              onChange={e => {
                handleInputChange('cancleDay', e.target.value)
              }}
              isInvalid={ownerError.cancleDay}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.cancleDay}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* ... (Keep all your existing form fields with updated onChange handlers) ... */}

        {/* Dynamic Addon Sections */}
        {addons.categories.map(category => (
          <React.Fragment key={category}>
            <h4 style={{ marginLeft: '20px' }}>{category}</h4>
            <div className='row m-2'>
              {addons.items[category]?.map((item, index) => (
                <div className='col-md-6' key={item.addon_subcategory_id}>
                  <label className='form-label'>
                    {item.sub_category_name}
                  </label>
                  <div className='d-flex justify-content-between align-items-center' style={{ columnGap: '15px' }}>
                    <input
                      type='checkbox'
                      checked={item.checkStatus === 1}
                      onChange={() => handleAddonCheckboxChange(category, index)}
                      style={{
                        width: '40px',
                        height: '42px',
                        borderRadius: '4px',
                        marginTop: '2px',
                        backgroundColor: item.checkStatus === 0 ? '#f0f0f0' : 'orange',
                        border: 'none'
                      }}
                    />
                    <Form.Control
                      type='number'
                      placeholder='Enter Price In KDW'
                      value={item.price}
                      onChange={e => handleAddonPriceChange(category, index, e.target.value)}
                      disabled={item.checkStatus === 0}
                      isInvalid={!!error[`${category}_price_${index}`]}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {error[`${category}_price_${index}`]}
                    </Form.Control.Feedback>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}


        {/* {renderAddonSections()} */}

        {/* ... (Keep all your remaining form fields) ... */}

        {/* Trip Time and Date Section */}
        {/* Trip Time and Date Section */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Trip Time
            </label>
            <Form.Select
              id='trip_time'
              value={formData.trip_time}
              onChange={e => handleInputChange('trip_time', e.target.value)}
              isInvalid={!!ownerError.trip_time}
            >
              <option value=''>Select Trip Time</option>
              <option value='0'>Open Time</option>
              <option value='1'>Fixed Time</option>
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.trip_time}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Trip Date Type
            </label>
            <Form.Select
              id='trip_date_type'
              value={formData.trip_date_type}
              onChange={e => handleInputChange('trip_date_type', e.target.value)}
              isInvalid={!!ownerError.trip_date_type}
            >
              <option value=''>Select Trip Date</option>
              <option value='0'>All Days</option>
              <option value='1'>Choose Dates</option>
              <option value='2'>WeekEnd (Friday-Saturday)</option>
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.trip_date_type}
            </Form.Control.Feedback>
          </div>
        </div>

        {/* Conditional Fields Based on Trip Time Selection */}
        {/* {formData.trip_time === '0' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='tripOpenTime' className='form-label'>
                Open Time
              </label>
              <Form.Control
                type='time'
                id='tripOpenTime'
                value={formData.trip_open_time}
                onChange={e => handleInputChange('trip_open_time', e.target.value)}
                isInvalid={!!ownerError.trip_open_time}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_open_time}
              </Form.Control.Feedback>
            </div>

            <div className='col-md-6'>
              <label htmlFor='tripCloseTime' className='form-label'>
                Close Time
              </label>
              <Form.Control
                type='time'
                id='tripCloseTime'
                value={formData.trip_close_time}
                onChange={e => handleInputChange('trip_close_time', e.target.value)}
                isInvalid={!!ownerError.trip_close_time}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_close_time}
              </Form.Control.Feedback>
            </div>
          </div>
        )}

        {formData.trip_time === '1' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='tripFixedTime' className='form-label'>
                Fixed Time
              </label>
              <Form.Control
                type='time'
                id='tripFixedTime'
                value={formData.trip_fixed_time}
                onChange={e => handleInputChange('trip_fixed_time', e.target.value)}
                isInvalid={!!ownerError.trip_fixed_time}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_fixed_time}
              </Form.Control.Feedback>
            </div>
          </div>
        )} */}

        {formData.trip_time === '0' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='tripOpenTime' className='form-label'>
                Open Time
              </label>
              <Form.Control
                type='time'
                id='tripOpenTime'
                value={formData.trip_open_time}
                onChange={e => handleTimeChange('trip_open_time', e.target.value)}
                isInvalid={!!ownerError.trip_open_time}
                step="3600"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_open_time}
              </Form.Control.Feedback>
            </div>

            <div className='col-md-6'>
              <label htmlFor='tripCloseTime' className='form-label'>
                Close Time
              </label>
              <Form.Control
                type='time'
                id='tripCloseTime'
                value={formData.trip_close_time}
                onChange={e => handleTimeChange('trip_close_time', e.target.value)}
                isInvalid={!!ownerError.trip_close_time}
                step="3600"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_close_time}
              </Form.Control.Feedback>
            </div>
          </div>
        )}

        {formData.trip_time === '1' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='tripFixedTime' className='form-label'>
                Fixed Time
              </label>
              <Form.Control
                type='time'
                id='tripFixedTime'
                value={formData.trip_fixed_time}
                onChange={e => handleTimeChange('trip_fixed_time', e.target.value)}
                isInvalid={!!ownerError.trip_fixed_time}
                step="3600"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_fixed_time}
              </Form.Control.Feedback>
            </div>
          </div>
        )}

        {/* Date Picker for Specific Dates */}
        {formData.trip_date_type === '1' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='tripDates' className='form-label'>
                Select Trip Dates
              </label>
              <DatePicker
                multiple
                value={formData.trip_dated || []}
                onChange={(dates) => handleInputChange('trip_dated', dates)}
                format='YYYY-MM-DD'
                placeholder='Select Dates'
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da'
                }}
              />
              {ownerError.trip_dated && (
                <div className='text-danger mt-1'>
                  {ownerError.trip_dated}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          className='btn btn-dark'
          style={{
            marginLeft: '20px',
            background: '#19918F',
            border: 'none',
            marginBottom: '5rem'
          }}
          onClick={handlesubmit}
        >
          ADD TRIP
        </button>
      </div>

      <Modal show={alertModal} onHide={() => setAlertModal(false)}>
        <div className='mc-alert-modal'>
          <i className='material-icons' style={{ color: 'green' }}>
            check_circle
          </i>
          <h3>Confirmation</h3>
          <br />
          <p>Trip has been created successfully.</p>
          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  )
}
