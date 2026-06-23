/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Modal, Form } from 'react-bootstrap';
import PageLayout from '../../layouts/PageLayout';
import axios from 'axios';
import './UserProfilePage.css';
import { decode, encode } from 'base-64';
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant';
import DatePicker from 'react-multi-date-picker';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function EditTrip() {
  const { trip_id } = useParams();
  const [user_id, setUserId] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [ownerError, setownerError] = useState({});
  const [destinationArr, setDestinationArr] = useState([]);
  const { t } = useContext(TranslatorContext);

  // Form state
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
    minLeadDays: '',
    trip_time: '',
    trip_date_type: '',
    trip_open_time: '',
    trip_close_time: '',
    trip_fixed_time: '',
    trip_dated: '',
    destination_id: '',
    couponCode: '',
    startDate: '',
    endDate: '',
  });

  // Dynamic addons state
  const [addons, setAddons] = useState({
    categories: [],       // Stores addon categories from API
    items: {},            // Stores items for each category
    selected: {}          // Stores selected items and prices
  });

  const [image, setImage] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [countryDetails, setCountryDetails] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [tripType, setTripType] = useState([]);
  const [boatData, setBoatData] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [pickupPointObj, setPickupPointObj] = useState(null); // for GooglePlacesAutocomplete

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setownerError(prev => ({ ...prev, [field]: '' }));
  };

  // Fetch all addon categories and items
  const fetchAddons = async () => {
    try {
      const response = await axios.get(API_URL + '/get_addons_subcategory');
      const categories = response.data.addonSubCategoryArray || [];

      // Group items by category
      const itemsByCategory = {};
      categories.forEach(item => {
        if (!itemsByCategory[item.addon_name]) {
          itemsByCategory[item.addon_name] = [];
        }
        itemsByCategory[item.addon_name].push({
          ...item,
          checkStatus: 0,
          price: ''
        });
      });

      return {
        categories: Object.keys(itemsByCategory),
        items: itemsByCategory
      };

    } catch (error) {
      console.error('Error fetching addons:', error);
      return {
        categories: [],
        items: {}
      };
    }
  };

  // Fetch existing coupon data for the trip
  const fetchCouponData = async (tripId) => {
    try {
      const response = await axios.get(API_URL + `/check_coupon_code?trip_id=${tripId}`);
      if (response.data.success && response.data.coupon_data) {
        const couponData = response.data.coupon_data;
        return {
          couponCode: couponData.coupon_code || '',
          startDate: couponData.start_date ? couponData.start_date.split('T')[0] : '', // Convert to YYYY-MM-DD format
          endDate: couponData.end_date ? couponData.end_date.split('T')[0] : '', // Convert to YYYY-MM-DD format
        };
      }
      return {
        couponCode: '',
        startDate: '',
        endDate: '',
      };
    } catch (error) {
      console.error('Error fetching coupon data:', error);
      return {
        couponCode: '',
        startDate: '',
        endDate: '',
      };
    }
  };

  // Handle checkbox changes for addons
  const handleAddonCheckboxChange = (category, index) => {
    setAddons(prev => {
      const updatedItems = { ...prev.items };
      updatedItems[category][index].checkStatus =
        updatedItems[category][index].checkStatus === 0 ? 1 : 0;

      // Reset price if unchecked
      if (updatedItems[category][index].checkStatus === 0) {
        updatedItems[category][index].price = '';
      }

      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  // Add this custom handler function for time inputs
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

  // Handle price changes for addons
  const handleAddonPriceChange = (category, index, value) => {
    setAddons(prev => {
      const updatedItems = { ...prev.items };
      updatedItems[category][index].price = value;
      return {
        ...prev,
        items: updatedItems
      };
    });
    // Clear any existing error for this field
    setError(prev => ({ ...prev, [`${category}_price_${index}`]: '' }));
  };

  // Clear coupon fields
  const clearCouponFields = () => {
    handleInputChange('couponCode', '');
    handleInputChange('startDate', '');
    handleInputChange('endDate', '');
    setError(prev => ({
      ...prev,
      couponCode: '',
      startDate: '',
      endDate: ''
    }));
  };

  // Handle cover image upload
  const handleCoverImageChange = event => {
    const file = event.target.files[0];
    setCoverImage(file);
    setownerError(prev => ({ ...prev, coverImage: '' }));
  };

  // Handle image upload
  const handleImageChange = event => {
    const files = Array.from(event.target.files);
    setImage(files);
    setownerError(prev => ({ ...prev, image: '' }));
  };

  const handlePickupPointChange = async (value) => {
    if (!value) {
      setPickupPointObj(null);
      handleInputChange('pickupPoint', '');
      setLatitude('');
      setLongitude('');
      return;
    }
    setPickupPointObj(value);
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
    }
  };

  // Form submission
  const handlesubmit = () => {
    let errors = {};
    let isValid = true;

    // Validate addons with prices
    Object.entries(addons.items).forEach(([category, items]) => {
      items.forEach((item, index) => {
        if (item.checkStatus === 1 && (!item.price || item.price <= 0)) {
          errors[`${category}_price_${index}`] = 'Please enter a valid price!';
          isValid = false;
        }
      });
    });

    // Other validations
    if (!formData.captainNameEnglish) {
      errors.captainNameEnglish = 'Please Enter Captain Name In English';
      isValid = false;
    }

    if (!formData.IdleHours) {
      errors.IdleHours = 'Please Enter Idle Hours';
    } else if (formData.IdleHours < 0) {
      errors.IdleHours = 'Please Enter Valid Idle Hours';
    }

    if (!formData.cancleDay) {
      errors.cancleDay = 'Please Enter Customer Cancle Day'
    } else if (formData.cancleDay < 0) {
      errors.cancleDay = 'Please Enter Valid Customer Cancle Day'
    }
    // min_lead_days is optional (0 = no limit); only validate when provided
    if (formData.minLeadDays !== '' && Number(formData.minLeadDays) < 0) {
      errors.minLeadDays = 'Please Enter Valid Minimum Lead Days'
    }
    if (!formData.captainNameEnglish) {
      errors.captainNameEnglish = 'Please Enter Captain Name In English'
    }
    if (!formData.pickupPoint) {
      errors.pickupPoint = 'Please Enter Pickup Point'
    }
    if (!formData.slotPrice) {
      errors.slotPrice = 'Please Enter Slot Price'
    } else if (formData.slotPrice < 0) {
      errors.slotPrice = 'Please Enter valid Slot Price'
    }
    if (!formData.minimumHours) {
      errors.minimumHours = 'Please Enter Minimum Hours'
    } else if (formData.minimumHours < 0) {
      errors.minimumHours = 'Please Enter Valid Minimum Hours'
    }
    if (!formData.selectedBoatId) {
      errors.selectedBoatId = 'Please Select Boat'
    }
    if (!formData.trip_time) {
      errors.trip_time = 'Please Select Trip Time Type'
    }
    if (!formData.trip_date_type) {
      errors.trip_date_type = 'Please Select Trip Date Type'
    }
    if (!formData.city) {
      errors.city = 'Please Select City'
    }
    if (!formData.destination_id) {
      errors.destination_id = 'Please select a destination';
      isValid = false;
    }
    // if (!formData.captainNameArabic) {
    //   errors.captainNameArabic = 'Please Enter Captain Name Arabic'
    // }
    if (!formData.maxNumberofPeople) {
      errors.maxNumberofPeople = 'Please Enter Max Number of People'
    } else if (formData.maxNumberofPeople < 0) {
      errors.maxNumberofPeople = 'Please Enter Valid Max Number of People'
    }
    if (!formData.captainNumber) {
      errors.captainNumber = 'Please Enter Captain Number'
    } else if (formData.captainNumber < 0) {
      errors.captainNumber = 'Please Enter Valid Captain Number'
    }
    // if (!formData.discount) {
    //   errors.discount = 'Please Enter Discount '
    // } else if (formData.discount < 0) {
    //   errors.discount = 'Please Enter Valid Discount '
    // }
    if (!formData.gender) {
      errors.gender = 'Please Enter Gender '
    }
    if (!formData.nationality) {
      errors.nationality = 'Please Enter Nationality '
    }
    if (!formData.advertisementType) {
      errors.advertisementType = 'Please Enter Advertisement Type '
    }
    if (!formData.tripTypeSelected || formData.tripTypeSelected.length === 0) {
      errors.tripTypeSelected = 'Please Select At Least One Activity'
    }
    // if (!formData.couponDiscount) {
    //   errors.couponDiscount = 'Please Enter Coupon Discount'
    // } else if (formData.couponDiscount < 0) {
    //   errors.couponDiscount = 'Please Enter Valid Coupon Discount'
    // }

    // Validate coupon fields if any are provided
    if (formData.couponCode || formData.startDate || formData.endDate) {
      if (!formData.couponCode) {
        errors.couponCode = 'Please Enter Coupon Code'
        isValid = false;
      }
      if (!formData.startDate) {
        errors.startDate = 'Please Select Start Date'
        isValid = false;
      }
      if (!formData.endDate) {
        errors.endDate = 'Please Select End Date'
        isValid = false;
      }

      // Validate date range if both dates are provided
      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (startDate >= endDate) {
          errors.endDate = 'End Date must be after Start Date'
          isValid = false;
        }
      }
    }
    if (!formData.descriptionInEnglish) {
      errors.descriptionInEnglish = 'Please Enter Description In English'
    }
    // if (!formData.descriptionInArabic) {
    //   errors.descriptionInArabic = 'Please Enter Description In Arabic'
    // }
    if (!image) {
      errors.image = 'Please select image'
    }

    if (!formData.trip_time) {
      errors.trip_time = 'Please select trip time type'
      isValid = false
    }
    if (!formData.minimumHours) {
      errors.minimumHours = 'Please enter minimum hours'
      isValid = false
    }

    if (!formData.trip_date_type) {
      errors.trip_date_type = 'Please select trip date type'
      isValid = false
    }

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
      setError(errors);
      setownerError(errors);
      return;
    }

    // Prepare addon data for submission
    const addonData = {};
    Object.entries(addons.items).forEach(([category, items]) => {
      const categoryKey = `${category.toLowerCase().replace(/\s+/g, '_')}_arr`;

      // Only include checked items
      addonData[categoryKey] = items
        .filter(item => item.checkStatus === 1 || item.checked === 1)
        .map(item => ({
          addon_id: item.addon_id,
          addon_subcategory_id: item.addon_subcategory_id,
          checkStatus: 1,
          checked: 1,
          price: item.price || ''
        }));
    });

    // Create a new FormData instance
    const formDataObj = new FormData();

    // Add all your form fields
    formDataObj.append('trip_id', decode(trip_id));
    formDataObj.append('captain_name_english', formData.captainNameEnglish);
    formDataObj.append('user_id', formData.user_id || '');
    formDataObj.append('captain_name_arabic', formData.captainNameArabic);
    formDataObj.append('trip_time', formData.trip_time);
    formDataObj.append('trip_close_time', formData.trip_close_time);
    formDataObj.append('trip_open_time', formData.trip_open_time);
    formDataObj.append('fixed_time', formData.trip_fixed_time);
    formDataObj.append('max_people', formData.maxNumberofPeople);
    formDataObj.append('contact_number', formData.captainNumber);
    formDataObj.append('discount', formData.discount);
    formDataObj.append('coupon_discount', formData.couponDiscount);
    formDataObj.append('description_english', formData.descriptionInEnglish);
    formDataObj.append('gender', formData.gender);
    formDataObj.append('description_arabic', formData.descriptionInArabic);
    formDataObj.append('country_id', formData.nationality);
    formDataObj.append('city_id', formData.city);
    formDataObj.append('trip_type_id', formData.tripTypeSelected.join(','));
    formDataObj.append('trip_date_type', formData.trip_date_type);
    formDataObj.append('advertisement_type', formData.advertisementType);
    formDataObj.append('boat_id', formData.selectedBoatId);
    formDataObj.append('pickup_point', formData.pickupPoint);
    formDataObj.append('latitude', latitude);
    formDataObj.append('longitude', longitude);
    formDataObj.append('price_per_hour', formData.slotPrice);
    formDataObj.append('minimum_hours', formData.minimumHours);
    formDataObj.append('idle_hours', formData.IdleHours);
    formDataObj.append('destination_id', formData.destination_id);
    formDataObj.append('free_to_cancel', formData.cancleDay);
    formDataObj.append('min_lead_days', formData.minLeadDays === '' ? 0 : formData.minLeadDays);
    formDataObj.append('trip_date', formData.trip_dated);
    formDataObj.append('coupon_code', formData.couponCode);
    formDataObj.append('start_date', formData.startDate);
    formDataObj.append('end_date', formData.endDate);

    // Add cover image if it exists
    if (coverImage) {
      formDataObj.append('mainImage', coverImage);
    }

    // Add additional images if they exist
    if (image && image.length > 0) {
      image.forEach(img => {
        formDataObj.append('image', img);
      });
    }

    // Then when appending to formData:
    Object.entries(addonData).forEach(([key, value]) => {
      formDataObj.append(key, JSON.stringify(value));
    });

    // Submit to API (using edit endpoint)
    axios.post(API_URL + '/edit_trip', formDataObj)
      .then(response => {
        if (response.data.success) {
          setAlertModal(true);
          setTimeout(() => {
            setAlertModal(false);
            navigate(APP_PREFIX_PATH + `/owner-view/${encode(user_id)}`);
          }, 2000);
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
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        else {
          setownerError(prev => ({ ...prev, ...response.data.errors }));
        }
      })
      .catch(error => {
        console.error('Error submitting trip:', error);
        setownerError(prev => ({ ...prev, formError: 'Failed to submit trip' }));
      });
  };

  // Fetch cities when country changes
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // First fetch all possible addons
        const addonsData = await fetchAddons();

        // Then fetch trip details and coupon data in parallel
        const [tripDetailsRes, destinationsRes, couponData] = await Promise.all([
          axios.get(API_URL + `/Check_trip_details_for_testing?trip_id=${decode(trip_id)}`),
          axios.get(API_URL + '/fetch_destination_details'),
          fetchCouponData(decode(trip_id))
        ]);

        if (tripDetailsRes.data?.trip_arr?.length > 0) {
          const trip = tripDetailsRes.data.trip_arr[0];
          setUserId(trip.user_id);
          const checkUserId = trip.user_id;
          setDestinationArr(destinationsRes.data.destination_arr || []);

          console.log("Trip city_id from API:", trip.city_id, typeof trip.city_id);

          // FIRST - Fetch countries, cities, trip types, and boats in parallel
          const [
            countriesRes,
            citiesRes,
            tripTypesRes,
            boatsRes
          ] = await Promise.all([
            axios.get(API_URL + '/fetch_coutry_list'),
            trip.country_id ? axios.get(API_URL + `/fetch_city_for_trip_list?country_id=${trip.country_id}`) : Promise.resolve({ data: { city_arr: [] } }),
            axios.get(API_URL + '/fetch_trip_type'),
            axios.get(API_URL + `/fetch_boat_data_by_id?user_id=${checkUserId}`)
          ]);

          // Set all dropdown options first
          setCountryDetails(countriesRes.data.country_arr || []);
          setCityDetails(citiesRes.data.city_arr || []);
          setTripType(tripTypesRes.data.trip_type_arr || []);
          setBoatData(boatsRes.data.boat_arr || []);

          const cities = citiesRes.data.city_arr || [];
          setCityDetails(cities);

          console.log("Available cities:", cities);
          console.log("Looking for city_id:", trip.city_id);

          // THEN set form data with all values including city_id and coupon data
          setFormData({
            captainNameEnglish: trip.captain_name_english || '',
            captainNameArabic: trip.captain_name_arabic || '',
            maxNumberofPeople: trip.max_people || '',
            captainNumber: trip.contact_number || '',
            discount: trip.discount || '',
            couponDiscount: trip.coupon_discount || '',
            descriptionInEnglish: trip.description_english || '',
            descriptionInArabic: trip.description_arabic || '',
            gender: trip.gender?.toString() || '',
            advertisementType: trip.advertisement_type?.toString() || '',
            nationality: trip.country_id?.toString() || '', // Ensure string
            city: trip.city_id?.toString() || '', // Ensure string
            tripTypeSelected: trip.trip_type_id ? trip.trip_type_id.split(',').map(id => id.trim()) : [],
            pickupPoint: trip.pickup_point || '',
            selectedBoatId: trip.boat_id?.toString() || '', // Ensure string
            slotPrice: trip.price_per_hour || '',
            minimumHours: trip.minimum_hours || '',
            IdleHours: trip.idle_hours || '',
            cancleDay: trip.free_to_cancel || '',
            minLeadDays: (trip.min_lead_days ?? '') === '' ? '' : String(trip.min_lead_days),
            trip_time: trip.trip_time?.toString() || '',
            trip_date_type: trip.trip_date?.toString() || '',
            trip_open_time: trip.from_time || '',
            trip_close_time: trip.to_time || '',
            trip_fixed_time: (trip.trip_time == 1) ? trip.from_time : '',
            trip_dated: trip.dates ? trip.dates.split(',') : [],
            destination_id: trip.destination_id?.toString() || '',
            couponCode: couponData.couponCode || '',
            startDate: couponData.startDate || '',
            endDate: couponData.endDate || '',
          });

          // Process addons
          if (trip.addons && trip.addons.length > 0) {
            const updatedItems = { ...addonsData.items };

            // Create a map of existing addon subcategory IDs for quick lookup
            const tripAddonMap = {};
            trip.addons.forEach(addon => {
              tripAddonMap[addon.addon_subcategory_id] = addon;
            });

            // Update each item with existing addon data if it exists
            for (const category in updatedItems) {
              updatedItems[category] = updatedItems[category].map(item => {
                const existingAddon = tripAddonMap[item.addon_subcategory_id];
                if (existingAddon) {
                  return {
                    ...item,
                    checkStatus: 1,
                    checked: 1,
                    price: existingAddon.price
                  };
                }
                return item;
              });
            }

            setAddons({
              categories: addonsData.categories,
              items: updatedItems,
              selected: {}
            });
          }
          setLatitude(trip.latitude || '');
          setLongitude(trip.longitude || '');
          setPickupPointObj(trip.pickup_point ? { label: trip.pickup_point, value: { place_id: '' } } : null);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [trip_id]);

  useEffect(() => {
    // if (formData.nationality) {
    axios.get(API_URL + `/fetch_city_for_trip_list?country_id=1`)
      .then(response => {
        setCityDetails(response.data.city_arr || []);
        if (formData.city && document.activeElement && document.activeElement.id === 'nationality') {
          handleInputChange('city', '');
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
    // } else {
    //   setCityDetails([]);
    //   handleInputChange('city', '');
    // }
  }, []);

  // Render addon sections dynamically
  const renderAddonSections = () => {
    return addons.categories.map(category => (
      <React.Fragment key={category}>
        <h4 style={{ marginLeft: '20px' }}>{category}</h4>
        <div className='row m-2'>
          {addons.items[category]?.map((item, index) => (
            <div className='col-md-6' key={`${item.addon_id}_${item.addon_subcategory_id}`}>
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
    ));
  };

  return (
    <PageLayout>
      {/* Breadcrumb and header */}
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Edit Trip')}</h3>
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
              <li className='mc-breadcrumb-item'>{t('Edit Trip')}</li>
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

        {/* <div className='row m-2'>
          <div className='col-12 d-flex justify-content-between align-items-center'>
            <small className='text-muted'>
              <i className='material-icons' style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '5px' }}>
                info
              </i>
              Coupon fields are optional. Fill them only if you want to create/update a coupon for this trip.
            </small>
            {(formData.couponCode || formData.startDate || formData.endDate) && (
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                onClick={clearCouponFields}
                style={{ fontSize: '12px' }}
              >
                <i className='material-icons' style={{ fontSize: '14px', marginRight: '5px' }}>
                  clear
                </i>
                Clear Coupon
              </button>
            )}
          </div>
        </div> */}

        <div className='row m-2'>
          <div className='col-md-4'>
            <label htmlFor='couponCode' className='form-label'>
              Coupon Code
            </label>
            <Form.Control
              type='text'
              placeholder='Enter Coupon Code'
              value={formData.couponCode}
              onChange={e => handleInputChange('couponCode', e.target.value)}
              isInvalid={!!ownerError.couponCode}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.couponCode}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-4'>
            <label htmlFor='startDate' className='form-label'>
              Start Date
            </label>
            <Form.Control
              type='date'
              value={formData.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => handleInputChange('startDate', e.target.value)}
              isInvalid={!!ownerError.startDate}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.startDate}
            </Form.Control.Feedback>
          </div>

          <div className='col-md-4'>
            <label htmlFor='endDate' className='form-label'>
              End Date
            </label>
            <Form.Control
              type='date'
              value={formData.endDate}
              // min={formData.startDate || new Date().toISOString().split('T')[0]}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => handleInputChange('endDate', e.target.value)}
              isInvalid={!!ownerError.endDate}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.endDate}
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
              key={`city-select-${cityDetails.length}`}
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
                <option
                  key={String(city.city_id)}
                  value={String(city.city_id)}
                >
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
          <div className='col-md-6'>
            <label htmlFor='categoryDescription' className='form-label'>
              Activity
            </label>
            <Select
              isMulti
              options={tripType.map(type => ({
                value: String(type.trip_type_id),
                label: type.name_english,
              }))}
              value={
                tripType
                  .map(type => ({
                    value: String(type.trip_type_id),
                    label: type.name_english,
                  }))
                  .filter(type => formData.tripTypeSelected.includes(type.value))
              }
              onChange={selectedOptions => {
                const selectedValues = selectedOptions.map(option => option.value);
                handleInputChange('tripTypeSelected', selectedValues);
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
            <label htmlFor='coverImage' className='form-label'>
              Cover Image
            </label>
            <Form.Control
              type='file'
              id='coverImage'
              onChange={handleCoverImageChange}
              isInvalid={!!ownerError.coverImage}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.coverImage}
            </Form.Control.Feedback>
          </div>
          <div className='col-md-6'>
            <label htmlFor='coverPics' className='form-label'>
              Images
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

        <div className='row m-2'>
          <div className='col-md-6'>
            <Form.Group className="form-group mb-4 ml-2">
              <Form.Label>Pickup point</Form.Label>
              <GooglePlacesAutocomplete
                apiKey="AIzaSyCY1_Ncz7dVOoaddm4ZXGqoAdG7cd8_exE"
                selectProps={{
                  value: pickupPointObj,
                  onChange: handlePickupPointChange,
                  placeholder: 'Search Location',
                  noOptionsMessage: () => null,
                  loadingMessage: () => null,
                  className: ownerError.pickupPoint ? 'is-invalid' : '',
                }}
              />
              <p>{ownerError.pickupPoint}</p>
            </Form.Group>
          </div>

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
              {destinationArr.map(destination => (
                <option key={destination.destination_id} value={destination.destination_id}>
                  {destination.destination_english}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>
              {ownerError.destination_id}
            </Form.Control.Feedback>
          </div>
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

          <div className='col-md-6'>
            <label htmlFor='minLeadDays' className='form-label'>
              Minimum Lead Days
            </label>
            <Form.Control
              type='number'
              min='0'
              placeholder='Enter Minimum Lead Days (0 = no limit)'
              value={formData.minLeadDays}
              onChange={e => {
                handleInputChange('minLeadDays', e.target.value)
              }}
              isInvalid={ownerError.minLeadDays}
            />
            <Form.Control.Feedback type='invalid'>
              {ownerError.minLeadDays}
            </Form.Control.Feedback>
          </div>
        </div>
        {/* Form fields (same structure as add page) */}
        {/* ... (keep all your existing form fields) ... */}

        {/* Dynamic Addon Sections */}
        {renderAddonSections()}

        {/* Trip Time and Date Section */}
        <div className='row m-2'>
          <div className='col-md-6'>
            <label htmlFor='trip_time' className='form-label'>
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
            <label htmlFor='trip_date_type' className='form-label'>
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
              <label htmlFor='trip_open_time' className='form-label'>
                Open Time
              </label>
              <Form.Control
                type='time'
                id='trip_open_time'
                value={formData.trip_open_time}
                onChange={e => handleInputChange('trip_open_time', e.target.value)}
                isInvalid={!!ownerError.trip_open_time}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_open_time}
              </Form.Control.Feedback>
            </div>

            <div className='col-md-6'>
              <label htmlFor='trip_close_time' className='form-label'>
                Close Time
              </label>
              <Form.Control
                type='time'
                id='trip_close_time'
                value={formData.trip_close_time}
                onChange={e => handleInputChange('trip_close_time', e.target.value)}
                isInvalid={!!ownerError.trip_close_time}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.trip_close_time}
              </Form.Control.Feedback>
            </div>
          </div>
        )} */}

        {formData.trip_time === '0' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='trip_open_time' className='form-label'>
                Open Time
              </label>
              <Form.Control
                type='time'
                id='trip_open_time'
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
              <label htmlFor='trip_close_time' className='form-label'>
                Close Time
              </label>
              <Form.Control
                type='time'
                id='trip_close_time'
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

        {/* {formData.trip_time === '1' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='trip_fixed_time' className='form-label'>
                Fixed Time
              </label>
              <Form.Control
                type='time'
                id='trip_fixed_time'
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

        {formData.trip_time === '1' && (
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='trip_fixed_time' className='form-label'>
                Fixed Time
              </label>
              <Form.Control
                type='time'
                id='trip_fixed_time'
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
              <label htmlFor='trip_dated' className='form-label'>
                Select Trip Dates
              </label>
              <DatePicker
                multiple
                value={formData.trip_dated}
                onChange={dates => handleInputChange('trip_dated', dates)}
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
          UPDATE TRIP
        </button>
      </div>

      <Modal show={alertModal} onHide={() => setAlertModal(false)}>
        <div className='mc-alert-modal'>
          <i className='material-icons' style={{ color: 'green' }}>
            check_circle
          </i>
          <h3>Confirmation</h3>
          <br />
          <p>Trip has been updated successfully.</p>
          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  );
}