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
    readProducts();
});

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
            // based on their answer, either call the bid or the post functions
            if (answer.product_id > 0) {
                var query = "SELECT * FROM products where ?";
                connection.query(query, { item_id: answer.product_id }, function (err, res) {

                    if (res[0].stock_quantity > answer.quantity) {
                        var newQuantity = res[0].stock_quantity - answer.quantity;
                        var totalCost = answer.quantity * res[0].price;
                        var totalProductSales = res[0].product_sales + totalCost;
                        updateProductQuantity(res[0].item_id, newQuantity, totalProductSales);
                        console.log("Purchase complete! Total cost " + totalCost);
                        readProductsByID(res[0].item_id);
                        //connection.end();
                    }
                    else {
                        console.log("Insufficient quantity!");
                    }
                });
            }
            else {
                console.log("Not a valid id!");
                connection.end();
            }
        });
}

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        displayItems(res);
        buyerPrompt();
    });
}

function readProductsByID(id) {
    console.log("Selecting product by id...\n");
    connection.query("SELECT * FROM products where ?", { item_id: id }, function (err, res) {
        if (err) throw err;
        displayItems(res);
    });
}

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

function displayItems(res) {
    res.map(function (element) {
        var line = element.item_id + " || " + element.product_name + " || " + element.department_name + " || " + element.price + " || " + element.stock_quantity + "\n";
        console.log(line);
    });
}

