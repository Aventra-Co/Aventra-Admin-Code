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
import { SyncLoader } from 'react-spinners'

export default function EditProperty() {
  const { property_id } = useParams()
  const [alertModal, setAlertModal] = useState(false)
  const [ownerError, setOwnerError] = useState({})
  const { t } = useContext(TranslatorContext)

  // Form State
  const [formData, setFormData] = useState({
    property_id: '',
    user_id: '',
    property_name_english: '',
    property_type: '',
    property_address: '',
    no_of_rooms: '',
    no_of_halls: '',
    no_of_washroom: '',
    outdoor_seating: '',
    pool: ''
  })

  // Loading states
  const [loading, setLoading] = useState({
    page: true,
    submit: false
  })
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

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        console.log('Fetching property data for ID:', decode(property_id));
        
        const response = await axios.get(`${API_URL}/view_property_by_id?property_id=${decode(property_id)}`)
        
        console.log('Property response:', response.data);

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          
          // Set form data - property_type comes as integer from API
          setFormData({
            property_id: data.property_id,
            user_id: data.user_id,
            property_name_english: data.property_name_english || '',
            property_type: data.property_type ? data.property_type.toString() : '',
            property_address: data.property_address || '',
            no_of_rooms: data.no_of_rooms || '',
            no_of_halls: data.no_of_halls || '',
            no_of_washroom: data.no_of_washroom || '',
            outdoor_seating: data.outdoor_seating || '',
            pool: data.pool || ''
          })

          setLoading(prev => ({ ...prev, page: false }))
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Property not found',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate(-1)
          })
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        setLoading(prev => ({ ...prev, page: false }))
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load property data',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate(-1)
        })
      }
    }

    if (property_id) {
      fetchPropertyData();
    }
  }, [property_id, navigate])

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

    setLoading(prev => ({ ...prev, submit: true }))

    const formDataObj = new FormData()
    
    // Append all form fields
    formDataObj.append('property_id', formData.property_id)
    formDataObj.append('user_id', formData.user_id)
    formDataObj.append('property_name_english', formData.property_name_english)
    formDataObj.append('property_type', formData.property_type)
    formDataObj.append('property_address', formData.property_address)
    formDataObj.append('no_of_rooms', formData.no_of_rooms)
    formDataObj.append('no_of_halls', formData.no_of_halls)
    formDataObj.append('no_of_washroom', formData.no_of_washroom)
    formDataObj.append('outdoor_seating', formData.outdoor_seating)
    formDataObj.append('pool', formData.pool)

    // Submit to API
    axios.post(API_URL + '/edit_property', formDataObj)
      .then(response => {
        setLoading(prev => ({ ...prev, submit: false }))
        if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${encode(formData.user_id)}`)
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
        setLoading(prev => ({ ...prev, submit: false }))
        console.error('Error updating property:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update property',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      })
  }

  if (loading.page) {
    return (
      <PageLayout>
        <Col xl={12}>
          <div className="mc-card">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <SyncLoader color="#086861" />
            </div>
          </div>
        </Col>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('Edit Property')}</h3>
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
                <Link to={`${APP_PREFIX_PATH + `/owner-view/${encode(formData.user_id)}`}`} className='mc-breadcrumb-link'>
                  {t('owner details')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('Edit Property')}</li>
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

          {/* Property Type - Fixed with Integer Values */}
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
              >
                <option value=''>Select Property Type</option>
                <option value='1'>Villa</option>
                <option value='2'>Farm House</option>
                <option value='3'>Resort</option>
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
                placeholder='Enter number'
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
                placeholder='Enter number'
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
                placeholder='Enter number'
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
                placeholder='e.g., 1 large garden'
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
                placeholder='e.g., 1 small water pool in the garden'
                value={formData.pool}
                onChange={e => handleInputChange('pool', e.target.value)}
                isInvalid={!!ownerError.pool}
              />
              <Form.Control.Feedback type='invalid'>
                {ownerError.pool}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Hidden Fields */}
          <input type='hidden' name='property_id' value={formData.property_id} />
          <input type='hidden' name='user_id' value={formData.user_id} />

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
                disabled={loading.submit}
              >
                {loading.submit ? 'UPDATING...' : 'UPDATE'}
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
          <p>Property has been updated successfully.</p>
          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  )
}