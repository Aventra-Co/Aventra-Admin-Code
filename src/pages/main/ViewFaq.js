import React, { useContext, useEffect, useState } from "react";
import { TranslatorContext } from "../../context/Translator";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import axios from "axios";
import "./UserProfilePage.css";
import {
  API_URL,
  APP_PREFIX_PATH,
} from "../../constant/constant";
import moment from "moment";
import { decode } from "base-64";
// import Spinner from "./Spinner";
import { Helmet } from "react-helmet-async";
export default function ViewFaq() {

  const { t } = useContext(TranslatorContext);
  const { faq_id } = useParams();
  const [Data, setData] = useState("");
  const [spinner, setSpinner] = useState(false);


  const getData = () => {
    setSpinner(true);
    axios
      .get(API_URL + `/get_faq_by_id/${decode(faq_id)}`)
      .then((res) => {
        setSpinner(false);
        setData(res.data.res[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function formatDateWithTime(date) {
    return moment(date).format("DD/MM/YYYY hh:mm A");
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | View-FAQ</title>
      </Helmet>
      <Col xl={12}>
        <div className="mc-card">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">
              {t("View Faq")}
            </h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <Link
                  to={`${APP_PREFIX_PATH + "/dashboard"}`}
                  className="mc-breadcrumb-link"
                >
                  {t("home")}
                </Link>
              </li>
              <li className="mc-breadcrumb-item">
                <Link
                  to={`${APP_PREFIX_PATH + "/manage-faq"}`}
                  className="mc-breadcrumb-link"
                >
                  {t("manage_faq")}
                </Link>
              </li>
              <li className="mc-breadcrumb-item">
                {t("View Faq")}
              </li>
            </ul>
          </div>
        </div>
      </Col>
      <div className="mc-card p-lg-4">
        {/* {spinner ? (
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </div>
        ) : ( */}
        <>
          <Row>
            <Col xl={8}>
              <h6 className="mc-divide-title mb-4">{t("faq_details")}</h6>
              <div className="mc-product-view-info-group">
                <div className="col-lg-12 content">
                  <div className="row">
                    <div className="col-lg-6">
                      <h6 className="mt-2">{t("question")} : &nbsp;</h6>
                    </div>
                    <div className="col-lg-6">
                      <span style={{ fontWeight: "400" }}>
                        {Data.question || "NA"}
                      </span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <h6 className="mt-2">{t("answer")} : &nbsp;</h6>
                    </div>
                    <div className="col-lg-6">
                      <span style={{ fontWeight: "400" }}>
                        {Data.answer || "NA"}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-lg-6">
                      <h6 className="mt-2">{t("createdatetime")} : &nbsp;</h6>
                    </div>
                    <div className="col-lg-6">
                      <span style={{ fontWeight: "400" }}>
                        {Data.createtime
                          ? formatDateWithTime(Data.createtime)
                          : "NA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
        {/* )} */}
      </div>
    </PageLayout>
  );
}