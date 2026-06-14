<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";

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

const isDark = useDark();

const pagesData = [
  { name: "Instructions", value: 5, label: "5s" },
  { name: "Odometer Capture", value: 30, label: "30s" },
  { name: "Position Prediction", value: 12, label: "12s" },
  { name: "Other Photos", value: 120, label: "2m 00s", highlight: true }, // Highlighted red bar in screenshot
  { name: "Review", value: 15, label: "15s" },
  { name: "Submit", value: 10, label: "10s" }
];

const option = computed(() => {
  const textColor = isDark.value ? "#94a3b8" : "#64748b";
  const gridColor = isDark.value ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const mainTextColor = isDark.value ? "#f8fafc" : "#0f172a";
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark.value ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      borderRadius: 12,
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowBlur: 10,
      textStyle: {
        color: mainTextColor,
        fontFamily: "Plus Jakarta Sans",
      },
      formatter: (params: any) => {
        const item = params[0];
        if (!item) return "";
        const dataItem = pagesData[item.dataIndex];
        return `
          <div class="px-3 py-1.5">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">${item.name}</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span class="text-xs font-bold">Avg Time: ${dataItem.label}</span>
            </div>
          </div>
        `;
      }
    },
    grid: {
      top: "15%",
      left: "2%",
      right: "2%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: pagesData.map(d => d.name),
      axisLine: {
        lineStyle: {
          color: gridColor,
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 600,
        interval: 0,
      }
    },
    yAxis: {
      type: "value",
      name: "Duration",
      nameTextStyle: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 9,
        fontWeight: 600,
        padding: [0, 0, 0, -20]
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: gridColor,
          type: "dashed"
        }
      },
      axisLabel: {
        color: textColor,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 10,
        fontWeight: 600,
        formatter: (val: number) => {
          if (val >= 60) {
            return `${Math.floor(val / 60)}m ${val % 60}s`;
          }
          return `${val}s`;
        }
      }
    },
    series: [
      {
        data: pagesData.map(d => d.value),
        type: "bar",
        barWidth: "35%",
        label: {
          show: true,
          position: "top",
          color: textColor,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 10,
          fontWeight: "bold",
          formatter: (params: any) => {
            return pagesData[params.dataIndex].label;
          }
        },
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: (params: any) => {
            const item = pagesData[params.dataIndex];
            // Other Photos is highlighted red/rose in screenshot
            if (item.highlight) {
              return {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#f43f5e" }, // rose-500
                  { offset: 1, color: "#be123c" }  // rose-700
                ]
              };
            }
            return {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#60a5fa" }, // blue-400
                { offset: 1, color: "#2563eb" }  // blue-600
              ]
            };
          }
        }
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
          <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">Users Average Time Spent on Each Page</h3>
          <button class="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Icon icon="lucide:info" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Analysis of friction points</p>
    </div>

    <!-- Chart container -->
    <div class="h-[260px] w-full">
      <VChart :option="option" autoresize />
    </div>
  </div>
</template>
