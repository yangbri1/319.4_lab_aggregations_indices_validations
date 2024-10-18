/* all the callback handler functions dump here */
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

// get single grade entry by :id
async function getSingleGrade(req, res){
    try {
        // 1. specify collection
        let collection = await db.collection('grades');
        // 2. specify action

        let query =  {_id: new ObjectId(req.params.id)};

        let result = await collection.findOne(query); // DN need .toArray() for .findOne()

        // return result
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server Error"});
    }
}

// Get grades by student id
async function getStudentGrades(req, res){

    try {
        let collection = await db.collection('grades');

        // need to typecast to Number
        let query = {student_id: Number(req.params.id)};
        
        let results = await collection.find(query).toArray();    // req .toArray() b/c it's a list
    
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server Error"});
    }
}   

async function getClassGrades(req, res){

    try {
        let collection = await db.collection('grades');

        // need to cast from String to Number
        let query = {class_id: Number(req.params.id)};
        
        let results = await collection.find(query).toArray();    // req .toArray() b/c it's a list
    
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server Error"});
    }
}  

// Create new grades in DB
async function createGrades(req, res){
    try {
        let collection = await db.collection('grades');
        let results = await collection.insertOne(req.body);
        res.json(results);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server Error"});
    }
}

// ALL class averages for one learner
async function studentClassesAvg(req, res){
    try {
        // 1. specify collection -- await b/c async function
        let collection = await db.collection('grades');
        // 2. specify action -- aggregation pipeline is an array of objects
        
        let results = await collection.aggregate([
            // this aggregate pipeline is from Codesandbox -- more can be made from MongoDB Compass
            {
              $match: { student_id: Number(req.params.id) },
            },
            {
              $unwind: { path: "$scores" },
            },
            {
              $group: {
                _id: "$class_id",
                quiz: {
                  $push: {
                    $cond: {
                      if: { $eq: ["$scores.type", "quiz"] },
                      then: "$scores.score",
                      else: "$$REMOVE",
                    },
                  },
                },
                exam: {
                  $push: {
                    $cond: {
                      if: { $eq: ["$scores.type", "exam"] },
                      then: "$scores.score",
                      else: "$$REMOVE",
                    },
                  },
                },
                homework: {
                  $push: {
                    $cond: {
                      if: { $eq: ["$scores.type", "homework"] },
                      then: "$scores.score",
                      else: "$$REMOVE",
                    },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                class_id: "$_id",
                avg: {
                  $sum: [
                    { $multiply: [{ $avg: "$exam" }, 0.5] },
                    { $multiply: [{ $avg: "$quiz" }, 0.3] },
                    { $multiply: [{ $avg: "$homework" }, 0.2] },
                  ],
                },
              },
            },
          ]).toArray()   // .toArray() necessary as we are working w/ a dataset
    
        // 3. return results
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server Error"});
    }
}
// export a function of many objs
export default { getSingleGrade, getClassGrades, getStudentGrades, createGrades, studentClassesAvg  };