import React,{useContext} from 'react';
import './App.css';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import TodoList from './components/TodoList/TodoList';
import UserDirectory from './components/UserDirectory/UserDirectory'; 
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import ThemeContext from './context/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App ${theme}`}>
      <Header />
      <main>
        <Welcome nombre="Yhosmar" />
        <Welcome nombre="Desarrollador" />
        <TodoList />
        <UserDirectory />
      </main>
    </div>
  );
}

export default App;