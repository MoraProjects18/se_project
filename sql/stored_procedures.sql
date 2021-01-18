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
CREATE PROCEDURE show_user_profile(
    user_id int(15)
)
BEGIN
    START TRANSACTION;
    SELECT * FROM user WHERE user_id=user_id;
END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE register_new_staff(
    user_id int(10),
	email varchar(100),
    password varchar(255),
    NIC varchar(12),
    first_name varchar(200),
    last_name varchar(200),
    role varchar(15),
    branch_id int(10)
)
BEGIN
	START TRANSACTION;
		INSERT INTO useracc(user_id,email,password,NIC,first_name,last_name,user_type) VALUES (user_id,email,password,NIC,first_name,last_name,"staff");
		INSERT INTO staff(user_id,role,branch_id) VALUES (user_id,role,branch_id);
        
        -- SELECT user_id,first_name,last_name,user_type FROM useracc WHERE user_id=LAST_INSERT_ID();
    COMMIT;
END $$
DELIMITER ;