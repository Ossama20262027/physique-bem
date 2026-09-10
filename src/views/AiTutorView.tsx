import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Camera,
  Image as ImageIcon,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  User
} from 'lucide-react';
import Markdown from 'react-markdown';
import { AiMessage } from '../types';

interface AiTutorViewProps {
  initialPrompt?: string;
  initialMode?: 'solve' | 'guide';
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  initialPrompt,
  initialMode = 'guide'
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك يا بطل! 👋 أنا **الأستاذ الذكي لمادة الفيزياء للسنة الرابعة متوسط** 🇩🇿.

أنا هنا لمساعدتك على التفوق في شهادة BEM:
- 💬 **اطرح أي سؤال** حول المفاهيم، القوانين، التحليل الكهربائي، أو دافعة أرخميدس.
- 📸 **صوّر تمرينك** وسأقوم بتحليله وتفكيكه معك.
- 🤝 **وضع 'حل معي'**: سأرشدك خطوة بخطوة لتفكر وتصل للحل بنفسك كأستاذك في القسم!

كيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [mode, setMode] = useState<'solve' | 'guide'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initialPrompt
  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
      if (initialMode) setMode(initialMode);
    }
  }, [initialPrompt, initialMode]);

  // Voice speech-to-text recognition setup
  const toggleVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم ميزة التعرف على الصوت مباشرة. يرجى كتابة السؤال نصياً.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-DZ';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Image Upload Handling (supports camera or file input)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Send Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend && !selectedImage) return;

    const userMsgId = Date.now().toString();
    const userMsg: AiMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend || 'تحليل الصورة المرفقة للتمرين',
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let response: Response;

      if (currentImage) {
        // Exercise solver endpoint with image base64
        response = await fetch('/api/ai/solve-exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseText: textToSend,
            imageBase64: currentImage,
            mode
          })
        });
      } else {
        // Chat endpoint with full history
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content
        }));

        response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            mode
          })
        });
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'تعذر الاتصال بخدمة الذكاء الاصطناعي');
      }

      const data = await response.json();
      const botMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.solution || 'تم الرد بنجاح.',
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ عذراً يا بني: ${err.message || 'حدث خطأ في الاتصال بالخادم'}. 
تأكد من ضبط مفتاح GEMINI_API_KEY أو أعد المحاولة لاحقاً.`,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('هل تريد مسح المحادثة الحالية والبدء من جديد؟')) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `أهلاً بك من جديد! أنا مستعد لمساعدتك في أي سؤال فيزيائي خاص بشهادة BEM.`,
          timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const sampleQuestions = [
    'ما هو الفرق بين الكتلة (m) والثقل (P)؟',
    'كيف أستخرج Umax و الدور T من شاشة راسم الاهتزاز المهبطي؟',
    'كيف أكتب وأوازن معادلة تفاعل حمض كلور الماء مع معدن الحديد؟',
    'ما هي شروط توازن جسم صلب خاضع لقوتين غير متوازيتين؟',
    'ما الفرق بين التكهرب بالدلك والتكهرب بالتأثير؟'
  ];

  return (
    <div id="ai-tutor-view" className="flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto pb-4">
      {/* Top Header Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3 mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                الأستاذ الذكي للفيزياء
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                منهاج 4AM الجزائر 🇩🇿
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {mode === 'guide'
                ? '🤝 وضع الأستاذ المرشد (حل معي خطوة بخطوة)'
                : '⚡ وضع الحل المباشر مع سلم التنقيط'}
            </p>
          </div>
        </div>

        {/* Mode Selector & Reset */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-100 dark:bg-slate-700 p-0.5 rounded-xl flex text-xs font-semibold">
            <button
              onClick={() => setMode('guide')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'guide'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              حل معي 🤝
            </button>
            <button
              onClick={() => setMode('solve')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'solve'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              حل كامل ⚡
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="إعادة ضبط المحادثة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 mb-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                {/* Uploaded Exercise Image */}
                {msg.imageUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-xs">
                    <img
                      src={msg.imageUrl}
                      alt="صورة التمرين"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Content with Markdown */}
                <div className="markdown-body prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>

                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-blue-200 text-left' : 'text-slate-400 text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>الأستاذ يفكر ويقوم بتحليل المسألة وفق المنهاج...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length <= 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/50 whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview Box before send */}
      {selectedImage && (
        <div className="p-2 mb-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={selectedImage}
              alt="صورة ملتقطة"
              className="w-12 h-12 object-cover rounded-lg border"
            />
            <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">
              تم إرفاق صورة تمرين جاهزة للتحليل
            </span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs text-red-500 hover:underline px-2"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* Bottom Input Controls */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2 shrink-0">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* Camera / Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
          title="صوّر تمرينك بكاميرا الهاتف أو اختر صورة"
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Voice Input Microphone Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`p-2 rounded-xl transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50'
          }`}
          title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تحدث بالمايكروفون'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input Field */}
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            selectedImage
              ? 'اكتب سؤالك حول الصورة أو اضغط إرسال للحل المباشر...'
              : 'اسأل الأستاذ في الفيزياء أو اكتب معطيات تمرينك...'
          }
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none px-1"
        />

        {/* Send Button */}
        <button
          type="button"
          disabled={(!inputPrompt.trim() && !selectedImage) || isLoading}
          onClick={() => handleSendMessage()}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
        >
          <span>إرسال</span>
          <Send className="w-3.5 h-3.5 transform -scale-x-100" />
        </button>
      </div>
    </div>
  );
};
