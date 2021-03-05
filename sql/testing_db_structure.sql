-- Sechema of the database

drop database if exists emission_test_db_testing;
create database emission_test_db_testing;

use emission_test_db_testing;


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
use emission_test_db;
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

-- Insert Queries

DELETE FROM `ticket`;
DELETE FROM `invoice`;
DELETE FROM `service_order`;
DELETE FROM `customer`;
DELETE FROM `staff`;
DELETE FROM `vehicle`;
DELETE FROM `branch`;

ALTER TABLE `branch` AUTO_INCREMENT = 1;
ALTER TABLE `ticket` AUTO_INCREMENT=1001;
ALTER TABLE `invoice` AUTO_INCREMENT=1001;
ALTER TABLE `service_order` AUTO_INCREMENT=1001;

INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('charuka@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654872V', 'Charuka', 'Rathnayaka', 'customer');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('pasindu@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654889V', 'Pasindu', 'Abeysinghe', 'customer');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('roshini@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654811V', 'Roshini', 'Jayasundara', 'customer');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('hithru@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654844V', 'Hithru', 'Alwis', 'customer');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('admin1@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654172V', 'admin1', '1admin', 'admin');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('cashier1@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654666V', 'cashier1', '1cashier', 'cashier');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('receptionist1@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654355V', 'receptionist1', '1receptionist', 'receptionist');
INSERT INTO `useracc` (`email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES ('reportissuer1@gmail.com', '$2b$10$zrlbiOTdiRh/wx0Gnu4naOtau5KsZeq4dxKfxbXm6fC8vmh0Xm1Be', '972654155V', 'reportissuer1', '1reportissuert', 'reportissuer');

INSERT INTO `customer` (`user_id`, `license_number`,`email_verification`) VALUES ('2', '1234568','1');
INSERT INTO `customer` (`user_id`, `license_number`,`email_verification`) VALUES ('3', '1238888','1');
INSERT INTO `customer` (`user_id`, `license_number`,`email_verification`) VALUES ('4', '1234569','1');
INSERT INTO `customer` (`user_id`, `license_number`,`email_verification`) VALUES ('5', '1234567','1');

INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Athurugiriya', '175/3C,Malambe Road,Pore,Athurugiriya', '0773920271');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Avissawella', 'No.140.Ukwatta,Avissawella. ', '0772998385');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Bellanthota', '88, Attidiya Road,Nikape,Dehiwala. ', '0772356301');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Borella', '141/2,N.M.Perera MwCaota Road, Colombo 08.  ', '0773897776');



INSERT INTO `adminacc` (`user_id`, `admin_id`) VALUES ('6', '2');

INSERT INTO `staff` (`user_id`, `employee_id`,  `branch_id`) VALUES ('7', '101', '1');
INSERT INTO `staff` (`user_id`, `employee_id`, `branch_id`) VALUES ('8', '102','1');
INSERT INTO `staff` (`user_id`, `employee_id`, `branch_id`) VALUES ('9', '103','1');




INSERT INTO `ticket` (`ticket_id`, `user_id`, `status`, `start_date`, `start_time`, `branch_id`) VALUES ('1', '2', 'closed', '2021-02-20', '17:00', '1');
INSERT INTO `ticket` (`ticket_id`, `user_id`, `status`, `start_date`, `start_time`, `branch_id`) VALUES ('2', '3', 'Open', '2021-02-22', '14:00', '3');
INSERT INTO `ticket` (`ticket_id`, `user_id`, `status`, `start_date`, `start_time`, `branch_id`) VALUES ('3', '4', 'closed', '2021-02-23', '17:00', '4');

INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('2', '0772343123');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('3', '0772345671');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('4', '0774597234');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('5', '0774567123');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('6', '0772343123');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('7', '0772345671');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('8', '0774597234');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('9', '0774567123');

INSERT INTO `vehicle` (`registration_number`, `user_id`, `engine_number`, `model_number`, `model`) VALUES ('KJ1832', '2', 'WGHF1234N13245U', 'VX120', 'Car');
INSERT INTO `vehicle` (`registration_number`, `user_id`, `engine_number`, `model_number`, `model`) VALUES ('GH7895', '3', 'LGFF132N13245U', 'CS345', 'MotorCycle');
INSERT INTO `vehicle` (`registration_number`, `user_id`, `engine_number`, `model_number`, `model`) VALUES ('WR6574', '4', 'XGDF134N12345W', 'GZ456', 'Car');
INSERT INTO `vehicle` (`registration_number`, `user_id`, `engine_number`, `model_number`, `model`) VALUES ('NR7456', '3', 'DGBF1324U12345B', 'TR789', 'Car');


INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ( '3', 'KJ1832', '2021-01-20 17:31:46', '2021-01-20 17:50:46', 'Open');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ( '3', 'KJ1832', '2021-01-20 17:31:46', '2021-01-20 17:50:46', 'Open');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('2', 'KJ1832', '2021-02-10 13:21:46', '2021-02-10 13:51:46', 'Paid');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('2', 'GH7895', '2021-01-25 16:31:46', '2021-01-25 16:50:46', 'Closed');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('4', 'WR6574', '2021-02-10 13:21:46', '2021-02-10 13:51:46', 'Paid');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('3', 'NR7456', '2021-02-25 10:15:00', '2021-01-20 10:45:00', 'Open');

INSERT INTO `invoice` (`service_order_id`, `payment_amount`) VALUES ('1001', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1002', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1003', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1004', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1005', '400');

