const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.STRING(190).BINARY,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
      },
      fullname: { type: DataTypes.STRING(190) },
      email: { type: DataTypes.STRING(190), unique: true, allowNull: false },
      mobile: { type: DataTypes.STRING(190) },
      address: { type: DataTypes.STRING(1234) },
      town: { type: DataTypes.STRING(190) },
      state: { type: DataTypes.STRING(190) },
      country: { type: DataTypes.STRING(190) },
      password: { type: DataTypes.STRING(190), allowNull: false },
    },
    {
      hooks: {
        beforeCreate(user) {
          return user.hashPassword();
        },
        beforeUpdate(user) {
          return user.hashPassword();
        },
      },
    }
  );

  // Instance methods
  Users.prototype.hashPassword = function hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
    return this.password;
  };

  Users.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Class Method
  // Users.associate = (models) => {
  //   Users.hasMany(models.Order, {
  //     foreignKey: 'userID',
  //     onUpdate: 'cascade',
  //     onDelete: 'cascade',
  //   });
  // };

  return Users;
};
