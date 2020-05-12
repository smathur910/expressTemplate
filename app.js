const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ["ice"];
var workItem = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", function(req, res) {

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    res.render("list", { listTiltle: day, newItems: items })
});

app.post("/", function(req, res) {
    let item = req.body.newItem;

    if (req.body.list === "work") {
        workItem.push(item);
        res.redirect("/work");
    } else {
        items.push(item);

        res.redirect("/");
    }

});


app.get("/work", function(req, res) {
    res.render("list", { listTiltle: "work List", newItems: workItem })
});


app.post("/work", function(req, res) {

    let item = req.body.newItem;

    workItem.push(item);

    res.redirect("/work");
});


app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("server start");
});