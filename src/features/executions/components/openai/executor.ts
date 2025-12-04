import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

type OpenAiData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    sytemPrompt?: string;
    userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenAiData> = async ({ data, userId, nodeId, context, step, publish }) => {
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

    if (!data.credentialId) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAI node: Credential is required");
    }

    const systemPrompt = data.sytemPrompt
        ? HandleBars.compile(data.sytemPrompt)(context)
        : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    const credentials = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId,
            },
        });
    });

    if (!credentials) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAI node: Credentials not found");
    }

    const openAi = createOpenAI({
        apiKey: credentials.value,
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
