// imports
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import gradeRoutes from './routes/gradeRoutes.mjs';

// create an instance of express
const app = express();
dotenv.config();
let PORT = process.env.PORT || 3001;

// Aside: db.createCollection("CollectionName");    // --- creating a collection
/* Aside+: db.runCommand({
//              collMod: "CollectionName"
//              ... }); // --- updating existing validator */
// ref: https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/?msockid=0196e6e3201a6f5504d5f2d421086e50
//      https://www.slingacademy.com/article/how-to-create-validation-rules-in-mongodb-with-examples/
//      https://www.canva.com/design/DAGUBpKEFtY/JiFgr5uUZI7Ijo58Y4J8OA/edit 
// schema ("cookie cutter") for "grades" collection
const gradeSchema = {
    // using MongoDB's $jsonSchema operator
    $jsonSchema: {
        bsonType: "object",
        title: "Grades Object Validation",
        // list required fields
        required: ["class_id", "student_id"],
        // properties obj containg document fields w/ validation rules
        properties: {
          class_id: {
            // validation criteria followed by each document field ...
            // given rule s.t. "class_id" must be an int b/t 0-300 inclusively
            bsonType: "int",
            minimum: 0,
            maximum: 300,
            // output description when criteria is missed
            description: "'class_id' must be an integer b/t 0-300 inclusively"
          },
          // validation rule imposed s.t. "student_id" must be an int $gte 0
          student_id: {
            bsonType: "int",
            minimum: 0,
            description: "'student_id' must be an integer at least 0 or greater"
          }
        }
      }

};

// middlware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

// routes
app.use('/grades', gradeRoutes); // connect to gradeRoutes, attach using app.use()

// listener
app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);
});