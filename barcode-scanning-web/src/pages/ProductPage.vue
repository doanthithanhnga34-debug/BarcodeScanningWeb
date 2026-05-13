<script setup>
import Nav from "../components/Common/Nav.vue";
import Search from "../components/Common/Search.vue";
import ProductList from "../components/Product/ProductList.vue";
</script>

<template>
  <div class="h-dvh screen-bg">
    <Nav />
    <div class="px-4 pt-6 border-t-1 border-white">
      <Search @search="keyWord" />
      <ProductList/>
    </div>
  </div>
</template>
