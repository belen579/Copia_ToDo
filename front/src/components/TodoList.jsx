import './tasks.css';
import React, { useEffect, useState } from 'react';

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

     
         setTasks(tasks.filter((task) => task.id !== id));
    }catch(error){
      console.log(error);
    }
  }



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
          task.id === id ? { ...task, status: "COMPLETED" } : task
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
      const respuesta = await fetch(`http://localhost:3000/tasks/${taskToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToEdit), // Envía los datos actualizados
      });

      console.log(taskToEdit.id);
  
      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log(data.msg);
  
        // Actualiza el estado con la tarea editada
        setTasks(
          tasks.map((task) =>
            task.id === taskToEdit.id
              ? { ...taskToEdit, modifiedAt: new Date().toISOString() }
              : task
          )
        );
  
       
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

      

        {taskToEdit && <button type="button" onClick={() => setTaskToEdit(null)}>Cancelar</button>}

        <button onClick={() => handleordenedTask()}>Ordenar Tareas </button>
      </form>

      <h2>Tareas</h2>
      <div className="grid" id="task-list">
        {(tasks === null || tasks?.length === 0) && <p>  No hay tareas disponibles</p>}

        {tasks?.map((task) => (
          <div key={task.id}>
            <p>{task.title}</p>
            <p>{task.description}</p>
            <p>{task.createdAt}</p>
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
        )

        )}
      </div>
    </div>
  );
};

export default TodoList;













