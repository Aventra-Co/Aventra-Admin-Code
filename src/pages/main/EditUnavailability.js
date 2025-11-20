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

export default function EditUnavailability() {
  const { unavailability_id } = useParams()
  const [errors, setErrors] = useState({})
  const [alertModal, setAlertModal] = useState(false)
  const { t } = useContext(TranslatorContext)
  const [dateSelected, setdateSelected] = useState('')
  const [boatData, setBoatData] = useState([])
  const [selectedBoatId, setSelectedBoat] = useState('')
  const [tripOpenTime, setTripOpenTime] = useState('')
  const [tripCloseTime, setTripCloseTime] = useState('')
  const [user_id, setUserId] = useState('')
  const [availabilityType, setAvailabilityType] = useState('1') // Default to selected time

  const navigate = useNavigate()

  let userId = 0

  const handleSubmit = () => {
    let newErrors = {}

    if (!selectedBoatId) {
      newErrors.selectedBoatId = 'Please Select Boat'
    }
    if (!dateSelected) {
      newErrors.dateSelected = 'Please Enter Date'
    }
    if (availabilityType === '1') {
      if (!tripOpenTime) {
        newErrors.tripOpenTime = 'Please Select From Time'
      }
      if (!tripCloseTime) {
        newErrors.tripCloseTime = 'Please Select To Time'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formData = new FormData()
    formData.append('unavailability_id', decode(unavailability_id))
    formData.append('boat_id', selectedBoatId)
    formData.append('user_id', user_id)
    formData.append('date', dateSelected)
    formData.append('type', availabilityType)

    if (availabilityType === '1') {
      formData.append('from_time', tripOpenTime)
      formData.append('to_time', tripCloseTime)
    } else {
      formData.append('from_time', '00:00:00')
      formData.append('to_time', '23:59:59')
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
        } else if (response.data.key === 'exist') {
          setErrors(prev => ({ ...prev, email: response.data.msg }))
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.data.msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch(error => {
        console.error('Error updating unavailability:', error)
      })
  }



  const fetchData = () => {
    axios
      .get(API_URL + `/fetch_unavailability?unavailability_id=${decode(unavailability_id)}`)
      .then(response => {
        const data = response.data.unavailability;
        const dateParts = data.date.split('-')
        const months = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        }

        const formattedDate = `${dateParts[2]}-${months[dateParts[1]]}-${dateParts[0].padStart(2, '0')}`

        setdateSelected(formattedDate)
        setTripCloseTime(data.to_time)
        setTripOpenTime(data.from_time)
        setSelectedBoat(data.boat_id)
        setUserId(data.user_id)
        userId = data.user_id
        console.log("line no 102", data.user_id)
        setAvailabilityType(data.type || '1') // Set the type from existing data
      })
      .catch(error => {
        console.error('Error fetching unavailability details:', error)
      })
  }


  const fetchBoatData = () => {
    axios
      .get(API_URL + `/fetch_boat_data_by_trip?user_id=${userId}`)
      .then(response => {
        setBoatData(response.data.boat_arr || [])
      })
      .catch(error => {
        console.error('Error fetching boat data:', error)
      })
  }



  useEffect(() => {
    fetchData()
  }, [])
  // useEffect(() => {
  //   fetchBoatData()
  // }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBoatData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLayout>
        <Col xl={12}>
          <div className='mc-card'>
            <div className='mc-breadcrumb'>
              <h3 className='mc-breadcrumb-title'>{t('Edit Unavailability')}</h3>
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
                <li className='mc-breadcrumb-item'>{t('Edit Unavailability')}</li>
              </ul>
            </div>
          </div>
        </Col>

        <div className='container'>
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='boat' className='form-label'>Boat</label>
              <Form.Select
                id='boat'
                value={selectedBoatId}
                onChange={e => {
                  setSelectedBoat(e.target.value)
                  setErrors(prev => ({ ...prev, selectedBoatId: '' }))
                }}
                isInvalid={!!errors.selectedBoatId}
              >
                <option value='' disabled>{t('Select Boat')}</option>
                {boatData.map(boat => (
                  <option key={boat.boat_id} value={boat.boat_id}>
                    {boat.boat_name_english}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                {errors.selectedBoatId}
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
                <label htmlFor='tripOpenTime' className='form-label'>From Time</label>
                <Form.Control
                  type='time'
                  id='tripOpenTime'
                  value={tripOpenTime}
                  onChange={e => {
                    setTripOpenTime(e.target.value)
                    setErrors(prev => ({ ...prev, tripOpenTime: '' }))
                  }}
                  isInvalid={!!errors.tripOpenTime}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.tripOpenTime}
                </Form.Control.Feedback>
              </div>

              <div className='col-md-6'>
                <label htmlFor='tripCloseTime' className='form-label'>To Time</label>
                <Form.Control
                  type='time'
                  id='tripCloseTime'
                  value={tripCloseTime}
                  onChange={e => {
                    setTripCloseTime(e.target.value)
                    setErrors(prev => ({ ...prev, tripCloseTime: '' }))
                  }}
                  isInvalid={!!errors.tripCloseTime}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.tripCloseTime}
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
            <p>Unavailability has been Updated successfully.</p>
          </div>
        </Modal>
      </PageLayout>
    </>
  )
}