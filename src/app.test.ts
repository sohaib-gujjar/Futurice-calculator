import request from 'supertest'
import { app } from './index';

describe('GET /calculus', () => {
  test("should return 200 & valid response", async () => {
    await request(app)
      .get("/calculus?query=[MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=]")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({ error: false, result: -132.88888888888889 })
      })
  })
})
