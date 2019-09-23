DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL
  product_name VARCHAR(75) NULL,
  department_name VARCHAR(50),
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "IPhone", "Electronics", 575.00, 5), (2, "Road Bicycle", "Sports", 1000.00, 3), (3, "Saxofone", "Music", 800.00, 1);