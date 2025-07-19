import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, User, Clock, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';
import { Consultation, Patient } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConsultationWithPatient extends Consultation {
  patient: Patient;
}

export default function ConsultationList() {
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<ConsultationWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      `${consultation.patient.first_name} ${consultation.patient.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return t('consultations.status.ongoing');
      case 'completed':
        return t('consultations.status.completed');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{t('consultations.title')}</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>{t('consultations.newConsultation')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('consultations.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          {[
            { value: 'all', label: t('consultations.all') },
            { value: 'ongoing', label: t('consultations.ongoing') },
            { value: 'completed', label: t('consultations.completed') },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredConsultations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? t('consultations.noResults') : t('consultations.noConsultations')}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? t('patients.tryOtherKeywords')
                : t('consultations.createFirst')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {consultation.patient.first_name} {consultation.patient.last_name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(consultation.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-13">
                      <p className="text-gray-900 font-medium">
                      {t('consultations.reason')}: {consultation.chief_complaint}
                      </p>
                      {consultation.notes && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {consultation.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {getStatusText(consultation.status)}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(consultation.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}