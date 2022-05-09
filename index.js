const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connetion to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tstmx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("refrigerator").collection("addedItems");

        // get all product api
        app.get("/manage", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });

        // add single product
        app.post("/product", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });



          // get my product api
    app.get("/my", async (req, res) => {
      const userid = req.query.uid;
      const query = { userid };
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

      // add single product
      app.post("/product", async (req, res) => {
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      });
  
      // get single product
      app.get("/view/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const sProduct = await productCollection.findOne(query);
        res.send(sProduct);
      });
  
      // Update Product
  
      app.put("/view/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            name: updatedUser.name,
            supplier: updatedUser.supplier,
            price: updatedUser.price,
            quantity: updatedUser.quantity,
            description: updatedUser.description,
            imgURL: updatedUser.imgURL,
          },
        };
        const result = await productCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });
  
      app.put("/sview/:id", async (req, res) => {
        const id = req.params.id;
        const updatedQty = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            quantity: updatedQty.quantity,
          },
        };
        const result = await productCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });
  
      // delete api
      app.delete("/view/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      });
    } finally {
    }
}

run().catch(console.dir);
app.get("/", (req, res) => {
    res.send(`App is listening`);
});

app.listen(port, () => {
    console.log(`App Listening to port: ${port}`);
});