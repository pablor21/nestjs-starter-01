const Sequelize = require('sequelize');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async params => {
    return params.context.createTable('people', {
        name: Sequelize.DataTypes.STRING,
        isBetaMember: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            // references: {
            //     model: {
            //         tableName: 'users',
            //         schema: 'schema'
            //     },
            //     key: 'id'
            // },
            allowNull: false
        },
    });
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async params => {
    return params.context.dropTable('people');
};
