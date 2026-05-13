<script setup>
import { computed, onMounted } from "vue";
import { getProductCache } from "../../services/productCache";
import ProductItem from "./ProductItem.vue";

defineProps({
  products: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["select"]);
</script>

<template>
  <div class="flex gap-4 flex-col items-center justify-center w-full">
    <ProductItem
      v-for="(productItem, barcode) in products"
      :key="barcode"
      :productItem="productItem"
      :barcode="barcode"
      @select="emit('select', $event)"
    />
  </div>
</template>
