<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Icon } from "@iconify/vue";
import auditLogsData from "../../mock/auditLogs.json";

// Search query
const searchQuery = ref("");

// Selected log for detail view
const selectedLog = ref<any>(null);

// Pretty-print JSON strings
const prettyJson = (str: string) => {
  if (!str) return "—";
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
};

// Open / close detail modal
const openDetail = (log: any) => {
  selectedLog.value = log;
};
const closeDetail = () => {
  selectedLog.value = null;
};

// Filter out metric logs, sort by timestamp descending
const auditLogs = computed(() => {
  return auditLogsData
    .filter((log: any) => log.ev !== "funnel_metric" && log.ev !== "time_metric")
    .sort((a: any, b: any) => new Date(b.t).getTime() - new Date(a.t).getTime());
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(7);

// Apply local search query
const filteredLogsAll = computed(() => {
  if (!searchQuery.value) return auditLogs.value;
  const q = searchQuery.value.toLowerCase();
  return auditLogs.value.filter(
    (log: any) =>
      log.r.toLowerCase().includes(q) ||
      log.u.toLowerCase().includes(q) ||
      log.ev.toLowerCase().includes(q)
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredLogsAll.value.length / itemsPerPage.value))
);

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredLogsAll.value.slice(start, end);
});

const pageStart = computed(() =>
  filteredLogsAll.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage.value + 1
);
const pageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredLogsAll.value.length)
);

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

// Device icon mapping
const getDeviceIcon = (os?: string) => {
  const o = (os || "").toLowerCase();
  if (o.includes("android")) return "lucide:smartphone";
  if (o.includes("ios")) return "lucide:smartphone";
  if (o.includes("windows")) return "lucide:monitor";
  if (o.includes("mac")) return "lucide:laptop";
  if (o.includes("linux")) return "lucide:terminal";
  return "lucide:smartphone";
};
</script>

