<script setup lang="ts">
import {
  HomeIcon,
  ImageIcon,
  DatabaseIcon,
  Settings2Icon,
  LogOutIcon,
  CreditCardIcon,
  MoonIcon,
  SunIcon,
  SparkleIcon,
  CircleGaugeIcon,
} from "lucide-vue-next";

const { signOut } = useUser();
const route = useRoute();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const isActive = (path: string) => {
  if (path === "/dashboard") {
    return route.path === "/dashboard";
  }
  return route.path.startsWith(path);
};

const menuItems = [
  {
    label: "仪表盘",
    icon: HomeIcon,
    to: "/dashboard",
    primary: true,
  },
  {
    label: "数据库示例",
    icon: DatabaseIcon,
    to: "/dashboard/demo/notes",
    badge: "Demo",
  },
  {
    label: "存储示例",
    icon: ImageIcon,
    to: "/dashboard/demo/storage",
    badge: "Demo",
  },
  {
    label: "AI应用",
    icon: SparkleIcon,
    to: "/dashboard/ai/demo",
    badge: "Demo",
  },
  {
    label: "Token",
    icon: CircleGaugeIcon,
    to: "/dashboard/ai/tokens",
  },
  {
    label: "设置",
    icon: Settings2Icon,
    to: "/dashboard/settings",
  },
];

const bottomMenuItems = [
  {
    label: "设置",
    icon: Settings2Icon,
    to: "/dashboard/settings",
  },
  {
    label: "账单",
    icon: CreditCardIcon,
    to: "/dashboard/settings/billing",
  },
];

defineProps<{
  onNavigate?: () => void;
}>();
</script>

<template>
  <aside class="flex h-screen w-[250px] flex-col border-r">
    <div class="flex items-center gap-2 p-4">
      <NuxtLink to="/">
        <Logo class="h-4 mt-5" />
      </NuxtLink>
    </div>

    <nav class="flex-1 space-y-1 p-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
        :class="[
          isActive(item.to)
            ? 'bg-primary/10 text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ]"
        @click="onNavigate?.()"
      >
        <component :is="item.icon" class="size-4" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <div class="border-t p-2">
      <div class="group relative">
        <UserInfo />
        <div
          class="absolute bottom-full left-0 w-full invisible group-hover:visible bg-background border rounded-lg"
        >
          <nav class="space-y-1 p-2">
            <NuxtLink
              v-for="item in bottomMenuItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              @click="onNavigate?.()"
            >
              <component :is="item.icon" class="size-4" />
              <span>{{ item.label }}</span>
            </NuxtLink>

            <button
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              @click="toggleTheme"
            >
              <SunIcon v-if="isDark" class="size-4" />
              <MoonIcon v-else class="size-4" />
              <span>{{ isDark ? "日光模式" : "暗黑模式" }}</span>
            </button>

            <button
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              @click="signOut"
            >
              <LogOutIcon class="size-4" />
              <span>退出登录</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </aside>
</template>
