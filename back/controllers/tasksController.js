





const users = [
    { id: 1, firstname: "Jordi", lastname: "Galobart", email: "test@example.com", password: "correctpassword" },



]


const Task = require("../models/task");


function createtask(req,res){
    console.log("REQ.BODY", req.body);
    Task.create({   title: 'Comprar Libro English', description: 'Oxford English C1', status: 'IN_PROGRESS', dueDate: '2024-04-01', user: 1, createdAt: '2023-09-01', modifiedAt: '2023-09-02'  })
    .then(taskDoc => console.log(`task create worked well: ${taskDoc}`))
    .catch(error =>
        
      console.log(`Creating a new task went wrong! Try again 😞 ${err}`)
    );

    return
  }


const getdetails = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = Task.find(task => task.id === taskId);

    console.log(task);

    if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user !== taskId) {
        return res.status(403).json({ msg: 'Forbidden' });
    }


    return res.status(200).json(task);
}


async function updatetask (req, res)  {
    const taskId = req.params.id;

  
    if (!taskId) {
        console.log("este es el id " + taskId);
        return res.status(400).json({ msg: "You missed parameter 'id'" });
    }

    try {
   
        const task = await Task.findById(taskId);
        console.log("Este es el nombre de la tarea " + task.title);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

      

    
        const { title,  description, dueDate } = req.body;

  
        if (!title) {
            return res.status(400).json({ msg: "You missed parameter: 'title'" });
        }

   
        if (title) task.title = title;
      
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;

        task.modifiedAt = new Date();

   
        const updatedtask = await task.save();
     

 
        return res.status(200).json({ msg: "Task updated", task: updatedtask });

    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ msg: "Error updating task", updatedtask });
    }
}
 
   


async function addNewTask(req, res) {
    const { title, description, dueDate } = req.body;

    // Verificar si los parámetros obligatorios están presentes
    if (!title) {
        return res.status(400).json({ msg: "Missing parameter: title" });
    }

    try {
        const newTask = new Task({
            title,
            description: description || "",
            status: 'NOT_STARTED',
            dueDate,
            user: req.user ? req.user.id : null,
            createdAt: new Date(),
            modifiedAt: new Date(),
        });

        // Guardar la tarea en la base de datos
        const savedTask = await newTask.save();

        // Responder con el éxito
        return res.status(201).json({ msg: "Task created", id: savedTask._id });
    } catch (error) {
        // Manejo de errores
        console.error("Error creating task:", error);
        return res.status(500).json({ msg: "Error creating task", error });
    }
}//

async function deleteTaskbyId(req, res) {
    const taskId = req.params.id;

    if (!taskId) {
        return res.status(400).json({ msg: 'You missed parameter id' });
    }

    try {
        // Buscar la tarea en la base de datos
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

       

     
        return res.status(200).json({ msg: 'Task removed successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ msg: 'Error deleting task', error });
    }
}

async function patchtask2(req, res) {
    const taskId = req.params.id;

    if (!taskId) {
        return res.status(400).json({ msg: "You missed parameter 'id'" });
    }

    try {
      
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

   
        task.status = 'NOT_STARTED';
        task.modifiedAt = new Date();

  
        await task.save();
        return res.status(200).json({ msg: "Task marked as NOT_STARTED" });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ msg: 'Error updating task', error });
    }
}

async function patchtask(req, res) {
    const taskId = req.params.id;

    if (!taskId) {
        return res.status(400).json({ msg: "You missed parameter 'id'" });
    }

    try {
      
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

     
     /*   if (task.user.toString() !== (req.user ? req.user.id : null)) {
            return res.status(403).json({ msg: "Forbidden" });
        }*/

   
        task.status = 'DONE';
        task.modifiedAt = new Date();

  
        await task.save();
        return res.status(200).json({ msg: "Task marked as completed" });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ msg: 'Error updating task', error });
    }
}

async function incompleteTasks(req, res) {
    try {
        // Obtener las tareas que no están marcadas como 'DONE'
        const tasks = await Task.find({ status: { $ne: 'DONE' } });

        // Responder con las tareas incompletas
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching incomplete tasks:', error);
        res.status(500).json({ msg: 'Error fetching incomplete tasks', error });
    }
}


async function getTasks(req, res){
    try {
        // Obtener las tareas que no están marcadas como 'DONE'
    /*   const tasks = await Task.find({ status: { $ne: 'DONE' } });*/

        const tasks = await Task.find();

        // Responder con las tareas incompletas
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching incomplete tasks:', error);
        res.status(500).json({ msg: 'Error fetching incomplete tasks', error });
    }

}

async function getinformationuser(req, res) {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            return res.status(400).json({ msg: 'User not authenticated' });
        }

        // Buscar el usuario en la base de datos
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        });
    } catch (error) {
        console.error('Error fetching user information:', error);
        return res.status(500).json({ msg: 'Error fetching user information', error });
    }
}

async function loginuser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Missing parameters: 'email' or 'password'" });
    }

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const passwordValid = (password === user.password); 

        if (!passwordValid) {
            return res.status(403).json({ msg: "Forbidden" });
        }

        // Autenticación exitosa
        return res.status(200).json({ msg: "Login successful" });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ msg: 'Error logging in', error });
    }
}

module.exports = {
   
    getdetails,
    updatetask,
    createtask,
    addNewTask,
    getTasks,
    patchtask,
    deleteTaskbyId,
    getinformationuser,
    loginuser,
    incompleteTasks,
    patchtask2

}









