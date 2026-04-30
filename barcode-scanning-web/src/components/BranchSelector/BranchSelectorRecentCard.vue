<template>
  <div class="w-full mt-10 px-6">
    <div>
      <h5 class="text-sm text-left text-gray-400 font-medium">Recently Visited</h5>
    </div>

    <Card class="mt-6">
      <template #content>
        <div class="flex justify-between items-center">
          <img :src="storeIcon" alt="" class="w-20" />
          <div class="w-80 flex flex-col justify-start pl-8">
            <h5 class=" font-bold text-left text-lg">Lê Quang Định</h5>
            <span class="text-left ">
              <i class="pi pi-map-marker"></i>
              123 Lê Quang Định
            </span>
          </div>
          <i class="pi pi-star text-black w-20 !text-2xl"></i>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import storeIcon from "../../assets/image/store.svg";
</script>
