<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import auditLogs from "./mock/auditLogs.json";

// Initialize VueUse useDark to toggle 'dark' class on <html>
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
});
const toggleDark = useToggle(isDark);

// Derive quick stats for header
const totalCount = auditLogs.length;
const failureCount = auditLogs.filter((log) =>
  log.ev.toLowerCase().includes("fail"),
).length;
</script>

<template>
  <div
    class="min-h-screen relative font-sans text-[var(--text-main)] overflow-x-hidden pb-12"
  >
    <!-- Mesh Gradients for background aura -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Top-left Indigo Mesh -->
      <div
        class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full opacity-[0.15] dark:opacity-[0.25] blur-[120px]"
        style="
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.8) 0%,
            rgba(99, 102, 241, 0) 70%
          );
        "
      ></div>
      <!-- Bottom-right Purple/Pink Mesh -->
      <div
        class="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-[0.1] dark:opacity-[0.2] blur-[100px]"
        style="
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.8) 0%,
            rgba(168, 85, 247, 0) 70%
          );
        "
      ></div>
    </div>

    <!-- Sticky Glassmorphic Navbar Header -->
    <header
      class="sticky top-0 z-50 premium-glass border-b border-[var(--panel-border)] px-6 py-4 flex items-center justify-between backdrop-blur-md"
    >
      <div class="flex items-center gap-3">
        <!-- Logo Icon -->
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
        >
          <Icon icon="lucide:activity" class="w-6 h-6" />
        </div>
        <div>
          <h1
            class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            FlowPulse
          </h1>
          <p
            class="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] -mt-0.5"
          >
            User Journey Analytics
          </p>
        </div>
      </div>

      <!-- Center Status / Summary Widgets (Hidden on small screens) -->
      <div
        class="hidden md:flex items-center gap-6 text-sm border-x border-[var(--panel-border)] px-6"
      >
      

        <div class="flex items-center gap-2 text-xs">
          <span class="text-[var(--text-muted)]">Logs:</span>
          <span
            class="font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-code"
            >{{ 9847 }}</span
          >
        </div>

        <div class="flex items-center gap-2 text-xs">
          <span class="text-[var(--text-muted)]">Failures:</span>
          <span
            class="font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 dark:text-rose-400 font-code"
            >{{ 151 }}</span
          >
        </div>
      </div>

      <!-- Right Panel Controls -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle Button -->
        <button
          @click="toggleDark()"
          class="p-2.5 rounded-xl border border-[var(--panel-border)] bg-transparent hover:bg-slate-500/10 text-[var(--text-muted)] hover:text-[var(--text-main)] ease-premium cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="w-5 h-5" />
        </button>

        <!-- Profile Avatar -->
        <div class="flex items-center gap-2">
          <div
            class="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-500 text-sm"
          >
            VM
          </div>
          <div class="hidden lg:block text-left">
            <p class="text-xs font-semibold -mb-0.5">Vinit M.</p>
            <p
              class="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold"
            >
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="relative z-10 w-11/12 mx-auto px-4 md:px-6 pt-8">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Scoped overrides/tweaks if needed */
</style>
