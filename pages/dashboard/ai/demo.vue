<script setup lang="ts">
definePageMeta({
  layout: "saas-dashboard",
});

useHead({
  title: "AI应用",
});
</script>

<template>
  <div class="container py-8">
    <div class="flex flex-col space-y-4">
      <h2 class="text-2xl font-bold tracking-tight text-foreground">
        AI应用演示
      </h2>
      <p class="text-sm text-muted-foreground">一个简单的AI应用演示</p>
      <EmojiDemo />
    </div>
  </div>
</template>
