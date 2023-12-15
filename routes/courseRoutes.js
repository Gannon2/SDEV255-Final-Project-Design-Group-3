const express= require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/', courseController.course_index);
router.post('/', courseController.course_create_post);
router.get('/create', courseController.course_create_get);
router.post('/create', courseController.course_create_post);
router.get('/:id', courseController.course_details);
router.delete('/:id', courseController.course_delete);

// Add course to user's schedule
router.post('/add-to-schedule', courseController.addToSchedule);

// View courses for a user
router.get('/user-courses', courseController.getUserCourses);

module.exports = router;