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
  
  const oracledb = {
    createPool: jest.fn().mockResolvedValue(mockPool),
    getPool: jest.fn().mockReturnValue(mockPool),
    getConnection: jest.fn().mockResolvedValue(mockConnection),
  };
  
  module.exports = oracledb;
  