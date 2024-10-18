// MongoClient is not camelcase b/c it's labeled as so in MongoDB
import { MongoClient } from "mongodb"; 
import dotenv from 'dotenv';

// set up dotenv configuration
dotenv.config();

// create connection string
let connectionString = process.env.atlasURI || '';

// create client
const client = new MongoClient(connectionString);


// Variable to hold connection info 
// need to be declared outside otw "let db" won't know where is "conn"
let conn;

try {
    // try to connect to client -- if so initialize to "conn" variable above
    conn = await client.connect();
    console.log(`MongoDB is connected`);
} catch (err) {
    console.error(err);
}

// receive data from the cluster "sample_training" collections and assign it to db
let db = conn.db("sample_training");

export default db;