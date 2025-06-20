export const AUTH_ROUTES = {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
}

export const DASHBOARD_ROUTES = {
    HOME: '/dashboard',
}

export const WEBSITE_ROUTES = {
    CREATE: `${DASHBOARD_ROUTES.HOME}/website/create`,
    VERIFY_LICENSE_KEY: `${DASHBOARD_ROUTES.HOME}/website/verify-license-key`,
}