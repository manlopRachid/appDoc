import React, { useState } from 'react';
import { User, MessageSquare, FileText, Settings, LogOut, Calendar, Search, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import PatientList from './PatientList';
import ConsultationList from './ConsultationList';
import AIChat from './AIChat';
import AppointmentCalendar from './AppointmentCalendar';

type Tab = 'patients' | 'consultations' | 'appointments' | 'chat' | 'settings';

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('patients');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const tabs = [
    { id: 'patients' as const, name: t('dashboard.patients'), icon: User },
    { id: 'consultations' as const, name: t('dashboard.consultations'), icon: FileText },
    { id: 'appointments' as const, name: t('dashboard.appointments'), icon: Calendar },
    { id: 'chat' as const, name: t('dashboard.aiAssistant'), icon: MessageSquare },
    { id: 'settings' as const, name: t('dashboard.settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{t('dashboard.title')}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <div className="text-sm text-gray-600">
              Dr. {user?.email?.split('@')[0]}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'patients' && <PatientList />}
          {activeTab === 'consultations' && <ConsultationList />}
          {activeTab === 'appointments' && <AppointmentCalendar />}
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.settings')}</h2>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}