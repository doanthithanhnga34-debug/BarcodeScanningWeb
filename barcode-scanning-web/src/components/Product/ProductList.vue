<script setup>
import { computed, onMounted } from "vue";
import { getProductCache } from "../../services/productCache";
import ProductItem from "./ProductItem.vue";
import { RecycleScroller } from "vue-virtual-scroller";

defineProps({
  products: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["select"]);
</script>

<template>
  <RecycleScroller
    class="h-full overflow-y-auto px-4 pb-6"
    :items="products"
    :item-size="112"
    key-field="barcode"
    :buffer="300"
    v-slot="{ item }"
  >
    <div class="h-[112px] pb-3">
      <ProductItem
        :productItem="item"
        :barcode="item.barcode"
        class="h-[100px]"
        @select="emit('select', $event)"
      />
    </div>
  </RecycleScroller>
</template>
