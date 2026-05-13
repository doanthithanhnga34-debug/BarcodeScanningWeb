<template>
  <div
    class="flex p-5 w-90 rounded-lg bg-white card_box-shadow gap-2"
    @click="selectProduct"
  >
    <div
      class="bg-[#e7e7f1] w-1/4 p-2 rounded-md flex justify-center items-center"
    >
      <img
        width="48"
        height="48"
        src="https://img.icons8.com/forma-thin/48/product.png"
        alt="product"
      />
    </div>
    <div class="w-3/4 text-left">
      <h5 class="font-semibold text-lg">{{ productItem.name }}</h5>
      <p class="text-sm">{{ barcode }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
const props = defineProps({
  barcode: {
    type: String,
  },
  productItem: Object,
});

const emit = defineEmits(["select"]);

const selectProduct = () => {
  emit("select", {
    barcode: props.barcode,
    ...props.productItem,
  });
};
</script>
