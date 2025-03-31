import { getSession } from "next-auth/react";

const API_URL = "http://localhost:8000/api";

/**
 * Helper function to get the stored access token
 */
async function getAuthHeaders() {
  const session = await getSession(); // Get session from NextAuth
  if (!session || !session.accessToken) return {};

  return { "Authorization": `Bearer ${session.accessToken}` };
}


/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 */
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}


/**
 * Fetch tasks
 */
export async function fetchTasks() {
  const headers = await getAuthHeaders(); // ✅ Wait for the token
  const response = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    headers: { 
      ...headers, 
      "Content-Type": "application/json" 
    },
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

/**
 * Create a new task
 * @param {Object} task - { title, description }
 */
export async function createTask(task) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { 
      ...headers, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}


/**
 * Update a task
 * @param {Object} task - { id, title, description }
 */
export async function updateTask(task) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: { 
      ...headers, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}


/**
 * Delete a new task
 * @param {Integer} taskId
 */
export async function deleteTask(taskId) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: headers,
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return taskId;
}
