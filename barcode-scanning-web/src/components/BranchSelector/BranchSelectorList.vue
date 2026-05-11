<template>
  <BranchSelectorRecentCard />
  <div class="w-full">
    <div class="mb-3">
      <p class="text-left text-sm font-bold text-slate-500">
        All Branches
        <span class="text-slate-400"> ({{ totalBranches}}) </span>
      </p>
    </div>

    <div
      class="h-[400px] overflow-y-auto scrollbar-thin overflow-x-hidden rounded-lg border border-slate-100 card"
    >
      <div v-if="!branches.length" class="h-full w-full flex items-center justify-center">
        <p>No data found</p>
      </div>

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
import { useRouter } from "vue-router";
import BranchSelectorCard from "./BranchSelectorCard.vue";
import BranchSelectorRecentCard from "./RecentBranchSelectorCard.vue";
import { computed, ref } from "vue";
import { saveRecentBranch } from "../../utils/recentBranches";


const selectedBranch = ref();
defineProps({
  branches: {
    type: Array,
    required: true,
  },totalBranches: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

function selectBranch(branch) {
  saveRecentBranch(branch)
  sessionStorage.setItem("selectedBranch", branch.name);
  console.log("Selected branch:", branch.name);
  router.push({
    path: "/action",
    // query: {
    //   autoStart: "1",
    //   branchId: branch.id,
    // },
  });
}
</script>
