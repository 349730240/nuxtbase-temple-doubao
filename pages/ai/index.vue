<script setup lang="ts">
definePageMeta({
  layout: "marketing",
  static: true,
});

useHead({
  title: "AI示例",
});
</script>

<template>
  <div class="container py-32 max-w-5xl">
    <div class="flex flex-col items-center justify-center gap-4 text-center">
      <h1 class="text-4xl font-bold">AI示例</h1>
      <p class="text-lg text-muted-foreground">不仅是全栈应用，更是AI应用</p>
    </div>
    <div>
      <EmojiDemo />
    </div>
  </div>
</template>
