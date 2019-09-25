var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password1234",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId + "\n");
    optionsMenu();
});

function optionsMenu() {
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.options) {
        case "View Products for Sale":
            showInventory();
          break;
  
        case "View Low Inventory":
          showLowInventory();
          break;
  
        case "Add to Inventory":
          rangeSearch();
          break;
  
        case "Add New Product":
          songSearch();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }

function showInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products ", function (err, res) {
        if (err) throw err;
        displayItems(res);
        optionsMenu();
    });
}

function showLowInventory() {
    console.log("Selecting low inventory...\n");
    connection.query("SELECT * FROM products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        displayItems(res);
        optionsMenu();
    });
}



function displayItems(res) {
    res.map(function (element) {
        var line = element.item_id + " || " + element.product_name + " || " + element.department_name + " || " + element.price + " || " + element.stock_quantity + "\n";
        console.log(line);
    });
}