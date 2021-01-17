DELIMITER $$
CREATE PROCEDURE register_new_customer(
	email varchar(100),
    password varchar(255),
    NIC varchar(12),
    first_name varchar(200),
    last_name varchar(200),
    license_number char(8)
)
BEGIN
	START TRANSACTION;
		INSERT INTO useracc(email,password,NIC,first_name,last_name,user_type) VALUES (email,password,NIC,first_name,last_name,"customer");
		INSERT INTO customer(user_id,license_number) VALUES (LAST_INSERT_ID(),license_number);
        
        SELECT user_id,email FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;

END $$


DELIMITER $$
CREATE PROCEDURE get_user_tickets()
BEGIN
  SELECT ticket_id,user_id,status,start_time,branch_id
     FROM emission_test_db.ticket
     WHERE DATE(user_id) = 3;
END $$
DELIMITER ;

