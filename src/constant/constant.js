export const BASE_URL = '/';
export const BASE_TITLE = '';
export const APP_PREFIX_PATH = '/app/central';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://aventra-co.com/app/server';
const DEV_MODE = (process.env.APP_ENV || 'production') !== 'production';

export const API_URL    = `${SERVER_URL}/app/server/adminAPI`;
export const IMAGE_PATH = DEV_MODE ? `${SERVER_URL}/uploads/` : `${SERVER_URL}/app/server/uploads/`;
export const LOGO_URL   = DEV_MODE ? `${SERVER_URL}/logo/logo.png` : `${SERVER_URL}/app/server/logo/logo.png`;
export const placeholder = DEV_MODE ? `${SERVER_URL}/uploads/placeholder.webp` : `${SERVER_URL}/app/server/uploads/Placeholder.webp`;
