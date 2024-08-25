/* eslint-disable */
'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      // Updated Admin Users
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Ahmad',
        lastName: 'Marei',
        email: 'ahmad.marei@gmail.com',
        dateOfBirth: '2000-01-01T01:30:00.000-05:00',
        password: await bcrypt.hash('Ahmad@test1234', 10),
        role: 'admin',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Sara',
        lastName: 'Zebdeh',
        email: 'sara.zebdeh@gmail.com',
        dateOfBirth: '2000-01-01T01:30:00.000-05:00',
        password: await bcrypt.hash('Sara@test1234', 10),
        role: 'admin',
        createdAt: new Date(),
      },
      // New Users with role 'user'
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@gmail.com',
        dateOfBirth: '1995-03-15T10:00:00.000-05:00',
        password: await bcrypt.hash('Alice@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@gmail.com',
        dateOfBirth: '1992-07-22T15:45:00.000-05:00',
        password: await bcrypt.hash('Bob@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@gmail.com',
        dateOfBirth: '1988-11-30T12:30:00.000-05:00',
        password: await bcrypt.hash('Charlie@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@gmail.com',
        dateOfBirth: '1991-06-18T09:15:00.000-05:00',
        password: await bcrypt.hash('David@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Eva',
        lastName: 'Davis',
        email: 'eva.davis@gmail.com',
        dateOfBirth: '1985-02-20T16:30:00.000-05:00',
        password: await bcrypt.hash('Eva@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
