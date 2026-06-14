<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import auditLogs from "../../mock/auditLogs.json";

// Register ECharts renderer and components
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
]);

// Accept logs prop to dynamically render failures based on filters
const props = defineProps<{
  logs?: any[];
}>();

// Read light/dark theme status
const isDark = useDark();

// Fallback to all logs if none are passed
const activeLogs = computed(() => props.logs || auditLogs);

// Properly type the accumulator as a Record<string, number>
const failureCounts = computed(() => {
  return activeLogs.value
    .filter((log) => log.ev.toLowerCase().includes("fail"))
    .reduce((acc: Record<string, number>, log) => {
      const key = log.ev;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
});

// Convert the counts object into an array suitable for ECharts
const apiFailures = computed(() => {
  return Object.entries(failureCounts.value).map(([api, count]) => ({
    api,
    count,
  }));
});

const sortedApiFailures = computed(() => {
  return [...apiFailures.value].sort((a, b) => b.count - a.count);
});

// Helper to format API labels into a premium human-readable style
const formatLabel = (val: string) => {
  return val
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(" Ocr ", " OCR ")
    .replace(" Api ", " API ");
};

const option = computed(() => {
  const textColor = isDark.value ? "#94a3b8" : "#64748b";
  const gridColor = isDark.value ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark.value ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const tooltipTextColor = isDark.value ? "#f8fafc" : "#0f172a";

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      borderRadius: 12,
      shadowColor: "rgba(0, 0, 0, 0.15)",
      shadowBlur: 10,
      padding: 0,
      textStyle: {
        color: tooltipTextColor,
        fontFamily: "Plus Jakarta Sans",
      },
      formatter: (params: any) => {
        const item = params[0];
        if (!item) return "";
        const formattedTitle = formatLabel(item.name);
        return `
          <div class="px-3.5 py-2.5 min-w-[200px]">
            <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1.5">API Endpoint</p>
            <p class="text-xs font-bold text-[${tooltipTextColor}] leading-tight mb-2">${formattedTitle}</p>
            <div class="flex items-center gap-2 border-t border-[var(--panel-border)] pt-2 mt-1.5">
              <span class="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block"></span>
              <span class="text-xs text-slate-400">Failures:</span>
              <span class="text-xs font-extrabold font-code ml-auto">${item.value}</span>
            </div>
          </div>
        `;
      },
    },
    grid: {
      top: "12%",
      left: "2%",
      right: "2%",
      bottom: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: sortedApiFailures.value.map((item) => item.api),
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 500,
        rotate: 15,
        formatter: (val: string) => {
          const cleaned = formatLabel(val);
          return cleaned.length > 20 ? cleaned.slice(0, 18) + "..." : cleaned;
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Failures",
      nameTextStyle: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 600,
        padding: [0, 0, 0, -20],
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: gridColor,
          type: "dashed",
        },
      },
      axisLabel: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 600,
      },
    },
    series: [
      {
        data: sortedApiFailures.value.map((item) => item.count),
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#a855f7" }, // purple-500
              { offset: 1, color: "#6366f1" }, // indigo-500
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#ec4899" }, // pink-500
                { offset: 1, color: "#a855f7" }, // purple-500
              ],
            },
          },
        },
      },
    ],
  };
});
</script>

<template>
  <div class="premium-glass p-6 rounded-2xl border border-[var(--panel-border)] shadow-sm">
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold tracking-tight text-[var(--text-main)]">API Failure Analysis</h2>
        <p class="text-xs text-[var(--text-muted)]">Metrics identifying most frequently failing endpoints</p>
      </div>
      <div 
        v-if="sortedApiFailures.length > 0"
        class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider self-start md:self-auto"
      >
        <span class="relative flex h-1.5 w-1.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
        </span>
        Action Required
      </div>
      <div 
        v-else 
        class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider self-start md:self-auto"
      >
        <Icon icon="lucide:check-circle" class="w-3.5 h-3.5" />
        No Failures
      </div>
    </div>

    <!-- ECharts Wrapper -->
    <div class="w-full overflow-hidden">
      <div v-if="sortedApiFailures.length === 0" class="h-[380px] flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
        <Icon icon="lucide:check-circle" class="w-12 h-12 text-emerald-500/50" />
        <p class="text-sm font-semibold">Zero failures detected for current filter configuration</p>
      </div>
      <VChart v-else :option="option" autoresize style="height: 380px" />
    </div>
  </div>
</template>
