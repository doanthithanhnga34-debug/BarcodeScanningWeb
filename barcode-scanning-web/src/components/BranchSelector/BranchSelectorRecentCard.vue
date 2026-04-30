<template>
  <div class="w-full mb-8">
    <div class="mb-3 flex items-center justify-between">
      <p class="text-sm font-bold text-slate-500">Recently Visited</p>
      <span
        class="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
      >
        Last used
      </span>
    </div>

    <button
      class="w-full rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-3xl"
        >
          <img :src="storeIcon" alt="" />
        </div>

            <div class="min-w-0 flex-1">
              <h3 class="truncate text-base font-bold text-slate-800">
               Lê Quang Đinh
              </h3>

              <p class="mt-1 flex items-start gap-1 text-sm leading-5 text-slate-500">
                <span class="text-red-500">📍</span>
                <span>123 Lê Quang Đinh</span>
              </p>
            </div>

            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg">
              ⭐
            </div>
      </div>
    </button>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import storeIcon from "../../assets/image/store.svg";
</script>
