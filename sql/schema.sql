CREATE DATABASE emission_test;
USE emission_test;

create database emission_db;

use emission_db;

CREATE TABLE useracc(user_id int(15) unsigned NOT NULL AUTO_INCREMENT primary key, email varchar(100), password varchar(255), NIC varchar(12), first_name varchar(200), last_name varchar(200),user_type varchar(30));

CREATE TABLE branch(branch_id int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY  , branch_name varchar(20), branch_address varchar(100), contact_no varchar(15));

CREATE TABLE staff(user_id int(15) unsigned PRIMARY KEY, employee_id varchar(15), role varchar(15), branch_id int(10) unsigned, FOREIGN KEY(user_id) references useracc(user_id), FOREIGN KEY(branch_id) references branch(branch_id));

CREATE TABLE adminacc(user_id int(15) unsigned PRIMARY KEY, admin_id varchar(15), FOREIGN KEY(user_id) references useracc(user_id));

CREATE TABLE contact_no(user_id int(15) unsigned,contact_no varchar(15),PRIMARY KEY(user_id,contact_no), FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE vehicle(registration_number varchar(10) PRIMARY KEY, user_id int(15) unsigned, engine_number varchar(20), model_number varchar(20), model varchar(20), FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE customer(user_id int(15) unsigned PRIMARY KEY, license_number char(8),email_verification boolean ,FOREIGN KEY(user_id) REFERENCES useracc(user_id));

CREATE TABLE service_order(service_order_id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY , user_id int(15) unsigned, vehicle_number varchar(10), start_date DateTime, end_date DateTime, status varchar(10), FOREIGN KEY(user_id) REFERENCES customer(user_id));

CREATE TABLE invoice(invoice_id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY  , service_order_id int unsigned, payment_amount decimal, FOREIGN KEY(service_order_id) REFERENCES service_order(service_order_id));

CREATE TABLE ticket(ticket_id int(15) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY , user_id int(15) unsigned, status varchar(10), start_date date, start_time time, branch_id int(10) unsigned, FOREIGN KEY(user_id) REFERENCES customer(user_id), FOREIGN KEY(branch_id) REFERENCES branch(branch_id));

alter table ticket AUTO_INCREMENT=1001;
alter table invoice AUTO_INCREMENT=1001;
alter table service_order AUTO_INCREMENT=1001;
