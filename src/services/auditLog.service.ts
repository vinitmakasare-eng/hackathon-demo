// src/services/auditLog.service.ts

import auditLogs from "../mock/auditLogs.json";

export const auditLogService = {
  getAll() {
    return auditLogs;
  },

  getByProcessCode(processCode: string) {
    return auditLogs.filter((log) => log.r === processCode);
  },

  getByEvent(event: string) {
    return auditLogs.filter((log) =>
      log.ev.toLowerCase().includes(event.toLowerCase()),
    );
  },
};
