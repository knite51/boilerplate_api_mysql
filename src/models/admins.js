const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Admins = sequelize.define(
    'Admins',
    {
      id: {
        type: DataTypes.STRING(190).BINARY,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
      },
      _id: {
        type: DataTypes.BIGINT,
        defaultValues: 0,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(190),
        unique: true,
        allowNull: false,
      },
      password: { type: DataTypes.STRING(190), allowNull: false },
      is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      hooks: {
        beforeCreate(user) {
          return user.hashPassword();
        },
      },
    }
  );

  // Instance methods
  Admins.prototype.hashPassword = function hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
    return this.password;
  };

  Admins.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return Admins;
};
