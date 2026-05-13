<template>
  <div class="absolute left-4 right-4 bottom-20 fadeInUp">
    <div
      class="card border-top rounded-3xl bg-white px-3 py-6 text-black shadow-lg z-50"
    >
      <div class="flex justify-around items-center gap-3">
        <div
          class="flex icon-box items-center justify-centerw-20 h-20 rounded-xl bg-primary"
        >
          <i class="pi pi-image"></i>
        </div>
        <p v-if="loading" class="mt-1 text-sm font-bold text-gray-500">
          Đang lấy thông tin...
        </p>
        <p v-else-if="product" class="text-sm text-gray-500 font-bold">
          {{ productName }}
        </p>
        <p v-else class="text-sm text-red-500 font-bold">
          {{ errorMessage || "Không tìm thấy sản phẩm" }}
        </p>
        <button
          class="flex items-center justify-center bg-black p-4 rounded-4xl"
          @click="isShowModal"
        >
          <i class="pi pi-plus text-white"></i>
        </button>
      </div>
    </div>
  </div>
  <Transition name="modal">
    <ExpiryForm
      v-if="isShowExpiryForm"
      :barcode="barcode"
      :productName="productName"
      @close="isShowExpiryForm = false"
      @save="handleSave"
      @scan-again="handleScanAgain"
    />
  </Transition>
</template>

<script setup>
import { computed, ref } from "vue";
import ExpiryForm from "./ExpiryForm.vue";

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
const emit = defineEmits(["scan-again", "add-product", "save-product"]);

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

const isShowExpiryForm = ref(false);

function isShowModal() {
  isShowExpiryForm.value = true;
}

function handleSave(data) {
  emit("save-product", data);
}
function handleScanAgain() {
  isShowExpiryForm.value = false;
  emit("scan-again");
}
</script>
