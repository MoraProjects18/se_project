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
        
        SELECT user_id,first_name,last_name,user_type FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;
END $$
DELIMITER ;

DELIMITER $$
  CREATE PROCEDURE get_todayso()
    BEGIN
       SELECT service_order_id,NIC,first_name,last_name,vehicle_number,start_date,end_date, status
       FROM emission_test.useracc INNER JOIN emission_test.service_order 
       ON emission_test.useracc.user_id=emission_test.service_order.user_id
       WHERE DATE(start_date) = CURDATE();
    END$$
  DELIMITER ;