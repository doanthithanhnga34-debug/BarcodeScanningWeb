<template>

<div class="flex w-100">
    <BranchSelectorCard v-for=" branch in branches " :key="branch.id"  :branch ="branch"/>

</div>

</template>


<script setup>
import BranchSelectorCard from './BranchSelectorCard.vue';
import { ref } from "vue"

const branches = ref([
    {
        id:1,
        name:"Trương Hoàng Thanh",
        link:""
    },
    {
        id:2,
        name:"Hoàng Thùy Linh",
        link:""
    }
])

</script>