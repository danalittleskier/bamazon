DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(75) NULL,
  department_name VARCHAR(50),
  price DECIMAL(10,2) NULL DEFAULT 0,
  stock_quantity INT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

create table departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);



ALTER TABLE products
  ADD product_sales DECIMAL(10,2) NULL;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "IPhone", "Electronics", 575.00, 5), (2, "Road Bicycle", "Sports", 1000.00, 3), (3, "Saxofone", "Music", 800.00, 1);