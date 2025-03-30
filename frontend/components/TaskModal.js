"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeTaskModal } from "@/store/uiSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TaskModal({ onCreateTask }) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.taskModalOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask({ title, description });
      setTitle("");
      setDescription("");
      dispatch(closeTaskModal());
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeTaskModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
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
          <Button type="submit" className="mt-4 w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
s