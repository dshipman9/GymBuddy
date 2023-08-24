import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { WorkoutHistory } from '../../components/workoutHistory/workoutHistory';

function HomePage() {
  const navigate = useNavigate();

  const handleGenerateWorkoutClick = () => {
    navigate('/workout-details-page', {state: {random: true}});
  };

  const handleCustomWorkoutClick = () => {
    navigate('/workout-details-page', {state: {random: false}});
  };

  return (
    <div>
      <header className="App-header">
        <div className='headerButtons'>
          <Button onClick={handleGenerateWorkoutClick}
            icon={"pi pi-bolt"}
            label={'Random'}
          />
        </div>
        <div className='headerButtons'>
          <Button
            onClick={handleCustomWorkoutClick}
            icon={"pi pi-file-edit"}
            label={'Custom'}
          />
        </div>
      </header>
      <WorkoutHistory/>
    </div>
  );
}

export default HomePage;