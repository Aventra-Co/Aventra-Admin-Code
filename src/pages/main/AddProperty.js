/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Col, Modal, Form, Row } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { decode, encode } from 'base-64'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import Swal from 'sweetalert2';

export default function AddProperty() {
  const { user_id } = useParams()
  const [alertModal, setAlertModal] = useState(false)
  const [ownerError, setOwnerError] = useState({})
  const { t } = useContext(TranslatorContext)

  // Form State
  const [formData, setFormData] = useState({
    property_name_english: '',
    property_type: '',
    property_address: '',
    no_of_rooms: '',
    no_of_halls: '',
    no_of_washroom: '',
    outdoor_seating: '',
    pool: ''
  })

  // Loading state
  const [loading, setLoading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [error, setError] = useState({})

  const navigate = useNavigate()

  // Fetch property types on component mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoadingTypes(true)
        const response = await axios.get(API_URL + '/get_all_property_type')
        
        if (response.data.success && response.data.data) {
          setPropertyTypes(response.data.data)
        } else {
          setPropertyTypes([])
        }
      } catch (error) {
        console.error('Error fetching property types:', error)
        setPropertyTypes([])
      } finally {
        setLoadingTypes(false)
      }
    }
    
    fetchPropertyTypes()
  }, [])

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setOwnerError(prev => ({ ...prev, [field]: '' }))
  }

  // Validation function
  const validateForm = () => {
    let errors = {}
    let isValid = true

    // Required fields validation
    if (!formData.property_name_english) {
      errors.property_name_english = 'Please enter property name'
      isValid = false
    }

    if (!formData.property_type) {
      errors.property_type = 'Please select property type'
      isValid = false
    }

    if (!formData.property_address) {
      errors.property_address = 'Please enter property address'
      isValid = false
    }

    if (!formData.no_of_rooms) {
      errors.no_of_rooms = 'Please enter number of rooms'
      isValid = false
    } else if (Number(formData.no_of_rooms) < 0) {
      errors.no_of_rooms = 'Please enter valid number'
      isValid = false
    }

    if (!formData.no_of_halls) {
      errors.no_of_halls = 'Please enter number of halls'
      isValid = false
    } else if (Number(formData.no_of_halls) < 0) {
      errors.no_of_halls = 'Please enter valid number'
      isValid = false
    }

    if (!formData.no_of_washroom) {
      errors.no_of_washroom = 'Please enter number of washrooms'
      isValid = false
    } else if (Number(formData.no_of_washroom) < 0) {
      errors.no_of_washroom = 'Please enter valid number'
      isValid = false
    }

    if (!formData.outdoor_seating) {
      errors.outdoor_seating = 'Please enter outdoor seating details'
      isValid = false
    }

    if (!formData.pool) {
      errors.pool = 'Please enter pool details'
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

    setLoading(true)

    const formDataObj = new FormData()
    
    // Append all form fields
    formDataObj.append('user_id', decode(user_id))
    formDataObj.append('property_name_english', formData.property_name_english)
    formDataObj.append('property_type', formData.property_type) // This will send property_type_id
    formDataObj.append('property_address', formData.property_address)
    formDataObj.append('no_of_rooms', formData.no_of_rooms)
    formDataObj.append('no_of_halls', formData.no_of_halls)
    formDataObj.append('no_of_washroom', formData.no_of_washroom)
    formDataObj.append('outdoor_seating', formData.outdoor_seating)
    formDataObj.append('pool', formData.pool)

    // Submit to API
    axios.post(API_URL + '/add_property', formDataObj)
      .then(response => {
        setLoading(false)
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
        setLoading(false)
        console.error('Error submitting property:', error)
        setOwnerError(prev => ({ ...prev, formError: 'Failed to submit property' }))
      })
  }

  return (
    <PageLayout>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Add Property')}</h3>
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
              <li className='mc-breadcrumb-item'>
                <Link to={`${APP_PREFIX_PATH + `/owner-view/${user_id}`}`} className='mc-breadcrumb-link'>
                  {t('owner details')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Add Property')}</li>
            </ul>
          </div>
        </div>
      </Col>

      <div className='container'>
        <div className='mc-card p-4'>
          <h4 className='mb-4'>Property Details</h4>
          
          {/* Property Name */}
          <div className='row m-2'>
            <div className='col-md-12'>
              <label htmlFor='property_name_english' className='form-label'>
                Property Name *
              </label>
              <Form.Control
                type='text'
                placeholder='Enter property name'
                value={formData.property_name_english}
                onChange={e => handleInputChange('property_name_english', e.target.value)}
                isInvalid={!!ownerError.property_name_english}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.property_name_english}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Property Type - Dynamic from API */}
          <div className='row m-2'>
            <div className='col-md-12'>
              <label htmlFor='property_type' className='form-label'>
                Property Type *
              </label>
              <Form.Select
                id='property_type'
                value={formData.property_type}
                onChange={e => handleInputChange('property_type', e.target.value)}
                isInvalid={!!ownerError.property_type}
                disabled={loadingTypes}
              >
                <option value=''>
                  {loadingTypes ? 'Loading property types...' : 'Select Property Type'}
                </option>
                {!loadingTypes && propertyTypes.length > 0 ? (
                  propertyTypes.map((type) => (
                    <option key={type.property_type_id} value={type.property_type_id}>
                      {type.property_type_name} / {type.property_type_name_arabic}
                    </option>
                  ))
                ) : (
                  !loadingTypes && (
                    <option value='' disabled>No property types available</option>
                  )
                )}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                {ownerError.property_type}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Property Address */}
          <div className='row m-2'>
            <div className='col-md-12'>
              <label htmlFor='property_address' className='form-label'>
                Property Address *
              </label>
              <Form.Control
                type='text'
                placeholder='Enter property address'
                value={formData.property_address}
                onChange={e => handleInputChange('property_address', e.target.value)}
                isInvalid={!!ownerError.property_address}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.property_address}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Numbers Row */}
          <div className='row m-2'>
            <div className='col-md-4'>
              <label htmlFor='no_of_rooms' className='form-label'>
                Number of Rooms *
              </label>
              <Form.Control
                type='number'
                placeholder='Enter Rooms'
                value={formData.no_of_rooms}
                onChange={e => handleInputChange('no_of_rooms', e.target.value)}
                isInvalid={!!ownerError.no_of_rooms}
                min="0"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.no_of_rooms}
              </Form.Control.Feedback>
            </div>
            <div className='col-md-4'>
              <label htmlFor='no_of_halls' className='form-label'>
                Number of Halls *
              </label>
              <Form.Control
                type='number'
                placeholder='Enter Halls'
                value={formData.no_of_halls}
                onChange={e => handleInputChange('no_of_halls', e.target.value)}
                isInvalid={!!ownerError.no_of_halls}
                min="0"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.no_of_halls}
              </Form.Control.Feedback>
            </div>
            <div className='col-md-4'>
              <label htmlFor='no_of_washroom' className='form-label'>
                Number of Washrooms *
              </label>
              <Form.Control
                type='number'
                placeholder='Enter washrooms'
                value={formData.no_of_washroom}
                onChange={e => handleInputChange('no_of_washroom', e.target.value)}
                isInvalid={!!ownerError.no_of_washroom}
                min="0"
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.no_of_washroom}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Outdoor Seating - Text Input */}
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='outdoor_seating' className='form-label'>
                Outdoor Seating Details *
              </label>
              <Form.Control
                type='text'
                placeholder='Enter Outdoor Seating'
                value={formData.outdoor_seating}
                onChange={e => handleInputChange('outdoor_seating', e.target.value)}
                isInvalid={!!ownerError.outdoor_seating}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.outdoor_seating}
              </Form.Control.Feedback>
            </div>

            {/* Pool - Text Input */}
            <div className='col-md-6'>
              <label htmlFor='pool' className='form-label'>
                Pool Details *
              </label>
              <Form.Control
                type='text'
                placeholder='Enter Pool'
                value={formData.pool}
                onChange={e => handleInputChange('pool', e.target.value)}
                isInvalid={!!ownerError.pool}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.pool}
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
                  marginBottom: '1rem'
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
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
          <p>Property has been added successfully.</p>
          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  )
}