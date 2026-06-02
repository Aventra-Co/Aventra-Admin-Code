export const BASE_URL = '/';
export const BASE_TITLE = '';

// 'app' (production) | 'staging' — drives both the router prefix and the server path.
const BASE = process.env.REACT_APP_BASE || 'app';
export const APP_PREFIX_PATH = `/${BASE}/central`;          // router base, e.g. /app/central

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://aventra-co.com';
const DEV_MODE = (process.env.APP_ENV || 'production') !== 'production';
const SERVER_BASE = `${SERVER_URL}/${BASE}/server`;         // e.g. https://aventra-co.com/staging/server

export const API_URL    = `${SERVER_BASE}/adminAPI`;
export const IMAGE_PATH = DEV_MODE ? `${SERVER_URL}/uploads/` : `${SERVER_BASE}/uploads/`;
export const LOGO_URL   = DEV_MODE ? `${SERVER_URL}/logo/logo.png` : `${SERVER_BASE}/logo/logo.png`;
export const placeholder = DEV_MODE ? `${SERVER_URL}/uploads/placeholder.webp` : `${SERVER_BASE}/uploads/Placeholder.webp`;
