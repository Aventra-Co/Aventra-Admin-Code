import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Modal, Col } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import { decode } from 'base-64'
import Swal from 'sweetalert2';

export default function AddPropertyUnavailability() {
  const { owner_id } = useParams()
  const [errors, setErrors] = useState({})
  const [alertModal, setAlertModal] = useState(false)
  const { t } = useContext(TranslatorContext)
  const [dateSelected, setdateSelected] = useState('')
  const [propertyData, setPropertyData] = useState([])
  const [selectedPropertyId, setSelectedProperty] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [availabilityType, setAvailabilityType] = useState('1') // Default to selected time
  const navigate = useNavigate()

  const handleSubmit = () => {
    let newErrors = {}

    if (!selectedPropertyId) {
      newErrors.selectedPropertyId = 'Please Select Property'
    }
    if (!dateSelected) {
      newErrors.dateSelected = 'Please Enter Date'
    }
    if (availabilityType === '1') {
      if (!fromTime) {
        newErrors.fromTime = 'Please Select From Time'
      }
      if (!toTime) {
        newErrors.toTime = 'Please Select To Time'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formData = new FormData()
    formData.append('user_id', decode(owner_id))
    formData.append('property_id', selectedPropertyId)
    formData.append('date', dateSelected)
    formData.append('type', availabilityType)
    formData.append('entity_type', '1') // 1 for property

    if (availabilityType === '1') {
      formData.append('from_time', fromTime)
      formData.append('to_time', toTime)
    }

    axios
      .post(API_URL + '/add_unavailability', formData)
      .then(response => {
        if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${owner_id}`)
          }, 2000)
        } else if (response.data.key) {
          setErrors(prev => ({ ...prev, [response.data.key]: response.data.msg }))
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.data.msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch(error => {
        console.error('Error adding property unavailability:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add unavailability',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      })
  }

  const fetchPropertyData = () => {
    axios
      .get(API_URL + `/fetch_property_data_by_id?user_id=${decode(owner_id)}`)
      .then(response => {
        setPropertyData(response.data.data || [])
      })
      .catch(error => {
        console.error('Error fetching property data:', error)
      })
  }

  useEffect(() => {
    fetchPropertyData()
  }, [])

  return (
    <>
      <PageLayout>
        <Col xl={12}>
          <div className='mc-card'>
            <div className='mc-breadcrumb'>
              <h3 className='mc-breadcrumb-title'>{t('Add Property Unavailability')}</h3>
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
                <li className='mc-breadcrumb-item'>
                  <Link
                    to={`${APP_PREFIX_PATH + `/owner-view/${owner_id}`}`}
                    className='mc-breadcrumb-link'
                  >
                    {t('owner details')}
                  </Link>
                </li>
                <li className='mc-breadcrumb-item'>
                  {t('Add Property Unavailability')}
                </li>
              </ul>
            </div>
          </div>
        </Col>

        <div className='container'>
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='property' className='form-label'>
                Property
              </label>
              <Form.Select
                id='property'
                value={selectedPropertyId}
                onChange={e => {
                  setSelectedProperty(e.target.value)
                  setErrors(prev => ({ ...prev, selectedPropertyId: '' }))
                }}
                isInvalid={!!errors.selectedPropertyId}
              >
                <option value='' disabled>
                  {t('Select Property')}
                </option>
                {propertyData.map(property => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.property_name_english}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                {errors.selectedPropertyId}
              </Form.Control.Feedback>
            </div>
            <div className='col-md-6'>
              <label htmlFor='dateSelected' className='form-label'>
                Date
              </label>
              <Form.Control
                type='date'
                id='dateSelected'
                placeholder='Enter Date'
                value={dateSelected}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => {
                  setdateSelected(e.target.value)
                  setErrors(prev => ({ ...prev, dateSelected: '' }))
                }}
                isInvalid={!!errors.dateSelected}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.dateSelected}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className='row m-2'>
            <div className='col-md-12 mb-3'>
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='availabilityType'
                  id='fullDay'
                  value='0'
                  checked={availabilityType === '0'}
                  onChange={() => setAvailabilityType('0')}
                />
                <label className='form-check-label' htmlFor='fullDay'>
                  Full Day
                </label>
              </div>
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='availabilityType'
                  id='selectedTime'
                  value='1'
                  checked={availabilityType === '1'}
                  onChange={() => setAvailabilityType('1')}
                />
                <label className='form-check-label' htmlFor='selectedTime'>
                  Selected Time
                </label>
              </div>
            </div>
          </div>

          {availabilityType === '1' && (
            <div className='row m-2'>
              <div className='col-md-6'>
                <label htmlFor='fromTime' className='form-label'>
                  From Time
                </label>
                <Form.Control
                  type='time'
                  id='fromTime'
                  value={fromTime}
                  onChange={e => {
                    setFromTime(e.target.value)
                    setErrors(prev => ({ ...prev, fromTime: '' }))
                  }}
                  isInvalid={!!errors.fromTime}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.fromTime}
                </Form.Control.Feedback>
              </div>

              <div className='col-md-6'>
                <label htmlFor='toTime' className='form-label'>
                  To Time
                </label>
                <Form.Control
                  type='time'
                  id='toTime'
                  value={toTime}
                  onChange={e => {
                    setToTime(e.target.value)
                    setErrors(prev => ({ ...prev, toTime: '' }))
                  }}
                  isInvalid={!!errors.toTime}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.toTime}
                </Form.Control.Feedback>
              </div>
            </div>
          )}

          <button
            className='btn btn-dark mt-3 mb-5 mx-2'
            style={{ background: '#19918F', border: 'none' }}
            onClick={handleSubmit}
          >
            ADD
          </button>
        </div>

        <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
          <div className='mc-alert-modal'>
            <i className='material-icons' style={{ color: 'green' }}>
              check_circle
            </i>
            <h3>Confirmation</h3>
            <p>Property Unavailability has been Added successfully.</p>
          </div>
        </Modal>
      </PageLayout>
    </>
  )
}