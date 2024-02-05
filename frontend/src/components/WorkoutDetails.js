import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [editing, setEditing] = useState(false);
  // Deep copy workout to ensure nested sets are handled properly
  const [editedWorkout, setEditedWorkout] = useState(
    JSON.parse(JSON.stringify(workout))
  );

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    // Reset editedWorkout to the original workout data
    setEditedWorkout(JSON.parse(JSON.stringify(workout)));
  };

  const handleSave = async () => {
    if (!user) return;

    const response = await fetch(`/api/workouts/${editedWorkout._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(editedWorkout),
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      setEditing(false);
    } else {
      // Handle error (e.g., display a message)
      console.error("Failed to update workout:", json.error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const response = await fetch(`/api/workouts/${editedWorkout._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: { _id: editedWorkout._id } });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("sets")) {
      const index = parseInt(name.split("[")[1].split("]")[0], 10);
      const fieldName = name.split(".")[1];
      const updatedSets = [...editedWorkout.sets];
      updatedSets[index][fieldName] = Number(value);
      setEditedWorkout({ ...editedWorkout, sets: updatedSets });
    } else {
      setEditedWorkout({ ...editedWorkout, [name]: value });
    }
  };

  return (
    <div className="workout-details">
      <h4>
        {editing ? (
          <input
            type="text"
            name="title"
            value={editedWorkout.title}
            onChange={handleInputChange}
          />
        ) : (
          workout.title
        )}
      </h4>
      {editedWorkout.sets.map((set, index) => (
        <div key={index}>
          <p>
            <strong>Set {index + 1}:</strong>
          </p>
          <p>
            Load (kg):
            {editing ? (
              <input
                type="number"
                name={`sets[${index}].load`}
                value={set.load}
                onChange={handleInputChange}
              />
            ) : (
              " " + set.load
            )}
          </p>
          <p>
            Reps:
            {editing ? (
              <input
                type="number"
                name={`sets[${index}].reps`}
                value={set.reps}
                onChange={handleInputChange}
              />
            ) : (
              " " + set.reps
            )}
          </p>
        </div>
      ))}
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      {user && (
        <div>
          {editing ? (
            <div>
              <button onClick={handleSave}>
                <MdSave />
              </button>
              <button onClick={handleCancel}>
                <MdCancel />
              </button>
            </div>
          ) : (
            <div>
              <button onClick={handleEdit}>
                <MdEdit />
              </button>
              <button onClick={handleDelete}>
                <MdDelete />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutDetails;
