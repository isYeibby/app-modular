import React, { useState, useEffect, useContext } from 'react';
import './TodoList.css';
import TodoItem from '../TodoItem/TodoItem'; // <-- Importar el hijo
import TaskHistory from '../TaskHistory/TaskHistory'; // <-- Importar el historial
import { db } from '../../firebaseConfig'; // <-- Importa nuestra config
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; // <-- Importa funciones de Firestore
import ThemeContext from '../../context/ThemeContext'; // <-- Importar el contexto de tema

const TodoList = () => {
  const { theme } = useContext(ThemeContext); // <-- Consumir el tema
  // El estado 'tasks' ahora empieza vacío; Firestore lo poblará
  const [tasks, setTasks] = useState([]);

  const [inputValue, setInputValue] = useState('');

  // --- LEER TAREAS (GET) ---
  // useEffect se ejecutará cuando el componente se monte
  useEffect(() => {
    // 1. Creamos una referencia a nuestra colección "tasks" en Firestore
    const collectionRef = collection(db, "tasks");

    // 2. Creamos una consulta (query) para ordenar las tareas por fecha
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    // 3. onSnapshot es el ¡ESCUCHADOR EN TIEMPO REAL!
    // Se dispara una vez al inicio y luego CADA VEZ que los datos cambian
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks = [];
      querySnapshot.forEach((doc) => {
        newTasks.push({ 
          ...doc.data(), 
          id: doc.id // El ID del documento es importante
        });
      });
      setTasks(newTasks); // Actualizamos nuestro estado de React
    });

    // Esta función de limpieza se ejecuta cuando el componente se "desmonta"
    // Evita fugas de memoria
    return () => unsubscribe();

  }, []); // El '[]' asegura que esto se ejecute solo una vez

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    try {
      // Añadimos el documento a Firestore; createdAt usa serverTimestamp
      await addDoc(collection(db, 'tasks'), {
        text: inputValue,
        isComplete: false,
        createdAt: serverTimestamp()
      });
      // El onSnapshot se encargará de refrescar 'tasks'
      setInputValue('');
    } catch (error) {
      console.error('Error añadiendo tarea:', error);
    }
  };

  // --- NUEVAS FUNCIONES ---

  // Función para marcar/desmarcar una tarea
  const handleToggleComplete = async (idToToggle) => {
    try {
      const task = tasks.find(t => t.id === idToToggle);
      if (!task) return;
      
      const taskRef = doc(db, 'tasks', idToToggle);
      const newCompleteState = !task.isComplete;
      
      // Si la tarea se está marcando como completada, guardar en historial
      if (newCompleteState === true) {
        await addDoc(collection(db, 'taskHistory'), {
          type: 'completed',
          taskText: task.text,
          taskId: idToToggle,
          completedAt: serverTimestamp(),
          originalCreatedAt: task.createdAt
        });
      }
      
      await updateDoc(taskRef, { 
        isComplete: newCompleteState,
        completedAt: newCompleteState ? serverTimestamp() : null
      });
      
      // onSnapshot actualizará el estado local
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (idToDelete) => {
    try {
      const task = tasks.find(t => t.id === idToDelete);
      if (!task) return;
      
      // Guardar en historial antes de eliminar
      await addDoc(collection(db, 'taskHistory'), {
        type: 'deleted',
        taskText: task.text,
        taskId: idToDelete,
        deletedAt: serverTimestamp(),
        wasCompleted: task.isComplete || false,
        originalCreatedAt: task.createdAt
      });
      
      // Ahora eliminar la tarea
      await deleteDoc(doc(db, 'tasks', idToDelete));
      // onSnapshot actualizará el estado local
    } catch (error) {
      console.error('Error eliminando tarea:', error);
    }
  };

  // --- RENDER ACTUALIZADO ---

  return (
    <div className={`todo-list-container ${theme}`}>
      <h2>Mi Lista de Tareas</h2>

      <form onSubmit={handleAddTask} className="add-task-form task-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Añade una nueva tarea..."
        />
        <button type="submit">Añadir</button>
      </form>

      <ul>
        {/* Aquí está la magia: 
          Mapeamos las tareas y por cada una, renderizamos un <TodoItem />
          pasándole los datos y las FUNCIONES como props.
        */}
        {tasks.map(task => (
          <TodoItem 
            key={task.id}
            task={task}
            onToggleComplete={() => handleToggleComplete(task.id)}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </ul>

      {/* Componente de historial */}
      <TaskHistory />
    </div>
  );
};

export default TodoList;