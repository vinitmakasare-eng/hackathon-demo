<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";

// Register ECharts renderer and components
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { FunnelChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  FunnelChart,
  TooltipComponent,
  LegendComponent,
]);

const isDark = useDark();

const funnelData = [
  { value: 100, name: "Start Inspection", actual: 10000, color: "#3b82f6" }, // Blue
  { value: 95, name: "Instructions", actual: 9500, color: "#6366f1" },       // Indigo
  { value: 90, name: "Odometer Capture", actual: 9000, color: "#f59e0b" },   // Orange/Amber
  { value: 85, name: "Position Prediction", actual: 8500, color: "#a855f7" },// Violet
  { value: 78, name: "Other Photos", actual: 7800, color: "#10b981" },       // Emerald
  { value: 72, name: "Review & Submit", actual: 7200, color: "#ec4899" }     // Pink
];

const option = computed(() => {
  const textColor = isDark.value ? "#94a3b8" : "#64748b";
  const mainTextColor = isDark.value ? "#f8fafc" : "#0f172a";
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark.value ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      borderRadius: 12,
      padding: [8, 12],
      textStyle: {
        color: mainTextColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 11,
      },
      formatter: (params: any) => {
        const actualVal = funnelData.find(d => d.name === params.name)?.actual || 0;
        return `${params.name}: <b>${actualVal.toLocaleString()} users</b> (${params.data.realValue}%)`;
      }
    },
    series: [
      {
        name: "User Journey Funnel",
        type: "funnel",
        left: "5%",
        right: "40%",
        top: "5%",
        bottom: "5%",
        width: "55%",
        min: 0,
        max: 100,
        minSize: "10%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "right",
          color: textColor,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 11,
          fontWeight: 600,
          formatter: (params: any) => {
            return `${params.name}\n${params.data.realValue}%`;
          }
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
            color: isDark.value ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"
          }
        },
        itemStyle: {
          borderColor: isDark.value ? "#0f172a" : "#ffffff",
          borderWidth: 2,
          borderRadius: 4,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.15)"
        },
        emphasis: {
          label: {
            fontSize: 11,
            color: mainTextColor,
            fontWeight: "bold"
          }
        },
        data: funnelData.map((d, index) => ({
          value: 100 - (index * 16), // Forces a perfect V shape (100, 84, 68, 52, 36, 20)
          realValue: d.value,
          name: d.name,
          itemStyle: {
            color: d.color
          }
        }))
      }
    ]
  };
});
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm flex flex-col justify-between h-[340px]">
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">User Journey Funnel</h3>
          <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Icon icon="lucide:info" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Drop-off at each step</p>
    </div>

    <!-- Chart container -->
    <div class="flex-1 w-full min-h-[220px] mt-4 mb-2">
      <VChart :option="option" autoresize />
    </div>

    <!-- Bottom summary metrics block -->
    <div class="border-t border-[var(--panel-border)] pt-3 flex items-center justify-between text-xs">
      <a href="#" class="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
        View full funnel analysis
        <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
