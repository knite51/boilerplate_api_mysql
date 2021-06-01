const faker = require('faker');

module.exports = {
  createAdminUser: () => ({
    username: 'KniteDeveloperAdmin',
    email: faker.internet.email(),
    isAdmin: true,
    password: 'adminPassword',
  }),
};
