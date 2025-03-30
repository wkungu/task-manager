import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    taskModalOpen: false, // Controls whether the Task Modal is open
  },
  reducers: {
    openTaskModal: (state) => {
      state.taskModalOpen = true;
    },
    closeTaskModal: (state) => {
      state.taskModalOpen = false;
    },
  },
});

export const { openTaskModal, closeTaskModal } = uiSlice.actions;
export default uiSlice.reducer;
