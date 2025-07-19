import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, FileText, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';
import { AIMessage } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AIChat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Show initial assistant message
    const welcomeMessage = language === 'fr' 
      ? `Bonjour, je suis votre assistant médical intelligent. Je suis ici pour vous aider dans votre pratique médicale.

**Je peux vous assister pour :**
- Rédiger des ordonnances types ou lettres médicales
- Résumer une consultation à partir de vos notes
- Donner des informations générales sur des médicaments, pathologies ou examens
- Suggérer des examens ou conduites à tenir selon les données fournies

**Important :** Mes conseils sont informatifs et ne remplacent jamais votre jugement médical personnel. Je respecte scrupuleusement la déontologie médicale.

Comment puis-je vous aider aujourd'hui ?`
      : `Hello, I am your intelligent medical assistant. I am here to help you in your medical practice.

**I can assist you with:**
- Writing prescription templates or medical letters
- Summarizing a consultation from your notes
- Providing general information about medications, pathologies or examinations
- Suggesting examinations or management according to provided data

**Important:** My advice is informational and never replaces your personal medical judgment. I strictly respect medical ethics.

How can I help you today?`;

    setMessages([
      {
        id: 'welcome',
        consultation_id: '',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    ]);
  }, [language]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (language === 'en') {
      // English responses
      if (lowerMessage.includes('prescription') || lowerMessage.includes('medication')) {
        return `**Prescription Template** (to be adapted according to patient and pathology)

*[Example for simple cystitis in adult woman]*

**Treatment:**
- Nitrofurantoin 100 mg
- 1 capsule morning and evening for 5 days
- To be taken with meals

**Associated advice:**
- Drink plenty of fluids (at least 1.5L water/day)
- Avoid sexual intercourse during treatment
- Consult if symptoms persist after 48h of treatment

⚠️ **Important:** This template prescription must be adapted to each patient (allergies, contraindications, drug interactions).`;
      }

      if (lowerMessage.includes('summary') || lowerMessage.includes('consultation')) {
        return `**Consultation Summary Structure:**

**Patient:** [Age, sex, relevant history]
**Chief complaint:** [Reported symptoms]
**Clinical examination:** [Vital signs, examinations performed]
**Diagnostic hypotheses:** [Main diagnosis, differentials]
**Management:** [Treatment, additional tests, follow-up]

Can you provide me with the specific elements of your consultation so I can help you structure the summary?`;
      }

      if (lowerMessage.includes('chest pain') || lowerMessage.includes('thorax')) {
        return `**Chest Pain - Management**

**Emergencies to rule out first:**
1. **Acute coronary syndrome** - ECG, troponins if available
2. **Pulmonary embolism** - D-dimers, Wells score
3. **Pneumothorax** - Chest X-ray
4. **Aortic dissection** - Blood pressure asymmetry, imaging

**Crucial history:**
- Character of pain (tightness, burning, stabbing)
- Triggering factors (effort, stress, position)
- Cardiovascular history, risk factors

**Systematic clinical examination:**
- Vital signs (BP in both arms)
- Cardiopulmonary auscultation
- Signs of heart failure

⚠️ **If doubt about life-threatening emergency: immediate hospital referral**`;
      }

      return `I understand your question. To give you a precise and appropriate answer, could you provide me with more details?

**For better assistance, please specify:**
- The specific clinical context
- Patient's age and medical history
- Observed symptoms or signs
- Your specific medical question

**Important reminder:** My advice is informational and never replaces your personal clinical assessment. In case of diagnostic or therapeutic doubt, don't hesitate to refer to official recommendations or seek specialist advice.

How can I help you more specifically?`;
    }

    // Handle different types of medical queries
    if (lowerMessage.includes('ordonnance') || lowerMessage.includes('prescription')) {
      return `**Modèle d'ordonnance** (à adapter selon le patient et la pathologie)

*[Exemple pour cystite simple chez femme adulte]*

**Traitement :**
- Furadantine® (nitrofurantoïne) 100 mg
- 1 gélule matin et soir pendant 5 jours
- À prendre au cours des repas

**Conseils associés :**
- Boire abondamment (au moins 1,5L d'eau/jour)
- Éviter les rapports sexuels pendant le traitement
- Consulter si persistance des symptômes après 48h de traitement

⚠️ **Important :** Cette ordonnance type doit être adaptée à chaque patient (allergies, contre-indications, interactions médicamenteuses).`;
    }

    if (lowerMessage.includes('résumé') || lowerMessage.includes('consultation')) {
      return `**Structure de résumé de consultation :**

**Patient :** [Âge, sexe, antécédents pertinents]
**Motif de consultation :** [Symptômes rapportés]
**Examen clinique :** [Constantes, examens pratiqués]
**Hypothèses diagnostiques :** [Diagnostic principal, différentiels]
**Conduite à tenir :** [Traitement, examens complémentaires, suivi]

Pouvez-vous me donner les éléments spécifiques de votre consultation pour que je vous aide à structurer le résumé ?`;
    }

    if (lowerMessage.includes('douleur thoracique') || lowerMessage.includes('thorax')) {
      return `**Douleur thoracique - Conduite à tenir**

**Urgences à éliminer en priorité :**
1. **Syndrome coronarien aigu** - ECG, troponines si disponibles
2. **Embolie pulmonaire** - D-dimères, score de Wells
3. **Pneumothorax** - Radiographie thoracique
4. **Dissection aortique** - Asymétrie tensionnelle, imagerie

**Anamnèse cruciale :**
- Caractère de la douleur (serrement, brûlure, coup de poignard)
- Facteurs déclenchants (effort, stress, position)
- Antécédents cardiovasculaires, facteurs de risque

**Examen clinique systématique :**
- Constantes vitales (TA aux 2 bras)
- Auscultation cardio-pulmonaire
- Recherche de signes d'insuffisance cardiaque

⚠️ **Si doute sur urgence vitale : orientation hospitalière immédiate**`;
    }

    if (lowerMessage.includes('hta') || lowerMessage.includes('hypertension')) {
      return `**Hypertension artérielle - Points clés**

**Diagnostic :** 3 mesures ≥ 140/90 mmHg à 2 consultations différentes

**Bilan initial :**
- Créatinine, DFG, protéinurie
- Glycémie, bilan lipidique
- ECG, FO si indiqué

**Traitement non médicamenteux (prioritaire) :**
- Réduction sodium < 6g/j
- Activité physique régulière
- Perte de poids si surcharge pondérale
- Arrêt tabac, modération alcool

**Traitement médicamenteux (si TA ≥ 140/90 malgré mesures hygiéno-diététiques) :**
- IEC/ARA2 en première intention
- Objectif < 140/90 mmHg (< 130/80 si diabète)

Cette information est générale et doit être adaptée au contexte clinique spécifique.`;
    }

    // Default response for other queries
    return `Je comprends votre question. Pour vous donner une réponse précise et adaptée, pourriez-vous me fournir plus de détails ?

**Pour une meilleure assistance, précisez :**
- Le contexte clinique spécifique
- L'âge et les antécédents du patient
- Les symptômes ou signes observés
- Votre question médicale précise

**Rappel important :** Mes conseils sont informatifs et ne remplacent jamais votre évaluation clinique personnelle. En cas de doute diagnostique ou thérapeutique, n'hésitez pas à vous référer aux recommandations officielles ou à prendre un avis spécialisé.

Comment puis-je vous aider plus spécifiquement ?`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      consultation_id: consultationId || '',
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = simulateAIResponse(userMessage);
      const newAIMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        consultation_id: consultationId || '',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newAIMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t('aiChat.title')}</h2>
            <p className="text-sm text-gray-600">{t('aiChat.subtitle')}</p>
          </div>
        </div>
        
        {/* Important Notice */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>{t('aiChat.important')} :</strong> {t('aiChat.disclaimer')}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-green-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <div className={`rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex mr-3">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('aiChat.placeholder')}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <strong>{t('aiChat.examples')} :</strong> {t('aiChat.exampleQuestions')}
        </div>
      </div>
    </div>
  );
}