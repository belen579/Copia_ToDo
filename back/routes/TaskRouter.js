const express= require('express')
const {taskController, getdetails, updatetask} = require('../controllers/tasksController');




const router = express.Router()

//definimos rutas

router.get('/tasks', taskController.incompleteTasks);

router.get('/tasks/:id', getdetails);

router.put('/tasks/:id', updatetask)

router.post('/tasks/', taskController.addNewTask);

router.delete('/tasks/:id', taskController.deleteTaskbyId); 

router.patch('/tasks/:id', taskController.patchtask);


router.get('/user', taskController.getinformationuser);
router.post('/user/login', taskController.loginuser);





module.exports= router;