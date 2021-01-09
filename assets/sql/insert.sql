INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'charuka@gmail.com', 'password', '972654872V', 'charuka', 'rathnayaka', 'Customer');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'pasindu@gmail.com', 'password', '972654889V', 'pasindu', 'abeysinghe', 'Customer');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'roshini@gmail.com', 'password', '972654811V', 'roshini', 'jayasundara', 'Customer');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'hithru@gmail.com', 'password', '972654844V', 'Hithru', 'Alwis', 'Customer');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'admin1@gmail.com', 'password', '972654172V', 'admin1', '1admin', 'Admin');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'cashier1@gmail.com', 'password', '972654666V', 'cashier1', '1cashier', 'Staff');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'receptionist1@gmail.com', 'password', '97265455V', 'receptionist1', '1receptionist', 'Staff');
INSERT INTO `useracc` (`user_id`, `email`, `password`, `NIC`, `first_name`, `last_name`, `user_type`) VALUES (NULL, 'reportissuer1@gmail.com', 'password', '97265455V', 'reportissuer1', '1reportissuert', 'Staff');

INSERT INTO `customer` (`user_id`, `license_number`) VALUES ('1', '1234568');
INSERT INTO `customer` (`user_id`, `license_number`) VALUES ('2', '1238888');
INSERT INTO `customer` (`user_id`, `license_number`) VALUES ('3', '1234569');
INSERT INTO `customer` (`user_id`, `license_number`) VALUES ('4', '1234567');

INSERT INTO `staff` (`user_id`, `employee_id`, `role`, `branch_id`) VALUES ('6', '1', 'Cashier', '1');
INSERT INTO `staff` (`user_id`, `employee_id`, `role`, `branch_id`) VALUES ('7', '2', 'Receptionist', '1');
INSERT INTO `staff` (`user_id`, `employee_id`, `role`, `branch_id`) VALUES ('8', '3', 'Report Issuer', '1');

INSERT INTO `admin` (`user_id`, `admin_id`) VALUES ('5', '1');

INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Athurugiriya', '175/3C,Malambe Road,Pore,Athurugiriya', '0773920271');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Avissawella', 'No.140.Ukwatta,Avissawella. ', '0772998385');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Bellanthota', '88, Attidiya Road,Nikape,Dehiwala. ', '0772356301');
INSERT INTO `branch` (`branch_name`, `branch_address`, `contact_no`) VALUES ('Borella', '141/2,N.M.Perera MwCaota Road, Colombo 08.  ', '0773897776');


INSERT INTO `ticket` (`ticket_id`, `user_id`, `status`, `start_time`, `end_time`) VALUES (NULL, '1', 'open', '2021-01-09 17:11:03', '2021-01-09 17:18:03');



INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('1', '0772343123');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('2', '0772345671');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('3', '0774597234');
INSERT INTO `contact_no` (`user_id`, `contact_no`) VALUES ('4', '0774567123');

INSERT INTO `vehicle` (`registration_number`, `user_id`, `engine_number`, `model_number`, `model`) VALUES ('KJ1832', '1', 'MJ58235', 'VX120', 'Car');


INSERT INTO `service_order` (`service_order_id`, `user_id`, `vehicle_number`, `start_date`, `end_date`, `status`) VALUES ('10', '1', 'KJ1832', '2021-01-20 17:31:46', '2021-01-20 17:50:46', 'Open');


INSERT INTO `invoice` (`invoice_id`, `service_order_id`, `payment_amount`) VALUES ('1001', '10', '400');