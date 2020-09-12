const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsSchema = {
    task: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    task: "Welcome !"
})
const item2 = new Item({
    task: "+ for adding new items"
})
const item3 = new Item({
    task: "<-- hit this to delete an item"
})

const defaultItemsArray = [item1, item2, item3];


const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

let items = [];
let workItems = [];
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {


    let currentDay = date.getDay();
    Item.find(function (err, items) {

        if (items.length == 0) {
            Item.insertMany(defaultItemsArray, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default items succesfully inserted!");
                }
            })
        }

        if (err) {
            console.log(`error while finding items: ${err}`);
        } else {
            let tasks = [];
            for (x of items) {
                tasks.push(x.task);
            }
            res.render("index", {listTitle: currentDay,newListItems: tasks});
        }
    })

});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    if(customListName !== "favicon.ico"){    // don't even ask why.
        List.findOne({name:customListName},function(err,foundList){
            if(!err){
                if(!foundList){
                    const list = new List({
                        name: customListName,
                        items: defaultItemsArray
                    });
                    
                    list.save(function(err1){
                        if(!err1){
                            res.redirect("/" + customListName);
                        }
                    });
                }else{
                    let tasks = [];
                    for (x of foundList.items) {
                        tasks.push(x.task);
                    }
                    res.render("index",{listTitle: customListName,newListItems: tasks})
                }
            } 
        })
    }
        
        
        
    })


app.post("/", (req, res) => {

    const listName = req.body.button

    let item = new Item({
        task: req.body.newItem
    });
    if (listName==date.getDay()) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }

})

app.post("/delete", (req, res) => {
    let checkedTask = req.body.checkbox;
    let listName = req.body.listName[0];
    if(listName == date.getDay()){
        Item.deleteOne({task: checkedTask}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`"${checkedTask}" succesfully deleted.`);
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items:{task: checkedTask}}},function(err){
            if(!err){
                if(req.body.listName[0].length > 1){
                    res.redirect("/" + listName);
                } else{
                    res.redirect("/");
                }
            }
        })
    }

})



app.listen(3000, () => {
    console.log(`Server running on ${3000}`);
})