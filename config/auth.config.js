module.exports = {
    "headerName": env("AUTH_HEADER_NAME", "Authorization"),
    "cookieName": env("AUTH_COOKIE_NAME", "_token"),
    "paramName": env("AUTH_PARAM_NAME", "_token"),
    "sessionLifetime": env("AUTH_SESSION_LIFETIME", 120, 'number'),
    "extendedSessionLifetime": env("AUTH_EXTENDED_SESSION_LIFETIME", 43800, 'number'),
}