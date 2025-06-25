<script setup lang="ts">
const { user } = useUser();

interface Props {
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "size-8";
    case "lg":
      return "size-12";
    default:
      return "size-10";
  }
});

const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url);
</script>

<template>
  <Avatar :class="sizeClasses" class="bg-primary/10">
    <AvatarImage v-if="avatarUrl" :src="avatarUrl" />
    <AvatarFallback>
      <LucideUser />
    </AvatarFallback>
  </Avatar>
</template>
