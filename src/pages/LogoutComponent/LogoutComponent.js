import { Navigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from '../../constant/constant';


function LogoutComponent() {
  sessionStorage.removeItem('token1');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('admin_id');
  sessionStorage.removeItem('admin_name');
  sessionStorage.removeItem('admin_email');
  sessionStorage.removeItem('admin_mobile');
  sessionStorage.removeItem('expirationTime');
  sessionStorage.removeItem('user_arr_data');
  localStorage.removeItem('user_arr_data');

  sessionStorage.removeItem('user_type');
  return (
    <>
      <Navigate to={`${APP_PREFIX_PATH}/`} />
    </>
  );
}

export default LogoutComponent;
