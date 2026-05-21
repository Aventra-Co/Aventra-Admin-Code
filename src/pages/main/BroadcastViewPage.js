/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'
import './managebrodcast.css'
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant'
import { t } from 'i18next'
import Placeholder from './placeholder/placeholder.webp';
import { FileUploadComponent } from "../../components";
import { IMAGE_PATH } from '../../constant/constant'
import { Helmet } from 'react-helmet-async'
export default function BroadcastViewPage() {
  const [content, setContent] = useState(0)
  const [title, setTitle] = useState('')
  const [title1, setTitle1] = useState('')
  const [message, setMessage] = useState('')
  const [message1, setMessage1] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [users1, setUsers1] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUsers1, setSelectedUsers1] = useState([])
  const [AllTitleerror, setAllTitleerror] = useState('')
  const [AllTitleerror1, setAllTitleerror1] = useState('')
  const [Msgerror, setMsgerror] = useState('')
  const [Msgerror1, setMsgerror1] = useState('')
  const [selecterror, setselecterror] = useState('')
  const [selecterrorowner, setselecterrorowner] = useState('')

  const [image, setImage] = useState('')
  const [imageError, setImageError] = useState('')

  const [selecttitleerror, setselecttitleerror] = useState('')
  const [selecttitleerror1, setselecttitleerror1] = useState('')
  const [selectMsgerror, setselectMsgerror] = useState('')
  const [selectMsgerror1, setselectMsgerror1] = useState('')

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [preview, setpreview] = useState(Placeholder);
  const [selectedImage, setSelectedImage] = useState(null);
  const contentTypes = {
    all: 0,
    specific: 1,
    all1: 2,
    specific1: 3
  }

  useEffect(() => {
    axios
      .get(API_URL + '/get_manage_users')
      .then(response => {
        const userOptions = response.data.user_arr.map(user => ({
          value: user.user_id,
          label: `${user.name} ${user.email} ${user.mobile}`
        }))
        setUsers(userOptions)
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error)
      })
  }, [])
  useEffect(() => {
    axios
      .get(API_URL + '/get_all_owners')
      .then(response => {
        const userOptions = response.data.owner_arr.map(user => ({
          value: user.user_id,
          label: `${user.l_name} ${user.email} ${user.mobile}`
        }))
        setUsers1(userOptions)
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error)
      })
  }, [])

  const handleButtonClick = contentType => {
    setContent(contentTypes[contentType])
  }

  const SendBroadcast = () => {
    let hasError = false;

    // Validate inputs based on content type
    if (content === contentTypes.all) {
      if (!title.trim()) {
        setAllTitleerror(t('enter title'));
        hasError = true;
      } else {
        setAllTitleerror('');
      }
      if (!message.trim()) {
        setMsgerror(t('enter message'));
        hasError = true;
      } else {
        setMsgerror('');
      }
    } else if (content === contentTypes.specific) {
      if (!title.trim()) {
        setselecttitleerror(t('enter title'));
        hasError = true;
      } else {
        setselecttitleerror('');
      }
      if (!message.trim()) {
        setselectMsgerror(t('enter message'));
        hasError = true;
      } else {
        setselectMsgerror('');
      }
      if (selectedUsers.length === 0) {
        setselecterror(t('selected user'));
        hasError = true;
      } else {
        setselecterror('');
      }
    } else if (content === contentTypes.all1) {
      if (!title1.trim()) {
        setAllTitleerror1(t('enter title'));
        hasError = true;
      } else {
        setAllTitleerror1('');
      }
      if (!message1.trim()) {
        setMsgerror1(t('enter message'));
        hasError = true;
      } else {
        setMsgerror1('');
      }
    } else if (content === contentTypes.specific1) {
      if (!title1.trim()) {
        setselecttitleerror1(t('enter title'));
        hasError = true;
      } else {
        setselecttitleerror1('');
      }
      if (!message1.trim()) {
        setselectMsgerror1(t('enter message'));
        hasError = true;
      } else {
        setselectMsgerror1('');
      }
      if (selectedUsers1.length === 0) {
        setselecterrorowner(t('Select owner'));
        hasError = true;
      } else {
        setselecterrorowner('');
      }
    }

    if (hasError) {
      return;
    }

    const formData = new FormData();
    formData.append('action', 'send');
    // Handle each tab's data
    if (content === contentTypes.all) {
      formData.append('subject', title);
      formData.append('message_user', message);
      formData.append('userType', 'all');
      if (image) formData.append('image', image);
    } else if (content === contentTypes.specific) {
      formData.append('subject', title);
      formData.append('message_user', message);
      formData.append('userType', 'user');
      formData.append('select_arr', JSON.stringify(selectedUsers.map(user => user.value)));
      if (image) formData.append('image', image);
    } else if (content === contentTypes.all1) {
      formData.append('subject', title1);
      formData.append('message_user', message1);
      formData.append('userType', 'allOwner');
      if (image) formData.append('image', image);
    } else if (content === contentTypes.specific1) {
      formData.append('subject', title1);
      formData.append('message_user', message1);
      formData.append('userType', 'owner');
      formData.append('select_arr', JSON.stringify(selectedUsers1.map(user => user.value)));
      if (image) formData.append('image', image);
    }

    setIsButtonDisabled(true);
    axios
      .post(API_URL + '/send_notification', formData)
      .then(res => {
        setImage('');
        setTitle('');
        setpreview(Placeholder);
        setMessage('');
        setSelectedUsers([]);
        setTitle1('');
        setMessage1('');
        setSelectedUsers1([]);
        setShowModal(true);
        setTimeout(() => {
          handleModalClose();
        }, 1000);
      })
      .catch(() => {
        setShowModal(true);
        setTitle('');
        setMessage('');
        setpreview(Placeholder);
        setImage('');
        setSelectedUsers([]);
        setTitle1('');
        setMessage1('');
        setSelectedUsers1([]);
        setTimeout(() => {
          handleModalClose();
        }, 1000);
      });
  };

  const handleModalClose = () => {
    setShowModal(false)
    setIsButtonDisabled(false)
  }

  const handleImageChange = e => {


    const file = e.target.files[0]
    setpreview(URL.createObjectURL(file));

    if (!file) {
      setImage('')
      setImageError('Please upload an image.')
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (!validTypes.includes(file.type)) {
      setImage('')
      //   setImageError('Only JPG and PNG images are allowed.')
      setImageError('POnly JPG and PNG images are allowed.')
      return
    }

    setImage(file)
    setImageError('')
  }


  const handleFileUpload = (file) => {

    setSelectedImage(file);
    setpreview(URL.createObjectURL(file));

    // const file = e.target.files[0]
    // setpreview(URL.createObjectURL(file));

    if (!file) {
      setImage('')
      setImageError('Please upload an image.')
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (!validTypes.includes(file.type)) {
      setImage('')
      //   setImageError('Only JPG and PNG images are allowed.')
      setImageError('POnly JPG and PNG images are allowed.')
      return
    }

    setImage(file)
    setImageError('')
  };


  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | Manage-Broadcast</title>
      </Helmet>
      <Row>
        <Col xl={12}>
          <div className='mc-card'>
            <div className='mc-breadcrumb'>
              <h3 className='mc-breadcrumb-title'>{t('broadcast details')}</h3>
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
                  <Link to='#' className='mc-breadcrumb-link'>
                    {t('broadcast')}
                  </Link>
                </li>
                <li className='mc-breadcrumb-item'>{t('broadcast list')}</li>
              </ul>
            </div>
          </div>
        </Col>

        <Card.Body className='mt-5'>
          <Form>
            <nav className='navbar navbar-expand-lg navbar-light navBar'>
              <div
                className='container mobile'
                id='container-div'
                style={{
                  marginTop: '-2rem',
                  borderRadius: '5px',
                  marginLeft: '2.3rem'
                }}
              >
                <button
                  className={`btn btn-outline-success me-2 mb-2 btn-content ${content === contentTypes.all ? 'btn-active' : ''
                    }`}
                  style={{ width: '10rem' }}
                  type='button'
                  onClick={() => {
                    handleButtonClick('all')
                    setImageError('')
                    setImage('')
                    setMsgerror('')
                    setMessage('');
                    setMessage1('');
                    setTitle1('')
                    setTitle('')

                    setAllTitleerror('');
                    setSelectedUsers([]);
                    setselectMsgerror1('')
                    setAllTitleerror1('');
                    setselectMsgerror('');
                    setselecttitleerror('');
                    setselecterror('');
                    setMsgerror1('')
                    setselecterrorowner([])

                    setSelectedImage(null);
                  }}
                >
                  {t('all user')}
                </button>
                <button
                  className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.specific ? 'btn-active' : ''
                    }`}
                  style={{ width: '10rem' }}
                  type='button'
                  onClick={() => {
                    handleButtonClick('specific')
                    setImageError('')
                    setImage('')
                    setMsgerror('')
                    setMessage('')
                    setTitle('')
                    setMessage1('');
                    setTitle1('')
                    setAllTitleerror('')
                    setSelectedUsers([])
                    setselectMsgerror1('');
                    setAllTitleerror1('');
                    setselectMsgerror('');
                    setselecttitleerror('')
                    setselecterror('');
                    setMsgerror1('')
                    setselecterrorowner([])

                    setSelectedImage(null);
                  }}
                >
                  {t('selected user')}
                </button>
                <button
                  className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.all1 ? 'btn-active' : ''
                    }`}
                  style={{ width: '10rem' }}
                  type='button'
                  onClick={() => {
                    handleButtonClick('all1')
                    setImageError('')
                    setImage('')
                    setMsgerror('')
                    setMessage('')
                    setTitle('')
                    setMessage1('');
                    setTitle1('')
                    setAllTitleerror('')
                    setselectMsgerror1('')
                    setSelectedUsers([]);
                    setAllTitleerror1('');
                    setselectMsgerror('');
                    setselecttitleerror('');
                    setselecterror('');
                    setMsgerror1('')
                    setselecterrorowner([])

                    setSelectedImage(null);
                  }}
                >
                  {t('All Owners')}
                </button>
                <button
                  className={`btn btn-outline-success me-2  mb-2 btn-content ${content === contentTypes.specific1 ? 'btn-active' : ''
                    }`}
                  style={{ width: '10rem' }}
                  type='button'
                  onClick={() => {
                    handleButtonClick('specific1')
                    setImageError('')
                    setImage('')
                    setMsgerror('')
                    setMessage('')
                    setTitle('')
                    setMessage1('');
                    setTitle1('')
                    setAllTitleerror('')
                    setselectMsgerror1('')
                    setSelectedUsers([]);
                    setAllTitleerror1('');
                    setselectMsgerror('');
                    setselecttitleerror('');
                    setselecterror('');
                    setMsgerror1('')
                    setselecterrorowner([])

                    setSelectedImage(null);
                  }}
                >
                  {t('Selected Owner')}
                </button>
              </div>
            </nav>

            {content === 0 && (
              <div style={{ margin: '3rem' }}>
                <div>
                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('title')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type='text'
                        placeholder={t('enter title')}
                        value={title}
                        onChange={e => {
                          setTitle(e.target.value)
                          setAllTitleerror('')
                        }}
                      />
                      {AllTitleerror && (
                        <span className='text-danger'>{AllTitleerror}</span>
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    {/* <Form.Label> {t('Image')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type='file'
                        id='staffId'
                        accept='image/*'
                        onChange={handleImageChange}
                        placeholder={t('enter_image')}
                      />
                      {/* {imageError && ( */}
                    {/* <span className='text-danger'>{imageError}</span> */}
                    {/* )} */}
                    {/* </Col> */}


                    <Form.Label> {t('Image')}</Form.Label>

                    <Col xl={12}>
                      <div className="row">
                        <div className="col-lg-2">
                          <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '10px' }}>
                            <img
                              src={preview}
                              // src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}

                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}>

                            </img>

                          </div>
                        </div>
                      </div>
                      <FileUploadComponent icon="cloud upload" text={t('upload')} onFileUpload={handleFileUpload} />
                      <span className='text-danger'>{imageError}</span>
                    </Col>









                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalMessage'
                  >
                    <Form.Label> {t('message')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        as='textarea'
                        placeholder={t('enter message')}
                        rows={3}
                        value={message}
                        onChange={e => {
                          setMessage(e.target.value)
                          setMsgerror('')
                        }}
                      />
                      {Msgerror && (
                        <span className='text-danger'>{Msgerror}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-3 form' as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button
                        style={{ width: '15rem', marginLeft: '10px' }}
                        className='send-btn'
                        onClick={SendBroadcast}
                      // disabled={isButtonDisabled}
                      >
                        {t('send')}
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}

            {content === 1 && (
              <div style={{ margin: '3rem' }}>
                <div>
                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalSelect'
                  >
                    <Form.Label> {t('selected user')}</Form.Label>
                    <Col sm={7}>
                      <Select
                        isMulti
                        options={users}
                        value={selectedUsers}
                        onChange={e => {
                          setSelectedUsers(e)
                          setselecterror('')
                        }}
                        placeholder={t('selected user')}
                      />
                      {selecterror && (
                        <span className='text-danger'>{selecterror}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('Image')}</Form.Label>

                    <Col xl={12}>
                      <div className="row">
                        <div className="col-lg-2">
                          <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '10px' }}>
                            <img
                              src={preview}
                              // src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}

                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}>

                            </img>

                          </div>
                        </div>
                      </div>
                      <FileUploadComponent icon="cloud_upload" text={t('upload')} onFileUpload={handleFileUpload} />
                      <span className='text-danger'>{imageError}</span>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('title')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type='text'
                        placeholder={t('enter title')}
                        value={title}
                        onChange={e => {
                          setTitle(e.target.value)
                          setselecttitleerror('')
                        }}
                      />
                      {selecttitleerror && (
                        <span className='text-danger'>{selecttitleerror}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalMessage'
                  >
                    <Form.Label> {t('message')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        as='textarea'
                        placeholder={t('enter message')}
                        rows={3}
                        value={message}
                        onChange={e => {
                          setMessage(e.target.value)
                          setselectMsgerror('')
                        }}
                      />
                      {selectMsgerror && (
                        <span className='text-danger'>{selectMsgerror}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-3 form' as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button
                        style={{ width: '15rem', marginLeft: '10px' }}
                        className='send-btn'
                        onClick={SendBroadcast}
                      // disabled={isButtonDisabled}
                      >
                        {t('send')}
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}
            {content === 2 && (
              <div style={{ margin: '3rem' }}>
                <div>
                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('title')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type='text'
                        placeholder={t('enter title')}
                        value={title1}
                        onChange={e => {
                          setTitle1(e.target.value)
                          setAllTitleerror1('')
                        }}
                      />
                      {AllTitleerror1 && (
                        <span className='text-danger'>{AllTitleerror1}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('Image')}</Form.Label>
                    <Col xl={12}>
                      <div className="row">
                        <div className="col-lg-2">
                          <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '10px' }}>
                            <img
                              src={preview}
                              // src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}

                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}>

                            </img>

                          </div>
                        </div>
                      </div>
                      <FileUploadComponent icon="cloud_upload" text={t('upload')} onFileUpload={handleFileUpload} />
                      <span className='text-danger'>{imageError}</span>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalMessage'
                  >
                    <Form.Label> {t('message')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        as='textarea'
                        placeholder={t('enter message')}
                        rows={3}
                        value={message1}
                        onChange={e => {
                          setMessage1(e.target.value)
                          setMsgerror1('')
                        }}
                      />
                      {Msgerror1 && (
                        <span className='text-danger'>{Msgerror1}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-3 form' as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button
                        style={{ width: '15rem', marginLeft: '10px' }}
                        className='send-btn'
                        onClick={SendBroadcast}
                      // disabled={isButtonDisabled}
                      >
                        {t('send')}
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}

            {content === 3 && (
              <div style={{ margin: '3rem' }}>
                <div>
                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalSelect'
                  >
                    <Form.Label> {t('select owner')}</Form.Label>
                    <Col sm={7}>
                      <Select
                        isMulti
                        options={users1}
                        value={selectedUsers1}
                        onChange={e => {
                          setSelectedUsers1(e)
                          setselecterrorowner('')
                        }}
                        placeholder={t('select owner')}
                      />
                      {selecterrorowner && (
                        <span className='text-danger'>{selecterrorowner}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('title')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type='text'
                        placeholder={t('enter title')}
                        value={title1}
                        onChange={e => {
                          setTitle1(e.target.value)
                          setAllTitleerror1('')
                        }}
                      />
                      {AllTitleerror1 && (
                        <span className='text-danger'>{AllTitleerror1}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalEmail'
                  >
                    <Form.Label> {t('Image')}</Form.Label>
                    <Col xl={12}>
                      <div className="row">
                        <div className="col-lg-2">
                          <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '10px' }}>
                            <img
                              src={preview}
                              // src={adminDetails.image ? `${IMAGE_PATH}${adminDetails.image}` : `${IMAGE_PATH}image-1720095670109.png`}

                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}>

                            </img>

                          </div>
                        </div>
                      </div>
                      <FileUploadComponent icon="cloud_upload" text={t('upload')} onFileUpload={handleFileUpload} />
                      <span className='text-danger'>{imageError}</span>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    className='mb-3'
                    as={Row}
                    controlId='formHorizontalMessage'
                  >
                    <Form.Label> {t('message')}</Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        as='textarea'
                        placeholder={t('enter message')}
                        rows={3}
                        value={message1}
                        onChange={e => {
                          setMessage1(e.target.value)
                          setselectMsgerror1('')
                        }}
                      />
                      {selectMsgerror1 && (
                        <span className='text-danger'>{selectMsgerror1}</span>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-3 form' as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button
                        style={{ width: '15rem', marginLeft: '10px' }}
                        className='send-btn'
                        onClick={SendBroadcast}
                      // disabled={isButtonDisabled}
                      >
                        {t('send')}
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}
          </Form>
        </Card.Body>
      </Row>

      {/* For notify after Broadcast sent */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setIsButtonDisabled(false)
        }}
      >
        <Modal.Header>
          <Modal.Title>{t('Success')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('Broadcast message sent successfully')}</p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </PageLayout>
  )
}
