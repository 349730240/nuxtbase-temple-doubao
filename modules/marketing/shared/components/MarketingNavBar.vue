<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";

const route = useRoute();
const { y: verticalScrollPosition } = useWindowScroll();
const { user } = useUser();
const initialScrollChecked = ref(false);

const isDoc = computed(() => {
  return route.fullPath.startsWith("/docs");
});

const isTop = computed(() => {
  if (!initialScrollChecked.value) return true;
  return verticalScrollPosition.value < 10;
});

const { public: runtimeConfig } = useRuntimeConfig();

const hasUser = computed(() => {
  return user.value;
});

const mobileMenuOpen = ref(false);

const isMenuItemActive = (to: string) => {
  // 对于首页路由特殊处理，只有完全匹配才高亮
  if (to === "/") {
    return route.fullPath === "/";
  }
  // 其他路由保持原有的前缀匹配逻辑
  return route.fullPath.startsWith(to);
};
onMounted(() => {
  initialScrollChecked.value = true;
});

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
  }
);

type MenuItem = {
  label: string;
  to: string;
};
const menuItems = computed<MenuItem[]>(() => [
  {
    label: "首页",
    to: "/",
  },
  {
    label: "价格",
    to: "/pricing",
  },
  {
    label: "博客",
    to: "/blog",
  },
  {
    label: "AI✨",
    to: "/ai",
  },
  {
    label: "文档",
    to: "/docs/guide/intro",
  },
]);
</script>
<template>
  <nav
    id="marketing-header"
    class="fixed left-0 top-0 z-50 w-full transition-[height] duration-200 rounded-b-lg"
    :class="[
      isTop ? 'shadow-none' : 'bg-background/80 shadow-sm backdrop-blur-lg',
    ]"
    data-test="navigation"
  >
    <div
      :class="[isDoc ? 'w-full px-4 border-b' : 'container']"
      class="relative z-50"
    >
      <div
        class="flex items-center justify-stretch gap-6 transition-all duration-200"
        :class="[isTop ? 'py-6' : 'py-4']"
      >
        <div class="flex flex-1 justify-start">
          <NuxtLink to="/" class="block hover:no-underline active:no-underline">
            <Logo />
          </NuxtLink>
        </div>

        <div class="hidden flex-1 items-center justify-center lg:flex">
          <NuxtLink
            v-for="menuItem of menuItems"
            :key="menuItem.to"
            :to="menuItem.to"
            class="block shrink-0 px-3 py-2 text-sm text-foreground hover:text-foreground/90"
            :class="[isMenuItemActive(menuItem.to) ? 'font-bold' : '']"
          >
            {{ menuItem.label }}
          </NuxtLink>
        </div>

        <div class="flex flex-1 items-center justify-end gap-2">
          <ClientOnly>
            <ColorModeToggle />
          </ClientOnly>
          <ClientOnly>
            <Sheet v-model:open="mobileMenuOpen">
              <SheetTrigger asChild>
                <Button class="lg:hidden" size="icon" variant="outline">
                  <LucideMenu class="size-4 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent class="w-[250px]" side="right">
                <VisuallyHidden>
                  <DialogTitle>菜单</DialogTitle>
                  <DialogDescription>导航菜单</DialogDescription>
                </VisuallyHidden>

                <div class="flex flex-col items-stretch justify-center mt-8">
                  <NuxtLink
                    v-for="menuItem of menuItems"
                    :key="menuItem.to"
                    :to="menuItem.to"
                    class="block w-full px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground/90 rounded-md"
                    :class="[isMenuItemActive(menuItem.to) ? 'font-bold' : '']"
                  >
                    {{ menuItem.label }}
                  </NuxtLink>

                  <NuxtLink
                    :to="
                      hasUser ? runtimeConfig.auth.redirectPath : '/auth/signin'
                    "
                    :prefetch="!hasUser"
                    class="block w-full px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground/90 rounded-md"
                  >
                    {{ hasUser ? "控制台" : "登录" }}
                  </NuxtLink>
                </div>
              </SheetContent>
            </Sheet>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink
              :to="hasUser ? runtimeConfig.auth.redirectPath : '/auth/signin'"
              :prefetch="!hasUser"
              class="text-primary-foreground"
            >
              <Button class="hidden lg:flex px-6">
                {{ hasUser ? "控制台" : "登录" }}
              </Button>
            </NuxtLink>
          </ClientOnly>
        </div>
      </div>
    </div>
  </nav>
</template>
