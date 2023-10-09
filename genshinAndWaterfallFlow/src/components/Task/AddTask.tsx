import { useTasks, useTasksDispatch } from "@/Context/TasksContext";
import { useState } from "react";

export const AddTask = () => {
  let length = useTasks().length;
  const [text, setText] = useState("");
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        type="text"
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={(e) => {
          dispatch({
            type: "add",
            id: ++length,
            text: text,
          });
          setText('');
        }}
      >
        add
      </button>
    </>
  );
};
