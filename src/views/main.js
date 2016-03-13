// @flow

const array = require('./array');
const textEditor = require("./textEditor");
const counter = require('./counter');
const value = require('./value');

module.exports = value(array(value(textEditor)));
