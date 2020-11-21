const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Person = require("./models/person");

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


const db = mongoose.connection;

db.once("open", () => console.log("database connected :)"));




app.post("/signup", async (req, res, next) => {
    const { name, age, favoriteFoods } = req.body;

    try {
        const person = new Person({
            name: name,
            age: age,
            favoriteFoods: favoriteFoods
        });

        await person.save()
        res.status(200);
        res.send(person);
    }

    catch (error) {
        res.status(400);
        res.send({
            message: error.message,
        });
    }
});

app.post("/find/:name", async (req, res, next) => {

    const { name } = req.params
    //const index = Person.find(person => person.name == Name)
    const user = await Person.findOne({ name: name });
    if (user !== null) {
        res.send({
            message: 'user exists'
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});


app.post("/findFood/:food", async (req, res, next) => {

    const { food } = req.params
    //const index = Person.find(person => person.name == Name)
    const user = await Person.findOne({ favoriteFoods: food });
    if (user !== null) {
        res.send({
            message: 'food exists in ' + user.name + ' list'
        });
    }
    else {
        res.send({
            message: 'food doesn\'t exists'
        });
    }
});

app.post("/searchUser/:id", async (req, res, next) => {

    const { id } = req.params
    //const index = Person.find(person => person.name == Name)
    const user = await Person.findById(id);
    if (user !== null) {
        res.send({
            message: 'user exists, user name is ' + user.name
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});

app.post("/pushFood/:id/:food", async (req, res, next) => {
    const { id, food } = req.params
    //const index = Person.find(person => person.name == Name)
    const user = await Person.findById(id);
    user.favoriteFoods.push(food)
    user.save()
    if (user !== null) {
        res.send({
            message: user.favoriteFoods
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});


app.post("/changeAge/:id/:age", async (req, res, next) => {
    const { id, age } = req.params
    const data = await Person.findByIdAndUpdate(id, { age: age }, { new: true, useFindAndModify: true })

    data.save()

    if (data !== null) {
        res.send({
            data: data
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});

//delete element by id

app.post("/delete/:id", async (req, res, next) => {
    const { id } = req.params
    const data = await Person.findByIdAndDelete(id)

    data.save()

    if (data !== null) {
        res.send({
            message: 'user deleted'
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});




app.post("/deleteByName/:name", async (req, res, next) => {
    const { name } = req.params
    const data = await Person.deleteMany({ name: name });
    if (data !== null) {
        res.send({
            message: res.deletedCount
        });
    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});


app.post("/selectAndSort/:food", async (req, res, next) => {
    const { food } = req.params
    const user = await Person.find({ favoriteFoods: food });
    if (user !== null) {


        user.map((e) => { res.send({ name: e.name }) })


    }
    else {
        res.send({
            message: 'user doesn\'t exists'
        });
    }
});
/*

Note: This may be tricky, if in your Schema, you declared favoriteFoods as an Array, without specifying the 
type (i.e. [String]).
 In that case, favoriteFoods defaults to Mixed type, and you have to manually mark it as edited using 
 document.markModified('edited-field').
 See Mongoose documentation

Chain Search Query Helpers to Narrow Search Results
Find people who like burrito. Sort them by name, limit the results to two documents, and hide their age. Chain
 .find(), .sort(), .limit(), 
.select(), and then .exec(). Pass the done(err, data) callback to exec().
*/

app.use((err, req, res, next) => {
    res.send({
        message: err.message
    })
});

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`);
}); 