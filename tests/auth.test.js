import request from 'supertest';
import app from '../src/app';
import { associateModels } from '../src/models/associations';
import sequelize from '../src/database';
let token;


beforeAll(async () => {
	// await associateModels();
	await sequelize.sync();
  
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
      expect(res.body.message).toEqual("User registered successfully");
      
  });
});

afterAll(async () => {
  await sequelize.close(); // Close the database connection after all tests
});