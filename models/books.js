var mongoose=require("mongoose");

var booksSchema =new mongoose.Schema({
    coursecode: String,
    name: String,
    owner: String,
    username: String,
    phone: Number,
    date: {type: Date, default: Date.now},
    slot:String,
    savl: {type: [String], default:["A1","A2","B1","B2","C1","C2","D1","D2","E1","E2","F1","F2","G1","G2"]},
    invites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Invite"
        }
        ]
    
})

module.exports = mongoose.model("Book",booksSchema);