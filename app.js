const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    item: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({item : "Do exercises"})
const item2 = new Item({item : "Take a cold bath"})
const item3 = new Item({item : "Study hard AF"})

const defaultItemsArray = [item1,item2,item3];

Item.insertMany(defaultItemsArray,function(err){
    if(err){console.log(err);} else {console.log("Default items succesfully inserted!");}
})

let items = [];
let workItems = [];
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{

    let currentDay = date.getDay();

    res.render("index",{listTitle: currentDay, newListItems:items});
});

app.get("/work", (req,res)=>{
    res.render("index",{listTitle:"Work", newListItems:workItems});
})


app.post("/",(req,res)=>{

    let item = req.body.newItem;
    if(req.body.button === 'Work'){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }


})




app.listen(3000,()=>{
    console.log(`Server running on ${3000}`);
})