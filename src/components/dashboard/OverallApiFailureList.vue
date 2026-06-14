<script setup lang="ts">
import { Icon } from "@iconify/vue";

const apis = [
  { name: "Odometer OCR API", count: 120, percentage: 48, color: "bg-indigo-500" },
  { name: "Position Prediction API", count: 75, percentage: 30, color: "bg-purple-500" },
  { name: "Submit Inspection API", count: 23, percentage: 9, color: "bg-rose-500" },
  { name: "Image Upload API", count: 15, percentage: 6, color: "bg-emerald-500" },
  { name: "User Auth API", count: 8, percentage: 3, color: "bg-pink-500" }
];
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm flex flex-col justify-between h-[340px]">
    <div>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">Overall API Failure List</h3>
          <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" title="API failures grouped by endpoint">
            <Icon icon="lucide:info" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="api in apis" :key="api.name" class="space-y-1">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-[var(--text-main)]">{{ api.name }}</span>
            <span class="text-[var(--text-muted)] font-code">
              {{ api.count }} <span class="text-[var(--text-muted)]/60">({{ api.percentage }}%)</span>
            </span>
          </div>
          <!-- Progress Bar wrapper -->
          <div class="h-2 w-full rounded-full bg-slate-500/10 overflow-hidden relative">
            <div 
              :class="['h-full rounded-full transition-all duration-1000 ease-out', api.color]" 
              :style="`width: ${api.percentage}%`"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-[var(--panel-border)] pt-3 mt-3 flex items-center justify-between">
      <a href="#" class="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
        View all API failures
        <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
