const oracledb = require("oracledb");
const customerSchema = require("../models/model.customer");
const config = require("../config");
const query = require("../query");
const customerControllers = {
  getCustomers: async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        query.selectAll,
        [], // No binds
        { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return the result as an object
      );
      res.status(200).json({ status: "success", data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  },
  getCustomer: async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection(config);
      const { id } = req.params;
      const result = await connection.execute(query.selectOne, [id], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      if (result.rows.length > 0) {
        res.status(200).json({ status: "success", data: result.rows[0] });
      } else {
        res
          .status(404)
          .send({ status: "unsuccess", message: "Customer with id = "+id+" is not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "unsuccess", message: err.message });
    }
  },
  createCustomer: async (req, res) => {
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let connection;
    try {
      connection = await oracledb.getConnection(config);
      const { cust_id, name, email } = req.body;
      const result = await connection.execute(
        query.insert,
        [cust_id, name, email],
        { autoCommit: true }
      );
      res
        .status(201)
        .send({ status: "success", message: "customer created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "unsuccess", message: err.message });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  },
  updateCustomer: async (req, res) => {
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let connection;
    try {
      connection = await oracledb.getConnection(config);
      const id = req.params.id;
      const { name, cust_id, email } = req.body;
      const result = await connection.execute(
        query.selectOne,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (result.rows.length == 0) {
        return res
          .status(404)
          .send({ status: "unsuccess", message: "Customer with id = "+id+" is not found" });
      } 
      await connection.execute(
        query.update,
        [name, email, cust_id, id],
        { autoCommit: true }
      );
      res
        .status(200)
        .send({ status: "success", message: "customer updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "unsuccess", message: error.message });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  },
  deleteCustomer: async (req, res) => {
    let connection;
    try {
      const {id} = req.params;
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        query.selectOne,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (result.rows.length == 0) {
        return res
          .status(404)
          .send({ status: "unsuccess", message: "Customer with id = "+id+" is not found" });
      }
      await connection.execute(query.delete, [req.params.id], {
        autoCommit: true,
      });
      res
        .status(200)
        .send({ status: "success", message: "customer deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "unsuccess", message: err.message });
    } finally {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  },
};
module.exports = customerControllers;
