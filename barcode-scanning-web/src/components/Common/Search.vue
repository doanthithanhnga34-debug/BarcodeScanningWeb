<template>
  <section class="mb-7 w-full">
    <div
      class="relative flex card items-center gap-3 rounded-md border border-slate-100 bg-white px-4 py-3 shadow-sm"
    >
      <span class="text-slate-400">
        <i class="pi pi-search" style="font-size: 1rem"></i>
      </span>
      <input
        v-model="keyword"
        type="text"
        :placeholder="placeholder"
        class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />

      <button
        v-if="keyword"
        type="button"
        class="text-slate-400"
        @click="keyword = ''"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
  </section>
</template>
<script setup>
import { ref, watch, onUnmounted } from "vue";

defineProps({
  placeholder:{
    type:String,
    default:"Search..."
  }
})

const emit = defineEmits(["search"]);

const keyword = ref("");
let debounceTimer = null;

watch(keyword, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    emit("search", value);
  }, 300);
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>
