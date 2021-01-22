drop database if exists emission_test_db;
create database emission_test_db;

use emission_test_db;


CREATE TABLE useracc(
    user_id int AUTO_INCREMENT primary key, 
    email varchar(255) UNIQUE NOT NULL,
    first_name varchar(200) NOT NULL,
    last_name varchar(200) NOT NULL,
    NIC varchar(12) NOT NULL,
    user_type varchar(30) NOT NULL,
    password varchar(255) NOT NULL);

CREATE TABLE branch(
    branch_id int AUTO_INCREMENT PRIMARY KEY  , 
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
    email_verification boolean NOT NULL,
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
