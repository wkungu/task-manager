"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeTaskModal } from "@/store/uiSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TaskModal({ onUpdateTask, onCreateTask, taskToEdit }) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.taskModalOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() =>{
      if(taskToEdit){
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setStatus(taskToEdit.status || "pending");
      }else{
        setTitle("");
        setDescription("");
        setStatus("pending");
      }
  }, [taskToEdit])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const taskData = { title, description, status };
      if(taskToEdit){
        onUpdateTask({ ...taskToEdit, ...taskData });
      }else{
        onCreateTask(taskData);
        setTitle("");
        setDescription("");
        setStatus("pending");
      }
      dispatch(closeTaskModal());
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeTaskModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task': 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 border rounded-md mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded-md mt-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <Button type="submit" className="mt-4 w-full">
            {taskToEdit? 'Edit Task' : 'Create Task' }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
