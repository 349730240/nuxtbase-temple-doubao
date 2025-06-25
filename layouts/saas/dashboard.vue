<script lang="ts" setup></script>

<template>
  <div class="flex flex-col lg:flex-row h-screen">
    <div class="hidden lg:block">
      <SaasSideBar />
    </div>
    <div class="lg:hidden">
      <SaasHeader />
    </div>
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
