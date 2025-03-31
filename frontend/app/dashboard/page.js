"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, addTask, updateTask as updateTaskRedux, deleteTask as deleteTaskRedux } from "@/store/taskSlice";
import { openTaskModal } from "@/store/uiSlice";
import { Button } from "@/components/ui/button";
import TaskModal from "@/components/TaskModal";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // const { data: session } = useSession();
  console.log("🟢 Session Data:", session);

  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch tasks from DB
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    onSuccess: (data) => dispatch(setTasks(data)),
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      dispatch(addTask(newTask));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      dispatch(updateTaskRedux(updatedTask));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (taskId) => {
      dispatch(deleteTaskRedux(taskId));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  if (status === "loading" || isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome, {session?.user?.email}!</p>

      <Button onClick={() => dispatch(openTaskModal())} className="mt-4">
        Add New Task
      </Button>

      <TaskModal onCreateTask={(task) => createTaskMutation.mutate(task)} />

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-lg font-semibold">Your Tasks:</h2>
        <ul className="mt-2 space-y-2">
          {tasks?.map((task) => (
            <li
              key={task.id}
              className="border rounded-md p-3 shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => updateTaskMutation.mutate({ ...task, title: "Updated Task" })}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => deleteTaskMutation.mutate(task.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={() => signOut()} className="mt-4">
        Logout
      </Button>
    </div>
  );
}
