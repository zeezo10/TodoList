
<template>
  <div class="flex">
    <!-- Toggle Button for Mobile -->
    
    <button 
      @click="toggleSidebar" 
      class="fixed top-4 left-4 z-50 text-black p-2 rounded-md lg:hidden">
        <span class="sr-only">Toggle menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>

    <!-- Sidebar -->
    <div :class="[
      'h-screen fixed left-0 top-0 flex flex-col shadow-lg items-center p-4 bg-white transition-all duration-300 ease-in-out',
      {'w-64': isSidebarVisible, 'hidden': !isSidebarVisible, 'lg:w-64 ': true}
    ]">
      <div :class="['overflow-hidden', {'w-full pt-10': isSidebarVisible, 'w-0': !isSidebarVisible, 'lg:w-full': true}]">
        <h1 class="text-3xl font-bold lg:text-5xl whitespace-nowrap">My Tasks</h1>

        <nav class="mt-10 text-lg font-semibold w-full flex flex-col flex-1">
          <router-link to="/" class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md flex p-2 items-center whitespace-nowrap">
            <span>Dashboard</span>
          </router-link>
          <div class="border-[1px] border-dashed my-2"></div>
          <router-link to="/add-category" class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md flex p-2 items-center whitespace-nowrap">
            <span>Categories</span>
          </router-link>
          <div class="border-[1px] border-dashed my-2"></div>
          <router-link to="/add-task" class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md flex p-2 items-center whitespace-nowrap">
            <span>Add New Task</span>
          </router-link>
          <div class="border-[1px] border-dashed my-2"></div>
          <router-link to="/history" class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md flex p-2 items-center whitespace-nowrap">
            <span>History</span>
          </router-link>
        </nav>

        <div class="mt-auto p-2 whitespace-nowrap">
          <span>Created by Abdul Aziz</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div :class="[
      'flex-1 transition-all duration-300 ease-in-out',
      {'ml-64': isSidebarVisible, 'ml-0': !isSidebarVisible, 'lg:ml-64': true}
    ]">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSidebarVisible: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible; 
    },
  },
  mounted() {
    this.isSidebarVisible = window.innerWidth >= 1024; 
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    handleResize() {
      this.isSidebarVisible = window.innerWidth >= 1024;
    },
  },
}
</script>

<style scoped>

</style>
