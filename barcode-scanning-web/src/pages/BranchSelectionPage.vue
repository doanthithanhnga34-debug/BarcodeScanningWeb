<script setup>
import { computed, ref } from "vue";
import BranchSelectorList from "../components/BranchSelector/BranchSelectorList.vue";
import Search from "../components/Common/Search.vue";
import Fuse from "fuse.js";

const branches = ref([
  {
    id: 1,
    name: "Quận 10",
  },
  {
    id: 2,
    name: "Huỳnh Thiện Lộc",
  },
  {
    id: 3,
    name: "Đặng Văn Bi",
  },
  {
    id: 4,
    name: "Cần Thơ",
  },
  {
    id: 5,
    name: "Buôn Ma Thuộc",
  },
  {
    id: 6,
    name: "Lê Quang Định",
  },
  {
    id: 7,
    name: "Đoàn Hồng Phước",
  },
  {
    id: 8,
    name: "Lê Văn Thọ",
  },
  {
    id: 9,
    name: "Nguyễn Thị Định",
  },
]);
const keyword = ref("");
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
const fuse = computed(() => {
  const data = branches.value.map(branch => ({
    ...branch,
    searchName: removeVietnameseTones(
      branch.name.toLowerCase()
    ),
  }));

  return new Fuse(data, {
    keys: ["searchName"],
    threshold: 0.35,
    ignoreLocation: true,
  });
});

const filteredBranches = computed(() => {
  const searchText = removeVietnameseTones(
    keyword.value.trim().toLowerCase()
  );

  if (!searchText) {
    return branches.value;
  }

  return fuse.value
    .search(searchText)
    .map(result => result.item);
});


function filterBranch(value) {
  keyword.value = value;
}
</script>

<template>
  <div class="px-5 pb-8 pt-8 flex flex-col items-start bg-primary">
    <section class="mb-6">
      <h2 class="text-left text-sm font-bold text-slate-500">Select Branch</h2>

      <p class="mt-2 text-sm text-slate-500">
        Choose a branch to continue scanning products.
      </p>
    </section>
    <!-- Search -->
    <Search @search="filterBranch" />
    <!-- Branch Selector List -->
    <BranchSelectorList :branches="filteredBranches" :total-branches="branches.length" />
  </div>
</template>
