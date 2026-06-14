<script setup lang="ts">
import { Icon } from "@iconify/vue";

const insights = [
  {
    title: "Critical Issue",
    desc: "OCR API failure rate increased by 18% in the last 7 days, impacting 48% of total failures.",
    icon: "lucide:alert-triangle",
    colorClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    action: "View affected journeys",
    btnColor: "text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
  },
  {
    title: "User Friction",
    desc: "Users spend 3x longer on the 'Other Photos' page compared to other steps.",
    icon: "lucide:hourglass",
    colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    action: "View time analysis",
    btnColor: "text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
  },
  {
    title: "Recommendation",
    desc: "Add image quality validation before OCR processing to reduce failure rate and improve user experience.",
    icon: "lucide:sparkles",
    colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    action: "See suggested actions",
    btnColor: "text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
  },
  {
    title: "Business Impact",
    desc: "Fixing OCR issues could improve completion rate by 12% and save approx. 1,500+ user drop-offs.",
    icon: "lucide:trending-up",
    colorClass: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    action: "View impact analysis",
    btnColor: "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
  }
];
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[var(--panel-border)] pb-3">
      <div class="flex items-center gap-2">
        <Icon icon="lucide:bot" class="w-5 h-5 text-indigo-500" />
        <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">AI Insights</h3>
      </div>
      <span class="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-md">
        Beta
      </span>
    </div>

    <!-- Insights Stack -->
    <div class="space-y-4">
      <div 
        v-for="insight in insights" 
        :key="insight.title"
        class="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/20 hover:bg-[var(--panel-bg)]/40 transition-colors space-y-2.5"
      >
        <div class="flex items-center gap-2">
          <div :class="['w-7 h-7 rounded-lg flex items-center justify-center border', insight.colorClass]">
            <Icon :icon="insight.icon" class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-[var(--text-main)]">{{ insight.title }}</span>
        </div>

        <p class="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
          {{ insight.desc }}
        </p>

        <button :class="['text-[11px] font-bold flex items-center gap-1 mt-1 cursor-pointer transition-colors', insight.btnColor]">
          {{ insight.action }}
          <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
