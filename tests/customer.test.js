const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const routes = require('../routes/customer.routes');
const config = require('../config');

  jest.mock('oracledb', () => ({
    createPool: jest.fn(),
    getPool: jest.fn(),
    getConnection: jest.fn(),
  }));
  
  const example_customer = {
    cust_id: 1,
    name: 'Sharat',
    email: 'sharat@example.com'
  };
  
  const mockConnection = {
    execute: jest.fn((query, bind, options) => {
      if (query.charAt(0) === 's') {
        return Promise.resolve({ rows: [example_customer], metaData: [] });
      } else {
        return Promise.resolve({ rowsAffected: 1 });
      }
    }),
    close: jest.fn().mockResolvedValue(),
  };
  
  const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    close: jest.fn().mockResolvedValue(),
  };
  
  oracledb.createPool.mockResolvedValue(mockPool);
  oracledb.getPool.mockReturnValue(mockPool);
  oracledb.getConnection.mockResolvedValue(mockConnection);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

describe('Customer API End Points', () => {
    beforeAll(async () => {
        await oracledb.createPool(config);
    });

    afterAll(async () => {
        await oracledb.getPool().close();
    });

    beforeEach(() => {
        mockConnection.execute.mockClear();
        mockPool.getConnection.mockClear();
    });

    it('should get all customers', async () => {
        mockConnection.execute.mockResolvedValue({
            rows: [example_customer],
            metaData: []
        });

        const res = await request(app).get('/api/customers');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toEqual([example_customer]);
    });

    it('should return 404 when no customers are found', async () => {
        mockConnection.execute.mockResolvedValue({
            rows: [],
            metaData: []
        });

        const res = await request(app).get('/api/customers');

        expect(res.status).toBe(404);
        expect(res.body.status).toBe('unsuccess');
        expect(res.body.message).toBe('No customers found');
    });

    it('should get a customer by cust_id', async () => {
        mockConnection.execute.mockResolvedValue({
            rows: [example_customer],
            metaData: []
        });

        const res = await request(app).get('/api/customer/1');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toEqual([example_customer]);
    });

    it('should return 404 when customer is not found', async () => {
        mockConnection.execute.mockResolvedValue({
            rows: [],
            metaData: []
        });

        const res = await request(app).get('/api/customer/999'); //  this ID does not exist

        expect(res.status).toBe(404);
        expect(res.body.status).toBe('unsuccess');
        expect(res.body.message).toBe('Customer with id = 999 is not found');
    });

    it('should create a new customer', async () => {
        mockConnection.execute.mockResolvedValue({
            rowsAffected: 1
        });

        const res = await request(app).post('/api/customer').send(example_customer);

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Customer created successfully');
    });

    it('should return 400 for invalid customer data', async () => {
        const invalidCustomer = { name: 'Sharat' }; // Missing email and cust_id
        const res = await request(app).post('/api/customer').send(invalidCustomer);

        expect(res.status).toBe(400); 
    });

    it('should update customer with given cust_id', async () => {
        mockConnection.execute.mockResolvedValueOnce({
            rows: [example_customer], // Simulate existing customer
            metaData: []
        });
        mockConnection.execute.mockResolvedValueOnce({
            rowsAffected: 1
        });

        const res = await request(app).put('/api/customer/1').send(example_customer);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Customer updated successfully');
    });

    it('should return 404 when updating non-existent customer', async () => {
        mockConnection.execute.mockResolvedValueOnce({
            rows: [] // Simulate customer not found
        });

        const res = await request(app).put('/api/customer/999').send(example_customer);

        expect(res.status).toBe(404);
        expect(res.body.status).toBe('unsuccess');
        expect(res.body.message).toBe('Customer with id = 999 is not found');
    });

    it('should delete a customer with given cust_id', async () => {
        mockConnection.execute.mockResolvedValueOnce({
            rows: [example_customer], // Simulate existing customer
            metaData: []
        });
        mockConnection.execute.mockResolvedValueOnce({
            rowsAffected: 1
        });

        const res = await request(app).delete('/api/customer/1');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Customer deleted successfully');
    });

    it('should return 404 when deleting non-existent customer', async () => {
        mockConnection.execute.mockResolvedValueOnce({
            rows: [] // Simulate customer not found
        });

        const res = await request(app).delete('/api/customer/999');

        expect(res.status).toBe(404);
        expect(res.body.status).toBe('unsuccess');
        expect(res.body.message).toBe('Customer with id = 999 is not found');
    });
});
