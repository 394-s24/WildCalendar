import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TodoList from './pages/Todo';
import Cal from './pages/Calendar';


const Home = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
  <header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>Hello Vite + React!</p>
  <p>
    <button onClick={() => setCount(count => count + 1)}>
      count is: {count}
    </button>
  </p>
  <p>
    Edit <code>App.jsx</code> and save to test hot module replacement (HMR).
  </p>
  <p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
    {' | '}
    <a
      className="App-link"
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      Vite Docs
    </a>
  </p>
</header>
</div>);
};

const App = () => {

  return (
      <Router>
        <Routes>
              <Route path = "/" element = {<Home/>} />
              <Route path="/todo" element={<TodoList/>} />
              <Route path = "/calendar" element = {<Cal/>} />
        </Routes>
      </Router>
  );
};

export default App;
