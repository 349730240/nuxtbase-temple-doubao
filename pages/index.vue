<script setup lang="ts">
definePageMeta({
  layout: "marketing",
  static: true,
});

useHead({
  title: "首页",
});
</script>

<template>
  <div class="container py-24">
    <div class="flex flex-col items-center justify-center gap-4 text-center">
      <MarketingHero />
      <MarketingFeatures />
      <MarketingTestimonials />
      <MarketingFAQs />
    </div>
  </div>
</template>
