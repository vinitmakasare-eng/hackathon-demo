<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";

// Register ECharts renderer and components
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  PieChart,
  TooltipComponent,
  LegendComponent,
]);

const isDark = useDark();

const errorData = [
  { value: 203, percentage: 48, name: "OCR Failed", color: "#3b82f6" },      // Blue
  { value: 97, percentage: 23, name: "Timeout", color: "#f59e0b" },         // Amber
  { value: 63, percentage: 15, name: "Bad Request", color: "#10b981" },     // Emerald
  { value: 38, percentage: 9, name: "Server Error", color: "#ef4444" },     // Rose
  { value: 22, percentage: 5, name: "Other", color: "#a855f7" }             // Purple
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
      formatter: "{b}: <b>{c} failures</b> ({d}%)"
    },
    legend: {
      orient: "vertical",
      right: "0%",
      top: "center",
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
      textStyle: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 600,
      },
      formatter: (name: string) => {
        const item = errorData.find(d => d.name === name);
        if (!item) return name;
        return `${name} - ${item.percentage}% (${item.value})`;
      }
    },
    series: [
      {
        name: "Error Types",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["30%", "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: errorData.map(d => ({
          value: d.value,
          name: d.name,
          itemStyle: { color: d.color }
        }))
      }
    ]
  };
});
</script>

<template>
  <div class="premium-glass p-5 rounded-2xl border border-[var(--panel-border)] shadow-sm h-[380px] flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">Top Error Types</h3>
          <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Icon icon="lucide:info" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Classification of API issues</p>
    </div>

    <!-- Chart container -->
    <div class="h-[220px] w-full">
      <VChart :option="option" autoresize />
    </div>

    <!-- Bottom summary link -->
    <div class="border-t border-[var(--panel-border)] pt-3 flex items-center justify-between text-xs">
      <a href="#" class="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
        View all errors
        <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
