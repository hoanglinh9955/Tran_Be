Create database Transportation;
use Transportation;
create table company(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name VARCHAR(50),
   address VARCHAR(100),
   hotline INT
);

create table route(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   company_id INT FOREIGN KEY REFERENCES company(id),
   depart VARCHAR(100),
   destination VARCHAR(100)
);


create table trip(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   route_id INT FOREIGN KEY REFERENCES route(id),
   begin_time DATE,
   end_time DATE,
   distance int,
   price int
);

create table type(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name VARCHAR(50)
);

create table transportation(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   trip_id INT FOREIGN KEY REFERENCES trip(id),
   type_id INT FOREIGN KEY REFERENCES type(id),
   image_path VARCHAR(50),
   name VARCHAR(50)
);


create table cell(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   sit_number INT
);

create table ticket_detail(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   ticket_id INT FOREIGN KEY REFERENCES ticket(id),
   order_date DATE
);

create table user_(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name VARCHAR(50),
   email VARCHAR(50),
   password VARCHAR(250),
   phone_number int,
   role VARCHAR(20)
);

create table ticket(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   user_id INT FOREIGN KEY REFERENCES user_(id),
   quantity INT
);

ALTER TABLE route
ADD  depart_date DATE;







