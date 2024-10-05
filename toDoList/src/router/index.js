import {createRouter, createWebHistory} from "vue-router"
import Home from "../pages/Home.vue"
import AddCategory from "../pages/AddCategory.vue"
import AddTask from "../pages/AddTask.vue"
import History from "../pages/History.vue"
const routes = [
    {
        path : '/',
        name : 'Home',
        component : Home
    },
    {
        path : "/add-category",
        name : "add-category",
        component: AddCategory
    },
    {
        path: "/add-task",
        name : "add-task",
        component : AddTask
    },
    {
        path : "/history",
        name : "history",
        component : History
    }
]


const router  = createRouter({
    history: createWebHistory(),
    routes
})  

export default router