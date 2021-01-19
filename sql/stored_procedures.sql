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
        
        SELECT user_id,email FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;

END $$


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
