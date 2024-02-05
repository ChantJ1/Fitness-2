import React, { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = () => {
  const { workouts } = useWorkoutsContext();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Load Lifted (kg)",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  });

  useEffect(() => {
    if (workouts && workouts.length) {
      const formatDataForChart = () => {
        // This assumes workouts are already sorted by date or you need to sort them as before
        const workoutsByDate = workouts.reduce((acc, workout) => {
          const date = new Date(workout.createdAt).toDateString(); // Simplifies date to a readable format
          if (!acc[date]) {
            acc[date] = { totalLoad: 0, count: 0 };
          }
          // Sum the load for all sets in the workout
          const totalLoad = workout.sets.reduce(
            (sum, set) => sum + set.load * set.reps,
            0
          );
          acc[date].totalLoad += totalLoad;
          acc[date].count += 1;
          return acc;
        }, {});

        const labels = Object.keys(workoutsByDate);
        const data = Object.values(workoutsByDate).map(
          (item) => item.totalLoad
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Load Lifted (kg)",
              data,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        });
      };

      formatDataForChart();
    }
  }, [workouts]); // Re-run when workouts update

  return <Line data={chartData} />;
};

export default ProgressChart;
