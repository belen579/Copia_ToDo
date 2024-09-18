const express= require('express')
const {taskController, getdetails, updatetask, addNewTask, deleteTaskbyId, patchtask, getinformationuser,loginuser,incompleteTasks,getTasks } = require('../controllers/tasksController');




const router = express.Router()

//definimos rutas


router.get('/tasks',getTasks);

router.get('/tasks/:id', getdetails);

router.put('/tasks/:id', updatetask)

router.post('/tasks/', addNewTask);

router.delete('/tasks/:id', deleteTaskbyId); 

router.patch('/tasks/:id', patchtask);


router.get('/user', getinformationuser);
router.post('/user/login', loginuser);





module.exports= router;