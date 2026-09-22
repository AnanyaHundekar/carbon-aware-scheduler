import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  runWorkflow,
  type ExecutionResult,
  type ReplanResult,
  type ScheduleDecision,
  type WorkflowResponse,
  type WorkflowTask,
} from "@/lib/workflow.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carbon-Aware Workflow Runner" },
      {
        name: "description",
        content:
          "Submit a request, then view the planned workflow tasks, optimized carbon-aware schedule, execution results, and replanning decisions returned by the backend.",
      },
      { property: "og:title", content: "Carbon-Aware Workflow Runner" },
      {
        property: "og:description",
        content:
          "Plan, schedule, execute, and replan workflows with a carbon-aware backend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

// ---------- formatting helpers ----------

const pct = (v?: number) =>
  typeof v === "number" ? `${Math.round(v * 100)}%` : null;
const num = (v?: number, digits = 2) =>
  typeof v === "number" ? v.toFixed(digits) : null;

/** Collapse a long list of constraint failures into one row per model. */
function summarizeFailures(failures: ScheduleDecision["constraint_failures"]) {
  if (!failures?.length) return [];
  const byModel = new Map<string, Set<string>>();
  for (const f of failures) {
    const model = f?.model ?? "Unknown";
    if (!byModel.has(model)) byModel.set(model, new Set());
    for (const msg of f.failures ?? []) byModel.get(model)!.add(msg);
  }
  return [...byModel.entries()].map(([model, msgs]) => ({
    model,
    failures: [...msgs],
  }));
}

function StatusBadge({ status }: { status?: string | undefined }) {
  const s = status ?? "unknown";
  if (s === "success")
    return (
      <Badge className="gap-1">
        <CheckCircle2 className="h-3 w-3" /> Scheduled
      </Badge>
    );
  if (s === "no_feasible_option")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> No feasible option
      </Badge>
    );
  return <Badge variant="secondary">{s}</Badge>;
}

function Metric({ label, value }: { label: string; value: string | null }) {
  if (value === null) return null;
  return (
    <div className="rounded-md border border-border bg-background/50 px-2.5 py-1.5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function DecisionMetrics({ d }: { d: ScheduleDecision }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Metric label="Model" value={d.model ?? null} />
      <Metric label="Location" value={d.location ?? null} />
      <Metric label="Time" value={d.time ?? null} />
      <Metric label="Accuracy" value={pct(d.accuracy)} />
      <Metric label="Latency" value={num(d.latency) && `${num(d.latency)}s`} />
      <Metric
        label="Cost"
        value={num(d.cost) && `$${num(d.cost)}`}
      />
      <Metric label="Energy" value={num(d.energy) && `${num(d.energy)} Wh`} />
      <Metric
        label="Carbon"
        value={num(d.carbon) && `${num(d.carbon)} gCO₂`}
      />
      <Metric label="Score" value={num(d.score)} />
    </div>
  );
}

// ---------- result sections ----------

