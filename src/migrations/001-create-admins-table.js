/* eslint-disable no-unused-vars */
const tableName = 'Admins';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(190).BINARY,
        defaultValue: Sequelize.UUIDV1,
      },
      username: {
        type: Sequelize.STRING(190),
        unique: true,
        allowNull: false,
      },
      password: { type: Sequelize.STRING(190), allowNull: false },
      _id: {
        type: Sequelize.BIGINT,
        defaultValues: 0,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};
