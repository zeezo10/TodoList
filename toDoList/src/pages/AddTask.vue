<script setup>
import { ref } from "vue";
import axios from "axios";

const newTaskTitle = ref("");
const newTaskDescription = ref("");
const selectedCategory = ref("");
const newTaskDueDate = ref("");
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      "https://todo-list-01-pi.vercel.app/categories"
    );
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const handleAdd = async () => {
  try {
    const newTask = {
      title: newTaskTitle.value,
      description: newTaskDescription.value,
      status: "pending",
      due_date: newTaskDueDate.value,
      category_id: selectedCategory.value,
    };

    const response = await axios.post(
      "https://todo-list-01-pi.vercel.app/",
      newTask
    );
    console.log("Task added:", response.data.todo);

    newTaskTitle.value = "";
    newTaskDescription.value = "";
    selectedCategory.value = "";
    newTaskDueDate.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

fetchCategories();
</script>

<template>
  <div
    class="ml-64 h-screen w-screen border-2 rounded-2xl border-dashed p-4 flex gap-5 justify-center"
  >
    <div
      class="h-full w-2/3 shadow-xl border-[0.2px] rounded-2xl p-4 flex flex-col gap-5 bg-white"
    >
      <h1 class="text-5xl font-bold p-5">Add New Task</h1>
      <form @submit.prevent="handleAdd" class="h-full w-full p-5">
        <div>
          <label class="m-2 font-bold">Title</label>
          <input
            v-model="newTaskTitle"
            class="h-14 w-full rounded-xl p-2 border-2"
            placeholder="e.g pay rent"
            required
          />
        </div>
        <div>
          <label class="m-2 font-bold">Description</label>
          <textarea
            v-model="newTaskDescription"
            class="h-40 w-full rounded-xl p-2 border-2"
            placeholder="Description"
            required
          ></textarea>
        </div>
        <div>
          <label class="m-2 font-bold">Category</label>
          <select
            v-model="selectedCategory"
            class="h-14 w-full rounded-xl p-2 border-2"
            required
          >
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="m-2 font-bold">Due Date</label>
          <input
            v-model="newTaskDueDate"
            class="h-14 w-full rounded-xl p-2 border-2"
            type="date"
            required
          />
        </div>
        <div class="w-full h-28 flex items-center justify-end">
          <button
            type="submit"
            class="bg-green-400 rounded-xl h-14 w-24 font-bold hover:bg-green-500 text-white"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
