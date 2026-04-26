<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="mx-auto max-w-2xl">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">
          Scan History
        </h1>

        <button
          class="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          @click="clearHistory"
        >
          Clear
        </button>
      </div>

      <div
        v-if="scanHistory.length === 0"
        class="rounded-xl bg-white p-6 text-center shadow"
      >
        <p class="text-gray-500">No scan history yet.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in scanHistory"
          :key="item.id"
          class="rounded-xl bg-white p-4 shadow"
        >
          <p class="break-all text-lg font-semibold text-gray-900">
            {{ item.value }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            {{ item.date }}
          </p>
        </div>
      </div>

      <RouterLink
        to="/"
        class="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
      >
        Back to Scanner
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const scanHistory = ref([])

onMounted(() => {
  const savedHistory = localStorage.getItem('scanHistory')

  if (savedHistory) {
    scanHistory.value = JSON.parse(savedHistory)
  }
})

function clearHistory() {
  localStorage.removeItem('scanHistory')
  scanHistory.value = []
}
</script>