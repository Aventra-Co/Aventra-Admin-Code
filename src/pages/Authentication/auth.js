import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PREFIX_PATH } from '../../constant/constant';

function Authentication() {
    const navigate = useNavigate();

    const logoutUser = () => {
        sessionStorage.removeItem('expirationTime');
        navigate(`${APP_PREFIX_PATH}/logout`);
    };
    const resetExpirationTime = () => {
        const sessionDuration = 15 * 60 * 1000;
        const expirationTime = new Date().getTime() + sessionDuration;
        sessionStorage.setItem('expirationTime', expirationTime);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const expirationTime = sessionStorage.getItem('expirationTime');
            const currentTime = new Date().getTime();

            if (expirationTime && currentTime > expirationTime) {
                logoutUser();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        const handleKeyPress = () => {
            resetExpirationTime();
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('mousedown', handleKeyPress);


        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('mousedown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const path = window.location.pathname;
        const protectedPaths = [
            '/dashboard',
            APP_PREFIX_PATH + '/manageusers',
            APP_PREFIX_PATH + '/deletedusers',
            APP_PREFIX_PATH + '/managesubscription',
            APP_PREFIX_PATH + '/managecontactus',
            APP_PREFIX_PATH + '/manageseries',
            APP_PREFIX_PATH + '/managesubscribedusers',
            APP_PREFIX_PATH + '/managereportedcontents',
            APP_PREFIX_PATH + '/managecontent',
            APP_PREFIX_PATH + '/managebroadcast',
            APP_PREFIX_PATH + '/userreport',
            APP_PREFIX_PATH + '/managepost',
            APP_PREFIX_PATH + '/subscriptionreport',
            APP_PREFIX_PATH + '/managecategory',
            APP_PREFIX_PATH + '/manageannouncement',
            APP_PREFIX_PATH + '/viewuser/',
            APP_PREFIX_PATH + '/viewpost/',
            APP_PREFIX_PATH + '/analyticalreport',
            APP_PREFIX_PATH + '/adminprofile'
        ];

        const token = sessionStorage.getItem('token1');
        const userType = sessionStorage.getItem('user_type');

        console.log('Current Path:', path);
        console.log('Token1:', token);

        // Case 1: No token - Redirect to login page for any protected route
        if (!token) {
            console.log('No token found');
            if (
                ![APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/forgot-password', APP_PREFIX_PATH + '/reset-password'].includes(path)
            ) {
                console.log('Navigating to /');
                navigate(APP_PREFIX_PATH + '/');
            }
        } else {
            // Case 2: Token is present
            if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/reset-password', APP_PREFIX_PATH + '/forgot-password'].includes(path)) {
                // Redirect to dashboard if accessing login/reset/forgot-password while logged in
                console.log('Navigating to dashboard since token is present');
                navigate(APP_PREFIX_PATH + '/dashboard');
            }

            // Check for protected paths and user type validity
            if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
                console.log('Protected path');
                if (userType !== '0') {
                    console.log('Invalid user type, navigating to /logout');
                    navigate(APP_PREFIX_PATH + '/');
                }
            }
        }
    }, [navigate]);

    return null;
}

export default Authentication;
