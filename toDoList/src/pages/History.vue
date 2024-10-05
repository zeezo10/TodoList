<script setup>

import { ref ,onMounted} from "vue";
import axios from "axios";

const todos = ref([]);

// Function to fetch todos by status
const fetchTodosByStatus = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/todos/status/history`);
    todos.value = response.data; // Set the fetched todos to the state
    console.log("Fetched Todos:", todos.value); // Debugging: log the fetched todos
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

onMounted(fetchTodosByStatus)

const handleDel = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/${id}`);
    fetchTodosByStatus();
  } catch (error) {}
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/todos/${taskId}/status`,
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
    const response = await axios.delete('http://localhost:3000/todos/history');
    fetchTodosByStatus()
} catch (error) {
    console.error('Error deleting history tasks:', error);
  }
};



</script>

<template>
  <div class="ml-64 h-screen w-screen border-2 rounded-2xl border-dashed p-4 flex gap-5 flex-wrap">
    <div class="w-full h-20  flex flex-row justify-between items-center pr-10">
      <h1 class="text-5xl font-bold">History</h1>
      
      <a class="text-2xl cursor-pointer hover:text-red-500" 
      @click="deleteHistoryTasks"
      > Clear History</a>

    </div>
    
    <div class=" w-full  flex gap-2 ">

     <div
          class="flex flex-col space-y-4 w-full md:max-h-full max-h-[500px] h-full"
        >
          <div
            v-for="(task, index) in todos"
            :key="index"
            class="w-full h-36 md:h-40 rounded-lg shadow-md flex flex-col justify-around p-4 border-[1px] bg-white"
          >
            <div class="flex justify-between items-center  ">
              <h3 class="w-full text-lg md:text-2xl font-semibold">
                {{ task.title }}
              </h3>
              <button
                class="mt-auto px-3 py-1 font-semibold hover:text-slate-400 rounded-mdfont-bold text-lg w-40"
                @click="updateTaskStatus(task.id, `pending`)"
              >
                Do It Again
              </button>
               <button
                  @click="handleDel(task.id)"
                  class=" px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 font-bold text-sm"
                >
                  Delete
                </button> 
            </div>
            <p class="my-2 text-sm">Status: {{ task.status }}</p>
            <p class="text-sm">{{ task.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm">{{ formatDate(task.due_date) }}</p>
              
            </div>
          </div>
        </div>
    </div>        
        
    </div>
        

</template>