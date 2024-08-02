const mockConnection = {
    execute: jest.fn(),
    close: jest.fn().mockResolvedValue()
};

const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    close: jest.fn().mockResolvedValue()
};

const oracledb = {
    createPool: jest.fn().mockResolvedValue(mockPool),
    getPool: jest.fn().mockReturnValue(mockPool),
    OBJECT: 0 
};

module.exports = oracledb;
