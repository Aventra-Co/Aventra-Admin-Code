import React, { useContext, useEffect, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import PageLayout from '../../layouts/PageLayout';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from '../../constant/constant';
import { SyncLoader } from 'react-spinners';
import { decode } from 'base-64';
import { Helmet } from 'react-helmet-async';
export default function ViewAddons() {
  const { t } = useContext(TranslatorContext);
  const { addon_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [addonData, setAddonData] = useState(null);

  const fetchAddonData = () => {
    setLoading(true);
    axios.get(`${API_URL}/fetch_sub_addons_by_id?addon_id=${decode(addon_id)}`)
      .then(res => {
        if (res.data.success) {
          setAddonData(res.data.result);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching addon data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAddonData();
  }, [addon_id]);

  return (
    <PageLayout>
      <Helmet>
        <title>Aventra | View-Addons</title>
      </Helmet>
      <Col xl={12}>
        <div className='mc-card'>
          <div className='mc-breadcrumb'>
            <h3 className='mc-breadcrumb-title'>{t('AddOn Subcategory Details')}</h3>
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
                  to={`${APP_PREFIX_PATH + '/manage-addons'}`}
                  className='mc-breadcrumb-link'
                >
                  {t('AddOns')}
                </Link>
              </li>
              <li className='mc-breadcrumb-item'>{t('AddOn Details')}</li>
            </ul>
          </div>
        </div>
      </Col>

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
        <div className='mc-card p-lg-4'>
          <Row>
            <Col xl={12}>
              <h6 className='mc-divide-title mb-4'>{t('Add-on Subcategory Details')}</h6>
              <div className='mc-product-view-info-group'>
                <div className='col-lg-12 content'>
                  <div className='mobile-view'>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Add-on Name')}:</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {addonData?.addon_name || 'NA'}
                        </span>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Sub category Name')}:</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {addonData?.sub_category_name || 'NA'}
                        </span>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-lg-4'>
                        <h6>{t('Sub category Name Arabic')}:</h6>
                      </div>
                      <div className='col-lg-8'>
                        <span style={{ fontWeight: '400' }}>
                          {addonData?.sub_category_name_arabic || 'NA'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </PageLayout>
  );
}