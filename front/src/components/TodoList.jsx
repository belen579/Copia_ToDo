
import  './tasks.css';


import React, { useState } from 'react';


const TodoList = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Preparar la clase de Nuclio Full Stack Developer",
      description: "",
      status: "IN PROGRESS",
      dueDate: "2024-06-25",
    },
    {
      id: 2,
      title: "Devolver libros a la biblioteca y recoger nuevos libros sobre ciencia ficción",
      description: "",
      status: "IN PROGRESS",
      dueDate: "2024-07-17",
    },
    {
      id: 3,
      title: "Preparar maletas y contratar el seguro para el viaje a Marte",
      description: "",
      status: "IN PROGRESS",
      dueDate: "2024-08-03",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "NOT_STARTED",
  });

  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTaskWithId = {
      ...newTask,
      id: tasks.length + 1,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({ title: "", description: "", dueDate: "", status: "NOT_STARTED" });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

 /* const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "COMPLETED" } : task
      )
    );
  };*/ // funcion sin llamar al back

  // funcion llamando al back

  const handleCompleteTask = async(id)=>{
    try{

      const respuesta = await fetch(`http://localhost:3000/tasks/${id}`,{
        method:'PATCH',
        headers:{
          'Content-type': 'application/json',
        },
        body:JSON.stringify({status:'DONE'}),
    
        
      });
      const data = await respuesta.json();
      console.log(data.msg); // Mensaje de confirmación
     // para actualizar el estado de la vista
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: "COMPLETED" } : task
        )
      );


    }catch(error){
      console.log((error));
    }
  };

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
  };

  const handleSelectTaskToEdit = (task) => {
    setTaskToEdit({ ...task });
  };


  const  handleordenedTask = () =>{
      const sortTask =[...tasks].sort((a,b)  => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(sortTask);
  };

  return (
    <div>
      <header>
        <h1>TODOLIST</h1>
      </header>

      <h2><strong>{taskToEdit ? "Editar Tarea" : "Nueva Tarea"}</strong></h2>
      <form onSubmit={taskToEdit ? handleEditTask : handleAddTask} id="task-form">
        <label htmlFor="title">Título</label>
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
        <label htmlFor="description">Escribe la descripción de la tarea</label>
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
        <label htmlFor="dueDate">Fecha Límite</label>
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
        <button type="submit">{taskToEdit ? "Guardar cambios" : "Insertar"}</button>
        
              <button onClick={() => handleordenedTask()}>Ordenar Tareas </button>
       
        {taskToEdit && <button type="button" onClick={() => setTaskToEdit(null)}>Cancelar</button>}
      </form>

      <h2>Tareas</h2>
      <div className="grid" id="task-list">
        {tasks.map((task) => (
          <div key={task.id}>
            <p>{task.title}</p>
            <p>
              <span>{task.status}</span> Fecha Límite: {task.dueDate}
            </p>
            <p>
              <button onClick={() => handleCompleteTask(task.id)}>
                Marcar como finalizada
              </button>
            </p>
            <p>
              <button onClick={() => handleSelectTaskToEdit(task)}>Editar</button>
            </p>
            <p>
              <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
            </p>
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;



    



 
  




