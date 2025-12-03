import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

type AnthropicData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    sytemPrompt?: string;
    userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: Variable name is missing");
    }
    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: User prompt is missing");
    }

    if (!data.credentialId) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: Credential is required");
    }

    const systemPrompt = data.sytemPrompt
        ? HandleBars.compile(data.sytemPrompt)(context)
        : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    const credentials = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
            },
        });
    });

    if (!credentials) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: Credentials not found");
    }

    const anthropic = createAnthropic({
        apiKey: credentials.value,
    });

    try {
        const { steps } = await step.ai.wrap("anthopic-generate-text", generateText, {
            model: anthropic(data.model || "claude-opus-4-0"),
            system: systemPrompt,
            prompt: userPrompt,

            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true,
            },
        });

        const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return {
            ...context,
            [data.variableName]: {
                text,
            },
        };
    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
