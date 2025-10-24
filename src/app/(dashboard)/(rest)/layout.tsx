import AppHeader from "@/components/app-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <main>{children}</main>
        </>
    );
}
