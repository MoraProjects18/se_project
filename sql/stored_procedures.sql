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


DELIMITER $$
CREATE PROCEDURE initiate_so(
	user_id int,
    vehicle_number varchar(10),
    start_date datetime,
    payment_amount decimal(10,5)
)
BEGIN
	START TRANSACTION;
		INSERT INTO service_order(user_id,vehicle_number,start_date,status) VALUES (user_id,vehicle_number,start_date,"open");
		INSERT INTO invoice(service_order_id,payment_amount) VALUES (LAST_INSERT_ID(),payment_amount);
        
        SELECT service_order_id,invoice_id FROM invoice WHERE invoice_id=LAST_INSERT_ID();
    COMMIT;
END $$
DELIMITER ;

DELIMITER $$
  CREATE PROCEDURE get_failedso( NIC varchar(12))
    BEGIN
       SELECT service_order_id,vehicle_number,start_date,end_date, status
		FROM useracc natural inner join service_order where NIC= NIC and status="failed";
    END$$
  DELIMITER ;