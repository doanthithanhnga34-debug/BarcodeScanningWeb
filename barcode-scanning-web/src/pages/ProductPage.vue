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
onMounted(() => {
  if (!selectedBranch) {
    router.push("/");
    return;
  }

  const cachedProducts = getProductCache(selectedBranch);
  console.log(cachedProducts);

  if (cachedProducts) {
    productMap.value = cachedProducts;
  }

  getAllProducts(selectedBranch)
    .then((products) => {
      productMap.value = products;
      setProductCache(selectedBranch, products);
    })
    .catch((e) => {
      console.log("error", e);
      isProductPreloaded.value = Boolean(cachedProducts);
    });
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

const productItems = computed(() => {
  return Object.entries(productMap.value).map(([barcode, product]) => ({
    barcode,
    ...product,
    searchName: normalizeText(product.name),
  }));
});

const fuse = computed(() => {
  return new Fuse(productItems.value, {
    keys: ["searchName", "barcode"],
    threshold: 0.35,
    ignoreLocation: true,
  });
});
const handleSearch = (value) => {
  keyWord.value = value;
};
const isNumericKeyword = (text) => {
  return /^\d+$/.test(String(text || "").trim());
};

const filterProducts = computed(() => {
  const rawKeyword = keyWord.value.trim();

  if (!rawKeyword) {
    return productMap.value;
  }

  const isNumberSearch = isNumericKeyword(rawKeyword);
  const q = normalizeText(rawKeyword);

  return Object.fromEntries(
    Object.entries(productMap.value).filter(([barcode, product]) => {
      const code = String(barcode || "")
        .trim()
        .toLowerCase();
      const name = normalizeText(product.name);

      if (isNumberSearch) {
        return code.endsWith(q);
      }

      return name.includes(q);
    }),
  );
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
  <div class="h-dvh screen-bg">
    <Nav />

    <div class="px-4 pt-6">
      <div class="px-4 pb-3  sticky top-3 ">
        <Search @search="handleSearch" placeholder="Search product..." />
      </div>
      <ProductList :products="filterProducts" @select="handleSelectedProduct" />
    </div>
    <ExpiryForm
      v-if="isShowExpiryForm && selectedProduct"
      :barcode="selectedProduct.barcode"
      :productName="selectedProduct.name"
      @close="closeExpiryForm"
    />
  </div>
</template>
