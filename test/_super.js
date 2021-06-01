/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

require('dotenv').config();
const request = require('supertest');
const express = require('express');
const chai = require('chai');
const app = express();

const router = require('../src/routes/_config');

app.use(express.urlencoded({ extended: false }));
app.use('/', router);

const expect = chai.expect;
const assert = chai.assert;

module.exports = {
  app,
  request,
  expect,
  assert,
};
