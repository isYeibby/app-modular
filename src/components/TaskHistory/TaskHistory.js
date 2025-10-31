import React, { useState, useEffect, useContext } from 'react';
import './TaskHistory.css';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot, limit, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import ThemeContext from '../../context/ThemeContext';
import { Check, Trash2, Undo2 } from 'lucide-react'

const TaskHistory = () => {
  const { theme } = useContext(ThemeContext);
  const [historyItems, setHistoryItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'deleted'

  useEffect(() => {
    // Escuchar cambios en el historial (últimos 50 registros)
    const historyRef = collection(db, "taskHistory");
    const q = query(
      historyRef, 
      orderBy("completedAt", "desc"),
      orderBy("deletedAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ 
          ...doc.data(), 
          id: doc.id 
        });
      });
      setHistoryItems(items);
    }, (error) => {
      // Si hay error en la query (posiblemente por índices), hacer query más simple
      console.log('Usando query simplificada para historial');
      const simpleQuery = query(historyRef, limit(50));
      onSnapshot(simpleQuery, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({ 
            ...data, 
            id: doc.id,
            // Usar la fecha que esté disponible para ordenar
            sortDate: data.completedAt || data.deletedAt
          });
        });
        // Ordenar manualmente por fecha
        items.sort((a, b) => {
          const dateA = a.sortDate?.toMillis() || 0;
          const dateB = b.sortDate?.toMillis() || 0;
          return dateB - dateA;
        });
        setHistoryItems(items);
      });
    });

    return () => unsubscribe();
  }, []);

  // Filtrar elementos según el filtro seleccionado
  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = timestamp.toDate();
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para restaurar una tarea desde el historial
  const handleRestoreTask = async (historyItem) => {
    try {
      // Crear la tarea nuevamente en la colección de tareas
      await addDoc(collection(db, 'tasks'), {
        text: historyItem.taskText,
        isComplete: historyItem.type === 'completed' ? true : false,
        createdAt: serverTimestamp()
      });

      // Eliminar del historial
      await deleteDoc(doc(db, 'taskHistory', historyItem.id));
      
      console.log('Tarea restaurada correctamente');
    } catch (error) {
      console.error('Error restaurando tarea:', error);
    }
  };

  // Función para eliminar definitivamente del historial
  const handlePermanentDelete = async (historyItemId) => {
    try {
      await deleteDoc(doc(db, 'taskHistory', historyItemId));
      console.log('Tarea eliminada definitivamente del historial');
    } catch (error) {
      console.error('Error eliminando del historial:', error);
    }
  };

  return (
    <div className={`task-history-container ${theme}`}>
      <h3>Historial de Tareas</h3>
      
      {/* Filtros */}
      <div className="history-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Todas ({historyItems.length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completadas ({historyItems.filter(i => i.type === 'completed').length})
        </button>
        <button 
          className={filter === 'deleted' ? 'active' : ''}
          onClick={() => setFilter('deleted')}
        >
          Eliminadas ({historyItems.filter(i => i.type === 'deleted').length})
        </button>
      </div>

      {/* Lista de historial */}
      <div className="history-list">
        {filteredItems.length === 0 ? (
          <p className="empty-message">No hay elementos en el historial</p>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`history-item ${item.type}`}
            >
              <div className="history-icon">
                {item.type === 'completed' ? <Check /> : <Trash2 />}
              </div>
              <div className="history-content">
                <p className="history-task-text">{item.taskText}</p>
                <p className="history-date">
                  {item.type === 'completed' 
                    ? `Completada: ${formatDate(item.completedAt)}`
                    : `Eliminada: ${formatDate(item.deletedAt)}`
                  }
                </p>
                {item.type === 'deleted' && item.wasCompleted && (
                  <span className="history-badge">Estaba completada</span>
                )}
              </div>
              <div className="history-actions">
                <button 
                  className="restore-btn"
                  onClick={() => handleRestoreTask(item)}
                  title="Restaurar tarea"
                >
                  <Undo2 />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handlePermanentDelete(item.id)}
                  title="Eliminar definitivamente"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
