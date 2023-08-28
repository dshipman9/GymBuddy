import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from '../pages/homePage/homePage';
import WorkoutDetailsPage from '../pages/workoutDetailsPage/workoutDetailsPage';
import TimerPage from '../pages/timerPage/timerPage';
import WorkoutCompletePage from '../pages/workoutCompletePage/workoutCompletePage';
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export function App({ signOut, user }: WithAuthenticatorProps) { return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage userId={user?.username}/>} />
          <Route path="/workout-details-page" element={<WorkoutDetailsPage />} />
          <Route path="/timer-page" element={<TimerPage userId={user?.username}/>} />
          <Route path="/workout-complete" element={<WorkoutCompletePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default withAuthenticator(App);
