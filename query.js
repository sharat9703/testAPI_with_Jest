module.exports = {
    selectAll : `SELECT * FROM MFX_CUSTOMER1`,
    selectOne : `SELECT * FROM MFX_CUSTOMER1 WHERE CUST_ID = :id`,
    insert : `insert into mfx_customer1(cust_id,name,email) values(:cust_id,:name,:email)`,
    update : `update mfx_customer1 set name = :name, email = :email, cust_id = :cust_id where cust_id = :id`,
    delete : `delete from mfx_customer1 where cust_id = :id`,
}