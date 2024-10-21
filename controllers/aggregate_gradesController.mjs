/* callback handler functions w/ aggregate pipelines dump -- 
 Side note: "gradesController.mjs" last function is aggregate too */
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

/* every function should be asynchronous so we could use "await" as req w/ MongoDB's*/
// also follow similar standards
// 1. specify collection
// 2. specify action
// 3. return results
// 4. wrapped with try-catch error-handling  -- courtesy of Michelle 

async function getWeightedGrades(req, res){
    try {
        // 1. specify collection
        // declare local variable "collection" to save data from cluster "grades"
        let collection = await db.collection("grades");

        // 2. specify action -- aggregation pipeline is an array of objects
        // here "result" returns an array 
        let result = await collection.aggregate([
            // $project stage
            {
              '$project': {
                '_id': 0, 
                'student_id': 1, 
                'class_id': 1, 
                'avg': {
                  '$avg': '$scores.score'
                }
              }
            }, { // $match stage dependent on data from previous stage
              '$match': {
                'avg': {
                  '$gt': 70 // find each document (Note: each student has around 10 docs on db) s.t. $avg of $scores.score > 70
                }
              }
            }, { // $group stage dep on data from $match .. and so on
              '$group': {
                '_id': 'studentAbove70', 
                'studentAbove70': {
                  '$sum': 1 // acts like $count increments each document where the weighted avg > 70%
                }
              }
            }, 
          ])
            .toArray(); // .toArray() method required here since we're dealing w/ an array of objs

        // utilize MongoDB's .countDocuments() method to count total number of documents
        // .estimatedDocumentCount() method is faster but less accurate
        let number_of_documents = db.collection.countDocuments({});   // Note: no parameters -- count all documents regardless of conditions
        
        // assumption each student takes 10 clases so divide "number_of_documents" by 10 for approximate student body 
        let student_body = Math.floor(number_of_documents / 10);

        // calculate estimated number of students w/ an weighted avg about 70%
        let estimate_students_70 = result.studentAbove70 / 10;

        // ratio of students w/ a weighted avg above 70%
        let students_ratio_70 =  estimate_students_70 / student_body;

        // 3. return results in JSON string format to browser, Thunder-Client, Postman, etc.
        // enclosed contents: number of stduents w/ weighted avg > 70%, total student body, ratio of above 70% to total body
        res.json({result, student_body, students_ratio_70});

    } catch (err) {
        console.error(err);
        /* shows custom error code "500" w/ a JSON string of obj w/ "Server Error" to browser, Thunder-Client, Postman, etc. */
        res.status(500).json({msg: "Server side error"});
    }
};

// "async" function s.t "await" could be use in retrieval of data from cluster "grades" on MongoDB
async function getWeightedGradesByClass(req, res){
    // try-catch for catching any error -- although custom errors not quite added yet
    try {
        // 1. specify collection
        let collection = await db.collection("grades");

        // take input "class_id" from query from given URL path
        let query = {class_id: Number(req.params.id)};

        // 2. specify action -- aggregation pipeline conventionally is an array of objects stages
        let result = await collection.aggregate([
            // my other saved pipeline -- 2nd attempt but encounter BSONError similarly to when adding stages to aggregation pipeline on MongoDB Compass
            {
              '$project': {
                '_id': 0, 
                'student_id': 1, 
                'totalStudentBody': {
                  '$cond': {
                    'if': {
                      '$isNumber': '$student_id'
                    }, 
                    'then': {
                      '$sum': 1
                    }, 
                    'else': 0
                  }
                }, 
                'class_id': 1, 
                'avg': {
                  '$avg': '$scores.score'
                }, 
                'avgGt70': {
                  '$gt': [
                    'avg', 70
                  ]
                }, 
                'studentsAbove70': {
                  '$cond': [
                    {
                      '$gt': [
                        'avg', 70
                      ]
                    }, {
                      '$sum': 1
                    }, 0
                  ]
                }
              }
            }, {
              '$match': {
                'avg': {
                  '$gt': 70
                }
              }
            }, {
              '$count': 'studentsAbove70'
            }
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
          ]).find(query) // .find() array method (not MongoDB query I don't think ...) to find 1st instance of "query"
          // .find() returns the value from the 1st instance of "query" (class_id aka req.params :id)

          .toArray(); // .toArray() method require as we're dealing w/ an array of objects in aggregation pipeline

          /* ------------ THIS IS A COPY-PASTA OF ABOVE GET ROUTE FOR JSON FORMAT ---------- */
        
          // assumption each student takes 10 clases so divide "number_of_documents" by 10 for approximate student body 
        let student_body = Math.floor(number_of_documents / 10);

        // calculate estimated number of students w/ an weighted avg about 70%
        let estimate_students_70 = result.studentAbove70 / 10;

        // ratio of students w/ a weighted avg above 70%
        let students_ratio_70 =  estimate_students_70 / student_body;

        // 3. return results in JSON string format to browser, Thunder-Client, Postman, etc.
        res.json({result, student_body, students_ratio_70});

        // (custom errors would be here)
        // ...
    } catch (err) {
        console.error(err);
        /* output custom msg in JSON string format to browser indicating server error w/ error code 500  */
        res.json({msg: "Server side error desu"}).status(500);
    }
}

// export handler functions to "gradeRoutes.mjs" to use as callback 
export default { getWeightedGrades, getWeightedGradesByClass }