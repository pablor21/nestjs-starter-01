//logger config file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    lang: env('LOCALE', 'en'),
    supportedLngs: env('LOCALES', ['en', 'es'], 'array'),
    fallbackLng: env('FALLBACK_LOCALE', env('LOCALE', 'en')),
    saveMissing: true,
    updateMissing: true,
    saveMissingPlurals: true,
    ns: ['common', 'error', 'auth'],
    defaultNS: 'common',
    fallbackNs: 'common',
    debug: false,
    backend: {
        loadPath: path.join(__dirname, '../resources/lang/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '../resources/lang/{{lng}}/{{ns}}.missing.json')
    },
    detection: {
        // order and from where user language should be detected
        order: ['path', /*'session', */ 'querystring', 'cookie', 'header'],

        // keys or params to lookup language from
        lookupQuerystring: 'lang',
        lookupCookie: '_lang',
        lookupHeader: 'accept-language',
        lookupHeaderRegex: /(([a-z]{2})-?([A-Z]{2})?)\s*;?\s*(q=([0-9.]+))?/gi,
        lookupSession: '_lang',
        lookupPath: '_lang',
        lookupFromPathIndex: 0,

        // cache user language
        caches: false, // ['cookie']

        ignoreCase: true, // ignore case of detected language

        // optional expire and domain for set cookie
        cookieExpirationDate: new Date(),
        cookieDomain: 'myDomain',
        cookiePath: '/my/path',
        cookieSecure: true, // if need secure cookie
        cookieSameSite: 'strict' // 'strict', 'lax' or 'none'
    }
}