import type { JSX } from "react";
import { AppSidebar } from "../components/app-sidebar";
import DashboardHeader from "../components/dashboard-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

interface IProps {
  children: JSX.Element;
}

function MainLayout({ children }: IProps) {
  return (
    <>
      {/* Main Header - Fixed at the top */}
      <div className="sticky top-0 z-50 bg-background shadow-sm">
        <DashboardHeader />
      </div>

      {/* Content Area - Takes remaining vertical space */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          {/* AppSidebar - Renders within the SidebarProvider */}
          <AppSidebar />

          {/* SidebarInset - Main content area, scrolls if needed */}
          <SidebarInset className="flex-1 overflow-y-auto">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}

export default MainLayout;
