import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TodoList from './pages/Todo';
import CalendarPage from './pages/Calendar';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navigation/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar/>
      homepage!
      <Navbar/>
    </div>
  );
};

const App = () => {

  return (
      <Router>
        <Routes>
              <Route path = "/" element = {<Home/>} />
              <Route path="/todo" element={<TodoList/>} />
              <Route path = "/calendar" element = {<CalendarPage/>} />
        </Routes>
      </Router>
  );
}

export default App;
