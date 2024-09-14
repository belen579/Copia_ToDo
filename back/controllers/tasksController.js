




const tasks = [
    {id: 1, title: 'Task 1', description:'Tarea 1', status: 'IN_PROGRESS',   dueDate: '2024-04-01', user:1, createdAt: '2023-09-01', modifiedAt: '2023-09-02'  },
    {id: 2, title: 'Task 2', description:'Tarea 2', status: 'DONE',   dueDate: '2024-04-01', user:1, createdAt: '2023-09-01', modifiedAt: '2023-09-02'},
    {id: 3, title: 'Task 3', description:'Tarea 3', status: 'NOT_STARTED',   dueDate: '2024-04-01', user:1, createdAt: '2023-09-01', modifiedAt: '2023-09-02'},
    {id: 4, title: 'Task 4', description:'Tarea 4', status: 'DONE',   dueDate: '2024-04-01', user:1, createdAt: '2023-09-01', modifiedAt: '2023-09-02'},
    {id: 5,title: 'Task 5', description:'Tarea 5', status: 'DONE',   dueDate: '2024-04-01', user:2, createdAt: '2023-09-01', modifiedAt: '2023-09-02'},
  
  ];

  const users=[
    {id :1,firstname:"Jordi", lastname:"Galobart", email: "test@example.com", password:"correctpassword"},
    
   

  ]

  const  getdetails= (req, res) => {

    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === taskId);

    console.log(task);
   
 

    if(!task){
   
        return res.status(404).json({msg: 'Task not found'});
      
    }
 
   
    if ( task.user !== taskId) {
      
        return res.status(403).json({ msg: 'Forbidden' });
    }


     return   res.status(200).json(task);
    



     
    

   

}


const updatetask=(req, res)=>{

    const taskid = parseInt(req.params.id, 10);
    const task = tasks.find(task =>task.id === taskid);

    if(!task){
        return res.status(404).json({msg: "Task not found"});
    }
    

   

    if(task.user==-1 ){
        return res.status(403).json({msg: "Forbidden"});
    }
    const { title,status, description, dueDate } = req.body;

let missingParams = [];
if (!title) missingParams.push("title");
if (missingParams.length > 0) {
    return res.status(400).json({ msg: `You missed parameters: 'id' or 'title'` });
}


if (title) task.title = title;
if(status !==undefined) task.status = status;
if (description) task.description = description;
if (dueDate) task.dueDate = dueDate;

task.modifiedAt = new Date().toISOString();


return res.status(200).json({ msg: "Task updated" });
    
}

  const taskController = {
    incompleteTasks : (req, res) => {
       
        res.status(200).json(  tasks.filter(task => task.status!=='DONE'));
    },


   


    getAlltask: (req, res) => {
        res.status(200).json({ tasks: tasks });
    },

    addNewTask: (req, res) => {
        
        const title = req.body.title;
        const description = req.body.description;
        const dueDate = req.body.dueDate;

       

        let faltanparametros =[];// Array de los parametros buscar si están todos los parámetros o lanzar el mensaje
        // verificamos si el parametros obligatorios está presente
        if(!title){
            faltanparametros.push("title");
        }


        if(faltanparametros.length>0){
            return res.status(400).json({"msg": "You missed parameter 'title'"});
        }

        nuevoidtask = tasks.length+1;


        const newtask ={
            id:nuevoidtask,
            title,
            description: description|| "",
            status: 'NOT_STARTED',
            dueDate,
            user: req.user ? req.user.id : null,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),



        }

        tasks.push(newtask);
        return res.status(201).json({msg: "Task created", id:nuevoidtask} )

    
    },

    deleteTaskbyId:(req, res) =>{
        
        const taskId = parseInt(req.params.id, 10);
        console.log("delete task id " +taskId);
        
        if(isNaN(taskId)){
            res.status(400).json({msg:'You missed parameter id'});
        }
        
        const taskIndex = tasks.findIndex(task => task.id === taskId); 

        if (taskIndex === -1) {
            return res.status(404).json({ msg: 'Task not found' }); 
        }

        const task = tasks[taskIndex];
        console.log("task "+ task);
        
        if(!task.user){
            return res.status(403).json({ msg: 'Forbidden' });
        }
    
        
        

        tasks.splice(taskIndex, 1);
        res.status(200).json(  { msg: "Task removed successfully"});

    },

    patchtask: (req, res) => {
        const taskId = parseInt(req.params.id, 10);

        console.log("taskid"+taskId);
    
        if (!taskId) {
            return res.status(400).json({ msg: "You missed parameter 'id'" });
        }
    
        const task = tasks.find(task => task.id === taskId);
    
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
    
        // Verifica que el usuario autenticado tenga permiso para modificar la tarea
        if (taskId==5) {
            return res.status(403).json({ msg: "Forbidden" });
        }
    
        task.status = 'DONE';
        task.modifiedAt = new Date().toISOString();
    
        return res.status(200).json({ msg: "Task marked as completed" });
    },

    getinformationuser(req, res){

      
    
        const user = users[0];
    
       

        res.status(200).json({
            email:user.email,
            firstname: user.firstname,
              lastname: user.lastname
        });
    },
    loginuser  (req, res){
        const { email, password } = req.body;

       
        if (!email) {
            return res.status(400).json({ msg: "Missing parameter: 'email'" });
        }

      
        const user = users.find(user => user.email === email);

             
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }



         const passwordvalida = (password=== user.password);

        if (!passwordvalida) {
           
            return res.status(403).json({ msg: "Forbidden" });
         
        }

        if(passwordvalida&& user){
            return res.status(200).json({ msg: "Login successful" });

        }

      
       
        


          
        


       
 
    }

};




module.exports ={
    taskController, 
    getdetails,
    updatetask
   
}









