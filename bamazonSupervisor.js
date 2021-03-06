var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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
    supervisorMenu();
});


function supervisorMenu() {
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
        .then(function (answer) {
            if (answer === undefined) {
                console.log("Not a valid entry");
            }
            switch (answer.options) {
                case "View Product Sales by Department":
                    viewSalesByDept();
                    break;

                case "Create New Department":
                    createNewDept();
                    break;
                case "exit":
                    connection.end();
                    break;

            }
        });
}

function viewSalesByDept() {
    console.log("Selecting all sales by dept...\n");
    connection.query(`SELECT d.department_id, d.department_name, 
        d.over_head_costs, sum(p.product_sales) as total_sales,
        sum(p.product_sales) - d.over_head_costs as total_profit
        FROM products p, departments d
        where p.department_name = d.department_name
        group by d.department_id, d.department_name, d.over_head_costs
        order by d.department_id asc;`,
        function (err, res) {
            if (err) throw err;
            displayItemsJoin(res);
            supervisorMenu();
        });
}

function createNewDept() {
    console.log("Adding a new department...\n");
    inquirer
        .prompt([
        {
            name: "deptName",
            type: "input",
            message: "What is the name of the new department?"
        },
        {
            name: "deptOverhead",
            type: "input",
            message: "What is department's overhead cost?"
        }])
        .then(function (answer) {

            var query = connection.query("INSERT INTO departments SET ?",
                {
                    department_name: answer.deptName,
                    over_head_costs: answer.deptOverhead
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " deparment inserted!\n");
                    showInventory();
                }
            );
        });
}

function showInventory() {
    console.log("Selecting all departments...\n");
    connection.query("SELECT * FROM departments ", function (err, res) {
        if (err) throw err;
        displayItems(res);
        supervisorMenu();
    });
}

function displayItems(res) {
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Costs']
      , colWidths: [20, 20, 20]
    });

    res.map(function (element) {
        table.push([element.department_id , element.department_name, element.over_head_costs] );
    });
    console.log(table.toString());
}

function displayItemsJoin(res) {
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
      , colWidths: [20, 20, 20, 20, 20]
    });

    res.map(function (element) {
        table.push([element.department_id , element.department_name, element.over_head_costs, element.total_sales,element.total_profit ] );
    });
    console.log(table.toString());
}