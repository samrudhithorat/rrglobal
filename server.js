const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

let users;
let products;
let orders;

async function connectDB() {

    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db("demodb");

    users = db.collection("users");
    products = db.collection("products");
    orders = db.collection("orders");

}

connectDB();

app.post("/signup", async (req, res) => {

    try {

        await users.insertOne(req.body);

        res.json({ message: "Signup Successful" });

    } catch (err) {

        res.status(500).json({ message: "Database Error" });

    }

});

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await users.findOne({
        email: email,
        password: password
    });

    if(user){
        res.json({ message: "Login Successful" });
    }else{
        res.status(401).json({ message: "Invalid Email or Password" });
    }

});

app.post("/addProduct", async (req, res) => {

    try {

        await products.insertOne(req.body);

        res.json({ message: "Product Added Successfully" });

    } catch (err) {

        res.status(500).json({ message: "Error Adding Product" });

    }

});

app.get("/products", async (req, res) => {
    try {
        const allProducts = await products.find().toArray();
        res.json(allProducts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});


app.get("/", (req, res) => {
    res.send("Server is working");
});
 
app.delete("/products/:id", async (req, res) => {
    try {
        await products.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({ message: "Product Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const data = await orders.find().toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});
app.post("/addOrder", async (req, res) => {
    try {
        await orders.insertOne(req.body);
        res.json({ message: "Order Added Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding order" });
    }
});
app.delete("/orders/:id", async (req, res) => {
    try {
        await orders.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({ message: "Order Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting order" });
    }
});
app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});