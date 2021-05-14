//logger config file
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
    'name': env('APP_NAME', 'My app'),
    'url': env('APP_URL', 'http://localhsot:3000'),
    'frontend_url': env('FRONTEND_URL', 'http://localhsot:3000'),
    'port': env('APP_PORT', '3000'),
    //'debug': env('DEBUG', false, 'boolean'),
}