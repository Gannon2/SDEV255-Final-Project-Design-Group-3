const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://SDEV255:P@ssG@0up3@sdev255.7x1o0er.mongodb.net/Course?retryWrites=true&w=majority";
mongoose.connect(dbURI)
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// course routes
const subjects = [
    "ABRK", "ACCT", "ADMF", "AGRI", "ALTF", "AMSL", "ANTH", "AOLS", "APHY", "ARAB",
    "ARTH", "ARTS", "ASTR", "AUBR", "AUTI", "AVIM", "AVIT", "BCOM", "BCOT", "BCTI",
    "BIOL", "BIOT", "BOAT", "BUSI", "BUSN", "CARD", "CATX", "CHEM", "CHIN", "CIMG",
    "CINS", "COMM", "CONT", "CPIN", "CPTR", "CRIM", "CSCI", "CSIA", "CSTC", "DBMS",
    "DENT", "DESN", "DHYG", "DMSI", "ECED", "ECON", "EDSN", "EDUC", "EECT", "EETC",
    "ENGL", "ENGR", "ENGT", "ENRG", "ENTR", "EPCS", "ESOL", "EXER", "FREN", "GENS",
    "GEOG", "GEOL", "GERM", "GLOB", "GRDN", "HIMT", "HIST", "HLHS", "HOSP", "HPER",
    "HSPS", "HUMA", "HUMS", "HVAC", "INDT", "INFM", "ITSP", "IVYC", "IVYT", "LEGS",
    "LIBA", "LOGM", "MAMO", "MATH", "MEAS", "MEDL", "MEMS", "METC", "MKTG", "MORT",
    "MPRO", "MRIT", "MRTC", "MTTC", "NANO", "NETI", "NGAS", "NRSG", "OPTI", "PAET",
    "PARA", "PARM", "PHAR", "PHIL", "PHLB", "PHOT", "PHYS", "PLAS", "POLS", "PPTC",
    "PRCM", "PROC", "PSYC", "PTAS", "QUAL", "RADT", "RDTH", "RESP", "SCIN", "SDEV",
    "SMDI", "SOCI", "SPAN", "SPED", "SURG", "SUST", "SVAD", "TMAS", "TRCK", "VIDT",
    "VISC", "WELD"
];

app.get('/courses/create', (req, res) => {
    res.render('create', { title: 'Create a new course', subjects });
});

app.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
    .then(result => {
        res.render('index', { courses: result, title: 'All courses' });
    })
    .catch(err => {
        console.log(err);
    });
});

app.post('/courses', (req, res) => {
    const course = new Course(req.body);

    course.save()
    .then(result => {
        res.redirect('/courses');
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('details', { course: result, title: 'Course Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/courses' });
    })
    .catch(err => {
        console.log(err);
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
}); 