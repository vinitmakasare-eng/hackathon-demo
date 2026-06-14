<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import journeyData from "../../mock/journeyData.json";

// Search query
const searchQuery = ref("");

// Filter out metric logs, sort by timestamp descending
const auditLogs = computed(() => {
  return journeyData
    .filter((log) => log.ev !== "funnel_metric" && log.ev !== "time_metric")
    .sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime());
});

// Apply local search query
const filteredLogs = computed(() => {
  if (!searchQuery.value) return auditLogs.value.slice(0, 7); // Show top 7 by default
  const q = searchQuery.value.toLowerCase();
  return auditLogs.value
    .filter(
      (log) =>
        log.r.toLowerCase().includes(q) ||
        log.u.toLowerCase().includes(q) ||
        log.ev.toLowerCase().includes(q)
    )
    .slice(0, 7);
});

// Format time to HH:MM:SS format
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) return timeStr;
  return date.toTimeString().split(" ")[0];
};

// Status mapping helper
const getStatusDetails = (event: string) => {
  const ev = event.toLowerCase();
  if (ev.includes("fail") || ev.includes("error")) {
    return { label: "Failed", bg: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: "lucide:x-circle" };
  }
  if (ev.includes("success") || ev.includes("completed")) {
    return { label: "Success", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: "lucide:check-circle" };
  }
  return { label: "info", bg: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: "lucide:info" };
};
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm flex flex-col justify-between h-[508px] overflow-hidden">
    <!-- Header -->
    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">Audit Log Explorer</h3>
        <p class="text-xs text-[var(--text-muted)]">Search and explore all audit logs</p>
      </div>

      <!-- Controls Row -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by event, API, user, process code..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/30 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Icon icon="lucide:search" class="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
        </div>
        <button class="px-3 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/30 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-500/10 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
          <Icon icon="lucide:sliders-horizontal" class="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      <!-- Logs Mini Table -->
      <div class="w-full overflow-x-auto">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-[var(--panel-border)] text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] pb-2">
              <th class="pb-2 w-16">Time</th>
              <th class="pb-2">Process Code</th>
              <th class="pb-2">User ID</th>
              <th class="pb-2">Event</th>
              <th class="pb-2 w-16">Status</th>
              <th class="pb-2 w-8 text-center"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--panel-border)]/50 text-[11px] font-semibold">
            <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-slate-500/5 transition-colors group">
              <!-- Time -->
              <td class="py-2.5 font-code text-[var(--text-muted)]">
                {{ formatTime(log.t) }}
              </td>

              <!-- Process Code -->
              <td class="py-2.5 text-[var(--text-main)] font-code">
                {{ log.r }}
              </td>

              <!-- User -->
              <td class="py-2.5 text-[var(--text-muted)]">
                U{{ log.u }}
              </td>

              <!-- Event -->
              <td class="py-2.5 text-[var(--text-main)] truncate max-w-[120px]" :title="log.ev">
                {{ log.ev }}
              </td>

              <!-- Status Badge -->
              <td class="py-2.5">
                <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-0.5', getStatusDetails(log.ev).bg]">
                  <Icon :icon="getStatusDetails(log.ev).icon" class="w-2.5 h-2.5" />
                  {{ getStatusDetails(log.ev).label }}
                </span>
              </td>

              <!-- Expand Action -->
              <td class="py-2.5 text-center">
                <button class="text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
                  <Icon icon="lucide:eye" class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="6" class="py-8 text-center text-[var(--text-muted)] font-medium">
                No logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer link -->
    <div class="border-t border-[var(--panel-border)] pt-3 flex items-center justify-between">
      <a href="#" class="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
        View all logs
        <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
