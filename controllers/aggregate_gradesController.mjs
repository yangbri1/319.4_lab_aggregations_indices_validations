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
        // declare local variable "collection" to save data from cluster "grades"
        let collection = await db.collection('grades');

        // 2. specify action -- aggregation pipeline is an array of objects
        let result = await collection.aggregate([
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
          ])
            .toArray(); // .toArray() method required here since we're dealing w/ an array of objs

    } catch (err) {
        console.error(err);
        /* shows custom error code "500" w/ a JSON string of obj w/ "Server Error" to browser, Thunder-Client, Postman, etc. */
        res.status(500).json({msg: "Server side error"});
    }
}
// export handler functions to "gradeRoutes.mjs" to use as callback 
export default { getWeightedGrades, }