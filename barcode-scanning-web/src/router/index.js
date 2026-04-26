import {createRouter, createWebHistory} from 'vue-router'
import ScannerPage from '../pages/ScannerPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'

const routes =[
    {
        path:"/",
        name:'scanner',
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