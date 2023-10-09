import { ReactNode, useState } from "react";
import { Task, useTasks, useTasksDispatch } from "@/Context/TasksContext";

export const TaskList: React.FC = () => {
  const tasks = useTasks()
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task}></TaskItem>
        </li>
      ))}
    </ul>
  );
};

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          type="text"
          onChange={(e) =>
            dispatch({
              type: "change",
              task: {
                ...task,
                text: e.target.value,
              },
            })
          }
        />
        <button onClick={() => setIsEditing(false)}>保存</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>编辑</button>
      </>
    );
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={(e) => {
            dispatch({
              type: "change",
              task: {
                ...task,
                done: e.target.checked,
              },
            });
          }}
        />
        {taskContent}
        <button onClick={e => {
          dispatch({
            type: 'delete',
            id: task.id
          })
        }}>删除</button>
      </label>
    </>
  );
};
