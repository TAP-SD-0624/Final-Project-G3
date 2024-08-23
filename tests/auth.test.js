import request from 'supertest';
import app from '../src/app';
import { associateModels } from '../src/models/associations';
import sequelize from '../src/database';
import dotenv from 'dotenv';
let token;

dotenv.config({ path: './config/.env.local' });
dotenv.config({ path: './config/.env' });

beforeAll(async () => {
	// await associateModels();
	// await sequelize.sync();
});

describe('Sign up new user with valid credintials', () => {
  it('should return a 201 status code response that indicates success sign up', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: "Test",
        lastName: "Test",
        email: "testuser@gmail.com",
        dateOfBirth: "2000-01-01T01:30:00.000-05:00",
        password: "Test@test1234",
        confirmPassword: "Test@test1234"
      });
      expect(res.status).toBe(201);
  });
});

describe('Login to the system using an existing user', () => {
  it('should return a 200 status code response that indicates success login', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: "testuser@gmail.com",
        password: "Test@test1234",
      });
      expect(res.status).toBe(200);
      token = res.body.token;
  });
});

describe('Logout from the system while being logged in', () => {
  it('should return a 200 status code response that indicates successful logout', async () => {
    console.log(token);
      const res = await request(app).get('/api/auth/logout').set('jwt', `${token}`);
      expect(res.status).toBe(200);
  });
});

afterAll(async () => {
  // do rollbacks
  await sequelize.close(); // Close the database connection after all tests
});