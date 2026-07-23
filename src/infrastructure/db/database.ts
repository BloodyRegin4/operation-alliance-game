import Dexie, { type Table } from 'dexie';
import { GameSession, AuditLog } from '../../types/game';

/**
 * IndexedDB Wrapper using Dexie.js for offline-first telemetry and session persistence.
 * Stores game sessions and detailed audit logs with millisecond precision.
 */
export class OperationAllianceDB extends Dexie {
  sessions!: Table<GameSession, number>;
  audit_logs!: Table<AuditLog, number>;

  constructor() {
    super('OperationAllianceDB');

    this.version(1).stores({
      // Auto-increment primary key 'id', indexed by teamName, status, and startTime
      sessions: '++id, teamName, status, startTime',
      // Auto-increment primary key 'id', indexed by sessionId, timestamp, and eventType
      audit_logs: '++id, sessionId, timestamp, eventType'
    });
  }
}

export const db = new OperationAllianceDB();

/**
 * Helper function to record audit log events in real-time.
 */
export async function recordAuditLog(
  sessionId: number,
  eventType: AuditLog['eventType'],
  details: string,
  moduleIndex?: AuditLog['moduleIndex']
): Promise<number> {
  return await db.audit_logs.add({
    sessionId,
    timestamp: new Date().toISOString(),
    eventType,
    moduleIndex,
    details
  });
}