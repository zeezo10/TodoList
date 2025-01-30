<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const todos = ref([]);

const fetchTodosByStatus = async () => {
  try {
    const response = await axios.get(
      `https://todo-list-01-pi.vercel.app/todos/status/history`
    );
    todos.value = response.data;
    console.log("Fetched Todos:", todos.value); 
  } catch (error) {
    console.error("Error fetching todos by status:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
};

onMounted(fetchTodosByStatus);

const handleDel = async (id) => {
  try {
    const response = await axios.delete(
      `https://todo-list-01-pi.vercel.app/${id}`
    );
    fetchTodosByStatus();
  } catch (error) {}
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await axios.put(
      `https://todo-list-01-pi.vercel.app/todos/${taskId}/status`,
      { status: newStatus }
    );
    console.log("Task status updated:", response.data.todo);
    fetchTodosByStatus();
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const deleteHistoryTasks = async () => {
  try {
    const response = await axios.delete(
      "https://todo-list-01-pi.vercel.app/todos/history"
    );
    fetchTodosByStatus();
  } catch (error) {
    console.error("Error deleting history tasks:", error);
  }
};
</script>

<template>
  <div class="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-0">History</h1>
      <a
        class="text-lg sm:text-xl md:text-2xl cursor-pointer hover:text-red-500 transition-colors duration-200"
        @click="deleteHistoryTasks"
      >
        Clear History
      </a>
    </div>

    <div class="grid gap-4 sm:gap-6 md:gap-8">
      <div
        v-for="(task, index) in todos"
        :key="index"
        class="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4">
          <h3 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-0 sm:mr-4">
            {{ task.title }}
          </h3>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              class="px-3 py-1 text-sm sm:text-base font-semibold hover:bg-slate-100 rounded-md transition-colors duration-200"
              @click="updateTaskStatus(task.id, `pending`)"
            >
              Do It Again
            </button>
            <button
              @click="handleDel(task.id)"
              class="px-3 py-1 bg-red-400 text-white text-sm sm:text-base rounded-md hover:bg-red-500 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
        <p class="text-sm sm:text-base mb-2">Status: {{ task.status }}</p>
        <p class="text-sm sm:text-base mb-4">{{ task.description }}</p>
        <p class="text-xs sm:text-sm text-gray-600">Due: {{ formatDate(task.due_date) }}</p>
      </div>
    </div>
  </div>
</template>
