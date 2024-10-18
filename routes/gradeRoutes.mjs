// imports
import express from 'express';
// import db from '../db/conn.mjs';
import gradesCTL from '../controllers/gradesController.mjs';
// import gradesController from '../controllers/gradesController.mjs';

const router = express.Router();

// Routes go here
// router.get('/', (req, res) => {
//     res.send("connected");   // just to check of routes are connected to server.mjs
// });

// Get grades by ID
// why .route() here & not concatenate routes below? 2 get?
router.route('/:id').get(gradesCTL.getSingleGrade);

// Get student by studentID -- different endpoints /student/ in PATH otherwise will overwrite
router.get('/student/:id', gradesCTL.getStudentGrades);

// GET class by classID
router.get('/class/:id', gradesCTL.getClassGrades);

// Add new grade to DB
router.post('/', gradesCTL.createGrades);

// get weighted average for learner across all classes
router.get('/learner/:id/avg', gradesCTL.studentClassesAvg);

export default router;

// // Imports
// import express from 'express';
// import gradesCTL from '../controllers/gradesController.mjs';
// const router = express.Router();
// // Get grades by ID
// router.route('/:id').get(gradesCTL.getSingleGrade);
// // Get student grades by studentid
// router.get('/student/:id', gradesCTL.getStudentGrades)
// // Get Class grades by classID
// router.get('/class/:id', gradesCTL.getClassGrades)
// export default router;

// {
//     "student_id": 13,
//     "scores": [
//       {
//         "type": "exam",
//         "score": 100
//       },
//       {
//         "type": "quiz",
//         "score": 100
//       },
//       {
//         "type": "homework",
//         "score": 100
//       },
//       {
//         "type": "homework",
//         "score": 100
//       }
//     ],
//     "class_id": 339
// }