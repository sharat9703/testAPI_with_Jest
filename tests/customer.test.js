const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const routes = require('../routes/customers.routes');
const config = require('../config');
const que = require('../query');
jest.mock('oracledb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

const example_customer = {
    cust_id: 1,
    name: 'Sharat',
    email: 'sharat@example.com'
};

const mockConnection = {
    execute: jest.fn((query, binds, options) => {
        if (query === que.selectAll) {
            // Return mock data for selectAll query
            return Promise.resolve({ rows: [example_customer] });
        } else if (query === que.selectOne) {
            // Mock behavior for selectOne query
            const id = binds[0]; // Assuming binds[0] is the customer ID
            if (id === '1') {
                return Promise.resolve({ rows: [example_customer] });
            } else {
                return Promise.resolve({ rows: [] }); // No customer found
            }
        }
        // Add more conditions as needed for other queries
        return Promise.reject(new Error('Query not found'));
    }),
    close: jest.fn().mockResolvedValue(),
};

// Mock the connection pool and getConnection method
const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    close: jest.fn().mockResolvedValue(),
};

// Setup the oracledb mocks
oracledb.createPool.mockResolvedValue(mockPool);
oracledb.getPool.mockReturnValue(mockPool);
oracledb.getConnection.mockResolvedValue(mockConnection);


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

    it('should create a new customer', async () => {
        mockConnection.execute.mockResolvedValue({
            rowsAffected: 1
        });
        const res = await request(app).post('/api/customer').send(example_customer);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer created successfully');
    });

    it('should update customer with given cust_id', async () => {
        mockConnection.execute.mockResolvedValue({
            rowsAffected: 1
        });
        const res = await request(app).put('/api/customer/1').send(example_customer);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer updated successfully');
    });

    it('should delete a customer with given cust_id', async () => {
        mockConnection.execute.mockResolvedValue({
            rowsAffected: 1
        });
        const res = await request(app).delete('/api/customer/1');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer deleted successfully');
    });
});     
