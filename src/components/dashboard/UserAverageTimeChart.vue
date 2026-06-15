<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import journeyData from "../../mock/journeyData.json";

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

function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }
  return `${Math.round(seconds)}s`;
}

// ─── Calculate average time per page from journey data ───
type PageData = {
  name: string;
  value: number;
  label: string;
  highlight?: boolean;
};

const pagesData = computed<PageData[]>(() => {
  // 1. Parse time_metric events
  const metricMap = new Map<string, number>();
  for (const entry of journeyData as any[]) {
    if (entry.ev === "time_metric") {
      const ud = JSON.parse(entry.ud);
      metricMap.set(ud.page, ud.seconds);
    }
  }

  // 2. Calculate from page_visit timestamps
  // Group visits by user+processCode, compute gaps
  const visits = (journeyData as any[])
    .filter((e: any) => e.ev === "page_visit")
    .map((e: any) => ({
      user: e.u,
      code: e.r,
      page: JSON.parse(e.ud).page,
      time: new Date(e.t).getTime(),
    }))
    .filter((v) => v.page)
    .sort((a, b) => a.time - b.time);

  const journeys = new Map<string, typeof visits>();
  for (const v of visits) {
    const key = `${v.user}::${v.code}`;
    if (!journeys.has(key)) journeys.set(key, []);
    journeys.get(key)!.push(v);
  }

  // Collect samples for each page path
  const sampleMap = new Map<string, number[]>();

  for (const [, pages] of journeys) {
    pages.sort((a, b) => a.time - b.time);
    for (let i = 0; i < pages.length - 1; i++) {
      const sec = (pages[i + 1].time - pages[i].time) / 1000;
      if (sec >= 0 && sec < 600) {
        const key = pages[i].page;
        if (!sampleMap.has(key)) sampleMap.set(key, []);
        sampleMap.get(key)!.push(sec);
      }
    }
    // Last page → journey_completed
    const last = pages[pages.length - 1];
    const end = (journeyData as any[]).find(
      (e: any) => e.u === last.user && e.r === last.code && e.ev === "journey_completed"
    );
    if (end) {
      const sec = (new Date(end.t).getTime() - last.time) / 1000;
      if (sec >= 0 && sec < 600) {
        const key = last.page;
        if (!sampleMap.has(key)) sampleMap.set(key, []);
        sampleMap.get(key)!.push(sec);
      }
    }
  }

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;

  // 3. Map to the 4 requested pages
  // Instructions → time_metric "Instructions"
  const instructions = metricMap.get("Instructions") ?? avg(sampleMap.get("/vehicle/instructions") ?? [0]);

  // Odometer → time_metric "Odometer Capture" + page_visit "/vehicle/odometer" average combined
  const odometerCapture = metricMap.get("Odometer Capture") ?? 0;
  const odometerSamples = sampleMap.get("/vehicle/odometer");
  const odometerCalc = odometerSamples ? avg(odometerSamples) : 0;
  const odometerValue = Math.max(odometerCapture, odometerCalc);

  // Photos, Review, Submit — separate bars
  const otherPhotos = metricMap.get("Other Photos") ?? 0;
  const photosSamples = sampleMap.get("/vehicle/photos");
  const photosCalc = photosSamples ? avg(photosSamples) : 0;
  const photosValue = Math.max(otherPhotos, photosCalc);

  const review = metricMap.get("Review") ?? avg(sampleMap.get("/vehicle/review") ?? [0]);
  const submit = metricMap.get("Submit") ?? 0;

  // POI (Point of Impact) → from page_visit "/vehicle/poi" or "/vehicle/impacted-positions"
  const poiSamples = sampleMap.get("/vehicle/poi") ?? [];
  const impactedSamples = sampleMap.get("/vehicle/impacted-positions") ?? [];
  const allPoiSamples = [...poiSamples, ...impactedSamples];
  const poiValue = allPoiSamples.length > 0 ? avg(allPoiSamples) : 0;

  const result: PageData[] = [
    { name: "Instructions", value: Math.round(instructions), label: formatTime(instructions) },
    { name: "POI", value: Math.round(poiValue), label: formatTime(poiValue) },
    { name: "Odometer", value: Math.round(odometerValue), label: formatTime(odometerValue) },
    { name: "Photos", value: Math.round(photosValue), label: formatTime(photosValue), highlight: photosValue >= 60 },
    { name: "Review", value: Math.round(review), label: formatTime(review) },
    { name: "Submit", value: Math.round(submit), label: formatTime(submit) },
  ];

  return result;
});

// ─── ECharts option ───
const option = computed(() => {
  const textColor = isDark.value ? "#94a3b8" : "#64748b";
  const gridColor = isDark.value ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const mainTextColor = isDark.value ? "#f8fafc" : "#0f172a";
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark.value ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

  const data = pagesData.value;

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
        return `
          <div class="px-3 py-1.5">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">${item.name}</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span class="text-xs font-bold">Avg Time: ${data[item.dataIndex].label}</span>
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
      data: data.map(d => d.name),
      axisLine: {
        lineStyle: { color: gridColor }
      },
      axisTick: { show: false },
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
      axisLine: { show: false },
      axisTick: { show: false },
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
          if (val >= 60) return `${Math.floor(val / 60)}m ${val % 60}s`;
          return `${val}s`;
        }
      }
    },
    series: [
      {
        data: data.map(d => d.value),
        type: "bar",
        barWidth: "40%",
        label: {
          show: true,
          position: "top",
          color: textColor,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 10,
          fontWeight: "bold",
          formatter: (params: any) => data[params.dataIndex].label
        },
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: (params: any) => {
            const item = data[params.dataIndex];
            if ((item as any).highlight) {
              return {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: "#f43f5e" },
                  { offset: 1, color: "#be123c" }
                ]
              };
            }
            return {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "#6366f1" },
                { offset: 1, color: "#4338ca" }
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
