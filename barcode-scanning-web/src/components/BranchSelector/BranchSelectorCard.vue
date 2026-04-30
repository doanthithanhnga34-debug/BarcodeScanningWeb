<template>
  <div class ="branch-card card">
    <div class="branch-card__header">
      <div class="branch-card__icon avatar">
        <image />
      </div>
      <div class="branch-card__title info">
        <h4>{{ branch.name }}</h4>
      </div>
    </div>
    <button class="branch-card__button button-card">
        <span>Select Branch</span>
    </button>
  </div>
</template>
<script setup>
   defineProps({
    branch:Object
   })
</script>