<template>
  <div class="premium-glass p-6 rounded-2xl border border-[var(--panel-border)] shadow-sm flex flex-col justify-between w-full h-full min-h-[508px]">
    <!-- Header -->
    <div class="space-y-5 flex-1 flex flex-col">
      <div>
        <h3 class="text-base font-bold uppercase tracking-wider text-[var(--text-main)]">Audit Log Explorer</h3>
        <p class="text-sm text-[var(--text-muted)]">Search and explore all audit logs</p>
      </div>

      <!-- Controls Row -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by event, API, user, process code..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/30 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Icon icon="lucide:search" class="w-5 h-5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
        </div>
      
      </div>

      <!-- Logs Mini Table -->
      <div class="w-full overflow-x-auto flex-1 mt-2">
        <table class="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr class="border-b border-[var(--panel-border)] text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] pb-3">
              <th class="pb-3 w-24">Time</th>
              <th class="pb-3 w-32">Process Code</th>
              <th class="pb-3 w-24">User ID</th>
              <th class="pb-3">Event</th>
              <th class="pb-3 w-28">Status</th>
              <th class="pb-3 w-24">Device</th>
              <th class="pb-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--panel-border)]/50 text-sm font-medium">
            <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-500/5 transition-colors group">
              <!-- Time -->
              <td class="py-4 font-code text-[var(--text-muted)]">
                {{ formatTime(log.t) }}
              </td>

              <!-- Process Code -->
              <td class="py-4 text-[var(--text-main)] font-code">
                {{ log.r }}
              </td>

              <!-- User -->
              <td class="py-4 text-[var(--text-muted)]">
                U{{ log.u }}
              </td>

              <!-- Event -->
              <td class="py-4 text-[var(--text-main)]">
                {{ log.ev }}
              </td>

              <!-- Status Badge -->
              <td class="py-4">
                <span :class="['px-2.5 py-1 rounded-md text-xs font-bold border inline-flex items-center gap-1.5', getStatusDetails(log.ev).bg]">
                  <Icon :icon="getStatusDetails(log.ev).icon" class="w-3.5 h-3.5" />
                  {{ getStatusDetails(log.ev).label }}
                </span>
              </td>

              <!-- Device Info -->
              <td class="py-4">
                <div v-if="log.device_info" class="flex items-center gap-2">
                  <Icon :icon="getDeviceIcon(log.device_info.os)" class="w-4 h-4 text-[var(--text-muted)]" />
                  <span class="text-xs text-[var(--text-main)] font-medium">{{ log.device_info.os }}</span>
                </div>
                <span v-else class="text-xs text-[var(--text-muted)]">—</span>
              </td>

              <!-- Expand Action -->
              <td class="py-4 text-center">
                <button
                  @click="openDetail(log)"
                  class="text-[var(--text-muted)] hover:text-indigo-500 transition-colors p-1 cursor-pointer"
                >
                  <Icon icon="lucide:eye" class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="paginatedLogs.length === 0">
              <td colspan="7" class="py-12 text-center text-[var(--text-muted)] font-medium text-sm">
                No logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="border-t border-[var(--panel-border)] pt-4 mt-4 flex items-center justify-between">
      <span class="text-xs text-[var(--text-muted)] font-medium">
        Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredLogsAll.length }}
      </span>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-3 py-1.5 rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)]/30 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-500/10 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
        >
          <Icon icon="lucide:chevron-left" class="w-3.5 h-3.5" />
          Prev
        </button>

        <span class="text-xs font-bold text-[var(--text-main)] px-2">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-3 py-1.5 rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)]/30 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-500/10 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
        >
          Next
          <Icon icon="lucide:chevron-right" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedLog"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          @click="closeDetail"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="selectedLog"
              class="w-full max-w-2xl max-h-[85vh] bg-[var(--panel-bg)] rounded-2xl border border-[var(--panel-border)] shadow-2xl flex flex-col overflow-hidden"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between px-6 py-5 border-b border-[var(--panel-border)] shrink-0">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Icon icon="lucide:file-text" class="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 class="text-base font-bold text-[var(--text-main)]">Audit Log Detail</h4>
                    <p class="text-xs text-[var(--text-muted)]">Log ID: <span class="font-code">{{ selectedLog.id }}</span></p>
                  </div>
                </div>
                <button
                  @click="closeDetail"
                  class="p-2 rounded-lg hover:bg-slate-500/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:x" class="w-5 h-5" />
                </button>
              </div>

              <!-- Modal Body -->
              <div class="flex-1 overflow-y-auto p-6 space-y-5">
                <!-- Info Table -->
                <div class="rounded-xl border border-[var(--panel-border)] overflow-hidden">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-[var(--panel-border)]/50">
                      <tr class="bg-[var(--panel-bg)]/30">
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium w-36">Time</td>
                        <td class="py-3 px-4 text-[var(--text-main)] font-code">{{ formatTime(selectedLog.t) }}</td>
                      </tr>
                      <tr>
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">Event</td>
                        <td class="py-3 px-4 text-[var(--text-main)] font-semibold">{{ selectedLog.ev }}</td>
                      </tr>
                      <tr class="bg-[var(--panel-bg)]/30">
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">Status</td>
                        <td class="py-3 px-4">
                          <span
                            :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border', getStatusDetails(selectedLog.ev).bg]"
                          >
                            <Icon :icon="getStatusDetails(selectedLog.ev).icon" class="w-3.5 h-3.5" />
                            {{ getStatusDetails(selectedLog.ev).label }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">Service</td>
                        <td class="py-3 px-4 text-[var(--text-main)]">{{ selectedLog.s }}</td>
                      </tr>
                      <tr class="bg-[var(--panel-bg)]/30">
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">User ID</td>
                        <td class="py-3 px-4 text-[var(--text-main)] font-code">U{{ selectedLog.u }}</td>
                      </tr>
                      <tr>
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">Org ID</td>
                        <td class="py-3 px-4 text-[var(--text-main)] font-code">{{ selectedLog.o }}</td>
                      </tr>
                      <tr class="bg-[var(--panel-bg)]/30">
                        <td class="py-3 px-4 text-[var(--text-muted)] font-medium">Process Code</td>
                        <td class="py-3 px-4 text-[var(--text-main)] font-code">{{ selectedLog.r }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Device Info Card -->
                <div v-if="selectedLog.device_info" class="rounded-xl border border-[var(--panel-border)] p-5 space-y-4">
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:cpu" class="w-4 h-4 text-[var(--text-muted)]" />
                    <span class="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Device Information</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Icon :icon="getDeviceIcon(selectedLog.device_info.os)" class="w-6 h-6 text-indigo-500" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-[var(--text-main)] truncate">
                        {{ selectedLog.device_info.os }} {{ selectedLog.device_info.os_version }}
                      </p>
                      <p class="text-xs text-[var(--text-muted)] mt-0.5">
                        {{ selectedLog.device_info.browser }} · {{ selectedLog.device_info.device_type }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-[var(--panel-bg)]/50 rounded-lg p-3 border border-[var(--panel-border)]">
                      <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Screen</span>
                      <p class="text-xs font-medium text-[var(--text-main)] mt-1 font-code">{{ selectedLog.device_info.screen_resolution }}</p>
                    </div>
                    <div class="bg-[var(--panel-bg)]/50 rounded-lg p-3 border border-[var(--panel-border)]">
                      <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Language</span>
                      <p class="text-xs font-medium text-[var(--text-main)] mt-1 font-code">{{ selectedLog.device_info.language }}</p>
                    </div>
                  </div>
                </div>

                <!-- Request Metadata -->
                <div v-if="selectedLog.m">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:server" class="w-4 h-4 text-[var(--text-muted)]" />
                    <span class="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Request Metadata</span>
                  </div>
                  <pre class="bg-slate-950/60 rounded-xl p-4 text-xs font-code text-emerald-400 border border-[var(--panel-border)] leading-relaxed whitespace-pre-wrap break-all">{{ prettyJson(selectedLog.m) }}</pre>
                </div>

                <!-- User Data -->
                <div v-if="selectedLog.ud">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:user" class="w-4 h-4 text-[var(--text-muted)]" />
                    <span class="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">User Data</span>
                  </div>
                  <pre class="bg-slate-950/60 rounded-xl p-4 text-xs font-code text-blue-400 border border-[var(--panel-border)] leading-relaxed whitespace-pre-wrap break-all">{{ prettyJson(selectedLog.ud) }}</pre>
                </div>

                <!-- Request Data -->
                <div v-if="selectedLog.rd">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:database" class="w-4 h-4 text-[var(--text-muted)]" />
                    <span class="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Request Data</span>
                  </div>
                  <pre class="bg-slate-950/60 rounded-xl p-4 text-xs font-code text-amber-400 border border-[var(--panel-border)] leading-relaxed whitespace-pre-wrap break-all">{{ prettyJson(selectedLog.rd) }}</pre>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
