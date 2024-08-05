// __mocks__/oracledb.js
const oracledbMock = {
    createPool: jest.fn(),
    getPool: jest.fn(),
    getConnection: jest.fn(),
};

module.exports = oracledbMock;
