module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'scope-enum': [
        2,
        'always',
        [
          // workspace packages
          'core',
          'lib',
          'app',
          'config',
          'all',
          '*',
        ],
      ],
    },
  }