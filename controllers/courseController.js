const Course = require('../models/Course');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Todo: Implement error handling / validation for creating & updating courses

// Pass the req.body.accountType into EJS view files. Use if tags
//  to change the view based on the value ( 0 = student, 1 = teacher )


const course_index = (req, res) => {
  Course.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('courses/index', { courses: result, title: 'All courses' });
    })
    .catch((err) => {
      console.log(err);
    });
};

const course_details = (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then((result) => {
      res.render('courses/details', {
        course: result,
        title: 'Course Details',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Collapse this section. Trust me.
const subjects = [
  "ABRK",
  "ACCT",
  "ADMF",
  "AGRI",
  "ALTF",
  "AMSL",
  "ANTH",
  "AOLS",
  "APHY",
  "ARAB",
  "ARTH",
  "ARTS",
  "ASTR",
  "AUBR",
  "AUTI",
  "AVIM",
  "AVIT",
  "BCOM",
  "BCOT",
  "BCTI",
  "BIOL",
  "BIOT",
  "BOAT",
  "BUSI",
  "BUSN",
  "CARD",
  "CATX",
  "CHEM",
  "CHIN",
  "CIMG",
  "CINS",
  "COMM",
  "CONT",
  "CPIN",
  "CPTR",
  "CRIM",
  "CSCI",
  "CSIA",
  "CSTC",
  "DBMS",
  "DENT",
  "DESN",
  "DHYG",
  "DMSI",
  "ECED",
  "ECON",
  "EDSN",
  "EDUC",
  "EECT",
  "EETC",
  "ENGL",
  "ENGR",
  "ENGT",
  "ENRG",
  "ENTR",
  "EPCS",
  "ESOL",
  "EXER",
  "FREN",
  "GENS",
  "GEOG",
  "GEOL",
  "GERM",
  "GLOB",
  "GRDN",
  "HIMT",
  "HIST",
  "HLHS",
  "HOSP",
  "HPER",
  "HSPS",
  "HUMA",
  "HUMS",
  "HVAC",
  "INDT",
  "INFM",
  "ITSP",
  "IVYC",
  "IVYT",
  "LEGS",
  "LIBA",
  "LOGM",
  "MAMO",
  "MATH",
  "MEAS",
  "MEDL",
  "MEMS",
  "METC",
  "MKTG",
  "MORT",
  "MPRO",
  "MRIT",
  "MRTC",
  "MTTC",
  "NANO",
  "NETI",
  "NGAS",
  "NRSG",
  "OPTI",
  "PAET",
  "PARA",
  "PARM",
  "PHAR",
  "PHIL",
  "PHLB",
  "PHOT",
  "PHYS",
  "PLAS",
  "POLS",
  "PPTC",
  "PRCM",
  "PROC",
  "PSYC",
  "PTAS",
  "QUAL",
  "RADT",
  "RDTH",
  "RESP",
  "SCIN",
  "SDEV",
  "SMDI",
  "SOCI",
  "SPAN",
  "SPED",
  "SURG",
  "SUST",
  "SVAD",
  "TMAS",
  "TRCK",
  "VIDT",
  "VISC",
  "WELD",
];

const course_create_get = (req, res) => {
  res.render('courses/create', { title: 'Create a new course', subjects });
};


// this does not work properly. you're welcome to attempt a fix, but i'm prolly gonna ask hamby for advice
const course_create_post = async (req, res) => {
    const course = new Course(req.body);

    course.save()
    .then((result) => {
      res.redirect('/courses');
    })
    .catch((err) => {
      console.log(err);
    })
    
}

const course_delete = (req, res) => {
  const id = req.params.id;

  Course.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/' });
    })
    .catch((err) => {
      console.log(err);
    });
};

const addToSchedule = async (req, res) => {
  const courseId = req.body.courseId; // Assuming you send courseId in the request body
  const userId = req.User; // Assuming user information is stored in req.user

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add the course to the user's courses array
    await User.findByIdAndUpdate(userId, { $addToSet: { courses: courseId } });

    res.redirect( '/mycourse' );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//I tried this one but I keep getting user not authenticated.
// const addToSchedule = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const userId = req.params.id; 

//     // Check if userId is not available
//     if (!userId) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }

//     // Add the course to the user's courses array
//     await User.findByIdAndUpdate(userId, { $addToSet: { courses: courseId } });

//     // Redirect or send a response as needed
//     res.redirect('/mycourse');
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: 'Internal server error' });
//   }
// };



module.exports = {
  course_index,
  course_details,
  course_create_get,
  course_create_post,
  course_delete,
  addToSchedule
}