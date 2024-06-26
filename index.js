const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//coffeemaster
//3vM2QWHuinfktosB


// const uri = "mongodb+srv://<username>:<password>@cluster0.uo3rphs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uo3rphs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const userCollection = client.db("coffeeDB").collection("user")

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // single id
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(filter);
            res.send(result);



        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateCoffee = req.body;
            const coffee = {
                $set: {

                    name: updateCoffee.name,
                    chef: updateCoffee.chef,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo,

                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, option);
            res.send(result);
        })

        //delete

        app.delete('/coffee/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)



        })

        //user Api collection

        //sob gulo user k dekhar jonno 

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)


        })




        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })


        app.patch('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updatedDoc = {
                $set: {
                    lastLoggedAt:user. lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);

        })


        app.delete('/user/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










//routes

app.get('/', (req, res) => {
    res.send('my coffee project is running')
})

app.listen(port, (req, res) => {
    console.log(`server is running on port ${port}`)
})