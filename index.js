const express = require('express');
const {readFileSync} = require('fs');
const handlebars = require('handlebars');

const app = express();
// Serve the files in /assets at the URI /assets.
app.use('/assets', express.static('assets'));

// The HTML content is produced by rendering a handlebars template.
// The template values are stored in global state for reuse.
const data = {
  service: process.env.K_SERVICE || '???',
  revision: process.env.K_REVISION || '???',
};

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://scalable_group_15:scalable_group_15@cluster0.oci0nqv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let template;

app.get('/', async (req, res) => {
  // The handlebars template is stored in global state so this will only once.
  
  const randomRecord = await run().catch(console.dir);    
  res.status(200).send(randomRecord);

  
});

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
  
      const dbName = "scalable_services";
      const collectionName = "Quotes";
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
  
      try {
        const cursor = await collection.find();
        const quoteArray = []
  
        await cursor.forEach(item => {
          quoteArray.push(item.quote)
        });
  
        // add a linebreak
        //console.log(quoteArray);
        const randomIndex = Math.floor(Math.random() * quoteArray.length);
        const randomRecord = quoteArray[randomIndex];          
        return randomRecord
      } catch (err) {
        return `Something went wrong trying to find the documents: ${err}\n`;
      }
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  } 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});