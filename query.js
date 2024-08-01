module.exports = {
    selectAll : `select * from mfx_customer1`,
    selectOne : `select * from mfx_customer1 where cust_id = :id`,
    insert : `insert into mfx_customer1(cust_id,name,email) values(:cust_id,:name,:email)`,
    update : `update mfx_customer1 set name = :name, email = :email, cust_id = :cust_id where cust_id = :id`,
    delete : `delete from mfx_customer1 where cust_id = :id`,
}