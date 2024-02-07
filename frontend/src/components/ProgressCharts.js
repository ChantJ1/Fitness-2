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
        const workoutsByDate = workouts.reduce((acc, workout) => {
          const date = new Date(workout.createdAt).toISOString().slice(0, 10); // Use ISO string format for accurate sorting
          if (!acc[date]) {
            acc[date] = { totalLoad: 0, count: 0 };
          }
          const totalLoad = workout.sets.reduce(
            (sum, set) => sum + set.load * set.reps,
            0
          );
          acc[date].totalLoad += totalLoad;
          acc[date].count += 1;
          return acc;
        }, {});

        // Convert to arrays and sort by date descending
        const entries = Object.entries(workoutsByDate).sort((b, a) =>
          b[0].localeCompare(a[0])
        ); // Sort dates in descending order
        const labels = entries.map((entry) => entry[0]);
        const data = entries.map((entry) => entry[1].totalLoad);

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
