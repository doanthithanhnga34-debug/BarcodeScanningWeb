<template>
  <div
    class="flex h-full px-5 py-5 w-full shadow-sm items-center gap-4 rounded-2xl bg-white ring-1 ring-black/5 active:scale-[0.98] transition"
    @click="selectProduct"
  >
    <div
      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff]"
    >
      <img
        :src="
          productItem.image
            ? productItem.image
            : 'https://img.icons8.com/forma-thin/48/product.png'
        "
        alt="product"
        loading="lazy"
        class="max-h-12 max-w-12 object-contain"
      />
    </div>
    <div class="min-w-0 flex-1 text-left">
      <h5 class="line-clamp-2 text-[15px] font-semibold leading-snug text-[#5b5670]">{{ productItem.name }}</h5>
      <p class="mt-1 text-xs text-[#8f8aa3]">{{ barcode }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
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
