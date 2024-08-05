module.exports = {
  selectAll: `select * from mfx_customer1`,
  
  selectOne: `select * from mfx_customer1 where cust_id = :id`,
  
  insert: `insert into mfx_customer1(cust_id,name,email,created_by,created_on,auth_by,auth_on,deleted,auth_status) values(:cust_id,:name,:email,'Admin',sysdate,'Sharat',sysdate,'N','Y')`,

  update: `update mfx_customer1 set name = :name, email = :email, cust_id = :cust_id where cust_id = :id`,
  
  delete: `delete from mfx_customer1 where cust_id = :id`,
};
