-- Register New Customer
use emission_test_db;
drop procedure if exists register_new_customer;

DELIMITER $$
CREATE PROCEDURE register_new_customer(
	email varchar(100),
    password varchar(255),
    NIC varchar(12),
    first_name varchar(200),
    last_name varchar(200),
    license_number char(8),
    contact_no varchar(15)
)
BEGIN
	START TRANSACTION;
		INSERT INTO useracc(email,password,NIC,first_name,last_name,user_type) VALUES (email,password,NIC,first_name,last_name,"customer");
		INSERT INTO customer(user_id,license_number) VALUES (LAST_INSERT_ID(),license_number);
        INSERT INTO contact_no(user_id,contact_no) VALUES (LAST_INSERT_ID(),contact_no);
        
        SELECT user_id,first_name,last_name,user_type FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;

END $$
DELIMITER ;

-- Show today service orders
drop procedure if exists get_todayso;

DELIMITER $$
  CREATE PROCEDURE get_todayso()
    BEGIN
       SELECT service_order_id,NIC,first_name,last_name,vehicle_number,start_date,end_date, status
       FROM useracc INNER JOIN service_order 
       ON useracc.user_id=service_order.user_id
       WHERE DATE(start_date) = CURDATE();
    END$$
DELIMITER ;

-- initiate new service order
drop procedure if exists initiate_so;

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
    COMMIT ;
END $$
DELIMITER ;

-- Show Staff Profile
drop procedure if exists show_staff_profile;

DELIMITER $$
CREATE PROCEDURE show_staff_profile(
    id int
)
BEGIN
    START TRANSACTION;
    SELECT * FROM useracc NATURAL JOIN staff WHERE user_id=id;
    SELECT contact_no FROM contact_no WHERE user_id=id;
END$$

DELIMITER ;

-- Show Customer Profile
drop procedure if exists show_customer_profile;

DELIMITER $$
CREATE PROCEDURE show_customer_profile(
    id int
)
BEGIN
    START TRANSACTION;
    SELECT * FROM useracc NATURAL JOIN customer WHERE user_id=id;
    SELECT contact_no FROM contact_no WHERE user_id=id;
END$$

DELIMITER ;


-- Registre New Staff
drop procedure if exists register_new_staff;

DELIMITER $$
CREATE PROCEDURE register_new_staff(
    employee_id varchar(15),
	email varchar(255),
    password varchar(255),
    NIC varchar(12),
    first_name varchar(200),
    last_name varchar(200),
    user_type varchar(15),
    branch_id int,
    contact_no varchar(15)
)
BEGIN
	START TRANSACTION;
		INSERT INTO useracc(email,password,NIC,first_name,last_name,user_type) VALUES (user_id,email,password,NIC,first_name,last_name,user_type);
		INSERT INTO staff(user_id,employee_id,role,branch_id) VALUES (LAST_INSERT_ID(),employee_id,branch_id);
        INSERT INTO contact_no(user_id,contact_no) VALUES (LAST_INSERT_ID(),contact_no);
    COMMIT;
END $$
DELIMITER ;

-- Update user Profile
drop procedure if exists update_user;

DELIMITER $$
CREATE PROCEDURE update_user(
    id int,
    first_name varchar(200),
    last_name varchar(200),
    contact_no varchar(15)
)
BEGIN
	START TRANSACTION;
		UPDATE useracc SET first_name=first_name, last_name=last_name WHERE user_id=id;
        UPDATE contact_no SET contact_no=contact_no WHERE user_id=id;
    COMMIT;
END $$
DELIMITER ;

-- get failed service orders
drop procedure if exists get_failedso;

DELIMITER $$
  CREATE PROCEDURE get_failedso( nic_val varchar(12))
    BEGIN
       SELECT service_order_id,vehicle_number,start_date,end_date, status
		FROM useracc natural inner join service_order where NIC= nic_val and status="Failed";
    END$$
  DELIMITER ;

drop procedure if exists get_user_tickets;

DELIMITER $$
CREATE PROCEDURE get_user_tickets(
user_id int
)
BEGIN
  SELECT ticket_id,user_id,status,start_time,branch_id,branch_name,start_date
     FROM emission_test_db.ticket natural join emission_test_db.branch
     WHERE user_id = user_id AND status = "Open" ORDER BY start_date;

END $$
DELIMITER ;

-- drop procedure if exists get_today_tickets;

-- DELIMITER $$
-- CREATE PROCEDURE get_today_tickets(
--     branch_id int
-- )
-- BEGIN
--   SELECT ticket_id,user_id,status,start_time,branch_id,email
--      FROM emission_test_db.ticket natural join emission_test_db.useracc
--      WHERE start_date = CURDATE() ORDER BY start_time;
    

-- END $$
-- DELIMITER ;


drop procedure if exists get_timeslots;

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


DELIMITER $$
CREATE PROCEDURE get_today_tickets(
    branch_id int
)
BEGIN
  SELECT ticket_id,user_id,status,start_time,branch_id,email
     FROM emission_test_db.ticket natural join emission_test_db.useracc
     WHERE DATE(start_date) = CURDATE() AND branch_id = branch_id ORDER BY start_time;

END $$
DELIMITER ;