import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Modal, Col } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import { decode, encode } from 'base-64'
import Swal from 'sweetalert2';

export default function EditPropertyUnavailability() {
  const { unavailability_id } = useParams()
  const [errors, setErrors] = useState({})
  const [alertModal, setAlertModal] = useState(false)
  const { t } = useContext(TranslatorContext)
  const [dateSelected, setdateSelected] = useState('')
  const [propertyData, setPropertyData] = useState([])
  const [selectedPropertyId, setSelectedProperty] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [user_id, setUserId] = useState('')
  const [availabilityType, setAvailabilityType] = useState('1')
  const [loading, setLoading] = useState(true)

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
    formData.append('unavailability_id', decode(unavailability_id))
    formData.append('property_id', selectedPropertyId)
    formData.append('user_id', user_id)
    formData.append('date', dateSelected)
    formData.append('type', availabilityType)
    formData.append('entity_type', '1')

    if (availabilityType === '1') {
      formData.append('from_time', fromTime)
      formData.append('to_time', toTime)
    }

    axios
      .post(API_URL + '/edit_unavailability', formData)
      .then(response => {
        if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${encode(user_id)}`)
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
        console.error('Error updating property unavailability:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update unavailability',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      })
  }

  const fetchUnavailabilityData = () => {
    axios
      .get(API_URL + `/fetch_unavailability?unavailability_id=${decode(unavailability_id)}`)
      .then(response => {
        const data = response.data.unavailability;
        
        // Format date from DD-MMM-YYYY to YYYY-MM-DD
        const dateParts = data.date.split('-')
        const months = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        }
        const formattedDate = `${dateParts[2]}-${months[dateParts[1]]}-${dateParts[0].padStart(2, '0')}`

        setdateSelected(formattedDate)
        setToTime(data.to_time)
        setFromTime(data.from_time)
        setSelectedProperty(data.property_id)
        setUserId(data.user_id)
        setAvailabilityType(data.type?.toString() || '1')
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching unavailability details:', error)
        setLoading(false)
      })
  }

  const fetchPropertyData = () => {
    if (user_id) {
      axios
        .get(API_URL + `/fetch_property_data_by_id?user_id=${user_id}`)
        .then(response => {
          setPropertyData(response.data.data || [])
        })
        .catch(error => {
          console.error('Error fetching property data:', error)
        })
    }
  }

  useEffect(() => {
    fetchUnavailabilityData()
  }, [])

  useEffect(() => {
    if (user_id) {
      fetchPropertyData()
    }
  }, [user_id])

  if (loading) {
    return (
      <PageLayout>
        <Col xl={12}>
          <div className="mc-card">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </Col>
      </PageLayout>
    )
  }

  return (
    <>
      <PageLayout>
        <Col xl={12}>
          <div className='mc-card'>
            <div className='mc-breadcrumb'>
              <h3 className='mc-breadcrumb-title'>{t('Edit Property Unavailability')}</h3>
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
                  <Link to={`${APP_PREFIX_PATH + `/owner-view/${encode(user_id)}`}`} className='mc-breadcrumb-link'>
                    {t('owner details')}
                  </Link>
                </li>
                <li className='mc-breadcrumb-item'>{t('Edit Property Unavailability')}</li>
              </ul>
            </div>
          </div>
        </Col>

        <div className='container'>
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='property' className='form-label'>Property</label>
              <Form.Select
                id='property'
                value={selectedPropertyId}
                onChange={e => {
                  setSelectedProperty(e.target.value)
                  setErrors(prev => ({ ...prev, selectedPropertyId: '' }))
                }}
                isInvalid={!!errors.selectedPropertyId}
              >
                <option value='' disabled>{t('Select Property')}</option>
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
              <label htmlFor='dateSelected' className='form-label'>Date</label>
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
                  Full Day Unavailable
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
                  Selected Time Unavailable
                </label>
              </div>
            </div>
          </div>

          {availabilityType === '1' && (
            <div className='row m-2'>
              <div className='col-md-6'>
                <label htmlFor='fromTime' className='form-label'>From Time</label>
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
                <label htmlFor='toTime' className='form-label'>To Time</label>
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
            UPDATE
          </button>
        </div>

        <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
          <div className='mc-alert-modal'>
            <i className='material-icons' style={{ color: 'green' }}>
              check_circle
            </i>
            <h3>Confirmation</h3>
            <p>Property Unavailability has been Updated successfully.</p>
          </div>
        </Modal>
      </PageLayout>
    </>
  )
}