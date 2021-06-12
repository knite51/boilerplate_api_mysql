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
    })
    .get('/:id', async (request, response, next) => {
      request.payload = await admin_service.read_record_by_id(request, next);
      next();
    })
    .get('/search/:keys/:keyword', async (request, response, next) => {
      request.payload = await admin_service.read_records_by_wildcard(
        request,
        next
      );
      next();
    })
    .put('/:id', async (request, response, next) => {
      request.payload = await admin_service.update_record_by_id(request, next);
      next();
    })
    .put('/', async (request, response, next) => {
      request.payload = await admin_service.update_many_records(request, next);
      next();
    })
    .delete('/:id', async (request, response, next) => {
      request.payload = await admin_service.delete_record_by_id(request, next);
      next();
    })
    .delete('/', async (request, response, next) => {
      request.payload = await admin_service.delete_many_records(request, next);
      next();
    });
} catch (e) {
  console.log(`[Route Error] /admin: ${e.message}`);
} finally {
  module.exports = router;
}
