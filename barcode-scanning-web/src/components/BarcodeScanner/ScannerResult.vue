<template>
  <div class="absolute left-4 right-4 bottom-20 fadeInUp">
    <div
      class="flex justify-around items-center rounded-3xl bg-white px-2 py-6 text-black shadow-lg z-50"
    >
      <div
        class="flex items-center justify-center bg-amber-300 w-20 h-20 rounded-xl"
      >
        <i class="pi pi-image"></i>
      </div>
      <p v-if="loading" class="mt-1 text-sm font-bold text-gray-500">
        Đang lấy thông tin...
      </p>
      <p v-else-if="product" class="text-sm text-gray-500 font-bold">
        {{ productName }}
      </p>
      <button class="flex items-center justify-center bg-black p-4 rounded-4xl">
        <i class="pi pi-plus text-white"></i>
      </button>
      <!-- <p class="mt-1 break-all text-lg font-bold">{{ result }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  barcode: {
    type: String,
    required: true,
  },
  product: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["scan-again", "add-product"]);

const productName = computed(() => {
  return (
    props.product?.name ||
    props.product?.productName ||
    props.product?.tenSanPham ||
    props.product?.["Tên sản phẩm"] ||
    props.product?.["ten_san_pham"] ||
    "Không có tên sản phẩm"
  );
});

const productPrice = computed(() => {
  return (
    props.product?.price ||
    props.product?.gia ||
    props.product?.["Giá"] ||
    props.product?.["gia_ban"] ||
    ""
  );
});

function addProduct() {
  if (!props.product) return;

  emit("add-product", props.product);
}
</script>
