<template>
  <Toast>
     <template #message="slotProps">
    <div
      class="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-xl backdrop-blur-md"
    >
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100"
      >
        <i class="pi pi-check text-emerald-500"></i>
      </div>

      <div class="flex-1">
        <p class="font-bold text-slate-800">
          {{ slotProps.message.summary }}
        </p>

        <p class="text-sm text-slate-500">
          {{ slotProps.message.detail }}
        </p>
      </div>
    </div>
  </template>
     </Toast>
</template>
