const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
var items = ["ice"];
var workItem = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://admin-bitescode:Smathur@96@cluster0-m3vpl.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your ToDo list!"
});

const item2 = new Item({
    name: "press + button to save your list"
});

const item3 = new Item({
    name: "you can delete your list items"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/todolist", function(req, res) {


    Item.find({}, function(err, foundItems){

     if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully saved to DB");
        }
    });

    res.redirect("/todolist");
    } else {
            res.render("list", { listTitle: "Today", newItems: foundItems });
        }
    });

    // var today = new Date();

    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // };

    // var day = today.toLocaleDateString("en-US", options);

    // res.render("list", { listTiltle: day, newItems: foundItems })
});

app.get("/:customListName", function(req, res){
    // console.log(req.params.customListName);

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                
                list.save();

                res.redirect("/todolist" + customListName);
            }else{
                //Show existing list
                
                res.render("list",  { listTitle: foundList.name, newItems: foundList.items })
            }
        }
    });


});

app.post("/todolist", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/todolist");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/todolist" + listName);
        });
    }
});




app.post("/delete", function(req, res){
   const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){

        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("Successfully deleted checked item");
     
                res.redirect("/todolist");
            }
        });
    }  else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/todolist" + listName);
            }
        });
    }
   
});


app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("server start");
});