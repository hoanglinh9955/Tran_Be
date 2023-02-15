Create database Transssssa1;
go
use Transssssa1;
go
create table company(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name VARCHAR(50),
   address VARCHAR(100),
   hotline INT
);
go
create table route(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   company_id INT FOREIGN KEY REFERENCES company(id),
   depart VARCHAR(100),
   destination VARCHAR(100),
   depart_date VARCHAR(50)
);
go
create table trip(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   route_id INT FOREIGN KEY REFERENCES route(id),
   begin_time VARCHAR(50),
   end_time VARCHAR(50),
   distance int,
   price int
);
go
create table user_(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name VARCHAR(50),
   email VARCHAR(50),
   password VARCHAR(250),
   phone_number int,
   role VARCHAR(20),
   status int
);
go
create table transportation(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   trip_id INT FOREIGN KEY REFERENCES trip(id),
   type int,
   image_path VARCHAR(50),
   name VARCHAR(50)
);
go
create table ticket(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   user_id INT FOREIGN KEY REFERENCES user_(id),
   quantity INT
);
go
create table ticket_detail(
   ticket_id INT FOREIGN KEY REFERENCES ticket(id),
   order_date DATE
);
go
create table cell(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   sit_number INT
);
go
INSERT INTO company(name, address, hotline)
VALUES ('thanh buoi', 'ha noi', '123456789');
go
INSERT INTO company(name, address, hotline)
VALUES ('phuong trang', 'tpchm', '123456789');
go
INSERT INTO company(name, address, hotline)
VALUES ('khang dien', 'tpchm', '123456789');
go
INSERT INTO route(company_id, depart, destination, depart_date)
VALUES ('1', 'dalat', 'tphcm', '2-2-2022')
go
INSERT INTO route(company_id, depart, destination, depart_date)
VALUES ('2', 'tphcm', 'dalat', '1-2-2022')
go
INSERT INTO route(company_id, depart, destination, depart_date)
VALUES ('3', 'tphcm', 'nhatrang', '3-4-2023')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time)
VALUES ('1', '556','123','10:00', '11:00')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time)
VALUES ('2', '666', '333', '05:30' , '07:30')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time)
VALUES ('2', '666', '333', '05:30' , '07:30')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time)
VALUES ('3', '66', '333', '05:30' , '07:30')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('1', 'example/path', 'limo','16')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('2', 'example/path', 'limo','16')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('3', 'example/path', 'xe giuong nam','45')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('4', 'example/path', 'xe giuong nam','45')




