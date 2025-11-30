import { NonRetriableError } from "inngest";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { NodeType } from "@/generated/prisma";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { topologicalSort } from "@/inngest/utils";
import prisma from "@/lib/db";
import { geminiChannel } from "./channels/gemini";
import { inngest } from "./client";

export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
    },
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            stripeTriggerChannel(),
            geminiChannel(),
        ],
    },
    async ({ event, step, publish }) => {
        const workflowId = event.data.workflowId;

        if (!workflowId) {
            throw new NonRetriableError("Workflow ID is missing");
        }

        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                include: {
                    nodes: true,
                    connections: true,
                },
            });

            if (!workflow) {
                throw new NonRetriableError("Workflow not found");
            }

            return topologicalSort(workflow.nodes, workflow.connections);
        });

        // Initialize the context with any initial data from the trigger
        let context = event.data.initialData || {};

        // Execute each node
        for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                context,
                step,
                publish,
            });
        }

        return { workflowId, result: context };
    },
);
