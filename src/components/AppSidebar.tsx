import { LayoutDashboard, Filter, Palette, Cpu, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeMode: 'dashboard' | 'filters' | 'rgb' | 'esp32' | 'settings';
  onModeChange: (mode: 'dashboard' | 'filters' | 'rgb' | 'esp32' | 'settings') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'filters', label: 'Filters Mode', icon: Filter },
  { id: 'rgb', label: 'RGB Mode', icon: Palette },
  { id: 'esp32', label: 'ESP32 Mode', icon: Cpu },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function AppSidebar({ activeMode, onModeChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/20 backdrop-blur-xl bg-sidebar/80">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onModeChange(item.id as any)}
                    isActive={activeMode === item.id}
                    className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:border-primary/50 data-[active=true]:shadow-[0_0_15px_rgba(123,92,255,0.3)] hover:bg-primary/10 transition-all duration-300 border border-transparent rounded-lg"
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
