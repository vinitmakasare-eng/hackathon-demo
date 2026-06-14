<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Trend {
  value: string;
  isPositive: boolean;
}

interface Props {
  title: string;
  value: string | number;
  icon: string;
  accentColor: "indigo" | "emerald" | "violet" | "rose";
  trend?: Trend;
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: "indigo",
});

// Map colors to classes for backgrounds and borders
const colorMap = {
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    borderGlow: "hover:border-indigo-500/30 hover:shadow-indigo-500/5",
    valueText: "text-indigo-600 dark:text-indigo-400",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    borderGlow: "hover:border-emerald-500/30 hover:shadow-emerald-500/5",
    valueText: "text-emerald-600 dark:text-emerald-400",
  },
  violet: {
    iconBg: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
    borderGlow: "hover:border-violet-500/30 hover:shadow-violet-500/5",
    valueText: "text-violet-600 dark:text-violet-400",
  },
  rose: {
    iconBg: "bg-rose-500/10 text-rose-500 dark:text-rose-400",
    borderGlow: "hover:border-rose-500/30 hover:shadow-rose-500/5",
    valueText: "text-rose-600 dark:text-rose-400",
  },
};
</script>

<template>
  <div
    :class="[
      'premium-glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36 border border-[var(--panel-border)] shadow-sm bg-[var(--panel-bg)]',
      colorMap[accentColor].borderGlow,
    ]"
  >
    <!-- Card Top Header -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {{ title }}
      </span>
      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', colorMap[accentColor].iconBg]">
        <Icon :icon="icon" class="w-5 h-5" />
      </div>
    </div>

    <!-- Card Body Metrics -->
    <div class="mt-4 flex items-end justify-between">
      <div>
        <h3 class="text-3xl font-extrabold font-code leading-none text-[var(--text-main)]">
          {{ value }}
        </h3>
      </div>

      <!-- Trend pill -->
      <div
        v-if="trend"
        :class="[
          'flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border',
          trend.isPositive
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        ]"
      >
        <Icon
          :icon="trend.isPositive ? 'lucide:arrow-up-right' : 'lucide:arrow-down-right'"
          class="w-3.5 h-3.5"
        />
        <span>{{ trend.value }}</span>
      </div>
    </div>

    <!-- Decorative background highlight -->
    <div
      class="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-5 dark:opacity-[0.03] pointer-events-none"
      :style="`background-color: currentColor`"
    ></div>
  </div>
</template>
