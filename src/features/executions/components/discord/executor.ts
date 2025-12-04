import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import prisma from "@/lib/db";
import { geminiChannel } from "../../../../inngest/channels/gemini";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

type DiscordData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    sytemPrompt?: string;
    userPrompt?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({ data, nodeId, context, step, publish, userId }) => {
    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.variableName) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Gemini node: Variable name is missing");
    }
    if (!data.userPrompt) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Gemini node: User prompt is missing");
    }
    if (!data.credentialId) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Gemini node: Credential is required");
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
            geminiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Gemini node: Credentials not found");
    }

    const google = createGoogleGenerativeAI({
        apiKey: credentials.value,
    });

    try {
        const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
            model: google(data.model || "gemini-2.0-flash"),
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
            geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
