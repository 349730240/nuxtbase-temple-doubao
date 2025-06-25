<template>
  <div>
    <MarketingNavBar />
    <main class="min-h-screen">
      <slot />
    </main>
    <MarketingFooter v-if="!route.path.startsWith('/docs')" />
  </div>
</template>

<script setup>
const route = useRoute();
</script>
