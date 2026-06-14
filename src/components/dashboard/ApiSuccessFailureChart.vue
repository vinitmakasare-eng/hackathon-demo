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
        fontSize: 12,
      },
      formatter: "{b}: <b>{c}</b> ({d}%)"
    },
    legend: {
      orient: "vertical",
      right: "5%",
      top: "center",
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 11,
        fontWeight: 600,
      },
      data: ["Success", "Failure"]
    },
    series: [
      {
        name: "API Requests",
        type: "pie",
        radius: ["55%", "75%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 6
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
            color: mainTextColor,
            formatter: "{d}%"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: 11827, 
            name: "Success",
            itemStyle: { color: "#10b981" } // Emerald success
          },
          { 
            value: 623, 
            name: "Failure",
            itemStyle: { color: "#ef4444" } // Rose failure
          }
        ]
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
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">API Success vs Failure</h3>
          <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Icon icon="lucide:info" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Overall request breakdown</p>
    </div>

    <!-- Chart container -->
    <div class="relative h-[180px] w-full">
      <VChart :option="option" autoresize />
      <!-- Center absolute metrics overlay -->
      <div class="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p class="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none">Success</p>
        <p class="text-xl font-extrabold text-[var(--text-main)] mt-0.5 font-code">95%</p>
      </div>
    </div>

    <!-- Bottom summary metrics block -->
    <div class="border-t border-[var(--panel-border)] pt-3 flex items-center justify-between text-xs">
      <div>
        <p class="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Total Requests</p>
        <p class="text-sm font-extrabold text-[var(--text-main)] font-code">12,450</p>
      </div>
      <div class="text-right">
        <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Icon icon="lucide:arrow-up" class="w-3 h-3" />
          Healthy
        </span>
      </div>
    </div>
  </div>
</template>
