<template>
  <div
    class="flex items-center justify-between w-full border-gray-100 hover:bg-gray-50 active:scale-95 transition"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0"
      >
        <!-- <img :src="locationIcon" alt="" class="w-6 h-6 md:w-7 md:h-7" /> -->
         <i class="pi pi-map-marker"></i>
      </div>
      <div>
        <p class="font-semibold text-base md:text-lg truncate">
          {{ branch.name }}
        </p>
      </div>
    </div>

    <i class="pi pi-angle-right text-gray-400 text-lg md:text-xl ml-2"></i>
  </div>
</template>
<script setup>
import locationIcon from "../../assets/image/locationsvg.svg";
import locationIcon2 from "../../assets/image/locationsvg2.svg";
defineProps({
  branch: Object,
});
</script>
