/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const router = require('express').Router();
const admin_service = require('../services/admin');

try {
  router
    .post('/', async (request, response, next) => {
      request.payload = await admin_service.create_record(request, next);
      next();
    })

    .get('/', async (request, response, next) => {
      request.payload = await admin_service.read_records_by_filter(
        request,
        next
      );
      next();
    });
  // .get('/:id', async (request, response, next) => {
  //   request.payload = await department_service.read_record_by_id(
  //     request,
  //     next
  //   );
  //   next();
  // })
} catch (e) {
  console.log(`[Route Error] /admin: ${e.message}`);
} finally {
  module.exports = router;
}
