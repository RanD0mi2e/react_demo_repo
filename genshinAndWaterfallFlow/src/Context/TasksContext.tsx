import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  Dispatch,
} from "react";

const TasksContext = createContext<Task[]>([]);
const TaskDispatchContext = createContext<
  Dispatch<TaskAction<Task>>
>(() => {});

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, dispatchTasks] = useReducer(tasksReducer, initialTasks);
  return (
    <TasksContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatchTasks}>
        {children}
      </TaskDispatchContext.Provider>
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TasksContext);
};

export const useTasksDispatch = () => {
  return useContext(TaskDispatchContext);
};

type TaskAction<T> = {
  type: "add" | "change" | "delete";
  id?: number;
  text?: string;
  task?: T;
};
function tasksReducer(tasks: Task[], action: TaskAction<Task>): any {
  switch (action.type) {
    case "add":
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    case "change":
      return tasks.map(t => {
        if(t.id === action.task?.id) {
          return action.task
        } else {
          return t
        }
      });
    case "delete":
      return tasks.filter(t => {
        return t.id !== action.id
      });
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export type Task = {
  id: number;
  text: string;
  done: boolean;
};
const initialTasks: Task[] = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
];
