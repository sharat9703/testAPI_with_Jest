const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const routes = require('../routes/routes.customers');
const config = require('../config');

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

describe('Customer API End Points', () => {
    beforeAll(async () => {
        await oracledb.createPool(config);
    });

    afterAll(async () => {
        await oracledb.getPool().close();
    });

    beforeEach(() => {
        oracledb.getPool().getConnection().execute.mockClear();
    });

    it('should get all customers', async () => {
        oracledb.getPool().getConnection().execute.mockResolvedValueOnce({
            rows: [example_customer],
            metaData: []
        });
        const res = await request(app).get('/api/customers');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toEqual([example_customer]);
    });

    it('should get a customer by cust_id', async () => {
        oracledb.getPool().getConnection().execute.mockResolvedValueOnce({
            rows: [example_customer],
            metaData: []
        });
        const res = await request(app).get('/api/customer/1');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toEqual([example_customer]);
    });

    it('should create a new customer', async () => {
        oracledb.getPool().getConnection().execute.mockResolvedValueOnce({
            rowsAffected: 1
        });
        const res = await request(app).post('/api/customer').send(example_customer);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer created successfully');
    });

    it('should update customer with given cust_id', async () => {
        oracledb.getPool().getConnection().execute.mockResolvedValueOnce({
            rowsAffected: 1
        });
        const res = await request(app).put('/api/customer/1').send(example_customer);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer updated successfully');
    });

    it('should delete a customer with given cust_id', async () => {
        oracledb.getPool().getConnection().execute.mockResolvedValueOnce({
            rowsAffected: 1
        });
        const res = await request(app).delete('/api/customer/1');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('customer deleted successfully');
    });
});
