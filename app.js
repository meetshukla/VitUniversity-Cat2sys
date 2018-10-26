var express=require("express");
var app=express();
var bodyParser =require("body-parser");
var Book=require("./models/books")
var mongoose=require("mongoose");
var passport=require("passport")
var LocalStrategy=require("passport-local")
var User=require("./models/user")
var Invite=require("./models/invite")
var flash=require("connect-flash")


mongoose.connect('mongodb://localhost:27017/booksys', { useNewUrlParser: true });
//mongoose.connect('mongodb://meetshukla:jayambe22@ds241133.mlab.com:41133/cat2booksys', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


app.use(require("express-session")({
    secret:"Once again",
    resave: false,
    saveUninitialized: false
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.message=req.flash("message");
    next();
})




app.get("/",function(req,res){
    res.render("landing");
    
    })

app.get("/books",isLoggedIn,function(req,res){
    var user=req.user;
    Book.find({},function(err,allbooks){
        if(err){
            console.log(err);
        }else{
           res.render("show",{books:allbooks,user:user}); 
        }
    })
})

    
app.get("/bookstatus",isLoggedIn,function(req,res){
    var user=req.user;
    Invite.find({},function(err,allinvites){
        if(err){
            console.log(err);
        }else{
           res.render("status",{invites:allinvites,user:user}); 
        }
    })
})

app.post("/books",isLoggedIn,function(req,res){
    var coursecode=req.body.coursecode;
    var name=req.body.name;
    var owner=req.body.owner;
    var phone=req.body.phone;
    var username=req.user.username;
    var slot=req.body.slot.toUpperCase();
    var phoneno = /^\d{10}$/;
    var courseRegex = /[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]/g;
    var s1=["A1","A2","B1","B2","C1","C2","D1","D2","E1","E2","F1","F2","G1","G2"];
    if(phone.match(phoneno) && coursecode.match(courseRegex) && s1.indexOf(slot) > -1)
    {
        var flag=1;
    }
    var index = s1.indexOf(slot);
    if (index > -1) {
     s1.splice(index, 1);
    }
    var savl=s1;
    if(flag===1)
    {
    User.findById(req.params.id,function(err,user){
        if (err){
            console.log(err);
        }else{
            Book.create({
            coursecode: coursecode,
            name: name,
            owner: owner,
            phone: phone,
            slot: slot,
            savl: savl,
            username: username,
            },function(err,book){
                if(err){
                    console.log(err);
                }else
                {
                    var user=req.user;
                    user.books.push(book);
                    user.save();
                }
        })
        }
        
        
})
}
res.redirect("/books")
})

app.get("/user",function(req, res) {
    var user=req.user;
    console.log(user._id);
    
})

app.get("/books/new",isLoggedIn,function(req,res){
    res.render("newbook");
})

app.get("/mybooks",function(req,res){ 
    var user=req.user;
    User.findById(user._id).populate("books").exec(function(err,user1){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.render("mybooks",{user:user1})
        }
    })
})

//request page
app.get("/books/:id",isLoggedIn,function(req,res){
    Book.findById(req.params.id,function(err,book){
        if (err){
            console.log(err);
        }else{
            res.render("request",{book:book,user:req.user});
        }
    })
})

app.post("/books/:id",isLoggedIn,function(req,res){
    var person=req.user.username;
    var slotreq=req.body.slotreq;
    Book.findById(req.params.id,function(err,book){
        var pbook=book.name;
        if (err){
            console.log(err);
            res.redirect("/books")
        }else{
            Invite.create({
                book: pbook,
                person: person,
                slotreq: slotreq,
                },function(err,invite){
                    console.log(invite);
                if (err){
                    console.log(err);
                }else{
                    book.invites.push(invite);
                    book.save();
                    res.redirect("/books");
                }
            })
        }
    })
})

//view invite page
app.get("/mybooks/:id",isLoggedIn,function(req,res){
    
    Book.findById(req.params.id).populate("invites").exec(function(err,book){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.render("invites",{book:book})
        }
    })
})

//accept reject 

app.post("/accept/:id1/:id2",function(req, res) {
    Invite.findById(req.params.id2,function(err,invite){
        if (err){
            console.log(err);
        }else{
            invite.flag=true;
            invite.save();
            Book.findById(req.params.id1,function(err,book){
            if (err){
                console.log(err);
            }else{
            var savl=book.savl;
            var index = savl.indexOf(invite.slotreq);
            if (index > -1) {
            savl.splice(index, 1);
            }
            book.save()
        }
    })
            res.redirect("/books");
        }
    })
})

app.post("/reject/:id1/:id2",function(req, res) {
    Invite.findById(req.params.id2,function(err,invite){
        if (err){
            console.log(err);
        }else{
            invite.flag=false;
            invite.rejectflag=true;
            invite.save();
            Book.findById(req.params.id1,function(err,book){
            if (err){
                console.log(err);
            }else{
            var savl=book.savl;
            var index = savl.indexOf(invite.slotreq);
            if (index > -1) {
            savl.splice(index, 1);
            }
            book.save()
        }
    })
            res.redirect("https://web-dev-meetshukla.c9users.io/books");
        }
    })
})
//authorization//
app.get("/register",function(req, res) {
    res.render("register");                         
})

app.post("/register",function(req, res) {
    var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
        req.flash("message", err.message);
        return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/books");
        })
    })
});

app.get("/login",function(req, res) {
    res.render("login")
})

app.post("/login",passport.authenticate("local",
{
    successRedirect:"/books",
    failureRedirect:"/login",
}),
function(req, res) {
});

app.get("/logout",function(req, res) {
    req.logout();
    req.flash("message","Succefully Logged Out!!");
    res.redirect("/");
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("message","Please Login First!!");
    res.redirect("/login");
}




app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Swappy Server  started.");
});