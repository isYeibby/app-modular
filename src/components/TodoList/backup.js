import React,{useState, useContext} from "react";
import './TodoList.css';
import '/TodoItem/TodoItem.js';
import '/TodoItem/TodoItem.css';
import { Trash2, Check } from 'lucide-react'; // Importar iconos de react-icons
import ThemeContext from '../../context/ThemeContext'; // Importar el contexto de tema
import { db } from '../../firebaseConfig'; // <-- Importa nuestra config
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; // <-- Importa funciones de Firestore

const TodoList = () => {
    // Consumir el contexto de tema
    const { theme } = useContext(ThemeContext);
    // Hook de estado para manejar las tareas
    const [tasks, setTasks] = useState([
        {id: 1, text: 'Aprender react', completed: false},
        {id: 2, text: 'Construir una app', completed: false},
        {id: 3, text: 'Modularizar componentes', completed: false}
    ]);

    //Nuevo estado para el campo de texto
    const [inputValue, setInputValue] = useState('');

    //Funcion para manejar el envio del formulario
    const handleAddTask = (e) => {
        e.preventDefault(); // Evitar que la pagina se recargue
        if(inputValue.trim() !== ''){ // Validar que NO este vacio (corregido !== en lugar de ===)
            const newTask = {
               id: Date.now(), // Generar un id unico basado en la fecha actual
               text: inputValue,
               completed: false // Nueva tarea siempre empieza como no completada
            };
            setTasks([...tasks, newTask]); // Añadimos la nueva tarea a la lista
            setInputValue(''); // Limpiamos el campo de texto
        }
    }

    //Funcion para eliminar una tarea
    const handleDeleteTask = (taskId) => {
        // Filtramos la tarea que tenga el id especificado
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks); // Actualizamos el estado con la nueva lista
    }

    //Funcion para marcar una tarea como completada/no completada
    const handleToggleComplete = (taskId) => {
        // Mapeamos las tareas y cambiamos el estado de completed de la tarea con el id especificado
        const updatedTasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks); // Actualizamos el estado con la nueva lista
    }

    return (
        <div className={`todo-list-container ${theme}`}>
            <h2>Mi Lista de Tareas</h2>
            {/*aqui mostraremos la lista de tareas*/}
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <span className="task-text">{task.text}</span>
                        <div className="task-buttons">
                            <button 
                                onClick={() => handleToggleComplete(task.id)} 
                                className="complete-btn"
                                title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                            >
                                <Check />
                            </button>
                            <button 
                                onClick={() => handleDeleteTask(task.id)} 
                                className="delete-btn"
                                title="Eliminar tarea"
                            >
                                <Trash2 />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Aqui ira el formulario para agregar nuevas tareas */}
            <form onSubmit={handleAddTask} className="task-form">
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Añade una nueva tarea..."
                />  
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};

export default TodoList;