function TasksSection({ data }: { data: WorkflowResponse }) {
  const tasks = data.workflow?.tasks;
  if (!tasks?.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <ClipboardList className="h-5 w-5 text-primary" /> Workflow Tasks
      </h2>
      <div className="space-y-3">
        {tasks.map((t, i) => (
          <TaskCard key={i} task={t} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

function TaskCard({ task, index }: { task: WorkflowTask; index: number }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {index}
          </span>
          {task.task}
        </CardTitle>
        {task.description && (
          <CardDescription>{task.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {task.complexity && (
          <Badge variant="outline">Complexity: {task.complexity}</Badge>
        )}
        {task.urgency && <Badge variant="outline">Urgency: {task.urgency}</Badge>}
        {pct(task.accuracy_requirement) && (
          <Badge variant="outline">Accuracy ≥ {pct(task.accuracy_requirement)}</Badge>
        )}
        {typeof task.max_latency === "number" && (
          <Badge variant="outline">Max latency {task.max_latency}s</Badge>
        )}
        <Badge variant={task.can_defer ? "secondary" : "default"}>
          {task.can_defer ? "Deferrable" : "Cannot defer"}
        </Badge>
      </CardContent>
    </Card>
  );
}

function ScheduleSection({ data }: { data: WorkflowResponse }) {
  const schedule = data.initial_schedule;
  if (!schedule?.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <CalendarClock className="h-5 w-5 text-primary" /> Optimized Schedule
      </h2>
      <div className="space-y-3">
        {schedule.map((d, i) => {
          const failed = d.status === "no_feasible_option";
          return (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                  {d.task} <StatusBadge status={d.status} />
                </CardTitle>
                {d.reason && <CardDescription>{d.reason}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-3">
                {!failed && <DecisionMetrics d={d} />}
                {summarizeFailures(d.constraint_failures).length > 0 && (
                  <div className="space-y-1.5 rounded-md border border-destructive/30 bg-destructive/5 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-destructive">
                      Constraint failures
                    </div>
                    {summarizeFailures(d.constraint_failures).map((g) => (
                      <div key={g.model} className="text-sm text-foreground">
                        <span className="font-semibold">{g.model}:</span>{" "}
                        {g.failures.join("; ")}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ExecutionSection({ data }: { data: WorkflowResponse }) {
  const execution = data.execution;
  if (!execution?.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Bot className="h-5 w-5 text-primary" /> Execution Results
      </h2>
      <div className="space-y-3">
        {execution.map((e, i) => (
          <ExecutionCard key={i} result={e} />
        ))}
      </div>
    </section>
  );
}

function ExecutionCard({ result }: { result: ExecutionResult }) {
  const isError = !!result.result?.startsWith("Error:");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          {result.task}
          {result.selected_scheduler_model ? (
            <Badge variant="secondary">
              Model: {result.selected_scheduler_model}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" /> Not executed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      {result.result && (
        <CardContent>
          <pre
            className={`whitespace-pre-wrap break-words rounded-md border p-3 font-sans text-sm ${
              isError
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-border bg-muted/40 text-foreground"
            }`}
          >
            {result.result}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}

function ReplanningSection({ data }: { data: WorkflowResponse }) {
  const replanning = data.replanning;
  if (!replanning || !replanning.results?.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <RefreshCcw className="h-5 w-5 text-primary" /> Replanning Results
      </h2>
      <Badge
        variant={replanning.replan_required ? "default" : "secondary"}
        className="w-fit"
      >
        {replanning.replan_required
          ? "Replanning was required"
          : "No replanning required"}
      </Badge>
      <div className="space-y-3">
        {replanning.results.map((r, i) => (
          <ReplanCard key={i} result={r} />
        ))}
      </div>
    </section>
  );
}

function ImpactList({
  impact,
}: {
  impact: Exclude<ReplanResult["impact"], string | undefined>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(impact).map(([key, change]) => (
        <Badge key={key} variant="outline">
          {key}: {change?.old ?? "?"} → {change?.new ?? "?"}
          {typeof change?.percentage_change === "number" &&
            ` (${change.percentage_change > 0 ? "+" : ""}${change.percentage_change}%)`}
        </Badge>
      ))}
    </div>
  );
}

function ReplanCard({ result }: { result: ReplanResult }) {
  const init = result.initial_decision;
  const replanned = result.replanned_decision;
  const swap = (a?: ScheduleDecision) => a && <DecisionMetrics d={a} />;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          {result.task?.task} <StatusBadge status={result.status} />
        </CardTitle>
        {result.explanation && (
          <CardDescription>{result.explanation}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {init && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Initial decision
            </div>
            {swap(init)}
            {init.reason && (
              <p className="text-sm text-muted-foreground">{init.reason}</p>
            )}
          </div>
        )}
        {replanned && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              Replanned decision
            </div>
            {swap(replanned)}
            {replanned.reason && (
              <p className="text-sm text-muted-foreground">
                {replanned.reason}
              </p>
            )}
          </div>
        )}
        {result.impact &&
          (typeof result.impact === "string"
            ? result.impact.trim().length > 0
            : Object.keys(result.impact).length > 0) && (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Impact
            </div>
            <ImpactList
              impact={
                typeof result.impact === "string" ? {} : result.impact ?? {}
              }
            />
          </div>
        )}
        {result.environment_changes &&
          typeof result.environment_changes === "object" && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Environment changes
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.environment_changes).map(
                  ([key, change]) => (
                    <Badge key={key} variant="outline">
                      {key.replace(/_/g, " ")}: {change?.old ?? "?"} →{" "}
                      {change?.new ?? "?"}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

// ---------- page ----------

function Index() {
  const [userRequest, setUserRequest] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const runWorkflowFn = useServerFn(runWorkflow);
  const mutation = useMutation({
    mutationFn: (request: string) =>
      runWorkflowFn({ data: { userRequest: request } }),
  });

  const handleSubmit = () => {
    const trimmed = userRequest.trim();
    if (!trimmed) {
      setInputError("Please enter a request before running the workflow.");
      return;
    }
    setInputError(null);
    mutation.mutate(trimmed);
  };

  const data = mutation.data as WorkflowResponse | undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:py-14">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Carbon-Aware Workflow Runner
            </h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Describe what you need, run the workflow, and review the plan,
            optimized schedule, execution results, and replanning decisions
            produced by the backend.
          </p>
        </header>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={userRequest}
                onChange={(e) => setUserRequest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !mutation.isPending) handleSubmit();
                }}
                placeholder="e.g. Summarize this quarter's energy report"
                className="flex-1"
                aria-label="Workflow request"
              />
              <Button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="sm:w-44"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Running…
                  </>
                ) : (
                  "Run Workflow"
                )}
              </Button>
            </div>
            {inputError && (
              <p className="text-sm font-medium text-destructive">
                {inputError}
              </p>
            )}
            {mutation.isError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p>
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : "The workflow could not be completed. Please try again."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {mutation.isPending && (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">
              Planning, scheduling, and executing your workflow — this can take
              a minute.
            </span>
          </div>
        )}

        {data && !mutation.isPending && (
          <div className="space-y-8">
            {data.workflow?.workflow && (
              <p className="text-sm font-medium text-muted-foreground">
                {data.workflow.workflow}
              </p>
            )}
            {data.status && data.status !== "success" && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Backend returned status “{data.status}”.</span>
              </div>
            )}
            <TasksSection data={data} />
            <ScheduleSection data={data} />
            <ExecutionSection data={data} />
            <ReplanningSection data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
