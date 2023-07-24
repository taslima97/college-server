require('dotenv').config()
const express = require('express')
const app = express()
const cors =  require('cors')

const port = process.env.PORT || 5000 ;


// middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p54mfnr.mongodb.net/?retryWrites=true&w=majority`;

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

const collegeCollection = client.db('collegeDB').collection('Colleges')
const usersCollection = client.db('collegeDB').collection('users')
const reviewCollection = client.db('collegeDB').collection('review')


app.get('/Colleges', async(req, res)=>{
    const result = await collegeCollection.find().toArray();
    res.send(result)
})
app.get('/review', async(req, res)=>{
    const result = await reviewCollection.find().toArray();
    res.send(result)
})

app.get('/users/:email', async (req, res) => {
  
    const email = req.params.email;
    const query = { email: email };
    const result = await usersCollection.find(query).toArray();
    res.send(result)
  })

  app.get('/users/:id', async(req, res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)};
    const result = await usersCollection.findOne(query);
    res.send(result)
  }) 


app.get('/Colleges/:id', async(req, res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)};
  const result = await collegeCollection.findOne(query);
  res.send(result)
})

app.post('/users', async(req, res) =>{
  const users = req.body;
  console.log(users);
  const result = await usersCollection.insertOne(users);
  res.send(result)
});

app.post('/review', async(req, res) =>{
  const review = req.body;
  console.log(review);
  const result = await reviewCollection.insertOne(review);
  res.send(result)
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('college is running')
})


app.listen(port, ()=>{
    console.log(`college api is : ${port}`)
})