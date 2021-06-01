/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const { app, request, expect, assert } = require('../_super');

describe('Home Route', () => {
  it('should return : Welcome to KokopelliV2', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        assert.property(response, 'body');
        assert.property(response, 'status');
        expect(response.status).to.equal(200);
        assert.property(response.body, 'payload');
        expect(response.body).to.eql({
          payload: 'Welcome to KokopelliV2',
          error: null,
          status_code: 200,
          success: true,
        });
        done();
      });
  });
});
