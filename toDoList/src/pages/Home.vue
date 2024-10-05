<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const todosPending = ref([]);
const todosInProgress = ref([]);
const todosdone = ref([]);
const todos = ref([]);

const fetchTodos = async () => {
  try {
    let pending = [];
    let inProgress = [];
    let done = [];

    const response = await axios.get("https://todo-list-01-pi.vercel.app/");
    // todos.value = response.data;

    response.data.map((el) => {
      if (el.status === "pending") {
        pending.push(el);
      } else if (el.status === "in-progress") {
        inProgress.push(el);
      } else if (el.status === "done") {
        done.push(el);
      }
    });
    todosPending.value = pending;
    todosInProgress.value = inProgress;
    todosdone.value = done;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// ----------------

const newTaskTitle = ref("");
const newTaskDescription = ref("");
const newTaskDueDate = ref("");
const newTaskStatus = ref("pending");

onMounted(fetchTodos);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
};

const currentTime = ref("");

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}`;
};

let intervalId;

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// ------ date ---

const formattedDate = ref("");
const today = ref("");

const updateDate = () => {
  const now = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = daysOfWeek[now.getDay()];
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  formattedDate.value = `${month}/${day}/${year}`;
  today.value = `${dayName}`;
};

let intervalIdD;

onMounted(() => {
  updateDate();
  intervalIdD = setInterval(updateDate, 1000 * 60 * 60);
});

onUnmounted(() => {
  clearInterval(intervalIdD);
});

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await axios.put(
      `https://todo-list-01-pi.vercel.app/todos/${taskId}/status`,
      { status: newStatus }
    );
    console.log("Task status updated:", response.data.todo);
    fetchTodos(); // Refresh the todos list
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

import glassImage from "../assets/glass.png";
</script>

<template>
  <div class="w-full flex flex-col p-4 md:ml-64">
    <!-- Header Section -->
    <div
      class="h-64 bg-cover bg-center rounded-2xl flex flex-col p-5 shadow-xl w-full justify-between"
      :style="{ backgroundImage: `url(${glassImage})` }"
    >
      <div class="flex flex-col justify-between">
        <h1 class="text-4xl md:text-7xl text-white font-bold">{{ today }}</h1>
        <h1 class="text-4xl md:text-7xl text-white">{{ currentTime }}</h1>
        <h1 class="text-2xl md:text-4xl text-white">{{ formattedDate }}</h1>
      </div>
    </div>

    <!-- Task List Section -->
    <div class="flex gap-3 flex-wrap justify-between pt-5 overflow-x-auto">
      <!-- To Do Section -->
      <div
        class="flex flex-col shadow-lg justify-center items-center border-2 border-purple-500 border-dashed rounded-3xl w-full md:w-[400px] h-[calc(100vh-300px)] p-5 shrink-0 gap-5 pr-3 bg-white"
      >
        <div class="flex h-20 w-full items-center justify-between">
          <h1 class="text-2xl md:text-3xl font-bold">
            To Do ({{ todosPending.length }})
          </h1>
          <router-link
            to="/add-task"
            class="bg-slate-300 flex justify-center items-center h-8 md:h-10 w-24 font-bold text-center rounded-lg text-white hover:bg-purple-400 text-base mr-2"
          >
            <p>Add Task</p>
          </router-link>
        </div>

        <div
          class="flex flex-col space-y-4 w-full overflow-y-auto md:max-h-full max-h-[500px] h-full"
        >
          <div
            v-for="(task, index) in todosPending"
            :key="index"
            class="w-full h-36 md:h-40 rounded-lg shadow-md flex flex-col justify-around p-4 border-[1px]"
          >
            <div class="flex justify-between items-center">
              <h3 class="w-full text-lg md:text-2xl font-semibold">
                {{ task.title }}
              </h3>
              <button
                class="mt-auto px-3 py-1 font-semibold hover:text-slate-400 rounded-mdfont-bold text-lg"
              >
                edit
              </button>
            </div>
            <p class="my-2 text-sm">Status: {{ task.status }}</p>
            <p class="text-sm truncate">{{ task.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm">{{ formatDate(task.due_date) }}</p>
              <button
                @click="updateTaskStatus(task.id, `in-progress`)"
                class="mt-auto px-3 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500 font-bold text-sm"
              >
                Do it
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- In Progress Section -->
      <div
        class="flex flex-col shadow-lg justify-center items-center border-2 border-purple-500 border-dashed rounded-3xl w-full md:w-[400px] h-[calc(100vh-300px)] p-5 shrink-0 gap-5 pr-3 bg-white"
      >
        <div class="flex h-20 w-full items-center justify-between">
          <h1 class="text-2xl md:text-3xl font-bold">
            In progress ({{ todosInProgress.length }})
          </h1>
        </div>

        <div
          class="flex flex-col space-y-4 w-full overflow-y-auto md:max-h-full max-h-[500px] h-full"
        >
          <div
            v-for="(task, index) in todosInProgress"
            :key="index"
            class="w-full h-36 md:h-40 rounded-lg shadow-md flex flex-col justify-around p-4 border-[1px]"
          >
            <div class="flex justify-between items-center">
              <h3 class="w-full text-lg md:text-2xl font-semibold">
                {{ task.title }}
              </h3>
              <button
                class="mt-auto px-3 py-1 font-semibold hover:text-slate-400 rounded-mdfont-bold text-lg"
              >
                edit
              </button>
            </div>
            <p class="my-2 text-sm">Status: {{ task.status }}</p>
            <p class="text-sm">{{ task.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm">{{ formatDate(task.due_date) }}</p>
              <div class="flex gap-1">
                <button
                  @click="updateTaskStatus(task.id, `pending`)"
                  class="mt-auto px-3 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500 font-bold text-sm"
                >
                  Undo
                </button>
                <button
                  @click="updateTaskStatus(task.id, `done`)"
                  class="mt-auto px-3 py-1 bg-green-400 text-white rounded-md hover:bg-green-500 font-bold text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Done Section -->
      <div
        class="flex flex-col shadow-lg justify-center items-center border-2 border-purple-500 border-dashed rounded-3xl w-full md:w-[400px] h-[calc(100vh-300px)] p-5 shrink-0 gap-5 pr-3 bg-white"
      >
        <div class="flex h-20 w-full items-center justify-between">
          <h1 class="text-2xl md:text-3xl font-bold">
            Done ({{ todosdone.length }})
          </h1>
        </div>

        <div
          class="flex flex-col space-y-4 w-full overflow-y-auto md:max-h-full max-h-[500px] h-full"
        >
          <div
            v-for="(task, index) in todosdone"
            :key="index"
            class="w-full h-36 md:h-40 rounded-lg shadow-md flex flex-col justify-around p-4 border-[1px]"
          >
            <div class="flex justify-between items-center">
              <h3 class="w-full text-lg md:text-2xl font-semibold">
                {{ task.title }}
              </h3>
              <button
                class="mt-auto px-3 py-1 font-semibold hover:text-slate-400 rounded-mdfont-bold text-lg"
              >
                edit
              </button>
            </div>
            <p class="my-2 text-sm">Status: {{ task.status }}</p>
            <p class="text-sm">{{ task.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm">{{ formatDate(task.due_date) }}</p>
              <div class="flex gap-1">
                <button
                  @click="updateTaskStatus(task.id, `in-progress`)"
                  class="mt-auto px-3 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500 font-bold text-sm"
                >
                  Undo
                </button>

                <button
                  @click="updateTaskStatus(task.id, `history`)"
                  class="mt-auto px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 font-bold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <router-view />
</template>
