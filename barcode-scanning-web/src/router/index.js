import {createRouter, createWebHistory} from 'vue-router'
import ScannerPage from '../pages/ScannerPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import Home from '../pages/Home.vue'
import ActionSelectionPage from '../pages/ActionSelectionPage.vue'
import ProductPage from '../pages/ProductPage.vue'

const routes =[
    {
        path:"/",
        name:'Home',
        component: Home
    },
    {
        path:"/action",
        name:'Action',
        component:ActionSelectionPage
    },
    {
        path:"/scanner",
        name:'Scanner',
        component: ScannerPage
    },
    {
        path:"/product",
        name:"ProductPage",
        component: ProductPage
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