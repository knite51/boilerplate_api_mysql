/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const router = require('express').Router();
const {
  handle_404,
  handle_error,
  setup_request,
  process_response,
} = require('../middlewares/http');

// const { authenticate_user } = require('../middlewares/auth');

/** Route Handlers */
const home_route_handler = require('./home');
const admin_route_handler = require('./admin');

/** Cross Origin Handling */
router.use(setup_request);
router.use(home_route_handler);
router.use('/admin', admin_route_handler);
// router.use('/staffs', authenticate_user, staff_route_handler);

// router.use('/files', files_route_handler);

router.use(process_response);

router.use(handle_404);
router.use(handle_error);

module.exports = router;
