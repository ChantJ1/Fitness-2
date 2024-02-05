import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [sets, setSets] = useState([{ load: "", reps: "" }]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const addSet = () => {
    setSets([...sets, { load: "", reps: "" }]);
  };

  const removeSet = (index) => {
    const updatedSets = [...sets];
    updatedSets.splice(index, 1);
    setSets(updatedSets);
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    // Check if the title field is empty
    if (!title) {
      setError("Exercise Title is required");
      return;
    }

    // Check if any set fields are empty
    const hasEmptySetFields = sets.some(
      (set) => set.load === "" || set.reps === ""
    );
    if (hasEmptySetFields) {
      setError("Please fill in all the fields for each set");
      return;
    }

    const workout = { title, sets };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setSets([{ load: "", reps: "" }]); // Reset sets
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      {sets.map((set, index) => (
        <div key={index}>
          <label>Set {index + 1} Load (kg):</label>
          <input
            type="number"
            value={set.load}
            onChange={(e) => handleSetChange(index, "load", e.target.value)}
            className={emptyFields.includes(`load-${index}`) ? "error" : ""}
          />

          <label>Set {index + 1} Reps:</label>
          <input
            type="number"
            value={set.reps}
            onChange={(e) => handleSetChange(index, "reps", e.target.value)}
            className={emptyFields.includes(`reps-${index}`) ? "error" : ""}
          />

          {index > 0 && (
            <button type="button" onClick={() => removeSet(index)}>
              Remove Set
            </button>
          )}
        </div>
      ))}
      <button className="form-button" type="button" onClick={addSet}>
        Add Set
      </button>

      <button className="form-button">Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
