/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useContext } from 'react'
import { TranslatorContext } from '../../context/Translator'
import { Modal, Form } from 'react-bootstrap'
import { ButtonComponent } from '../elements'
import axios from 'axios'
import { API_URL, IMAGE_PATH } from '../../constant/constant'
import PaginationComponent from '../PaginationComponent'
import { Row, Col } from 'react-bootstrap'
import LabelFieldComponent from '../fields/LabelFieldComponent'
import AddIcon from '@mui/icons-material/Add'
import categoryImage from '../../assets/img/category.webp'
import { SyncLoader } from 'react-spinners'
import { Eye, EyeOff } from 'react-feather'
import Swal from 'sweetalert2'
import { APP_PREFIX_PATH } from '../../constant/constant'
import { useNavigate } from 'react-router-dom'
import { encode } from 'base-64';

// import { encode } from '../../utils/UrlEncode'
import { AnchorComponent } from '../elements'

import { useLocation } from 'react-router-dom'



export default function ManageSubAdmin({ thead, tbody }) {
  const navigate = useNavigate()
  const { t } = useContext(TranslatorContext)
  const [SubAdminDetails, setAdminDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [AddModal, setAddModal] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const [successModel, setsuccessModel] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [image, setImage] = useState(null)
  const [usertodelete, setUsertodelete] = useState('')
  const [editLink, seteditLink] = useState('')
  const [bannerError, setbannerError] = useState('')
  const [msg, setmsg] = useState('')
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [showImagePopup, setShowImagePopup] = useState(false)

  const [name, setName] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [existErr, setExistErr] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const entriesPerPage = 50

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage

  const filteredUsers = SubAdminDetails.filter(user => {
    const lowercasedTerm = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(lowercasedTerm) ||
      user.email?.toLowerCase().includes(lowercasedTerm) ||
      user.createtime?.toLowerCase().includes(lowercasedTerm)
    )
  })

  const showEmail = email => { }

  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry)

  const handlePageChange = pageNumber => setCurrentPage(pageNumber)

  const fetchSubAdmin = () => {
    setLoading(true)
    axios
      .get(API_URL + '/fetch_subadmin_details')
      .then(response => {
        setAdminDetails(response.data.subadmin_arr || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching user details:', error)
      })
  }

  useEffect(() => {
    fetchSubAdmin()
  }, [])

  const handleUserAction = (action, item) => {
    if (action === 'edit') {
      navigate(`${APP_PREFIX_PATH}/edit-sub-admin/${encode(item.user_id)}`)
    } else if (action === 'delete') {
      setAlertModal(true)
      setUsertodelete(item.user_id)
    }
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  // add banner
  const handleAddSubAdmin = () => {
    let error = {}

    if (!name) {
      error.name = 'Please enter name'
    }
    if (!email) {
      error.email = 'Please enter email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.email = 'Please enter a valid email address'
    }
    if (!password) {
      error.password = 'Please enter password'
    }
    if (password.length < 6) {
      error.password = 'Password cannot be less than 6 characters'
    }
    if (!image) {
      error.image = 'Please select image'
    }

    if (Object.keys(error).length > 0) {
      setbannerError(error)
      return
    }

    // console.log("FormaData name :", name);
    // console.log("FormaData email:", email);
    // console.log("FormaData password:", password);
    // console.log("FormaData image:", image);

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('image', image)

    console.log('FormaData :', formData)

    axios
      .post(API_URL + '/add_subadmin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        if (response.data.success) {
          setmsg('Sub Admin Created Successfully.')
          fetchSubAdmin()
          setAddModal(false)
          setsuccessModel(true)
          setTimeout(() => {
            setsuccessModel(false)
          }, 2000)
        } else {
          if (response.data.key === 'Exist') {
            setExistErr('Email address already being in use')
          } else {
            setExistErr('Something went wrong, please try again later')
          }
        }
      })
      .catch(error => {
        console.error('Error updating clinic:', error)
      })
  }

  const handleImageChange = e => {
    const file = e.target.files[0]

    if (!file) {
      setbannerError(prev => ({ ...prev, image: 'Please select an image!' }))
    } else if (!file.type.startsWith('image/')) {
      setbannerError(prev => ({
        ...prev,
        image: 'Only image files are allowed!'
      }))
    } else {
      setbannerError(prev => ({ ...prev, image: '' }))
      setImage(file)
    }
  }


  const handleDelete = () => {
    axios
      .post(API_URL + '/delete_subadmin', { user_id: usertodelete })
      .then(response => {
        if (response.data.success) {
          setmsg(response.data.msg)
          fetchSubAdmin()
          setsuccessModel(true)
          setTimeout(() => {
            setsuccessModel(false)
          }, 2000)
        }
      })
  }

  const handleImageClick = imageUrl => {
    setEnlargedImage(imageUrl)
    setShowImagePopup(true)
  }
  const handleCloseImage = () => {
    setEnlargedImage(null)
    setShowImagePopup(false)
  }

  return (
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
        <Col>
          <LabelFieldComponent
            type='search'
            // label={t('search_by')}
            icon='Search'
            placeholder={`${t('search_here')}`}
            labelDir='label-col'
            fieldSize='mb-4 w-100 h-md'
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col style={{ textAlign: 'right', marginBottom: '5px' }}>
          <button
            style={{
              background: '#2b77e5',
              padding: '7px 13px',
              color: '#fff',
              borderRadius: '5px'
            }}
            onClick={() => {
              navigate(`${APP_PREFIX_PATH}/add-sub-admin`)
              // setName(''),
              //   setemail(''),
              //   setpassword(''),
              //   setExistErr(''),
              //   setAddModal(true)

            }}
          >
            {' '}
            <AddIcon className='me-2' /> {t('add sub-admin')}{' '}
          </button>
        </Col>
      </Row>

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
        <div className='mc-table-responsive'>
          <table className='mc-table'>
            <thead className='mc-table-head primary'>
              <tr>
                <th>
                  <div className='mc-table-check'>
                    <p>{t('sno')}</p>
                  </div>
                </th>
                <th>{t('actions')}</th>
                <th>{t('image')}</th>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('create date & time')} </th>
              </tr>
            </thead>
            <tbody className='mc-table-body even'>
              {currentUsers?.map((item, index) => (
                <tr key={index}>
                  <td title='id'>
                    <div className='mc-table-check'>
                      <p>{indexOfFirstEntry + index + 1}</p>
                    </div>
                  </td>
                  <td>
                    <div className='mc-table-action'>
                      {/* <AnchorComponent  title="View" className="material-icons view">visibility</AnchorComponent> */}
                      <AnchorComponent to={`${APP_PREFIX_PATH}/view-sub-admin/${encode(item.user_id)}`} title="View" className="material-icons view">visibility</AnchorComponent>
                      {/* <ButtonsndleUserAction('edit', item) }}>edit</ButtonComponent> */}
                      <ButtonComponent
                        type='button'
                        className='material-icons edit'
                        onClick={() => handleUserAction('edit', item)}
                      >
                        edit
                      </ButtonComponent>

                      <ButtonComponent
                        type='button'
                        className='material-icons delete'
                        onClick={() => handleUserAction('delete', item)}
                      >
                        delete
                      </ButtonComponent>
                    </div>
                  </td>
                  <td title={item.image}>
                    <div className='mc-table-profile'>
                      <img
                        src={
                          item.image
                            ? `${IMAGE_PATH}${item.image}`
                            : `${IMAGE_PATH}Placeholder.webp`
                        }
                        alt='Profile'
                        style={{
                          width: '50px',
                          height: '50px',
                          cursor: 'pointer'
                        }}
                        onClick={() =>
                          handleImageClick(
                            item.image
                              ? `${IMAGE_PATH}${item.image}`
                              : `${IMAGE_PATH}Placeholder.webp`
                          )
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleImageClick(
                              item.image
                                ? `${IMAGE_PATH}${item.image}`
                                : `${IMAGE_PATH}Placeholder.webp`
                            )
                          }
                        }}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                        role='button' // Add role="button" to indicate interactive element
                        tabIndex={0}
                      />

                      {/* Enlarged image overlay */}
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
                            style={{
                              width: '30rem',
                              height: '30rem',
                              borderRadius: '5px'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span>{item.name || 'NA'}</span>
                  </td>

                  {/* <td>
                    <span>{item.email || 'NA'}</span>
                  </td> */}
                  <td>
                    <span
                      style={{
                        cursor: 'pointer',
                        // color: 'black',
                        // textDecoration: 'underline'
                      }}
                      onClick={() =>
                        Swal.fire({
                          title: 'Email Address',
                          text: item.email || 'NA',
                          confirmButtonText: 'Close'
                        })
                      }
                    >
                      {item.email || 'NA'}
                    </span>
                  </td>
                  <td>{item.createtime || 'NA'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationComponent
            totalEntries={filteredUsers.length}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          <Modal
            show={AddModal}
            onHide={() => setAddModal(false)}
            backdrop='static'
          >
            <div className='mc-user-modal'>
              <img src={categoryImage} alt='Profile' />
              <Form.Group className='form-group mb-4 ml-2'>
                <Form.Label>{t('Name')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Name'
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                    setbannerError(prev => ({ ...prev, name: '' }))
                  }}
                  isInvalid={!!bannerError.name}
                />

                <Form.Control.Feedback type='invalid'>
                  {bannerError.name}
                </Form.Control.Feedback>

                <Form.Label>{t('Email')}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Email'
                  value={email}
                  onChange={e => {
                    setemail(e.target.value)
                    setbannerError(prev => ({ ...prev, email: '' }))
                  }}
                  isInvalid={!!bannerError.email}
                />

                <Form.Control.Feedback type='invalid'>
                  {bannerError.email}
                </Form.Control.Feedback>

                <Form.Label>{t('Password')}</Form.Label>
                <div className='position-relative'>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={e => {
                      setpassword(e.target.value)
                      setbannerError(prev => ({ ...prev, password: '' }))
                    }}
                    isInvalid={!!bannerError.password}
                    style={{ paddingRight: '40px' }} // Prevents text overlap with the icon
                  />

                  <span
                    className='position-absolute end-0 top-50 translate-middle-y me-3'
                    style={{ cursor: 'pointer', zIndex: 10 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </Form.Group>
              <Form.Group className='form-group mb-4 ml-2'>
                <Form.Label>{t('image')}</Form.Label>
                <Form.Control
                  type='file'
                  onChange={handleImageChange}
                  isInvalid={!!bannerError.image}
                />
                <Form.Control.Feedback type='invalid'>
                  {bannerError.image}
                </Form.Control.Feedback>
              </Form.Group>

              {existErr && <p style={{ color: 'red' }}>{existErr}</p>}
              <Modal.Footer>
                <ButtonComponent
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => {
                    setAddModal(false)
                    setbannerError('')
                  }}
                >
                  {t('close_popup')}
                </ButtonComponent>
                <ButtonComponent
                  type='button'
                  className='btn btn-success'
                  onClick={handleAddSubAdmin}
                >
                  {t('Add SubAdmin')}
                </ButtonComponent>
              </Modal.Footer>
            </div>
          </Modal>

          <Modal show={successModel} onHide={() => setsuccessModel(false)}>
            <div className='mc-alert-modal'>
              <i className='material-icons' style={{ color: 'green' }}>
                check_circle
              </i>
              <h3>{t('success')}</h3>
              <br />
              <p>{msg}</p>
              <Modal.Footer></Modal.Footer>
            </div>
          </Modal>

          <Modal show={alertModal} onHide={() => setAlertModal(false)}>
            <div className='mc-alert-modal'>
              <i className='material-icons'>new_releases</i>
              <h3>{t('Delete Confirmation')}</h3>
              <p>Are you sure, you want to delete this sub-admin?</p>
              <Modal.Footer>
                <ButtonComponent
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setAlertModal(false)}
                >
                  {t('close')}
                </ButtonComponent>
                <ButtonComponent
                  type='button'
                  className='btn btn-danger'
                  onClick={() => {
                    setAlertModal(false)
                    handleDelete()
                  }}
                >
                  {t('delete')}
                </ButtonComponent>
              </Modal.Footer>
            </div>
          </Modal>
        </div>
      )}
    </>
  )
}
