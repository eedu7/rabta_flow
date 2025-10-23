"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
    .object({
        email: z.email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password don't match",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const isPending = form.formState.isSubmitting;

    const onSubmit = async (values: RegisterFormValues) => {
        await authClient.signUp.email(
            {
                name: values.email,
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Something went wrong during registration");
                },
            },
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button className="w-full" disabled={isPending} type="button" variant="outline">
                                        <Image alt="GitHub" height={20} src="/logos/github.svg" width={20} />
                                        Continue with GitHub
                                    </Button>
                                    <Button className="w-full" disabled={isPending} type="button" variant="outline">
                                        <Image alt="Google" height={20} src="/logos/google.svg" width={20} />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="********" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="********" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="w-full" disabled={isPending} type="submit">
                                        Register
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link className="underline underline-offset-4" href="/login">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
