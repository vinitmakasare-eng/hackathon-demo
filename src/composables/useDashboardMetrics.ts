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
  apiFailures: 151,
  dropOffRate: "26.5%",
  avgFlowTime: "3m 48s",
  criticalIssues: 3,
};

// ── 7‑day subset ──────────────────────────────
const DATA_7D = {
  totalSessions: 2415,
  completedFlows: 1812,
  apiFailures: 48,
  dropOffRate: "25%",
  avgFlowTime: "3m 41s",
  criticalIssues: 2,
};

// ── 24‑hour subset ────────────────────────────
const DATA_24H = {
  totalSessions: 342,
  completedFlows: 256,
  apiFailures: 4,
  dropOffRate: "25.1%",
  avgFlowTime: "3m 32s",
  criticalIssues: 1,
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

  return {
    selectedTimeframe,
    setTimeframe,
    kpiValues,
    totalSessionsRaw,
    apiFailuresRaw,
  };
}
