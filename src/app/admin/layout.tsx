import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full bg-noir-950">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-x-hidden p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
