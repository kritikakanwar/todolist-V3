require('dotenv').config();
const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const _=require('lodash');
const date=require(__dirname+"/date.js");

const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect(process.env.DB_CONNECTION);

const itemsschema=new mongoose.Schema({
name:String
});
const Item=mongoose.model('Item',itemsschema);
const item1=new Item({
name:'Welcome to your todolist!'
});
const item2=new Item({
name:'Hit + to add new item'
});
const defaultitems=[item1,item2];
const listschema={
    name:String,
    items:[itemsschema]
 }
const List=mongoose.model('List',listschema);
let day=date.getDate();
app.get("/",function(req,res){
Item.find({},function(err,result){
if(result.length==0)
{
    Item.insertMany(defaultitems,function(err){
if(err)
{
    console.log(err);
}
else
console.log("Successfully inserted data");
    });
    res.redirect("/");
}
else
{
    res.render("list",{listTitle:day,newlistitems:result});
}
});
});
app.post("/",function(req,res){
    // newitem is the input name  from list.ejs page
    const itemname=req.body.newitem;

    const listname=req.body.listbutton;

    // created new item document using itemnane passed above
    const item= new Item({
    name:itemname
    });

    if(listname==day)
    {
    // mongoose method to save data in database
    item.save();
    res.redirect("/");
    }
    else
    {
    List.findOne({name:listname},function(err,foundlist){
    // items is the listschema field
        foundlist.items.push(item);
    foundlist.save();
    res.redirect("/"+listname);
    });
    }
    });

// to delete items 
app.post("/delete",function(req,res){
const checkeditem=req.body.checkbox;
const listname=req.body.listname;
console.log(req.body.checkbox);
    if(listname==day)
    {
        Item.findByIdAndRemove(checkeditem,function(err){
        if( ! err)
        {
        console.log("Successfully deleted item from todolistDB");
        // In order to reflect changes 
        res.redirect("/");
        }
        });
    }
    else
    {
      List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkeditem}}},function(err, foundlist){
    if(! err)
    {
        res.redirect("/"+ listname);
    }
      });  
    }
    });

// Express allows us to create dynamic routes without creating new gettand post requests

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundlist){
// !err means not have any error
        if(!err)
{
    // if there is no list
if(!foundlist)
{
    // create a new list document
    // console.log("doesn't exist");
    const list=new List({
    name:customListName,
    items:defaultitems
    }) ; 
    list.save();
    // we will redirect to current route to customelistname 
    res.redirect("/"+ customListName);
}
else
{
    // show an existing list in the list.ejs file
    res.render("list",{listTitle:foundlist.name,newlistitems:foundlist.items});
    // console.log("exist");
}
}
console.log(req.params.customListName);
});
// res.render("list",{listTitle:worklist,newlistitems:worklists})
});

app.listen(process.env.PORT||3000,function (){
console.log("server started at port 3000");
});