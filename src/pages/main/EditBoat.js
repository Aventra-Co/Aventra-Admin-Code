import React, { useContext, useEffect, useState } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Modal, Col } from 'react-bootstrap'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './UserProfilePage.css'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import { useParams } from 'react-router-dom'
import { decode, encode } from 'base-64'
export default function EditBoat () {
  const { boat_id } = useParams()
  const [errors, setErrors] = useState({})
  const [alertModal, setAlertModal] = useState(false)
  const { t } = useContext(TranslatorContext)
  const [boatName, setBoatName] = useState('')
  const [boatBrand, setBoatBrand] = useState('')
  const [boatYear, setBoatYear] = useState('')
  const [boatRegistrationNumber, setBoatRegistrationNumber] = useState('')
  const [boatSize, setBoatSize] = useState('')
  const [boatCapacity, setBoatCapacity] = useState('')
  const [boatCabins, setBoatCabins] = useState('')
  const [boatToilet, setBoatToilet] = useState('')
  const [user_id, setOwnerID] = useState('')

  useEffect(() => {
    fetchBoatData()
  }, [])

  const fetchBoatData = () => {
    axios
      .get(API_URL + `/get_boat_detail?boat_id=${decode(boat_id)}`)
      .then(response => {
        if (response.data.success && response.data.boat_data) {
          var data = response.data.boat_data
          setBoatName(data.boat_name_english)
          setBoatBrand(data.boat_brand)
          setBoatCabins(data.cabins)
          setBoatCapacity(data.boat_capacity)
          setBoatRegistrationNumber(data.boat_registration_number)
          setBoatToilet(data.toilet)
          setBoatSize(data.boat_size)
          setBoatYear(data.boat_year)
        // if (!years.includes(data.boat_year)) {
        //     setBoatYear([...years, data.boat_year])
        //   }
          setOwnerID(data.user_id)
        }
      })
      .catch(error => {
        console.error('Error fetching roles:', error)
      })
  }

  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i)

  const handleSubmit = () => {
    let newErrors = {}

    if (!boatName.trim()) {
      newErrors.boatName = 'Please Enter Bost name'
    }
    if (!boatBrand.trim()) {
      newErrors.boatBrand = 'Please Enter Boat Brand'
    }
    if (!boatYear) {
      newErrors.boatYear = 'Please Enter Boat Year'
    }
    if (!boatRegistrationNumber) {
      newErrors.boatRegistrationNumber =
        'Please select Boat Registration Number'
    }
    if (!boatSize) {
      newErrors.boatSize = 'Please Enter Boat size'
    } else if (boatSize < 0) {
      newErrors.boatSize = 'Please Enter Valid Boat size'
    }

    if (!boatCapacity) {
      newErrors.boatCapacity = 'Please Enter Boat Capacity'
    } else if (boatCapacity < 0) {
      newErrors.boatCapacity = 'Please Enter Valid Boat Capacity'
    }

    if (!boatCabins) {
      newErrors.boatCabins = 'Please Enter Boat Cabins'
    } else if (boatCabins < 0) {
      newErrors.boatCabins = 'Please Enter Valid Boat Cabins'
    }

    if (!boatToilet) {
      newErrors.boatToilet = 'Please Enter Boat Toilet'
    } else if (boatToilet < 0) {
      newErrors.boatToilet = 'Please Enter Valid Boat Toilet'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formData = new FormData()
    formData.append('boat_id', decode(boat_id))
    formData.append('user_id', user_id)
    formData.append('boat_name', boatName)
    formData.append('boat_brand', boatBrand)
    formData.append('boat_year', boatYear)
    formData.append('boat_registration_number', boatRegistrationNumber)
    formData.append('boat_size', boatSize)
    formData.append('boat_capacity', boatCapacity)
    formData.append('cabins', boatCabins)
    formData.append('toilet', boatToilet)

    axios
      .post(API_URL + '/edit_boat_admin_side', formData)
      .then(response => {
        if (response.data.key == 'boatAlredyExits') {
          setErrors(prev => ({ boatName: 'Boat Name Alredy Exist' }))
        } else if (response.data.success) {
          setAlertModal(true)
          setTimeout(() => {
            setAlertModal(false)
            navigate(APP_PREFIX_PATH + `/owner-view/${encode(user_id)}`)
          }, 2000)
        } else if (response.data.key === 'exist') {
          setErrors(prev => ({ ...prev, email: response.data.msg }))
        }
      })
      .catch(error => {
        console.error('Error adding staff:', error)
      })
  }

  return (
    <>
      {' '}
      <PageLayout>
        <Col xl={12}>
          <div className='mc-card'>
            <div className='mc-breadcrumb'>
              <h3 className='mc-breadcrumb-title'>{t('Edit Boat')}</h3>
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
                <li className='mc-breadcrumb-item'>{t('Edit Boat')}</li>
              </ul>
            </div>
          </div>
        </Col>

        <div className='container'>
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='firstName' className='form-label'>
                Boat Name
              </label>
              <Form.Control
                type='text'
                id='firstName'
                placeholder='Enter Boat Name'
                value={boatName}
                onChange={e => {
                  setBoatName(e.target.value)
                  setErrors(prev => ({ ...prev, boatName: '' }))
                }}
                isInvalid={!!errors.boatName}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.boatName}
              </Form.Control.Feedback>
            </div>

            <div className='col-md-6'>
              <label htmlFor='lastName' className='form-label'>
                Boat Brand
              </label>
              <Form.Control
                type='text'
                id='lastName'
                placeholder='Enter Boat Brand'
                value={boatBrand}
                onChange={e => {
                  setBoatBrand(e.target.value)
                  setErrors(prev => ({ ...prev, boatBrand: '' }))
                }}
                isInvalid={!!errors.boatBrand}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.boatBrand}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='password' className='form-label'>
                Boat Registration Number
              </label>
              <div className='position-relative'>
                <Form.Control
                  type={'text'}
                  id='password'
                  placeholder='Enter Boat Registration Number'
                  value={boatRegistrationNumber}
                  onChange={e => {
                    setBoatRegistrationNumber(e.target.value)
                    setErrors(prev => ({ ...prev, boatRegistrationNumber: '' }))
                  }}
                  isInvalid={!!errors.boatRegistrationNumber}
                />
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatRegistrationNumber}
              </Form.Control.Feedback>
            </div>

            <div className='col-md-6'>
              <label htmlFor='year' className='form-label'>
                Boat Year
              </label>
              <div className='position-relative'>
                <Form.Select
                  id='year'
                  value={boatYear}
                  onChange={e => {
                    setBoatYear(e.target.value)
                    setErrors(prev => ({ ...prev, boatYear: '' }))
                  }}
                  isInvalid={!!errors.boatYear}
                >
                  <option value=''>Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatYear}
              </Form.Control.Feedback>
            </div>

            {/* <div className='col-md-6'>
                    <label htmlFor="year" className="form-label">
                        Boat Year
                    </label>
                    <div className="position-relative">
                        <Form.Control
                            type="number"
                            id="year"
                            placeholder="Enter Boat Year"
                            value={boatYear}
                            min="1900" 
                            max={new Date().getFullYear()}
                            onChange={(e) => {
                                setBoatYear(e.target.value);
                                setErrors(prev => ({ ...prev, boatYear: "" }));
                            }}
                            isInvalid={!!errors.boatYear}
                        />
                    </div>
                    <Form.Control.Feedback type="invalid">
                        {errors.boatYear}
                    </Form.Control.Feedback>
                </div> */}
          </div>

          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='password' className='form-label'>
                Boat Size
              </label>
              <div className='position-relative'>
                <Form.Control
                  type={'text'}
                  id='password'
                  placeholder='Enter Boat Size'
                  value={boatSize}
                  onChange={e => {
                    setBoatSize(e.target.value)
                    setErrors(prev => ({ ...prev, boatSize: '' }))
                  }}
                  isInvalid={!!errors.boatSize}
                />
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatSize}
              </Form.Control.Feedback>
            </div>
            <div className='col-md-6'>
              <label htmlFor='year' className='form-label'>
                Boat Capacity
              </label>
              <div className='position-relative'>
                <Form.Control
                  type='number'
                  id='year'
                  placeholder='Enter Boat Capacity'
                  value={boatCapacity}
                  min='1900'
                  max={new Date().getFullYear()}
                  onChange={e => {
                    setBoatCapacity(e.target.value)
                    setErrors(prev => ({ ...prev, boatCapacity: '' }))
                  }}
                  isInvalid={!!errors.boatCapacity}
                />
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatCapacity}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className='row m-2'>
            <div className='col-md-6'>
              <label htmlFor='password' className='form-label'>
                Boat Cabins
              </label>
              <div className='position-relative'>
                <Form.Control
                  type={'text'}
                  id='password'
                  placeholder='Enter Boat Cabins'
                  value={boatCabins}
                  min='0'
                  max='1000'
                  onChange={e => {
                    setBoatCabins(e.target.value)
                    setErrors(prev => ({ ...prev, boatCabins: '' }))
                  }}
                  isInvalid={!!errors.boatCabins}
                />
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatCabins}
              </Form.Control.Feedback>
            </div>
            <div className='col-md-6'>
              <label htmlFor='year' className='form-label'>
                Boat Toilet
              </label>
              <div className='position-relative'>
                <Form.Control
                  type='number'
                  id='year'
                  placeholder='Enter Boat Toilet'
                  value={boatToilet}
                  min='0'
                  max='1000'
                  onChange={e => {
                    setBoatToilet(e.target.value)
                    setErrors(prev => ({ ...prev, boatToilet: '' }))
                  }}
                  isInvalid={!!errors.boatToilet}
                />
              </div>
              <Form.Control.Feedback type='invalid'>
                {errors.boatToilet}
              </Form.Control.Feedback>
            </div>
          </div>

          <button
            className='btn btn-dark mt-3 mb-5 mx-2'
            style={{ background: '#19918F', border: 'none' }}
            onClick={handleSubmit}
          >
            Edit Boat
          </button>
        </div>

        <Modal show={alertModal} onHide={() => setAlertModal(false)} centered>
          <div className='mc-alert-modal'>
            <i className='material-icons' style={{ color: 'green' }}>
              check_circle
            </i>
            <h3>Confirmation</h3>
            <p>Boat has been Updated successfully.</p>
          </div>
        </Modal>
      </PageLayout>
    </>
  )
}
