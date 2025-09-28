const request = require('supertest');
const app = require('../app');

describe('API tests', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /items returns array', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /items creates item', async () => {
    const res = await request(app).post('/items').send({ name: 'new-item' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('new-item');
  });
});
