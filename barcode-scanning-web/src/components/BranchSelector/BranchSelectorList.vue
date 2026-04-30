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
const router = useRouter();

function selectBranch(branch) {
  console.log("Selected branch:", branch);
  router.push('/scanner');
}
</script>
