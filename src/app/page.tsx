import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
    return (
        <div className="text-bold bg-zinc-50 w-screen h-screen grid place-items-center">
            <Card>
                <CardContent>
                    <h1>Hello, World</h1>
                </CardContent>
            </Card>
        </div>
    );
}
