const Course = require('../models/course');
// course_index, course_details, course_create_get, course_create_post, course_delete

const course_index = (req, res) => {
    
    Course.find().sort({ createdAt: -1 })
    .then(result => {
        res.render('courses/index', { courses: result, title: 'All courses' });
    })
    .catch(err => {
        console.log(err);
    });

}

const course_details = (req, res) => {
    const id = req.params.id;
    Course.findById(id)
    .then(result => {
        res.render('courses/details', { course: result, title: 'course Details' });
    })
    .catch(err => {
        console.log(err);
    });
}

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

const course_create_get = (req, res) => {
    res.render('courses/create', { title: 'Create a new course', subjects });
}

const course_create_post = (req, res) => {
    const course = new Course(req.body);
    
    course.save()
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
}

const course_delete = (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/' });
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = {
    course_index,
    course_details,
    course_create_get,
    course_create_post,
    course_delete
}