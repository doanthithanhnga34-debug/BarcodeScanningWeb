<template>
  <div class="branch-card flex items-center justify-between w-full p-6 border-1 border-gray-100 hover:-translate-y-0.5 transition">
    <div class="branch-card__icon w-20 bg-red-50 rounded-xl p-2">
      <img :src="locationIcon" alt="" class=" w-20">
    </div>
   <div>
    <p class="branch-card__name w-60 font-bold text-left pl-8 text-lg">
      {{branch.name }}
    </p>
   </div>
   <i class="pi pi-angle-right text-gray-400 !text-lg"></i>
  </div>
</template>
<script setup>
import locationIcon from '../../assets/image/locationsvg.svg'

defineProps({
  branch: Object,
});
</script>
