import { ref, computed } from "vue";

// ──────────────────────────────────────────────
// Module-level singleton state — shared across
// all components that call this composable.
// ──────────────────────────────────────────────
const selectedTimeframe = ref("Last 7 Days");

// ── 30‑day baseline (most granular) ───────────
const DATA_30D = {
  totalSessions: 9847,
  completedFlows: 7235,
  apiFailures: 623,
  apiSuccesses: 11827,
  dropOffRate: "26.5%",
  avgFlowTime: "3m 48s",
  criticalIssues: 3,
  deviceOs: { Android: 2404, iOS: 2404, Windows: 2404, macOS: 1202, Linux: 1202 },
  deviceType: { Mobile: 2840, Desktop: 5608, Tablet: 1399 },
  browsers: { Chrome: 4260, Safari: 4260, Firefox: 1410, Edge: 1410 },
};

// ── 7‑day subset ──────────────────────────────
const DATA_7D = {
  totalSessions: 2415,
  completedFlows: 1812,
  apiFailures: 156,
  apiSuccesses: 2890,
  dropOffRate: "25%",
  avgFlowTime: "3m 41s",
  criticalIssues: 2,
  deviceOs: { Android: 568, iOS: 568, Windows: 566, macOS: 284, Linux: 283 },
  deviceType: { Mobile: 710, Desktop: 1402, Tablet: 303 },
  browsers: { Chrome: 1065, Safari: 1065, Firefox: 142, Edge: 143 },
};

// ── 24‑hour subset ────────────────────────────
const DATA_24H = {
  totalSessions: 342,
  completedFlows: 256,
  apiFailures: 18,
  apiSuccesses: 398,
  dropOffRate: "25.1%",
  avgFlowTime: "3m 32s",
  criticalIssues: 1,
  deviceOs: { Android: 85, iOS: 85, Windows: 85, macOS: 43, Linux: 42 },
  deviceType: { Mobile: 102, Desktop: 204, Tablet: 36 },
  browsers: { Chrome: 153, Safari: 153, Firefox: 18, Edge: 18 },
};

const DATASETS: Record<string, typeof DATA_30D> = {
  "Last 24 Hours": DATA_24H,
  "Last 7 Days": DATA_7D,
  "Last 30 Days": DATA_30D,
};

// ── Public API ────────────────────────────────
export function useDashboardMetrics() {
  const setTimeframe = (value: string) => {
    if (value in DATASETS) selectedTimeframe.value = value;
  };

  const kpiValues = computed(() => {
    const d = DATASETS[selectedTimeframe.value] ?? DATA_7D;
    return {
      totalSessions: d.totalSessions.toLocaleString(),
      completedFlows: d.completedFlows.toLocaleString(),
      apiFailures: d.apiFailures.toLocaleString(),
      dropOffRate: d.dropOffRate,
      avgFlowTime: d.avgFlowTime,
      criticalIssues: d.criticalIssues.toString(),
    };
  });

  const totalSessionsRaw = computed(
    () => DATASETS[selectedTimeframe.value]?.totalSessions ?? DATA_7D.totalSessions,
  );
  const apiFailuresRaw = computed(
    () => DATASETS[selectedTimeframe.value]?.apiFailures ?? DATA_7D.apiFailures,
  );
  const apiSuccessesRaw = computed(
    () => DATASETS[selectedTimeframe.value]?.apiSuccesses ?? DATA_7D.apiSuccesses,
  );
  const apiSuccessRate = computed(() => {
    const d = DATASETS[selectedTimeframe.value] ?? DATA_7D;
    const total = d.apiSuccesses + d.apiFailures;
    if (total === 0) return "0%";
    return `${((d.apiSuccesses / total) * 100).toFixed(1)}%`;
  });

  const deviceOs = computed(() => DATASETS[selectedTimeframe.value]?.deviceOs ?? DATA_7D.deviceOs);
  const deviceType = computed(() => DATASETS[selectedTimeframe.value]?.deviceType ?? DATA_7D.deviceType);
  const browsers = computed(() => DATASETS[selectedTimeframe.value]?.browsers ?? DATA_7D.browsers);

  return {
    selectedTimeframe,
    setTimeframe,
    kpiValues,
    totalSessionsRaw,
    apiFailuresRaw,
    apiSuccessesRaw,
    apiSuccessRate,
    deviceOs,
    deviceType,
    browsers,
  };
}
