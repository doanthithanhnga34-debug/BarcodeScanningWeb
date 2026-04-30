<template>
     <section class="mb-7 w-full">
        <div class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <span class="text-slate-400">
            <i class="pi pi-search" style="font-size: 1rem"></i>
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search branch name or address"
            class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </section>
</template>
<script setup>

</script>