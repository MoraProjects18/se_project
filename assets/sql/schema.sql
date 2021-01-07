
CREATE TABLE user(user_id int(15) unsigned primary key, email varchar(100), password varchar(255), NIC varchar(12), first_name varchar(200), last_name varchar(200),user_type varchar(30));

CREATE TABLE branch(branch_id int(10) unsigned PRIMARY KEY, branch_name varchar(20), branch_address varchar(100), contact_no varchar(15));

CREATE TABLE staff(user_id int(15) unsigned PRIMARY KEY, employee_id varchar(15), role varchar(15), branch_id int(10) unsigned, FOREIGN KEY(user_id) references user(user_id), FOREIGN KEY(branch_id) references branch(branch_id));

CREATE TABLE admin(user_id int(15) unsigned PRIMARY KEY, admin_id varchar(15), FOREIGN KEY(user_id) references user(user_id));

CREATE TABLE contact_no(user_id int(15) unsigned,contact_no varchar(15),PRIMARY KEY(user_id,contact_no), FOREIGN KEY(user_id) REFERENCES user(user_id));

CREATE TABLE vehicle(registration_number varchar(10) PRIMARY KEY, user_id int(15) unsigned, engine_number varchar(20), model_number varchar(20), model varchar(20), FOREIGN KEY(user_id) REFERENCES user(user_id));

CREATE TABLE customer(user_id int(15) unsigned PRIMARY KEY, license_number char(8),FOREIGN KEY(user_id) REFERENCES user(user_id));

CREATE TABLE service_order(service_order_id varchar(10) PRIMARY KEY, user_id int(15) unsigned, vehicle_number varchar(10), start_date DateTime, end_date DateTime, status varchar(10), FOREIGN KEY(user_id) REFERENCES customer(user_id));

CREATE TABLE invoice(invoice_id int unsigned PRIMARY KEY, service_order_id varchar(10), payment_amount decimal, FOREIGN KEY(service_order_id) REFERENCES service_order(service_order_id));

CREATE TABLE ticket(ticket_id int(15) unsigned PRIMARY KEY, user_id int(15) unsigned, status varchar(10), start_time DateTime, end_time DateTime, FOREIGN KEY(user_id) REFERENCES customer(user_id));
