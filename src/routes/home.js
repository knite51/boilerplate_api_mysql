/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const router = require('express').Router();

try {
  router.get('/', (request, response, next) => {
    request.payload = {
      payload: 'Welcome to KokopelliV2',
      error: null,
      status_code: 200,
      success: true,
    };
    next();
  });
} catch (e) {
  console.log(`[Route Error] /home: ${e.message}`);
} finally {
  module.exports = router;
}
