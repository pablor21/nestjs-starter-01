module.exports = {
    default: {
        uri: 'fs://' + env('STORAGE_ROOT', './storage'),
        name: 'filesystem',
        buckets: [
            { name: 'uploads', root: 'uploads' },
            { name: 'cache', root: 'cache' },
            { name: 'defaults', root: 'defaults' }
        ]
    }
}