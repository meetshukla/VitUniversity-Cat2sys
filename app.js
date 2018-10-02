var express=require("express");
var app=express();
var bodyParser =require("body-parser");
var mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/booksys', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var booksSchema =new mongoose.Schema({
    coursecode: String,
    name: String,
    owner: String,
    phone: Number,
    date: {type: Date, default: Date.now},
    slot: String
})
var Book= mongoose.model("Book",booksSchema);

// var userSchema = new mongoose.Schema({
//     username: String,
//     password: String
// })

// var User=mongoose.model("User",userSchema);
// Book.create({
//     coursecode: "MAT2001",
//     name: "BS Grewal",
//     owner: "Meet Shukla",
//     phone: 9994632205,
//     slot: "A1"
// },function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(campground);
//     }
// })


app.get("/",function(req,res){
    res.render("landing");
})

app.get("/books",function(req,res){
    Book.find({},function(err,allbooks){
        if(err){
            console.log(err);
        }else{
           res.render("show",{books:allbooks}); 
        }
    })
})

    

app.post("/books",function(req,res){
    var coursecode=req.body.coursecode;
    var name=req.body.name;
    var owner=req.body.owner;
    var phone=req.body.phone;
    var slot=req.body.slot;
    Book.create({
    coursecode: coursecode,
    name: name,
    owner: owner,
    phone: phone,
    slot: slot
},function(err,campground){
    if(err){
        console.log(err);
    }else{
        res.redirect("/books");
    }
})
})

app.get("/books/new",function(req,res){
    res.render("newbook");
})

app.get("/login",function(req,res){
    res.send("LOGIN PAGE!");
})
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Swappy Server  started.");
})