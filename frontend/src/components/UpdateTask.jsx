import React, { useEffect, useState } from "react";
import "../style/addtask.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTask = () => {
  const [taskData, setTaskData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getTask(id);
  }, []);

  const getTask = async (id) => {
    let task = await fetch(`http://localhost:3200/task/${id}`);
    task = await task.json();
    if (task.result) {
      setTaskData(task.result);
    }
  };

  const updateTask = async () => {
    let task = await fetch(`http://localhost:3200/update-task`, {
      method: "put",
      body: JSON.stringify(taskData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    task = await task.json();
    if (task) {
      navigate("/")
    }

  };

  return (
    <div className="container">
      <h1>Update Task</h1>
      <label htmlFor="">Title</label>
      <input
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        type="text"
        name="title"
        placeholder="Enter task title"
        value={taskData?.title || ""}
      />
      <label htmlFor="">Description</label>
      <textarea
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
        name="description"
        id=""
        placeholder="Enter task description"
        rows={4}
        value={taskData?.description || ""}
      ></textarea>
      <button onClick={updateTask} className="submit">
        Update Task
      </button>
    </div>
  );
};

export default UpdateTask;
