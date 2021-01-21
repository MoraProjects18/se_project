-- Register New Customer
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
		INSERT INTO service_order(user_id,vehicle_number,start_date,status) VALUES (user_id,vehicle_number,start_date,"Open");
		INSERT INTO invoice(service_order_id,payment_amount) VALUES (LAST_INSERT_ID(),payment_amount);
        
        SELECT service_order_id,invoice_id FROM invoice WHERE invoice_id=LAST_INSERT_ID();
-- Show Staff Profile
DELIMITER $$
CREATE PROCEDURE show_staff_profile(
    id int(15)
)
BEGIN
    START TRANSACTION;
    SELECT * FROM useracc NATURAL JOIN staff WHERE user_id=user_id;
    SELECT contact_no FROM contact_no WHERE user_id=user_id;
END$$

DELIMITER ;

-- Show Customer Profile
DELIMITER $$
CREATE PROCEDURE show_customer_profile(
    id int(15)
)
BEGIN
    START TRANSACTION;
    SELECT * FROM useracc NATURAL JOIN customer WHERE user_id=id;
     SELECT contact_no FROM contact_no WHERE user_id=id;
END$$

DELIMITER ;


-- Registre New Staff
DELIMITER $$
CREATE PROCEDURE register_new_staff(
    user_id int(10),
    employee_id varchar(15),
	email varchar(100),
    password varchar(255),
    NIC varchar(12),
    first_name varchar(200),
    last_name varchar(200),
    role varchar(15),
    branch_id int(10),
    contact_no varchar(15)
)
BEGIN
	START TRANSACTION;
		INSERT INTO useracc(user_id,email,password,NIC,first_name,last_name,user_type) VALUES (user_id,email,password,NIC,first_name,last_name,"staff");
		INSERT INTO staff(user_id,employee_id,role,branch_id) VALUES (user_id,employee_id,role,branch_id);
        INSERT INTO contact_no(user_id,contact_no) VALUES (user_id,contact_no);
        -- SELECT user_id,first_name,last_name,user_type FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;
END $$
DELIMITER ;

--Update user Profile
DELIMITER $$
CREATE PROCEDURE update_user(
    id int(10),
	email varchar(100),
    first_name varchar(200),
    last_name varchar(200),
    contact_no varchar(15)
)
BEGIN
	START TRANSACTION;
		UPDATE useracc SET email=email, first_name=first_name, last_name=last_name WHERE user_id=user_id;
        UPDATE contact_no SET contact_no=contact_no WHERE user_id=user_id;
    COMMIT;
END $$
DELIMITER ;

DELIMITER $$
  CREATE PROCEDURE get_failedso( nic_val varchar(12))
    BEGIN
       SELECT service_order_id,vehicle_number,start_date,end_date, status
		FROM useracc natural inner join service_order where NIC= nic_val and status="Failed";
    END$$
  DELIMITER ;


DELIMITER $$
CREATE PROCEDURE get_user_tickets()
BEGIN
  SELECT ticket_id,user_id,status,start_time,branch_id,branch_name,start_date
     FROM emission_test_db.ticket natural join emission_test_db.branch
     WHERE user_id = 3;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE get_today_tickets()
BEGIN
  SELECT ticket_id,user_id,status,start_time,branch_id,email
     FROM emission_test_db.ticket natural join emission_test_db.useracc
     WHERE DATE(start_time) = CURDATE() ORDER BY DATETIME(start_time);
END $$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE get_timeslots(
branch_id int ,
start_date date
)

BEGIN
  SELECT start_time
     FROM emission_test_db.ticket
     WHERE branch_id = branch_id AND start_date = start_date ;
END $$
DELIMITER ;
