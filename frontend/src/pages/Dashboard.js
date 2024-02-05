// BETA TEST

import { useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// Existing components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

// // New components for the dashboard
import ProgressChart from "../components/ProgressCharts";
// import GoalTracker from "../components/GoalTracker";
// import Recommendations from "../components/Recommendations";

const Dashboard = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("/api/workouts", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  return (
    <div className="dashboard">
      <section className="dashboard-overview">
        <h2>Dashboard</h2>
        <div className="dashboard-widgets">
          <div className="progress-chart-container">
            <ProgressChart className="progress-chart" />
          </div>
        </div>
      </section>
      <section className="workout-section">
        <div className="workouts">
          {workouts &&
            workouts.map((workout) => (
              <WorkoutDetails key={workout._id} workout={workout} />
            ))}
        </div>
        <WorkoutForm />
      </section>
    </div>
  );
};

export default Dashboard;
