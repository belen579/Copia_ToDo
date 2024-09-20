import './tasks.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    id: 0,
    title: "",
    description: "",
    status: "NOT_STARTED",
    dueDate: "",
    user: 0,
    createdAt: "",
    modifiedAt: ""

  });

  const [taskToEdit, setTaskToEdit] = useState(null);


  const fetchTasks = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/tasks');
      if (respuesta.ok) {
        const data = await respuesta.json();
        setTasks(data.tasks);  // aqui tiene que ser data.tasks;
      } else {
        console.error('Error fetching tasks:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  // Utilizo useffect para que solo se realice una vez cuando se cargen las tareas
  useEffect(() => {
    fetchTasks();
  }, []);// El array vacío asegura que se ejecute solo cuando el componente se monta


  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };


  const handleAddTask = async(e) =>{
    e.preventDefault();

    try{

      const respuesta = await fetch(`http://localhost:3000/tasks/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(newTask),


      });

      if(respuesta.ok){
        const nuevatarea = await respuesta.json();
        setTasks((tasks)=>[...tasks, nuevatarea]);
        fetchTasks(); // para actualizar en la vista la tarea y no tener que refrescar
        setNewTask({ title: "", description: "", dueDate: "", status: "NOT_STARTED" });
      }else{
        console.error('Error adding task:', respuesta.statusText);
      }
      
    }catch(error){
      console.log(error);
    }
    
  }

  const handleDeleteTask = async(id)=>{


    try{

      const respuesta = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        }
       


      });
      const data = await respuesta.json();
      console.log(data.msg);

     
         setTasks(tasks.filter((task) => task._id !== id));
    }catch(error){
      console.log(error);
    }
  }

  const handleCompleteTask2 = async(id) =>{

    try {

      const respuesta = await fetch(`http://localhost:3000/tarea/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ status: 'NOT_STARTED' }),


      });
      const data = await respuesta.json();
      console.log(data.msg); // Mensaje de confirmación
      // para actualizar el estado de la vista
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: "NOT_STARTED" } : task
      
     
        )
        
      );
    } catch (error) {
      console.log((error));
    }
  };



  const handleCompleteTask = async (id) => {
    try {

      const respuesta = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ status: 'DONE' }),


      });
      const data = await respuesta.json();
      console.log(data.msg); // Mensaje de confirmación
      // para actualizar el estado de la vista
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: "COMPLETED" } : task
      
     
        )
        
      );


    } catch (error) {
      console.log((error));
    }
  };
/*
  const handleEditTask = (e) => {
    e.preventDefault();
    setTasks(
      tasks.map((task) =>
        task.id === taskToEdit.id
          ? { ...taskToEdit, modifiedAt: new Date().toISOString() }
          : task
      )
    );
    setTaskToEdit(null);
  };*/

  const handleSelectTaskToEdit = (task) => {
    setTaskToEdit({ ...task });  // actualizamos la vista en el formulario paso variable taskToEdit 
  };

  const handleEditTask = async (e) => {
 e.preventDefault();

  
  
    try {
      const respuesta = await fetch(`http://localhost:3000/tasks/${taskToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToEdit), // Envía los datos actualizados
      });

      console.log(taskToEdit._id);
  
      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log(data.msg);
  
        // Actualiza el estado con la tarea editada
        setTasks(
          tasks.map((task) =>
            task._id === taskToEdit._id
              ? { ...taskToEdit, modifiedAt: new Date().toISOString() }
              : task
          )
        );
  
       setTaskToEdit(null);
      } else {
        console.error('Error editing task:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };


  const handleordenedTask = () => {
    const sortTask = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setTasks(sortTask);
  };

  return (
    <div>
      <header>
        <h1> <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '5px', color: 'black' }} />TASK SCHEDULE</h1>
      </header>

      <h2><strong>{taskToEdit ? "Edit Task" : "New Task"}</strong></h2>
      <form onSubmit={taskToEdit ? handleEditTask : handleAddTask} id="task-form">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={taskToEdit ? taskToEdit.title : newTask.title}
          onChange={(e) => {
            if (taskToEdit) {
              setTaskToEdit({ ...taskToEdit, title: e.target.value });
            } else {
              handleChange(e);
            }
          }}
          required
        />
        <br />
        <label htmlFor="description">Write The task description</label>
        <textarea
          id="description"
          name="description"
          value={taskToEdit ? taskToEdit.description : newTask.description}
          onChange={(evento) => {
            if (taskToEdit) {
              setTaskToEdit({ ...taskToEdit, description: evento.target.value }); // objeto del evento  target es el elemento input value contiene el campo de entrada
            } else {
              handleChange(evento);
            }
          }}
          cols="72"
          rows="5"
        />
        <br />
        <label htmlFor="dueDate">Deadline</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={taskToEdit ? taskToEdit.dueDate : newTask.dueDate}
          onChange={(e) => {
            if (taskToEdit) {
              setTaskToEdit({ ...taskToEdit, dueDate: e.target.value });
            } else {
              handleChange(e);
            }
          }}
          required
        />
        <br />
      <button type="submit">{taskToEdit ? "Save Changes" : "Insert"}</button> 

      

        {taskToEdit && <button type="button" onClick={() => setTaskToEdit(null)}>Cancel</button>}

        <button onClick={() => handleordenedTask()}>Order Tasks </button>
      </form>

      <h2>Tasks</h2>
      <div className="grid" id="task-list">
        {(tasks === null || tasks?.length === 0) && <p>  There are not tasks</p>}

        {tasks?.map((task) => (
          <div key={task._id} style={{background:'#ad86c2'}}>
                 <p>
            <span style={{ marginRight: '10px'  }}>
              <button onClick={() => handleSelectTaskToEdit(task)}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px', color: 'black' }}/>
                </button>
                </span>
                <span>
            
              <button onClick={() => handleDeleteTask(task._id)}>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px', color: 'black' }} /></button>
            </span>
            </p>
             <p style={{ textDecoration: task.status === "COMPLETED" ||task.status ===  "DONE" ? "line-through" : "none"   , fontWeight: 'bold',fontSize: '25px'} }>
      {task.title}
    </p>
            <p>{task.description}</p>
            <p>Created {new Date(task.createdAt).toLocaleDateString()}</p>
            <p>
              <span style={{  
                color:   task.status === "COMPLETED" || task.status === "DONE" ? "green" :
                task.status === "NOT_STARTED" ? "#FF6F61" : 
                "black"}}>
          <p   >
                
                {task.status}
                </p></span> 
Deadline: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p>

          

              
              <button onClick={() => handleCompleteTask(task._id)}>
              ✓ Done
              </button>
             

              <button onClick ={() => handleCompleteTask2(task._id)}>✓ Not-Started</button>
           
            </p>
          
       

          </div>
        )

        )}
      </div>
    </div>
  );
};

export default TodoList;













