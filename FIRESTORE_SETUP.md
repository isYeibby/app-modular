# Configuración de Firestore para el Historial de Tareas

## Reglas de Seguridad Necesarias

Para que el historial funcione correctamente, debes actualizar las reglas de Firestore en la consola de Firebase:

### Opción 1: Desarrollo (sin autenticación)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a la colección de tareas
    match /tasks/{taskId} {
      allow read, write: if true;
    }
    
    // Permitir acceso a la colección de historial
    match /taskHistory/{historyId} {
      allow read, write: if true;
    }
  }
}
```

### Opción 2: Producción (con autenticación)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder a sus tareas
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    // Solo usuarios autenticados pueden acceder a su historial
    match /taskHistory/{historyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Estructura de Datos en Firestore

### Colección: `tasks`
```javascript
{
  text: string,
  isComplete: boolean,
  createdAt: timestamp,
  completedAt: timestamp | null
}
```

### Colección: `taskHistory`

**Para tareas completadas:**
```javascript
{
  type: 'completed',
  taskText: string,
  taskId: string,
  completedAt: timestamp,
  originalCreatedAt: timestamp
}
```

**Para tareas eliminadas:**
```javascript
{
  type: 'deleted',
  taskText: string,
  taskId: string,
  deletedAt: timestamp,
  wasCompleted: boolean,
  originalCreatedAt: timestamp
}
```

## Índices Compuestos (Opcional)

Si recibes errores sobre índices faltantes, Firebase te proporcionará un enlace directo para crearlos. Alternativamente, puedes crear estos índices manualmente:

1. Ve a **Firestore Database** > **Indexes** en la consola de Firebase
2. Crea un índice compuesto para la colección `taskHistory`:
   - Collection: `taskHistory`
   - Fields: 
     - `completedAt` (Descending)
     - `deletedAt` (Descending)

**Nota:** El componente TaskHistory está diseñado para funcionar incluso sin índices compuestos, usando una query más simple si es necesario.
