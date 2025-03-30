import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => action.payload, // Replace tasks
    addTask: (state, action) => [...state, action.payload], // Add task
    updateTask: (state, action) => {
      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
