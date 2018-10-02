var mongoose=require("mongoose");

var booksSchema =new mongoose.Schema({
    coursecode: String,
    name: String,
    owner: String,
    phone: Number,
    date: {type: Date, default: Date.now}
    slot:String
})

module.exports = mongoose.model("Books",booksSchema);