// src/tests/category.test.js
const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../routes/category.routes');
const db = require('../config/db');

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

describe('GET /api/categories', () => {
    
  beforeAll(async () => {
    await db.execute('INSERT INTO categories (name) VALUES (\'Тестова категорія для Jest\')');
  });

  afterAll(async () => {
    await db.execute('DELETE FROM categories WHERE name = \'Тестова категорія для Jest\'');
    await db.end();
  });

  it('Має повернути статус 200 та масив категорій', async() => {
    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});