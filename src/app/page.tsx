import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
    await requireAuth();

    const data = await caller.getUsers();

    return (
        <div className="h-screen max-w-7xl mx-auto flex justify-center items-center">
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <Button>Logout</Button>
        </div>
    );
}
