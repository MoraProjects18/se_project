-- Sechema of the database

drop database if exists emission_test_db;
create database emission_test_db;

use emission_test_db;


CREATE TABLE useracc(
    user_id int primary key AUTO_INCREMENT,
    email varchar(255) UNIQUE NOT NULL,
    first_name varchar(200) NOT NULL,
    last_name varchar(200) NOT NULL,
    NIC varchar(12) UNIQUE NOT NULL,
    user_type varchar(30) NOT NULL,
    password varchar(255) NOT NULL);

CREATE TABLE branch(
    branch_id int PRIMARY KEY AUTO_INCREMENT,
    branch_name varchar(50) NOT NULL,
    branch_address varchar(255) NOT NULL,
    contact_no varchar(15) NOT NULL);

CREATE TABLE staff(
    user_id int PRIMARY KEY,
    employee_id varchar(15) NOT NULL,
    branch_id int,
    FOREIGN KEY(user_id) references useracc(user_id),
    FOREIGN KEY(branch_id) references branch(branch_id));

CREATE TABLE adminacc(
    user_id int(15) PRIMARY KEY,
    admin_id varchar(15),
    FOREIGN KEY(user_id) references useracc(user_id));

CREATE TABLE contact_no(
    user_id int,
    contact_no varchar(15),
    PRIMARY KEY(user_id,contact_no),
    FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE vehicle(
    registration_number varchar(10) PRIMARY KEY,
    user_id int,
    engine_number varchar(20) NOT NULL,
    model_number varchar(20) NOT NULL,
    model varchar(20) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE customer(
    user_id int PRIMARY KEY,
    license_number char(8) NOT NULL,
    email_verification boolean default 0,
    FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE service_order(
    service_order_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    vehicle_number varchar(10),
    start_date DateTime NOT NULL,
    end_date DateTime,
    status varchar(10) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES customer(user_id),
    FOREIGN KEY(vehicle_number) REFERENCES vehicle(registration_number));

CREATE TABLE invoice(
    invoice_id int PRIMARY KEY AUTO_INCREMENT,
    service_order_id int,
    payment_amount decimal(10,2),
    FOREIGN KEY(service_order_id) REFERENCES service_order(service_order_id));

CREATE TABLE ticket(
    ticket_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    status varchar(10) NOT NULL,
    start_date date NOT NULL,
    start_time time NOT NULL,
    branch_id int,
    FOREIGN KEY(user_id) REFERENCES customer(user_id),
    FOREIGN KEY(branch_id) REFERENCES branch(branch_id));

alter table ticket AUTO_INCREMENT=1001;
alter table invoice AUTO_INCREMENT=1001;
alter table service_order AUTO_INCREMENT=1001;


-- Stored Procedures
drop procedure if exists register_new_customer;
drop procedure if exists get_todayso;
drop procedure if exists show_staff_profile;
drop procedure if exists initiate_so;
drop procedure if exists show_customer_profile;
drop procedure if exists register_new_staff;
drop procedure if exists update_user;
drop procedure if exists get_failedso;
drop procedure if exists get_timeslots;
drop procedure if exists get_user_tickets;
drop procedure if exists get_today_tickets;


-- Register New Customer


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
		INSERT INTO `useracc`(`email`,`password`,`NIC`,`first_name`,`last_name`,`user_type`) VALUES (email,password,NIC,first_name,last_name,"customer");
		INSERT INTO `customer`(`user_id`,`license_number`) VALUES (LAST_INSERT_ID(),license_number);
        INSERT INTO `contact_no`(`user_id`,`contact_no`) VALUES (LAST_INSERT_ID(),contact_no);

        SELECT `user_id`,`first_name`,`last_name`,`user_type`,`email` FROM `useracc` WHERE `user_id`=LAST_INSERT_ID();
    COMMIT;

END $$
DELIMITER ;

-- Show today service orders

DELIMITER $$
  CREATE PROCEDURE get_todayso()
    BEGIN
       SELECT `service_order_id`,`NIC`,`first_name`,`last_name`,`vehicle_number`,`start_date`,`end_date`, `status`
       FROM useracc INNER JOIN service_order
       ON `useracc`.user_id=`service_order`.user_id
       WHERE DATE(start_date) = CURDATE();
    END$$
DELIMITER ;

-- initiate new service order


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

DELIMITER $$
CREATE PROCEDURE show_staff_profile(
    id int
)
BEGIN
    DECLARE userType VARCHAR(10);

    SELECT user_type INTO userType FROM useracc WHERE user_id=id;

    IF userType = "admin" THEN
        SELECT * FROM useracc NATURAL JOIN adminacc WHERE user_id=id;
    ELSE
        SELECT * FROM useracc NATURAL JOIN staff WHERE user_id=id;
    END IF;
    SELECT contact_no FROM contact_no WHERE user_id=id;

END$$

DELIMITER ;

-- Show Customer Profile

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
		INSERT INTO `useracc`(`email`,`password`,`NIC`,`first_name`,`last_name`,`user_type`) VALUES (email,password,NIC,first_name,last_name,user_type);
		INSERT INTO `staff`(`user_id`,`employee_id`,`branch_id`) VALUES (LAST_INSERT_ID(),employee_id,branch_id);
        INSERT INTO `contact_no`(`user_id`,`contact_no`) VALUES (LAST_INSERT_ID(),contact_no);
    COMMIT;
END $$
DELIMITER ;

-- Update user Profile

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


DELIMITER $$
  CREATE PROCEDURE get_failedso( nic_val varchar(12))
    BEGIN
       SELECT service_order_id,vehicle_number,start_date,end_date, status
		FROM useracc natural inner join service_order where NIC= nic_val and status="Failed";
    END$$
DELIMITER ;



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
  SELECT ticket_id,user_id,status,start_time,branch_id,email,first_name
     FROM emission_test_db.ticket natural join emission_test_db.useracc
     WHERE start_date = CURDATE() AND branch_id = branch_id AND status="Open" ORDER BY start_time;

END $$
DELIMITER ;

START TRANSACTION;
    ALTER TABLE `useracc` AUTO_INCREMENT = 1;
    INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('administrator@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654000V', 'Admin', 'Super', 'admin');
    INSERT INTO `adminacc` (`user_id`, `admin_id`) VALUES ('1', '1');
    INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('1', '0770000000');
COMMIT;
