import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Auth
    'auth.title': 'Assistant Médical',
    'auth.subtitle': 'Plateforme professionnelle pour médecins généralistes',
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.signIn': 'Se connecter',
    'auth.signUp': "S'inscrire",
    'auth.loading': 'Chargement...',
    'auth.disclaimer': 'Cette application est destinée exclusivement aux professionnels de santé.',
    'auth.disclaimer2': 'Les conseils fournis sont à titre informatif et ne remplacent pas un avis médical personnalisé.',

    // Dashboard
    'dashboard.title': 'Assistant Médical',
    'dashboard.logout': 'Déconnexion',
    'dashboard.patients': 'Patients',
    'dashboard.consultations': 'Consultations',
    'dashboard.appointments': 'Rendez-vous',
    'dashboard.aiAssistant': 'Assistant IA',
    'dashboard.settings': 'Paramètres',

    // Patients
    'patients.title': 'Patients',
    'patients.newPatient': 'Nouveau patient',
    'patients.search': 'Rechercher un patient...',
    'patients.noPatients': 'Aucun patient',
    'patients.noResults': 'Aucun patient trouvé',
    'patients.tryOtherKeywords': 'Essayez avec d\'autres mots-clés',
    'patients.addFirstPatient': 'Commencez par ajouter votre premier patient',
    'patients.addedOn': 'Ajouté le',
    'patients.editPatient': 'Modifier le patient',
    'patients.deletePatient': 'Supprimer le patient',
    'patients.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.',
    'patients.male': 'Homme',
    'patients.female': 'Femme',
    'patients.other': 'Autre',
    'patients.years': 'ans',

    // Patient Form
    'patientForm.newPatient': 'Nouveau patient',
    'patientForm.editPatient': 'Modifier le patient',
    'patientForm.newPatientSubtitle': 'Ajouter un nouveau patient au dossier médical',
    'patientForm.editPatientSubtitle': 'Mettre à jour les informations du patient',
    'patientForm.personalInfo': 'Informations personnelles',
    'patientForm.contact': 'Coordonnées',
    'patientForm.medicalInfo': 'Informations médicales',
    'patientForm.firstName': 'Prénom',
    'patientForm.lastName': 'Nom',
    'patientForm.dateOfBirth': 'Date de naissance',
    'patientForm.gender': 'Sexe',
    'patientForm.phone': 'Téléphone',
    'patientForm.email': 'Email',
    'patientForm.address': 'Adresse',
    'patientForm.medicalHistory': 'Antécédents médicaux',
    'patientForm.allergies': 'Allergies connues',
    'patientForm.currentMedications': 'Traitements en cours',
    'patientForm.age': 'Âge',
    'patientForm.cancel': 'Annuler',
    'patientForm.save': 'Ajouter le patient',
    'patientForm.update': 'Mettre à jour',
    'patientForm.saving': 'Enregistrement...',
    'patientForm.firstNamePlaceholder': 'Prénom du patient',
    'patientForm.lastNamePlaceholder': 'Nom de famille',
    'patientForm.phonePlaceholder': '06 12 34 56 78',
    'patientForm.emailPlaceholder': 'patient@exemple.com',
    'patientForm.addressPlaceholder': 'Adresse complète du patient',
    'patientForm.medicalHistoryPlaceholder': 'Antécédents médicaux, chirurgicaux, familiaux...',
    'patientForm.allergiesPlaceholder': 'Allergies médicamenteuses, alimentaires, environnementales...',
    'patientForm.medicationsPlaceholder': 'Médicaments actuels, posologies, durée de traitement...',

    // Consultations
    'consultations.title': 'Consultations',
    'consultations.newConsultation': 'Nouvelle consultation',
    'consultations.search': 'Rechercher par patient ou motif...',
    'consultations.all': 'Toutes',
    'consultations.ongoing': 'En cours',
    'consultations.completed': 'Terminées',
    'consultations.noConsultations': 'Aucune consultation',
    'consultations.noResults': 'Aucune consultation trouvée',
    'consultations.createFirst': 'Commencez par créer votre première consultation',
    'consultations.reason': 'Motif',
    'consultations.status.ongoing': 'En cours',
    'consultations.status.completed': 'Terminée',

    // Appointments
    'appointments.title': 'Calendrier des rendez-vous',
    'appointments.newAppointment': 'Nouveau rendez-vous',
    'appointments.today': 'Aujourd\'hui',
    'appointments.noAppointments': 'Aucun rendez-vous prévu',
    'appointments.consultation': 'Consultation',
    'appointments.followUp': 'Suivi',

    // AI Chat
    'aiChat.title': 'Assistant Médical IA',
    'aiChat.subtitle': 'Assistance professionnelle pour la pratique médicale',
    'aiChat.important': 'Important',
    'aiChat.disclaimer': 'Les conseils fournis sont informatifs et ne remplacent pas votre jugement médical. Utilisez toujours votre expertise clinique et les recommandations officielles.',
    'aiChat.placeholder': 'Posez votre question médicale... (Exemple: Patient 67 ans, HTA, douleur thoracique - conduite à tenir ?)',
    'aiChat.examples': 'Exemples de questions',
    'aiChat.exampleQuestions': '"Ordonnance pour cystite", "Résumé consultation", "Conduite à tenir douleur thoracique", "Information sur l\'HTA"',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher',
    'common.close': 'Fermer',
    'common.language': 'Langue',
  },
  en: {
    // Auth
    'auth.title': 'Medical Assistant',
    'auth.subtitle': 'Professional platform for general practitioners',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.loading': 'Loading...',
    'auth.disclaimer': 'This application is exclusively intended for healthcare professionals.',
    'auth.disclaimer2': 'The advice provided is for informational purposes and does not replace personalized medical advice.',

    // Dashboard
    'dashboard.title': 'Medical Assistant',
    'dashboard.logout': 'Logout',
    'dashboard.patients': 'Patients',
    'dashboard.consultations': 'Consultations',
    'dashboard.appointments': 'Appointments',
    'dashboard.aiAssistant': 'AI Assistant',
    'dashboard.settings': 'Settings',

    // Patients
    'patients.title': 'Patients',
    'patients.newPatient': 'New Patient',
    'patients.search': 'Search for a patient...',
    'patients.noPatients': 'No patients',
    'patients.noResults': 'No patients found',
    'patients.tryOtherKeywords': 'Try with other keywords',
    'patients.addFirstPatient': 'Start by adding your first patient',
    'patients.addedOn': 'Added on',
    'patients.editPatient': 'Edit patient',
    'patients.deletePatient': 'Delete patient',
    'patients.deleteConfirm': 'Are you sure you want to delete this patient? This action is irreversible.',
    'patients.male': 'Male',
    'patients.female': 'Female',
    'patients.other': 'Other',
    'patients.years': 'years old',

    // Patient Form
    'patientForm.newPatient': 'New Patient',
    'patientForm.editPatient': 'Edit Patient',
    'patientForm.newPatientSubtitle': 'Add a new patient to the medical record',
    'patientForm.editPatientSubtitle': 'Update patient information',
    'patientForm.personalInfo': 'Personal Information',
    'patientForm.contact': 'Contact Information',
    'patientForm.medicalInfo': 'Medical Information',
    'patientForm.firstName': 'First Name',
    'patientForm.lastName': 'Last Name',
    'patientForm.dateOfBirth': 'Date of Birth',
    'patientForm.gender': 'Gender',
    'patientForm.phone': 'Phone',
    'patientForm.email': 'Email',
    'patientForm.address': 'Address',
    'patientForm.medicalHistory': 'Medical History',
    'patientForm.allergies': 'Known Allergies',
    'patientForm.currentMedications': 'Current Medications',
    'patientForm.age': 'Age',
    'patientForm.cancel': 'Cancel',
    'patientForm.save': 'Add Patient',
    'patientForm.update': 'Update',
    'patientForm.saving': 'Saving...',
    'patientForm.firstNamePlaceholder': 'Patient\'s first name',
    'patientForm.lastNamePlaceholder': 'Last name',
    'patientForm.phonePlaceholder': '+1 234 567 8900',
    'patientForm.emailPlaceholder': 'patient@example.com',
    'patientForm.addressPlaceholder': 'Patient\'s complete address',
    'patientForm.medicalHistoryPlaceholder': 'Medical, surgical, family history...',
    'patientForm.allergiesPlaceholder': 'Drug, food, environmental allergies...',
    'patientForm.medicationsPlaceholder': 'Current medications, dosages, treatment duration...',

    // Consultations
    'consultations.title': 'Consultations',
    'consultations.newConsultation': 'New Consultation',
    'consultations.search': 'Search by patient or reason...',
    'consultations.all': 'All',
    'consultations.ongoing': 'Ongoing',
    'consultations.completed': 'Completed',
    'consultations.noConsultations': 'No consultations',
    'consultations.noResults': 'No consultations found',
    'consultations.createFirst': 'Start by creating your first consultation',
    'consultations.reason': 'Reason',
    'consultations.status.ongoing': 'Ongoing',
    'consultations.status.completed': 'Completed',

    // Appointments
    'appointments.title': 'Appointment Calendar',
    'appointments.newAppointment': 'New Appointment',
    'appointments.today': 'Today',
    'appointments.noAppointments': 'No appointments scheduled',
    'appointments.consultation': 'Consultation',
    'appointments.followUp': 'Follow-up',

    // AI Chat
    'aiChat.title': 'Medical AI Assistant',
    'aiChat.subtitle': 'Professional assistance for medical practice',
    'aiChat.important': 'Important',
    'aiChat.disclaimer': 'The advice provided is informational and does not replace your medical judgment. Always use your clinical expertise and official recommendations.',
    'aiChat.placeholder': 'Ask your medical question... (Example: 67-year-old patient, hypertension, chest pain - what to do?)',
    'aiChat.examples': 'Example questions',
    'aiChat.exampleQuestions': '"Prescription for cystitis", "Consultation summary", "Chest pain management", "Hypertension information"',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.close': 'Close',
    'common.language': 'Language',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageHook = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('medical-app-language');
    return (saved as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medical-app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return { language, setLanguage, t };
};

export { LanguageContext, translations };