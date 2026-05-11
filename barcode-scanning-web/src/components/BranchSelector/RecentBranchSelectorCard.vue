<template>
  <div v-if="recentBranches.length" class="w-full mb-8">
    <div class="mb-3 flex items-center justify-between">
      <p class="text-sm font-bold text-slate-500">Recently Visited</p>
      <span
        class="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
      >
        Last used
      </span>
    </div>

    <div>
      <button
        v-for="branch in recentBranches"
        :key="branch.id"
        class="w-full card rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
        @click="selectBranch(branch)"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 shrink-0 icon-box text-3xl">
            <i class="pi pi-shop"></i>
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="truncate text-base font-bold text-slate-800">
              {{ branch.name }}
            </h3>
          </div>

          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg"
          >
            <i class="pi pi-star-fill text-yellow-500"></i>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import storeIcon from "../../assets/image/store.svg";
import { onMounted, ref } from "vue";
import { getRecentBranches } from "../../utils/recentBranches";
import { useRouter } from "vue-router";
const recentBranches = ref([]);
const router = useRouter();
onMounted(() => {
  recentBranches.value = getRecentBranches();
});

function selectBranch(branch) {
  sessionStorage.setItem("selectedBranch", branch.name);
  router.push({
    path: "/action",
  });
}
</script>
