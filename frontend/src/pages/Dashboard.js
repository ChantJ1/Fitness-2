// Dashboard.js
import React, { useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFriends } from "../hooks/useFriends"; // Import useFriends hook

// Components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import FriendsList from "../components/FriendsList"; // Import FriendsList component
import ProgressChart from "../components/ProgressCharts";

const Dashboard = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const { friends, isLoading } = useFriends(); // Use the useFriends hook

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
          <div className="dashboard-friends">
            {isLoading ? (
              <div>Loading friends...</div>
            ) : (
              <FriendsList friends={friends} />
            )}
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
