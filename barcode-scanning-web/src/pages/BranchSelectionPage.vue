<script setup>
import BranchSelectorList from "../components/BranchSelector/BranchSelectorList.vue";
import Search from "../components/Common/Search.vue";
</script>

<template>
  <div class="px-5 pb-8 pt-8 flex flex-col items-start">
    <section class="mb-6">
      <h2 class=" text-left text-sm font-bold text-slate-500">
        Select Branch
      </h2>

      <p class="mt-2 text-sm text-slate-500">
        Choose a branch to continue scanning products.
      </p>
    </section>
    <!-- Search -->
    <Search/>
<!-- Branch Selector List -->
    <BranchSelectorList />
  </div>
</template>
