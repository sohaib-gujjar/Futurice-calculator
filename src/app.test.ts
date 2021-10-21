import request from 'supertest'
import { app } from './index';

describe('GET /calculus', () => {
      
    it('should return 200 & valid response', async done => {
      request(app)
        .get(`/calculus?query=[MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=]`)
        //.expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toMatchObject({'error': false, 'result': -132.88888888888889})
          done()
        })
    })
  })