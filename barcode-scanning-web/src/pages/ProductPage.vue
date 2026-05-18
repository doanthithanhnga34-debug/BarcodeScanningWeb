<script setup>
import { computed, onMounted, ref } from "vue";
import Nav from "../components/Common/Nav.vue";
import Search from "../components/Common/Search.vue";
import ProductList from "../components/Product/ProductList.vue";
import { useRouter } from "vue-router";
import { getProductCache, setProductCache } from "../services/productCache";
import { getAllProducts } from "../services/appScriptService";
import ExpiryForm from "../components/BarcodeScanner/ExpiryForm.vue";
import Fuse from "fuse.js";

const selectedBranch = sessionStorage.getItem("selectedBranch") || null;
const router = useRouter();
const productMap = ref({});
const isProductPreloaded = ref(false);
const keyWord = ref("");
const selectedProduct = ref(null);
const isShowExpiryForm = ref(false);
const productList = ref([]);

const mapProductsToList = (products) => {
  return Object.entries(products || {}).map(([barcode, product]) => ({
    barcode,
    ...product,
    searchName: normalizeText(product.name),
  }));
};

onMounted(async () => {
  if (!selectedBranch) {
    router.push("/");
    return;
  }

  const cachedProducts = getProductCache(selectedBranch);

  if (cachedProducts) {
    productMap.value = cachedProducts;
    productList.value = mapProductsToList(cachedProducts);

    isProductPreloaded.value = true;
  }

  try {
    const response = await getAllProducts(selectedBranch);

    console.log("raw products response:", response);

    const products = response?.data ?? response ?? {};

    productMap.value = products;
    productList.value = mapProductsToList(products);
    setProductCache(selectedBranch, products);
    isProductPreloaded.value = true;

    console.log("products:", products);
  } catch (e) {
    console.log("error", e);
    isProductPreloaded.value = Boolean(cachedProducts);
  }
});

const normalizeText = (text) => {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .toLowerCase();
};

const handleSearch = (value) => {
  keyWord.value = value;
};
const isNumericKeyword = (text) => {
  return /^\d+$/.test(String(text || "").trim());
};

const filterProducts = computed(() => {
  const rawKeyword = keyWord.value.trim();

  if (!rawKeyword) {
    return productList.value;
  }

  const isNumberSearch = isNumericKeyword(rawKeyword);
  const q = normalizeText(rawKeyword);

  return productList.value.filter((product) => {
    const code = String(product.barcode || "")
      .trim()
      .toLowerCase();

    if (isNumberSearch) {
      return code.endsWith(q);
    }

    return product.searchName.includes(q);
  });
});

const handleSelectedProduct = (product) => {
  selectedProduct.value = product;
  isShowExpiryForm.value = true;
  console.log(product);
};

const closeExpiryForm = () => {
  isShowExpiryForm.value = false;
  selectedProduct.value = null;
};
</script>

<template>
  <div class="h-dvh overflow-hidden screen-bg flex flex-col">
    <Nav />

    <div class="flex min-h-0 flex-1 flex-col px-4 pt-6">
      <div class="shrink-0 px-4 pb-3">
        <Search @search="handleSearch" placeholder="Search product..." />
      </div>
     <div class="min-h-0 flex-1">
        <ProductList
          :products="filterProducts"
          @select="handleSelectedProduct"
        />
      </div>
    </div>
    <ExpiryForm
      v-if="isShowExpiryForm && selectedProduct"
      :barcode="selectedProduct.barcode"
      :productName="selectedProduct.name"
      @close="closeExpiryForm"
    />
  </div>
</template>
