/** @type {import('umzug').MigrationFn<any>} */
exports.up = async params => {
    return params.context.bulkInsert('people', [{
        name: 'John',
        userId: 1
    }]);

};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async params => { };
