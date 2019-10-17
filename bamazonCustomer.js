var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//set up connections to the database
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

//create connections and output inventory
connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

//a prompt that shows a couple choices with an exit option
function mainMenu(){
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Buy a product",
                "exit"
            ]
        })
        .then(function(answer){
            switch (answer.options) {
                case "Buy a product":
                    buyerPrompt();
                    break;
                case "exit":
                    connection.end();
                    break;

            }
        });
}

//The prompt that grabs user input for buying a product
function buyerPrompt() {
    inquirer
        .prompt([{
            name: "product_id",
            type: "input",
            message: "What is the product id you would like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units you would like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ])
        .then(function (answer) {
            // based on their answer, if the product id exists search products table and take it out of inventory
            if (answer.product_id > 0) {

                var query = "SELECT * FROM products where ?";
                connection.query(query, { item_id: answer.product_id }, function (err, res) {
                    console.log(res);
                    if(res[0] === undefined){
                        console.log("That inventory id does not exist in the database! \n\n");
                        mainMenu();
                    }
                    else if (res[0].stock_quantity >= answer.quantity) {
                        var newQuantity = res[0].stock_quantity - answer.quantity;
                        var totalCost = answer.quantity * res[0].price;
                        var totalProductSales = res[0].product_sales + totalCost;
                        updateProductQuantity(res[0].item_id, newQuantity, totalProductSales);
                        console.log("Purchase complete! Total cost " + totalCost + "! \n\n");
                        readProductsByID(res[0].item_id);
                        connection.end();
                    }
                    else {
                        console.log("Insufficient quantity! \n\n");
                        mainMenu();
                    }
                });
            }
            else {
                console.log("Not a valid id! \n\n");
                mainMenu();
            }
        });
}

//get all products from table
function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        displayItems(res);
        mainMenu();
    });
}

//get product by a given id
function readProductsByID(id) {
    connection.query("SELECT * FROM products where ?", { item_id: id }, function (err, res) {
        if (err) throw err;
        displayItems(res);
    });
}

//update inventory by decreasing the product quantity and updating the total sales
function updateProductQuantity(id, quantity, productSales) {
    console.log("Updating product where id = " + id + "\n");

    connection.query("UPDATE products set ? where ?",
        [{
            stock_quantity: quantity,
            product_sales: productSales
        },
        {
            item_id: id
        }],
        function (err, res, ) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");

        });

}

//function that uses the table-cli module to display results in a pre defined table
function displayItems(res) {
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity', 'Product Sales']
      , colWidths: [20, 20, 20, 20, 20, 20]
    });

    res.map(function (element) {
        table.push([element.item_id, element.product_name, element.department_name,element.price, element.stock_quantity, element.product_sales] );
    });
    console.log(table.toString());
}

