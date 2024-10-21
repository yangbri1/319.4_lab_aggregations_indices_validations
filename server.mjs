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
// Note: below was how a schema was shown to be created from 319.4 CodeSandBox
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
            /* pattern: ^(?:[1-9]?[0-9]|[12][0-9][0-9]|300)$ , // -- this regular expression is equivalent to bounds established above */
            // output description when criteria is missed
            description: "'class_id' must be an integer b/t 0-300 inclusively"
          },
          // validation rule imposed s.t. "student_id" must be an int $gte 0
          student_id: {
            bsonType: "int",
            minimum: 0,
            /* pattern: ^[0-9]+$ , // -- regex that only accepts numbers [0, INF) */
            description: "'student_id' must be an integer at least 0 or greater"
          }
        }
      },
      // validationLevel: "strict",    /* "strict" settings requires documents to have "class_id" & "student_id" fields that strictly follows respective validation rules
                                       // other options: "off" or "moderate" for schema validation level */
      validationAction: "warn"         /* change schema validation action to "warn" from default "error"
                                        "error" - if documents violate validation rules, MongoDB rejects any insert or update */
};

// below format used to create collection "grades" w/ given validation rules & schema validation action in MongoDB Compass
// db.createCollection("grades",{
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         title: "Grades Object Validation",
//         // list required fields
//         required: ["class_id", "student_id", "name"],
//         properties: {
//           class_id: {
//             bsonType: "int",
//             minimum: 0,
//             maximum: 300,
//             description: "'class_id' must be an integer b/t 0-300 inclusive"
//           },
//           student_id: {
//             bsonType: "int",
//             minimum: 0,
//             description: "'student_id' must be an integer at least 0 or greater"
//           }
//         }
        
//       }
//     },
//     validationAction: "warn"
// });


/* create index using Node driver (.createIndex method) */
/* create a **single-field** index on "class_id"  */
// produce a single key ascending index for "class_id" on gradeSchema
gradeSchema.createIndex({ class_id : 1 });      // format in notes

/* create a **single-field** index on "student_id" */
// produce a single key descending index for "student_id" on gradeSchema
gradeSchema.createIndex({ student: -1 });       // format in notes

// alternative formats of above -- create **single-field** indices for "class_id" & "student_id"
/* under the assumption there's a collection "gradeSchema" w/ documents featuring 
"class_id" fields we frequently query s.t. we can index it in **ascending** order */
// db.gradeSchema.createIndex({ class_id: 1 }); // index in ascending order
// db.gradeSchema.createIndex({ student: -1});  // index in descending order

// middlware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

// routes
app.use('/grades', gradeRoutes); // connect to gradeRoutes, attach using app.use()

// listener
app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);
});