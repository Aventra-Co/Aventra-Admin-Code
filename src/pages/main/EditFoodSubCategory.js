import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import './UserProfilePage.css';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../../constant/constant";
import moment from "moment";
import { Eye, EyeOff } from "react-feather";

export default function EditFoodSubCategory() {
    const { food_sub_category_id } = useParams();
    const [alertModal, setAlertModal] = useState(false);
    const [CategoryError, setCategoryError] = useState('')
    const { t } = useContext(TranslatorContext)
    const [categoryEnglish, setcategoryEnglish] = useState('');
    const [categoryArabic, setcategoryArabic] = useState('');
    const [categoryFrench, setcategoryFrench] = useState('');
    const [categoryItalian, setcategoryItalian] = useState('');
    const [categoryKorean, setcategoryKorean] = useState('');
    const [image, setimage] = useState('')
    const [CategoryId, setCategoryId] = useState('');

    const [FoodCategory, setFoodCategory] = useState([])

    const navigate = useNavigate();

    const fetchFoodSubCategory = () => {
        axios.get(API_URL + "/fetch_food_category")
            .then((response) => {
                setFoodCategory(response.data.food_category_arr || []);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    };
    const fetchFoodSubCategoryById = () => {
        axios.get(API_URL + `/fetch_food_sub_category_by_id?food_sub_category_id=${food_sub_category_id}`)
            .then((response) => {
                setCategoryId(response.data.food_sub_category_arr[0].food_category_id);
                setcategoryEnglish(response.data.food_sub_category_arr[0].food_sub_category_english);
                setcategoryArabic(response.data.food_sub_category_arr[0].food_sub_category_arabic);
                setcategoryFrench(response.data.food_sub_category_arr[0].food_sub_category_french);
                setcategoryItalian(response.data.food_sub_category_arr[0].food_sub_category_italian);
                setcategoryKorean(response.data.food_sub_category_arr[0].food_sub_category_korean);
            })
            .catch((error) => {
                console.error('Error details:', error);
            });
    };

    useEffect(() => {
        fetchFoodSubCategory();
        fetchFoodSubCategoryById();
    }, [])

    const handlesubmit = () => {
        let errors = {}
        if (!categoryEnglish) {
            errors.categoryEnglish = 'Please enter food category in enlish'
        }
        if (!categoryArabic) {
            errors.categoryArabic = 'Please enter food category in arabic'
        }
        if (!categoryFrench) {
            errors.categoryFrench = 'Please enter food category in french'
        }
        if (!categoryItalian) {
            errors.categoryItalian = 'Please enter food category in italian'
        }
        if (!categoryKorean) {
            errors.categoryKorean = 'Please enter food category in korean '
        }
        if (!CategoryId) {
            errors.CategoryId = 'Please select food category'
        }

        if (Object.keys(errors).length > 0) {
            setCategoryError(errors)
            return
        }
        const formData = new FormData();
        formData.append("food_sub_category_id", food_sub_category_id);
        formData.append("food_category_id", CategoryId);
        formData.append("food_sub_category_english", categoryEnglish);
        formData.append("food_sub_category_arabic", categoryArabic);
        formData.append("food_sub_category_french", categoryFrench);
        formData.append("food_sub_category_italian", categoryItalian);
        formData.append("food_sub_category_korean", categoryKorean);
        formData.append("image", image);

        axios.post(API_URL + '/edit_food_sub_category', formData).then((response) => {
            if (response.data.success) {
                setAlertModal(true);
                setTimeout(() => {
                    setAlertModal(false);
                    navigate(APP_PREFIX_PATH + '/manage-food-sub-category')
                }, 2000);
            }
            else if (response.data.key == 'exist') {
                let updatedErrors = { ...errors };
                updatedErrors.categoryEnglish = 'food sub-category already exist';
                setCategoryError(updatedErrors);
                return;
            }
        }).catch((error) => {
            console.log(error);

        })

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setCategoryError((prev) => ({ ...prev, image: "Please select an image!" }));
        } else if (!file.type.startsWith("image/")) {
            setCategoryError((prev) => ({ ...prev, image: "Only image files are allowed!" }));
        } else {
            setCategoryError((prev) => ({ ...prev, image: "" }));
            setimage(file);
        }
    };

    return (
        <PageLayout>
            <Col xl={12}>
                <div className="mc-card">
                    <div className='mc-breadcrumb'>
                        <h3 className="mc-breadcrumb-title">{t('Edit Food Sub-Category')}</h3>
                        <ul className="mc-breadcrumb-list">
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/dashboard'}`} className="mc-breadcrumb-link">{t('home')}</Link></li>
                            <li className="mc-breadcrumb-item"><Link to={`${APP_PREFIX_PATH + '/manage-food-sub-category'}`} className="mc-breadcrumb-link">{t('food sub-category')}</Link></li>
                            <li className="mc-breadcrumb-item">{t('Edit Food Sub-Category')}</li>
                        </ul>
                    </div>
                </div>
            </Col>
            <div className="container">

                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Select Food Category
                        </label>
                        <Form.Select
                            value={CategoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setCategoryError((prev) => ({ ...prev, CategoryId: "" }));
                            }}
                            className={`form-select`}
                            isInvalid={!!CategoryError.CategoryId}
                        >
                            <option value="" disabled>{t('Select Food Category')}</option>
                            {FoodCategory.map((category) => (
                                <option key={category.food_category_id} value={category.food_category_id}>
                                    {category.food_category_english}
                                </option>
                            ))}

                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.CategoryId}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Food Sub-Category English
                        </label>
                        <Form.Control type="text" placeholder='Enter food category in english' value={categoryEnglish} onChange={(e) => {
                            setcategoryEnglish(e.target.value)
                            setCategoryError((prev) => ({ ...prev, categoryEnglish: "" }));
                        }}
                            isInvalid={CategoryError.categoryEnglish}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.categoryEnglish}
                        </Form.Control.Feedback>
                    </div>




                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Food Sub-Category Arabic
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter food category in arabic'
                            value={categoryArabic} onChange={(e) => {
                                setcategoryArabic(e.target.value)
                                setCategoryError((prev) => ({ ...prev, categoryArabic: "" }));
                            }}

                            isInvalid={CategoryError.categoryArabic}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.categoryArabic}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Food Sub-Category French
                        </label>
                        <Form.Control type="text" placeholder='Enter food category in french' value={categoryFrench} onChange={(e) => {
                            setcategoryFrench(e.target.value)
                            setCategoryError((prev) => ({ ...prev, categoryFrench: "" }));
                        }}
                            isInvalid={CategoryError.categoryFrench}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.categoryFrench}
                        </Form.Control.Feedback>
                    </div>

                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Food Sub-Category Italian
                        </label>
                        <Form.Control type="text"
                            placeholder='Enter food category in italian'
                            value={categoryItalian} onChange={(e) => {
                                setcategoryItalian(e.target.value)
                                setCategoryError((prev) => ({ ...prev, categoryItalian: "" }));
                            }}
                            isInvalid={CategoryError.categoryItalian}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.categoryItalian}
                        </Form.Control.Feedback>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Food Sub-Category Korean
                        </label>
                        <Form.Control type="text" placeholder='Enter food category in korean' value={categoryKorean} onChange={(e) => {
                            setcategoryKorean(e.target.value)
                            setCategoryError((prev) => ({ ...prev, categoryKorean: "" }));
                        }}
                            isInvalid={CategoryError.categoryKorean}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.categoryKorean}
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className='row m-2'>
                    <div className='col-md-6'>
                        <label htmlFor="categoryDescription" className="form-label">
                            Upload Image
                        </label>
                        <Form.Control type="file"
                            onChange={handleImageChange}
                            isInvalid={!!CategoryError.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryError.image}
                        </Form.Control.Feedback>
                    </div>
                </div>

                <button className="btn btn-dark"
                    style={{
                        marginLeft: '20px', background: '#19918F', border: 'none', marginBottom: '5rem'
                    }}
                    onClick={handlesubmit}
                >
                    EDIT
                </button>
            </div>

            <Modal show={alertModal} onHide={() => setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons" style={{ color: 'green' }}>check_circle</i>
                    <h3>Success</h3><br />
                    <p>Food sub-category updated successfully.</p>
                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal >
        </PageLayout>
    )
}