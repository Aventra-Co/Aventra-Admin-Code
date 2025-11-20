import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Modal, Form } from "react-bootstrap";
import { ButtonComponent, AnchorComponent } from "../elements";
import axios from "axios";
import Select from "react-select";
import { encode } from "base-64";
import Swal from "sweetalert2";
import {
  API_URL,
  APP_PREFIX_PATH,
  Category_placeholder,
  IMAGE_PATH,
  User_placeholder,
} from "../../constant/constant";
import PaginationComponent from "../PaginationComponent";
import { Row, Col } from "react-bootstrap";
import LabelFieldComponent from "../fields/LabelFieldComponent";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import categoryImage from "../../assets/img/category.webp";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

export default function ManageFaqTableComponent({ thead, tbody }) {
  const { t } = useContext(TranslatorContext);
  const [faqDetails, setfaqDetails] = useState([]);
  const [DeleteId, setDeleteId] = useState("");
  const [AddModal, setAddModal] = useState(false);
  const [EditModal, setEditModal] = useState(false);

  const [alertModal, setAlertModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [EditQuestion, setEditQuestion] = useState("");
  const [EditAnswer, setEditAnswer] = useState("");

  const [EditId, setEditId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const entriesPerPage = 50;

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const filteredUsers = faqDetails.filter((user) => {
    const lowercasedTerm = searchTerm?.trim().toLowerCase();

    if (!lowercasedTerm) {
      return true;
    }

    return (
      user.question?.toLowerCase().includes(lowercasedTerm) ||
      user.answer?.toLowerCase().includes(lowercasedTerm) ||
      user.createtime?.toLowerCase().includes(lowercasedTerm)
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const fetchfaqDetails = () => {
    axios
      .get(API_URL + "/get_faq")
      .then((response) => {
        const faqDetails = response.data.data.faq_details || [];

        if (Array.isArray(faqDetails)) {
          const formattedfaq = faqDetails.map((data) => ({
            question: data.question,
            answer: data.answer,

            faq_id: data.faq_id,

            createtime: data.createtime,
          }));
          setfaqDetails(formattedfaq);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  useEffect(() => {
    fetchfaqDetails();
  }, []);

  function formatDateWithTime(date) {
    return moment(date).format("DD/MM/YYYY hh:mm A");
  }

  const handleUserAction = (action, faq_id, question, answer) => {
    if (action === "edit") {
      console.log("faq_id", faq_id);

      setEditModal(true);
      setEditId(faq_id);
      setEditQuestion(question);
      setEditAnswer(answer);
    } else if (action === "delete") {
      setAlertModal(true);
      setDeleteId(faq_id);
    }
  };

  const QuestionDelete = () => {
    axios
      .post(API_URL + "/delete_faq", {
        faq_id: DeleteId,
      })
      .then((res) => {
        if (res.data.success) {
          fetchfaqDetails();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (values) => {
    console.log("values data", values);
    const { faq_id, question, answer, action } = values;

    if (action === "add_faq") {
      const data = new FormData();
      data.append("action", "add_faq");
      data.append("question", question);
      data.append("answer", answer);

      axios
        .post(`${API_URL}/add_faq`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data.success + "print");
          if (res.data.success) {
            if (res.data.key == "Exists") {
              Swal.fire({
                icon: "error",
                text: "Question already exist !",
                confirmButtonText: "Ok",
              });
            } else {
              Swal.fire({
                icon: "success",
                text: "Question added successfully.",
                timer: 1000,
                showConfirmButton: false,
              }).then(() => {
                setAddModal(false);
                fetchfaqDetails();
              });
            }
          }
        })
        .catch((err) => console.error("Error fetching Emergency:", err));
    } else {
      const data = new FormData();
      data.append("faq_id", faq_id);
      data.append("action", "edit_question");
      data.append("question", question);
      data.append("answer", answer);

      axios
        .post(`${API_URL}/edit_faq`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data.success + "print ");
          if (res.data.success) {
            if (res.data.key == "Exists") {
              Swal.fire({
                icon: "error",
                text: "Question already exist !",
                confirmButtonText: "Ok",
              });
            } else {
              Swal.fire({
                icon: "success",
                text: "Question updated successfully.",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                setEditModal(false);
                fetchfaqDetails();
              });
            }
          }
        })
        .catch((err) => console.error("Error fetching Emergency:", err));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Row
        xs={1}
        sm={2}
        xl={4}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Col>
          <LabelFieldComponent
            type="search"
            icon="Search"
            placeholder={`${t("search_here")}`}
            labelDir="label-col"
            fieldSize="mb-4 w-100 h-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col style={{ textAlign: "right", marginBottom: "5px" }}>
          <button
            style={{
              background: "#2b77e5",
              padding: "7px 13px",
              color: "#fff",
              borderRadius: "5px",
            }}
            onClick={() => {
              setAddModal(true);
            }}
          >
            <AddIcon className="me-2" /> {t("add_faq")}
          </button>
        </Col>
      </Row>

      <div className="mc-table-responsive">
        <table className="mc-table">
          <thead className="mc-table-head primary">
            <tr>
              <th>
                <div className="mc-table-check">
                  <p>{t("sno")}</p>
                </div>
              </th>
              <th>{t("actions")}</th>
              <th>{t("question")}</th>
              <th>{t("answer")}</th>

              <th>{t("createtime")}</th>
            </tr>
          </thead>
          <tbody className="mc-table-body even">
            {currentUsers?.map((item, index) => (
              <tr key={index}>
                <td title="id">
                  <div className="mc-table-check">
                    <p>{indexOfFirstEntry + index + 1}</p>
                  </div>
                </td>
                <td>
                  <div className="mc-table-action">
                    <AnchorComponent
                      to={`${APP_PREFIX_PATH}/view-faq/${encode(
                        item.faq_id
                      ).toString()}`}
                      title="View"
                      className="material-icons view"
                    >
                      visibility
                    </AnchorComponent>
                    <ButtonComponent
                      title="Edit"
                      className="material-icons edit"
                      onClick={() => {
                        handleUserAction(
                          "edit",
                          item.faq_id,
                          item.question,
                          item.answer
                        );
                      }}
                    >
                      edit
                    </ButtonComponent>

                    <ButtonComponent
                      type="button"
                      className="material-icons delete"
                      onClick={() =>
                        handleUserAction(
                          "delete",
                          item.faq_id,
                          item.question,
                          item.answer
                        )
                      }
                    >
                      delete
                    </ButtonComponent>
                  </div>
                </td>

                <td>
                  <span>{item.question || "NA"}</span>
                </td>

                <td>
                  <span>{item.answer || "NA"}</span>
                </td>
                <td>
                  {(item.createtime && formatDateWithTime(item.createtime)) ||
                    "NA"}
                </td>
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
          onHide={() => {
            setAddModal(false);
          }}
        >
          <div className="mc-user-modal">
            <img src={categoryImage} alt="Profile" />

            <Formik
              initialValues={{
                question: "",
                answer: "",
                action: "add_faq",
                submit: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={Yup.object().shape({
                question: Yup.string()
                  .trim()
                  .max(255)
                  .required("Please enter question."),
                answer: Yup.string()
                  .trim()
                  .max(255)
                  .required("Please enter answer."),
              })}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                touched,
                values,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <div className="form-group mb-2">
                    <label>{t("question")}</label>
                    <textarea
                      className="form-control"
                      label={t("question")}
                      name="question"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("enter_question")}
                      value={values.question}
                    ></textarea>
                    {touched.question && errors.question && (
                      <small className="text-danger form-text">
                        {errors.question}
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    <label>{t("answer")}</label>
                    <textarea
                      className="form-control"
                      label={t("answer")}
                      name="answer"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("enter_answer")}
                      value={values.answer}
                    ></textarea>
                    {touched.answer && errors.answer && (
                      <small className="text-danger form-text">
                        {errors.answer}
                      </small>
                    )}
                  </div>

                  <Row>
                    <Col mt={5} className="text-center mt-4">
                      <button
                        className="btn btn-block btn-secondary mb-4"
                        onClick={() => {
                          setAddModal(false);
                        }}
                        size="large"
                        type="button"
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-block btn-primary mb-4 ms-2"
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                      >
                        Add
                      </button>
                    </Col>
                  </Row>
                </form>
              )}
            </Formik>
          </div>
        </Modal>

        <Modal
          show={EditModal}
          onHide={() => {
            setEditModal(false);
          }}
        >
          <div className="mc-user-modal">
            <img src={categoryImage} alt="Profile" />

            <Formik
              initialValues={{
                faq_id: EditId || "",
                question: EditQuestion || "",
                answer: EditAnswer || "",
                action: "edit_question",
                submit: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={Yup.object().shape({
                question: Yup.string()
                  .trim()
                  .max(255)
                  .required("Please enter qualification."),
                answer: Yup.string()
                  .trim()
                  .max(255)
                  .required("Please enter qualification."),
              })}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                touched,
                values,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="faq_id"
                    value={values.faq_id}
                  />

                  <div className="form-group mb-2">
                    <label>{t("question")}</label>
                    <textarea
                      className="form-control"
                      label={t("question")}
                      name="question"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("enter_question")}
                      value={values.question}
                    ></textarea>
                    {touched.question && errors.question && (
                      <small className="text-danger form-text">
                        {errors.question}
                      </small>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label>{t("answer")}</label>
                    <textarea
                      className="form-control"
                      label={t("answer")}
                      name="answer"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("enter_answer")}
                      value={values.answer}
                    ></textarea>
                    {touched.answer && errors.answer && (
                      <small className="text-danger form-text">
                        {errors.answer}
                      </small>
                    )}
                  </div>

                  <Row>
                    <Col mt={5} className="text-center mt-4">
                      <button
                        className="btn btn-block btn-secondary mb-4"
                        onClick={() => {
                          setEditModal(false);
                        }}
                        size="large"
                        type="button"
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-block btn-primary mb-4 ms-2"
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                      >
                        Update
                      </button>
                    </Col>
                  </Row>
                </form>
              )}
            </Formik>
          </div>
        </Modal>

        <Modal show={alertModal} onHide={() => setAlertModal(false)}>
          <div className="mc-alert-modal">
            <i className="material-icons">new_releases</i>
            <h3>are your sure!</h3>
            <p>Want to delete this question?</p>
            <Modal.Footer>
              <ButtonComponent
                type="button"
                className="btn btn-secondary"
                onClick={() => setAlertModal(false)}
              >
                {t("close")}
              </ButtonComponent>
              <ButtonComponent
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setAlertModal(false);
                  QuestionDelete();
                }}
              >
                {t("delete")}
              </ButtonComponent>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </>
  );
}
