<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);
const todos = ref([]);
const newCategoryName = ref("");

const fetchCategory = async () => {
  try {
    const response = await axios.get("http://localhost:3000/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchTodosByCategory = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/todos/category/${id}`
    );
    todos.value = response.data;
    console.log("Fetched Todos:", todos.value);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

const handleAddCategory = async () => {
  if (newCategoryName.value.trim() === "") {
    console.error("Category name cannot be empty");
    return;
  }

  try {
    const newCategory = {
      name: newCategoryName.value,
    };

    const response = await axios.post(
      "http://localhost:3000/categories",
      newCategory
    );
    categories.value.push(response.data.category);
    newCategoryName.value = "";
    console.log("Category added:", response.data.category);
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

onMounted(fetchCategory);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
};

import glassImage from "../assets/glass.png";

</script>

<template>
  <div
    class="ml-64 h-screen w-screen border-2 rounded-2xl border-dashed p-4 flex gap-5"
  >
    <div class="border-2 h-full w-1/3 rounded-xl flex flex-col bg-white ">
      <div class="flex p-5 flex-col gap-5">
        <h1 class="text-4xl font-bold">My Categories</h1>
        <div class="flex gap-2">
          <input
            v-model="newCategoryName"
            class="h-14 rounded-xl border-[1px] p-2 w-3/4"
            placeholder="Add New Category"
          />
          <button
            class="w-1/4 font-bold hover:bg-slate-100  border-[1px] rounded-xl "
            @click="handleAddCategory"
          >
            Add
          </button>
        </div>
      </div>
      <div class="w-full h-full rounded-xl flex flex-col p-5 gap-3">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="flex flex-col w-full"
        >
          <a
            class="border-[1px] h-14 flex items-center p-2 rounded-xl cursor-pointer hover:bg-slate-100"
            @click="fetchTodosByCategory(category.id)"
          >
            <h1 class="text-3xl font-semibold">{{ category.name }}</h1>
          </a>
        </div>
      </div>
    </div>

    <div class="border-2 w-2/3 h-full flex flex-col p-3 gap-2 overflow-scroll bg-white rounded-ss-2xl">
        <div class="flex flex-row-reverse gap-4 text-white font-bold">
            <div class="bg-red-400 p-2 rounded-lg">Pending</div>
            <div class="bg-orange-400 p-2 rounded-lg">In Progress</div>
            <div class="bg-green-400 p-2 rounded-lg" >Done</div>
        </div>
      <div class="w-full  rounded-xl flex flex-col">
        <div
          v-if="todos.length === 0"
          class="flex items-center justify-center h-full"
        >
          <p class="text-lg font-semibold">There are no tasks available.</p>
        </div>
        <div v-else>
          <div
            v-for="task in todos"
            :key="task.id"
            class="w-full h-36 md:h-40 rounded-lg shadow-md flex flex-col justify-around p-4 border-[1px] mt-3"
          >
            <div
              :class="{
                'bg-red-400': task.status === 'pending',
                'bg-orange-400': task.status === 'in-progress',
                'bg-green-400': task.status === 'done',
              }"
              class="flex items-center -m-2 h-10 rounded-lg p-2"
            >
              <h3 class="w-full text-lg md:text-2xl font-semibold text-white">
                {{ task.title }}
              </h3>
              <button
                class="text-lg hover:text-blue-400"
                @click="editTask(task.id)"
              >
                Edit
              </button>
            </div>
            <p class="my-2 text-sm">Status: {{ task.status }}</p>
            <p class="text-sm truncate ">{{ task.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-sm">{{ formatDate(task.due_date) }}</p>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
