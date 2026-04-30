<template>

    <BranchSelectorRecentCard/>

  <div class="w-full px-6">
    <h5 class="w-full py-6 font-bold text-lg text-left">All Branches
        <span>(24)</span>
    </h5>
    <ul class=" p-0 m-0 list-none bg-white rounded-xl shadow overflow-hidden">
      <li
        v-for="branch in branches"
        :key="branch.id"
        class=""
      >
        <BranchSelectorCard :branch="branch" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import BranchSelectorCard from "./BranchSelectorCard.vue";
import BranchSelectorRecentCard from "./BranchSelectorRecentCard.vue";
import { ref } from "vue";

const branches = ref([
  {
    id: 1,
    name: "Trương Hoàng Thanh",
    link: "",
  },
  {
    id: 2,
    name: "Hoàng Thùy Linh",
    link: "",
  },
   {
    id: 3,
    name: "Đặng Văn Bi",
    link: "",
  },
]);
</script>
