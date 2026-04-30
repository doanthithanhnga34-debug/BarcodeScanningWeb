import {createRouter, createWebHistory} from 'vue-router'
import ScannerPage from '../pages/ScannerPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import Home from '../pages/Home.vue'

const routes =[
    {
        path:"/",
        name:'Home',
        component: Home
    },
    {
        path:"/scanner",
        name:'Scanner',
        component: ScannerPage
    },
    {
        path:'/history',
        name:'history',
        component:HistoryPage
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes
})