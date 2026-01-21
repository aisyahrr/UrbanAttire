import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/DashboardAdmin/components/Header";
import Sidebar from "@/components/DashboardAdmin/components/Sidebar";
import { supabase } from "@/libs/supabase";

type Shop = {
  id: string;
  name: string;
  logo: string | null;
};

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchShop = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("shops")
        .select("id, name, logo")
        .eq("owner_id", user.id)
        .single();

      setShop(data ?? null);
      setLoading(false);
    };

    fetchShop();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300 lg:ml-64"
      >
        <div className="sticky top-0 z-40 bg-white shadow">
          <Header onToggleSidebar={toggleSidebar} shop={shop} />
        </div>

        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
