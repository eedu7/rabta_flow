import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";

export default async function HomePage() {
    const users = await prisma.user.findMany();
    return (
        <div className="text-bold bg-zinc-50 w-screen h-screen grid place-items-center">
            <Card>
                <CardContent>
                    <pre>{JSON.stringify(users, null, 2)}</pre>
                </CardContent>
            </Card>
        </div>
    );
}
