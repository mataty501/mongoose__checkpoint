const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    age : {
        type: Number,
       
    },
	
	favoriteFoods : {
		type: Array
	}
});





userSchema.plugin(uniqueValidator, { message: "user already exist." });
const User = mongoose.model("User", userSchema);
module.exports = User;