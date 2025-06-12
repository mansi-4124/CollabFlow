import { Link } from "react-router-dom"; // Assuming you are using Next.js for client-side navigation
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link to={item.url}>
            <SidebarMenuButton asChild>
              <div>
                <item.icon />
                <span>{item.title}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
