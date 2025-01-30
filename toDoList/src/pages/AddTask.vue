<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const newTaskTitle = ref("");
const newTaskDescription = ref("");
const selectedCategory = ref("");
const newTaskDueDate = ref("");
const categories = ref([]);
const isMobile = ref(false);

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

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  fetchCategories();
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div
    :class="[
      'h-screen w-full border-2 rounded-2xl border-dashed  flex gap-5 justify-center p-5',
    ]"
  >
    <div
      class="h-full w-full max-w-2xl md:w-2/3 shadow-xl border-[0.2px] rounded-2xl p-4 flex flex-col gap-1 bg-white"
    >
      <h1 class="text-3xl md:text-5xl font-bold p-3 md:p-5">Add New Task</h1>
      <form @submit.prevent="handleAdd" class="h-full w-full p-3 flex flex-col space-y-4">
        <div class="">
          <label class="block font-bold">Title</label>
          <input
            v-model="newTaskTitle"
            class="h-12 md:h-14 w-full rounded-xl p-2 border-2"
            placeholder="e.g pay rent"
            required
          />
        </div>
        <div class="">
          <label class="block font-bold">Description</label>
          <textarea
            v-model="newTaskDescription"
            class="h-32 md:h-40 w-full rounded-xl p-2 border-2"
            placeholder="Description"
            required
          ></textarea>
        </div>
        <div class="">
          <label class="block font-bold">Category</label>
          <select
            v-model="selectedCategory"
            class="h-12 md:h-14 w-full rounded-xl p-2 border-2"
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
        <div class="">
          <label class="block font-bold">Due Date</label>
          <input
            v-model="newTaskDueDate"
            class="h-12 md:h-14 w-full rounded-xl p-2 border-2"
            type="date"
            required
          />
        </div>
        <div class="w-full  flex items-center ">
          <button
            type="submit"
            class="bg-green-400 rounded-xl h-12  w-24 font-bold hover:bg-green-500 text-white"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* No need for media queries here as we're using responsive classes */
</style>
