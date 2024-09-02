import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import './App.css';
import Header from './components/layout/Header';

function App() {
  return (
    <div className="App">
      <Header/>
    </div>
  );
}

export default App;
