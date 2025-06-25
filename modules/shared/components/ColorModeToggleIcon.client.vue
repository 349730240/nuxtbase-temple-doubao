<script setup lang="ts">
import { MoonIcon, SunIcon } from "lucide-vue-next";
</script>

<template>
  <component
    :is="$colorMode.value === 'light' ? SunIcon : MoonIcon"
    class="size-4 dark:text-white"
  />
</template>
