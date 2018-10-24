var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var InviteSchema= new mongoose.Schema({
    book: String,
    person: String,
    slotreq: String,
    flag: {type: Boolean, default:'no'},
    rejectflag: {type: Boolean, default:'no'},
    
});

module.exports=mongoose.model("Invite",InviteSchema);