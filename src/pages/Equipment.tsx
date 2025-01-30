import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SidebarContent } from '@/components/ui/sidebar';
import { EquipmentUpload } from '@/components/equipment/EquipmentUpload';
import { EquipmentList } from '@/components/equipment/EquipmentList';

const Equipment = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <Header />
          <div className="px-4 sm:px-6">
            <div className="space-y-4">
              <EquipmentUpload />
              <EquipmentList />
            </div>
          </div>
        </div>
      </SidebarContent>
    </div>
  );
};

export default Equipment;