/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/
const EventEmitter = require('events');
const { logger } = require('../utilities/logger');
class AppEvent extends EventEmitter {}
const appEvent = new AppEvent();

appEvent.on('error', (error) => {
  logger.error(`[AppEvent Error] ${error}`);
});

module.exports = appEvent;
