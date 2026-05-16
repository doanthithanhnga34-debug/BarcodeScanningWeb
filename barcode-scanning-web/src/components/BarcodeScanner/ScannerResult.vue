<template>
  <div class="px-3 py-6 z-50 fadeInUp">
    <div
      class="flex flex-row justify-around items-center p-4 bg-[#f3f3fd] rounded-lg mb-3 border-fushia-50 shadow-xs"
    >
      <div
        class="flex basis-1/3  items-center justify-center"
      >
        <img
          width="48"
          height="48"
          :src="
            product.image
              ? product.image
              : 'https://img.icons8.com/forma-thin/48/product.png'
          "
          alt="product"
        />
      </div>
      <p v-if="loading" class="mt-1 text-sm font-bold text-gray-500">
        Đang lấy thông tin...
      </p>
      <p
        v-else-if="product"
        class="basis-2/3 text-sm text-gray-500 font-bold "
      >
        {{ productName }}
      </p>
      <p v-else class="text-sm text-red-500 font-bold">
        {{ errorMessage || "Không tìm thấy sản phẩm" }}
      </p>
    </div>
    <button
      class="button flex items-center justify-center w-full bg-blue-700 p-4 rounded-xl text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition"
      @click="isShowModal"
    >
      Xác nhận
    </button>
    <span class="mt-3 text-center text-xs text-slate-400">
      Chạm “Xác nhận” để thiết lập hạn sử dụng
    </span>
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
