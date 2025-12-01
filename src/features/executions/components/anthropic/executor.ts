import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

type AnthropicData = {
    variableName?: string;
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

    // TODO: Throw if credential is missing

    const systemPrompt = data.sytemPrompt
        ? HandleBars.compile(data.sytemPrompt)(context)
        : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credentials that user selected

    const credentialValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credentialValue,
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
