-- create user 'emissioncenter'@'localhost' identified by 'password';
-- grant all on emission_test_db.* to 'emissioncenter'@'localhost';

use emission_test_db;

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
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('2', 'KJ1832', '2021-02-10 13:21:46', '2021-02-10 13:51:46', 'Paid');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('2', 'GH7895', '2021-01-25 16:31:46', '2021-01-25 16:50:46', 'Closed');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('4', 'WR6574', '2021-02-10 13:21:46', '2021-02-10 13:51:46', 'Paid');
INSERT INTO `service_order` ( `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('3', 'NR7456', '2021-02-25 10:15:00', '2021-01-20 10:45:00', 'Open');

INSERT INTO `invoice` (`service_order_id`, `payment_amount`) VALUES ('1001', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1002', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1003', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1004', '400');
INSERT INTO `invoice` ( `service_order_id`, `payment_amount`) VALUES ('1005', '400');

