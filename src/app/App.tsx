import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from '../pages/homePage/homePage';
import WorkoutDetailsPage from '../pages/workoutDetailsPage/workoutDetailsPage';
import TimerPage from '../pages/timerPage/timerPage';
import WorkoutCompletePage from '../pages/workoutCompletePage/workoutCompletePage';

function App() {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workout-details-page" element={<WorkoutDetailsPage />} />
          <Route path="/timer-page" element={<TimerPage />} />
          <Route path="/workout-complete" element={<WorkoutCompletePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
