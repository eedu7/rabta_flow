"use client";

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    type LucideIcon,
    StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";

type MenuSubItem = {
    title: string;
    icon: LucideIcon;
    url: string;
};

type MenuItem = {
    title: string;
    items: MenuSubItem[];
};

const menuItems: MenuItem[] = [
    {
        title: "Main",
        items: [
            {
                title: "Workflow",
                icon: FolderOpenIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions",
            },
        ],
    },
];

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                            <Link href="/" prefetch>
                                <Image alt="RabtaFlow" height={30} src="/logos/logo.svg" width={30} />
                                <span className="font-semibold text-sm">RabtaFlow</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className="gap-x-4 h-10 px-4"
                                            isActive={
                                                item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
                                            }
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url} prefetch>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {!hasActiveSubscription && !isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="gap-x-4 h-10 px-4"
                                onClick={() => authClient.checkout({ slug: "RabtaFlow-Pro" })}
                                tooltip="Upgrade to Pro"
                            >
                                <StarIcon className="size-4" />
                                <span>Upgrade to Pro</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="gap-x-4 h-10 px-4"
                            onClick={() => authClient.customer.portal()}
                            tooltip="Billing Portal"
                        >
                            <CreditCardIcon className="size-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="gap-x-4 h-10 px-4"
                            onClick={() =>
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login");
                                        },
                                    },
                                })
                            }
                            tooltip="Sign out"
                        >
                            <LogOutIcon className="size-4" />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};
