    <script>

    </script>

    <template>
        <div class="h-full w-60 fixed rounded-2xl flex flex-col shadow-lg items-center p-2 bg-white">
            <h1 class="text-7xl font-bold ">My Tasks</h1>

            <div class="mt-20 text-2xl font-semibold w-full  flex flex-col flex-1">
                <router-link
                to="/"
                 class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md  flex p-2  items-center">
                    <h1>Dashbored</h1>
                </router-link>
                <div class=" border-[1px] border-dashed"></div>
                <router-link
                    to="/add-category"
                 class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md  flex p-2  items-center">
                    <h1>Categoreis</h1>
                </router-link>
                <div class=" border-[1px] border-dashed"></div>
                <router-link
                    to="/add-task"
                 class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md  flex p-2  items-center">
                    <h1>Add New Task</h1>
                </router-link>
                <div class=" border-[1px] border-dashed"></div>
             

                <router-link
                 to="/history"
                class="hover:bg-slate-100 cursor-pointer w-full h-12 rounded-md  flex p-2  items-center">
                    <h1>History</h1>
                </router-link>
            
            </div>
            <div class="h-20 w-full flex-1 flex flex-col-reverse p-2">
                <h1>Created by Abdul Aziz</h1>
            </div>
        </div>
        <router-view/>
    </template>

    <style scoped>




    </style>