const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.o8c7bsg.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    const taskCollection = client.db("tasksDB").collection("tasks");
    const completedTaskCollection = client.db("tasksDB").collection("completedTasks");
    const ongoingTaskCollection = client.db("tasksDB").collection("ongoingTasks");
    
    app.get('/tasks', async(req, res) =>{
      const { email } = req?.query;
      // console.log(email);
      const query = {user_email:email}
      const result = await taskCollection.find(query).toArray();
      res.send(result) 
    })
    app.post("/tasks",  async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result);

      });
      app.delete('/tasks/:id', async(req, res) =>{
        const {id} = req?.params;
        console.log(id);
        const query = {_id:new ObjectId(id)}
        const result = await taskCollection.deleteOne(query);
        res.send(result) 
      })

// ======================================================================
      app.get('/completedTasks', async(req, res) =>{
        const { email } = req?.query;
        // console.log(email);
        const query = {user_email:email}
        const result = await completedTaskCollection.find(query).toArray();
        res.send(result) 
      })

    app.post("/completedTasks",  async (req, res) => {
        const task = req.body;
        const result = await completedTaskCollection.insertOne(task);
        res.send(result);
      });

      app.delete('/completedTasks/:id', async(req, res) =>{
        const {id} = req?.params;
        // console.log(id);
        const query = {_id:id}
        const result = await completedTaskCollection.deleteOne(query);
        res.send(result) 
      })
      app.delete('/tasksDelete/:id', async(req, res) =>{
        const {id} = req?.params;
        console.log('fgghgh',id);
        const query = {_id:new ObjectId(id)}
        const result = await taskCollection.deleteOne(query);
        res.send(result) 
      })

      // ===========================================================================
      app.post("/ongoingTasks",  async (req, res) => {
        const task = req.body;
        const result = await ongoingTaskCollection.insertOne(task);
        res.send(result);
      });
      app.get('/ongoingTasks', async(req, res) =>{
        const { email } = req?.query;
        console.log(email);
        const query = {user_email:email}
        const result = await ongoingTaskCollection.find(query).toArray();
        res.send(result) 
      })

      app.delete('/deleteOngoing/:id', async(req, res) =>{
        const {id} = req?.params;
        console.log('fgghgh',id);
        const query = {_id:new ObjectId(id)}
        const result = await ongoingTaskCollection.deleteOne(query);
        res.send(result) 
      })

     
      
      


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("tasks management system is running");
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });

  