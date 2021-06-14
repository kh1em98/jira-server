import { authConfig } from './auth';

const isProduction = process.env.NODE_ENV === 'true';

export { isProduction, authConfig };
