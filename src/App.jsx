import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TodoList from './pages/Todo';
import CalendarPage from './pages/Calendar';
import Layout from "./pages/Layout";
import Home from "./pages/Home"
import './App.css';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="todo" element={<TodoList />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="login" element={<Login />} />
          <Route path="about" element={
            <div className='w-screen h-screen flex justify-center items-center'>
              <p>About</p>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
