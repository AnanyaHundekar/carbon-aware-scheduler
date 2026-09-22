import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const WORKFLOW_ENDPOINT = "https://clever-baboons-strive.loca.lt/run-workflow";

// ---------- Response types (backend is the source of truth; all fields optional) ----------

export interface WorkflowTask {
  task?: string;
  description?: string;
  complexity?: string;
  accuracy_requirement?: number;
  max_latency?: number;
  urgency?: string;
  can_defer?: boolean;
}

export interface ScheduleDecision {
  status?: string;
  task?: string;
  reason?: string;
  model?: string;
  location?: string;
  time?: string;
  accuracy?: number;
  latency?: number;
  cost?: number;
  energy?: number;
  carbon?: number;
  score?: number;
  constraint_failures?: { model?: string; failures?: string[] }[];
}

export interface ExecutionResult {
  task?: string;
  selected_scheduler_model?: string | null;
  result?: string;
}

export interface ReplanResult {
  task?: WorkflowTask;
  status?: string;
  initial_decision?: ScheduleDecision;
  replanned_decision?: ScheduleDecision;
  impact?:
    | string
    | Record<string, { old?: number; new?: number; percentage_change?: number }>;
  explanation?: string;
  environment_changes?:
    | string
    | Record<string, { old?: number | string; new?: number | string }>;
}

export interface WorkflowResponse {
  status?: string;
  workflow?: { workflow?: string; tasks?: WorkflowTask[] };
  initial_schedule?: ScheduleDecision[];
  execution?: ExecutionResult[];
  replanning?: { replan_required?: boolean; results?: ReplanResult[] };
}

// ---------- Server function ----------

export const runWorkflow = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ userRequest: z.string() }).parse(data)
  )
  .handler(async ({ data }): Promise<WorkflowResponse> => {
    let res: Response;
    try {
      res = await fetch(WORKFLOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_request: data.userRequest }),
      });
    } catch {
      throw new Error(
        "Could not reach the workflow backend. It may be offline or the tunnel may have expired."
      );
    }

    if (!res.ok) {
      throw new Error(
        `Workflow backend responded with an error (HTTP ${res.status}).`
      );
    }

    try {
      return (await res.json()) as WorkflowResponse;
    } catch {
      throw new Error("Workflow backend returned an unreadable response.");
    }
  });
