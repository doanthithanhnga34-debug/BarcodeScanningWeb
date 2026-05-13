<script setup>
import { computed, onMounted, ref } from "vue";
import Nav from "../components/Common/Nav.vue";
import Search from "../components/Common/Search.vue";
import ProductList from "../components/Product/ProductList.vue";
import { useRouter } from "vue-router";
import { getProductCache, setProductCache } from "../services/productCache";
import { getAllProducts } from "../services/appScriptService";
import ExpiryForm from "../components/BarcodeScanner/ExpiryForm.vue";

const selectedBranch = sessionStorage.getItem("selectedBranch") || null;
const router = useRouter();
const productMap = ref({});
const isProductPreloaded = ref(false);
const keyWord = ref("");
const selectedProduct= ref(null);
const isShowExpiryForm = ref(false)
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

const handleSearch =(value)=>{
  keyWord.value= value;
}
const filterProducts =computed (()=>{
  const q = keyWord.value.trim().toLowerCase();
  if(!q){
    return productMap.value;
  }
   return Object.fromEntries(
    Object.entries(productMap.value).filter(([barcode, product]) => {
    const name = String(product.name || "").trim().toLowerCase();
    const code = String(barcode||"").trim().toLowerCase();

    return (name.includes(q) || code.endsWith(q))
  }))
})

const handleSelectedProduct = (product)=>{
  selectedProduct.value= product;
  isShowExpiryForm.value=true;
  console.log(product)
}

const closeExpiryForm=()=>{
  isShowExpiryForm.value=false;
  selectedProduct.value=null
}
</script>

<template>
  <div class="h-dvh screen-bg">
    <Nav />
    <div class="px-4 pt-6 border-t-1 border-white">
      <Search @search="handleSearch" placeholder="Search product..."/>
      <ProductList :products = "filterProducts" @select="handleSelectedProduct" />
    </div>
    <ExpiryForm v-if="isShowExpiryForm"  :barcode="selectedProduct.barcode" :productName="selectedProduct.name" @close="closeExpiryForm"/>
  </div>
</template>
