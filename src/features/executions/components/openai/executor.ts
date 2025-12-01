import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

type OpenAiData = {
    variableName?: string;
    model?: string;
    sytemPrompt?: string;
    userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenAiData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(
        openAiChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.variableName) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAI node: Variable name is missing");
    }
    if (!data.userPrompt) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAI node: User prompt is missing");
    }

    // TODO: Throw if credential is missing

    const systemPrompt = data.sytemPrompt
        ? HandleBars.compile(data.sytemPrompt)(context)
        : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credentials that user selected

    const credentialValue = process.env.OPENAI_API_KEY!;

    const openAi = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap("open-ai-generate-text", generateText, {
            model: openAi(data.model || "gpt-4"),
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
            openAiChannel().status({
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
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
