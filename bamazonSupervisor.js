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
    supervisonMenu();
});


function supervisonMenu() {
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "exit"
        ]
      })
      .then(function(answer) {
        if(answer === undefined){
            console.log("Not a valid entry");
        }
        switch (answer.options) {
        case "View Product Sales by Department":
            viewSalesByDept();
          break;
  
        case "Create New Department":
          createNewDept();
          break;

        }
    });
}

function viewSalesByDept(){
        console.log("Selecting all sales by dept...\n");
        connection.query(`SELECT d.department_id, d.department_name, 
        d.over_head_costs, p.product_sales,
        sum(p.product_sales - d.over_head_costs) as total_profit 
        FROM products p, departments d
        where p.department_name = d.department_name
        group by d.department_id, d.department_name, d.over_head_costs, p.product_sales;`,        
        function (err, res) {
            if (err) throw err;
            displayItems(res);
            supervisonMenu();
        });
}

function displayItems(res) {
    res.map(function (element) {
        var line = element.department_id + " || " + element.department_name + " || " + element.over_head_costs + " || " + element.product_sales + " || " + element.total_profit + "\n";
        console.log(line);
    });
}