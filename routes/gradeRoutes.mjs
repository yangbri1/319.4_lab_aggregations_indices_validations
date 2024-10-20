// imports
import express from 'express';
// import db from '../db/conn.mjs';
import gradesCTL from '../controllers/gradesController.mjs';
// import gradesController from '../controllers/gradesController.mjs';
import gradesCTL_v2 from '../controllers/aggregate_gradesController.mjs';

// use Express' router for modular routes -- separation of concerns from server.mjs
const router = express.Router();

// Routes go here
// router.get('/', (req, res) => {
//     res.send("connected");   // just to check of routes are connected to server.mjs
// });

// Get grades by ID
/* Aside: no overlaps in path URL otherwise some of them may not run or overwrite the other */
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

/* -------------------------- lab routes start below ---------------------------- */
// get number of learners w/ weighted avg > 70%
router.get('/grades/stats', gradesCTL_v2.getWeightedGrades);

export default router;

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