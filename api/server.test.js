const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async ()=>{
  await db.seed.run()
})
afterAll(async ()=>{
  await db.destroy() 
})

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('jokes router', () => {
  describe('[GET] /jokes', () => {
    let res
    beforeEach(async () => {
      res = await request(server).get('/api/jokes')
    })
    it('responds with 200 OK', async () => {
      expect(res.status).toBe(200)
    })
    it('responds with length', async () => {
      expect(res.body).toHaveLength(3)
    })
  })

  describe('[POST] /register', () => {
    let res
    beforeEach(async () => {
      res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'gabe', password: 'new' })
    })
    it('responds with a 200 created', async () => {
      expect(res.status).toBe(200)
    })
    it('responds with new hobbit', async () => {
      expect(res.body).toMatchObject({ id: 4, username: 'gabe' })
    })
  })

})