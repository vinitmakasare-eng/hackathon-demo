<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useDashboardMetrics } from "../../composables/useDashboardMetrics";

const { deviceOs, deviceType } = useDashboardMetrics();

const osList = computed(() => [
  { label: "Android", value: deviceOs.value.Android, icon: "lucide:smartphone", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "iOS", value: deviceOs.value.iOS, icon: "lucide:smartphone", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Windows", value: deviceOs.value.Windows, icon: "lucide:monitor", color: "text-sky-500", bg: "bg-sky-500/10" },
  { label: "macOS", value: deviceOs.value.macOS, icon: "lucide:laptop", color: "text-violet-500", bg: "bg-violet-500/10" },
  { label: "Linux", value: deviceOs.value.Linux, icon: "lucide:terminal", color: "text-amber-500", bg: "bg-amber-500/10" },
]);

const typeList = computed(() => [
  { label: "Mobile", value: deviceType.value.Mobile, icon: "lucide:smartphone", color: "text-emerald-500" },
  { label: "Desktop", value: deviceType.value.Desktop, icon: "lucide:monitor", color: "text-blue-500" },
  { label: "Tablet", value: deviceType.value.Tablet, icon: "lucide:tablet", color: "text-violet-500" },
]);

const maxOsValue = computed(() => Math.max(...Object.values(deviceOs.value)));
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm flex flex-col h-[340px] overflow-hidden">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:smartphone" class="w-4 h-4 text-indigo-500" />
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">Device Info</h3>
        </div>
        <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
          <Icon icon="lucide:info" class="w-3.5 h-3.5" />
        </button>
      </div>
      <p class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">OS & device breakdown</p>
    </div>

    <!-- OS Distribution Bars -->
    <div class="flex-1 mt-4 space-y-2.5">
      <div
        v-for="os in osList"
        :key="os.label"
        class="flex items-center gap-3"
      >
        <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0', os.bg]">
          <Icon :icon="os.icon" :class="['w-3.5 h-3.5', os.color]" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-[var(--text-main)]">{{ os.label }}</span>
            <span class="text-xs font-code text-[var(--text-muted)]">{{ os.value.toLocaleString() }}</span>
          </div>
          <div class="w-full h-1.5 rounded-full bg-[var(--panel-border)]/30 overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500', os.bg.replace('/10', '/60')]"
              :style="{ width: `${(os.value / maxOsValue) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Stats Row -->
    <div class="border-t border-[var(--panel-border)] pt-3 mt-3 grid grid-cols-3 gap-2">
      <div v-for="type in typeList" :key="type.label" class="text-center">
        <div class="flex items-center justify-center gap-1">
          <Icon :icon="type.icon" :class="['w-3 h-3', type.color]" />
          <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{{ type.label }}</span>
        </div>
        <p class="text-sm font-extrabold text-[var(--text-main)] font-code mt-0.5">{{ type.value.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
