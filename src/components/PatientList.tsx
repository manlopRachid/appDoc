import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Phone, Mail, Edit, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';
import { Patient } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PatientForm from './PatientForm';

export default function PatientList() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientAdded = (newPatient: Patient) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(prev => prev.map(p => p.id === newPatient.id ? newPatient : p));
    } else {
      // Add new patient
      setPatients(prev => [newPatient, ...prev]);
    }
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedPatient(null);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditForm(true);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm(t('patients.deleteConfirm'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;
      
      setPatients(prev => prev.filter(p => p.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Erreur lors de la suppression du patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'M': return t('patients.male');
      case 'F': return t('patients.female');
      default: return t('patients.other');
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <h2 className="text-2xl font-semibold text-gray-900">{t('patients.title')}</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('patients.newPatient')}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('patients.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? t('patients.noResults') : t('patients.noPatients')}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? t('patients.tryOtherKeywords')
                : t('patients.addFirstPatient')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{calculateAge(patient.date_of_birth)} {t('patients.years')}</span>
                          </div>
                          <span className="capitalize">{getGenderText(patient.gender)}</span>
                          {patient.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          {patient.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{patient.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500 mr-4">
                      {t('patients.addedOn')} {format(new Date(patient.created_at), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('patients.editPatient')}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('patients.deletePatient')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Form Modal */}
      {showAddForm && (
        <PatientForm
          onClose={() => setShowAddForm(false)}
          onPatientAdded={handlePatientAdded}
        />
      )}

      {/* Edit Patient Form Modal */}
      {showEditForm && selectedPatient && (
        <PatientForm
          onClose={() => {
            setShowEditForm(false);
            setSelectedPatient(null);
          }}
          onPatientAdded={handlePatientAdded}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}