<template>
  <BranchSelectorRecentCard />
  <div class="w-full">
    <div class="mb-3">
      <p class="text-left text-sm font-bold text-slate-500">
        All Branches
        <span class="text-slate-400"> (24) </span>
      </p>
    </div>
    <div
      class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md"
    >
      <button
        v-for="branch in branches"
        :key="branch.id"
        class="flex w-full items-center gap-4 border-b border-slate-100 p-4 text-left transition last:border-b-0 hover:bg-slate-50 active:bg-slate-100"
        @click="selectBranch(branch)"
      >
        <BranchSelectorCard :branch="branch" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {useRouter } from "vue-router";
import BranchSelectorCard from "./BranchSelectorCard.vue";
import BranchSelectorRecentCard from "./BranchSelectorRecentCard.vue";
import { ref } from "vue";

const branches = ref([
  {
    id: 1,
    name: "Quận 10",
    link: "",
  },
  {
    id: 2,
    name: "Huỳnh Thiện Lộc",
    link: "",
  },
  {
    id: 3,
    name: "Đặng Văn Bi",
    link: "",
  },
   {
    id: 4,
    name: "Cần Thơ",
    link: "",
  },
   {
    id: 5,
    name: "Buôn Ma Thuộc",
    link: "",
  },
   {
    id: 6,
    name: "Lê Quang Định",
    link: "",
  },
   {
    id: 6,
    name: "Đoàn Hồng Phước",
    link: "",
  },
   {
    id: 6,
    name: "Lê Văn Thọ",
    link: "",
  },
   {
    id: 6,
    name: "Nguyễn Thị Định",
    link: "",
  },
]);
const router = useRouter();

function selectBranch(branch) {
  sessionStorage.setItem("selectedBranch", branch.name);
  console.log("Selected branch:",  branch.name);

  router.push({
    path:'/scanner',
    query:{
      autoStart:"1",
      branchId : branch.id
    }
  });
}
</script>
