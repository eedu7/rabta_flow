"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const AVAILABLE_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
] as const;

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message:
                "Variable name must start with a letter or underscore and contains only letters, numbers and underscores",
        }),
    model: z.enum(AVAILABLE_MODELS),
    systemPrompt: z.string(),
    userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({ onOpenChange, open, onSubmit, defaultValues = {} }: Props) => {
    const form = useForm<GeminiFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                model: defaultValues.model || AVAILABLE_MODELS[0],
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchedVariableName = form.watch("variableName");

    const handleSubmit = (values: GeminiFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
                    <DialogDescription>Configure the AI model and prompts for this node.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="myApiCall" />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:{" "}
                                        {`{{${watchedVariableName}.text}}`}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        {/* Selecting model */}
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABLE_MODELS.map((model) => (
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        The Google Gemini model to use for this completion
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* System Prompt */}
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                            placeholder="You are a helpful assistant"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behavior of the assistant. Use {"{{variables}}"} for simple values or{" "}
                                        {"{{json variables}}"} to stringify objects
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        {/* User Prompt */}
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                            placeholder="Summarize this text: {{json httpResponse.data}}"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The prompt to send to the AI. Use {"{{variables}}"} for simple values or{" "}
                                        {"{{json variables}}"} to stringify objects
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
