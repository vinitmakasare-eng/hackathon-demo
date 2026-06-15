<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useDashboardMetrics } from "../composables/useDashboardMetrics";

const { selectedTimeframe, kpiValues } = useDashboardMetrics();
const selectedProcessCodeFilter = ref("All Process Codes");

const refreshDashboard = () => {
  // Mock refresh action - visual feedback
  const button = document.getElementById("refresh-btn");
  if (button) {
    button.classList.add("animate-spin");
    setTimeout(() => {
      button.classList.remove("animate-spin");
    }, 800);
  }
};
</script>

<template>
  <div class="space-y-8 pb-16 animate-fade-in">
    <!-- Premium Header Area -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Dashboard</h2>
        <p class="text-xs text-[var(--text-muted)] mt-1">
          Real-time overview of user journeys and system health
        </p>
      </div>

      <!-- Right Dashboard Filters -->
      <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
        <!-- Date Selector -->
        <div class="relative">
          <select
            v-model="selectedTimeframe"
            class="pl-9 pr-8 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/80 backdrop-blur-md text-xs font-bold text-[var(--text-main)] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <Icon icon="lucide:calendar" class="w-4 h-4 absolute left-3 top-2.5 text-indigo-500 pointer-events-none" />
          <Icon icon="lucide:chevron-down" class="w-3.5 h-3.5 absolute right-2.5 top-3 text-[var(--text-muted)] pointer-events-none" />
        </div>
        <!-- Refresh Button -->
      </div>
    </div>

    <!-- 6 KPI Grid Cards Row -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard
        title="Total Sessions"
        :value="kpiValues.totalSessions"
        icon="lucide:users"
        accentColor="indigo"

      />
      <KpiCard
        title="Completed Flows"
        :value="kpiValues.completedFlows"
        icon="lucide:check-circle"
        accentColor="emerald"

      />
      <KpiCard
        title="API Failures"
        :value="kpiValues.apiFailures"
        icon="lucide:alert-triangle"
        accentColor="rose"
      />
      <KpiCard
        title="Drop-off Rate"
        :value="kpiValues.dropOffRate"
        icon="lucide:trending-down"
        accentColor="violet"
      />
      <KpiCard
        title="Avg Flow Time"
        :value="kpiValues.avgFlowTime"
        icon="lucide:clock"
        accentColor="violet"
      />
      <KpiCard
        title="Critical Issues"
        :value="kpiValues.criticalIssues"
        icon="lucide:alert-circle"
        accentColor="rose"
      />
    </div>

    <!-- Main Dashboard Section with Sidebar Column -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left 9 Columns: Primary Analytics Charts -->
      <div class="lg:col-span-9 space-y-6">
        <!-- Row 1: Failure List, Success Ratio, Journey Funnel (3 columns equal height) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OverallApiFailureList />
          <ApiSuccessFailureChart />
          <UserJourneyFunnelChart />
        </div>

        <!-- Row 2: Average Time Spent (2/3 width) and Top Error Types (1/3 width) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <UserAverageTimeChart />
          </div>
          <div>
            <TopErrorTypesChart />
          </div>
        </div>

      </div>

      <!-- Right 3 Columns: AI Insights Sidebar -->
      <div class="lg:col-span-3">
        <AiInsights />
      </div>
    </div>

    <!-- Full Width Bottom Section -->
    <div class="space-y-6">
      <!-- Row 3: Journey Explorer (Full width) -->
      <div class="grid grid-cols-1 gap-6">
        <JourneyExplorer />
      </div>

      <!-- Row 4: Audit Log Explorer (Full width) -->
      <div class="grid grid-cols-1 gap-6">
        <AuditLogExplorer />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
