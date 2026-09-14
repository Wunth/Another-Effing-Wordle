import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import connection from '../../db/connection.ts'
import server from '../../server.ts'

let phuckId: number

beforeAll(async () => {
  await connection.migrate.latest()
})

beforeEach(async () => {
  await connection.seed.run()
  // look up the actual id fresh each time, since SQLite's AUTOINCREMENT
  // means ids keep climbing across every re-seed, never resetting to 1
  const row = await connection('words').where({ word: 'phuck' }).first()
  phuckId = row.id
})

afterAll(async () => {
  await connection.destroy()
})

describe('GET /random', () => {
  it('gets a random word, without leaking the actual word text', async () => {
    const res = await request(server).get('/api/v1/words/random')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        length: expect.any(Number),
      }),
    )
    expect(res.body.word).toBeUndefined()
  })
})

describe('GET /:id/reveal', () => {
  it('reveals the word for a given id', async () => {
    const res = await request(server).get(`/api/v1/words/${phuckId}/reveal`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ word: 'phuck' })
  })

  it('responds 404 for a word id that does not exist', async () => {
    const res = await request(server).get('/api/v1/words/999999/reveal')
    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual(
      expect.objectContaining({ message: 'Word not found' }),
    )
  })
})

describe('POST /check', () => {
  it('returns all "correct" and the seeded success message for an exact match', async () => {
    const res = await request(server)
      .post('/api/v1/words/check')
      .send({ wordId: phuckId, guess: 'phuck' })

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      result: ['correct', 'correct', 'correct', 'correct', 'correct'],
      message: 'Well done - you didnt phuck it up!',
    })
  })

  it('returns all "absent" for a guess sharing no letters with the word', async () => {
    const res = await request(server)
      .post('/api/v1/words/check')
      .send({ wordId: phuckId, guess: 'bwxyz' })

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toEqual(Array(5).fill('absent'))
  })

  it('returns a mix of correct/present/absent for a partially right guess', async () => {
    const res = await request(server)
      .post('/api/v1/words/check')
      .send({ wordId: phuckId, guess: 'chuck' })

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toEqual([
      'present',
      'correct',
      'correct',
      'correct',
      'correct',
    ])
  })

  it('responds 404 when the wordId does not exist', async () => {
    const res = await request(server)
      .post('/api/v1/words/check')
      .send({ wordId: 999999, guess: 'crane' })

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual(
      expect.objectContaining({ message: 'Word not found in the database' }),
    )
  })
})
