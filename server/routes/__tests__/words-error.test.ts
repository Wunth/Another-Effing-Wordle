import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import server from '../../server.ts'
import * as db from '../../db/words.ts'
import connection from '../../db/connection.ts'

vi.mock('../../db/words.ts')

beforeAll(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  await connection.migrate.latest()
})

afterAll(async () => {
  vi.restoreAllMocks()
  await connection.destroy()
})

describe('GET /random', () => {
  it('returns an error when the db fails', async () => {
    vi.spyOn(db, 'getRandomWord').mockImplementation(() => {
      throw new Error('random word failed')
    })

    const res = await request(server).get('/api/v1/words/random')

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(
      expect.objectContaining({ message: 'Something went wrong' }),
    )
    expect(db.getRandomWord).toHaveBeenCalled()
  })
})

describe('GET /:id/reveal', () => {
  it('returns an error when the db fails', async () => {
    // Note: mockImplementation replaces getWordById entirely, bypassing
    // its real internal try/catch. A genuine unmocked DB failure is
    // swallowed there and surfaces as a 404, not a 500.
    vi.spyOn(db, 'getWordById').mockImplementation(() => {
      throw new Error('reveal failed')
    })

    const res = await request(server).get('/api/v1/words/1/reveal')

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(
      expect.objectContaining({ message: 'Something went wrong' }),
    )
    expect(db.getWordById).toHaveBeenCalledWith(1)
  })
})

describe('POST /check', () => {
  it('returns an error when the db fails', async () => {
    vi.spyOn(db, 'getWordById').mockImplementation(() => {
      throw new Error('check failed')
    })

    const res = await request(server)
      .post('/api/v1/words/check')
      .send({ wordId: 1, guess: 'phuck' })

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(
      expect.objectContaining({ message: 'Something went wrong' }),
    )
    expect(db.getWordById).toHaveBeenCalledWith(1)
  })
})
