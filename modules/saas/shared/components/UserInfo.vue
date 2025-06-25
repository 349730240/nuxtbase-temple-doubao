<script setup lang="ts">
const { user } = useUser();

const name = computed(() => {
  return user.value?.user_metadata?.full_name || "用户";
});

const id = computed(() => {
  return user.value?.email || user.value?.phone || "";
});
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer">
    <UserAvatar size="sm" />
    <div class="flex flex-col">
      <div class="text-sm font-medium text-foreground">{{ name }}</div>
      <span class="text-xs text-muted-foreground">{{ id }}</span>
    </div>
  </div>
</template>
