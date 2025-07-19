import React from 'react';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function AppointmentCalendar() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Calendar className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('appointments')}
        </h2>
      </div>
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>{t('noAppointments')}</p>
      </div>
    </div>
  );
}