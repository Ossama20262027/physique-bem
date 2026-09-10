import React, { useState, useMemo } from 'react';
import {
  Binary,
  Calculator,
  Search,
  BookOpen,
  ArrowLeft,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { dataStore } from '../services/store';
import { Formula } from '../types';

interface FormulasSummaryViewProps {
  onNavigateToLesson: (lessonId: string) => void;
}

export const FormulasSummaryView: React.FC<FormulasSummaryViewProps> = ({
  onNavigateToLesson
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Calculator State
  const [calcType, setCalcType] = useState<'gravity' | 'umax' | 'archimedes'>('gravity');
  // Weight calculator
  const [massInput, setMassInput] = useState<string>('0.5'); // kg
  const [gInput, setGInput] = useState<string>('10'); // N/kg
  // Umax calculator
  const [nDivsInput, setNDivsInput] = useState<string>('3'); // divs
  const [svInput, setSvInput] = useState<string>('5'); // V/div
  // Archimedes calculator
  const [pLiquidInput, setPLiquidInput] = useState<string>('1000'); // kg/m^3
  const [volInput, setVolInput] = useState<string>('0.0002'); // m^3

  const allLessons = useMemo(() => dataStore.getAllLessons(), []);

  const allFormulas = useMemo(() => {
    const list: { formula: Formula; lessonTitle: string; lessonId: string; fieldId: string }[] = [];
    for (const lesson of allLessons) {
      for (const form of lesson.formulas) {
        list.push({
          formula: form,
          lessonTitle: lesson.title,
          lessonId: lesson.id,
          fieldId: lesson.fieldId
        });
      }
    }
    return list;
  }, [allLessons]);

  const filteredFormulas = useMemo(() => {
    return allFormulas.filter((item) => {
      if (activeTab !== 'all' && item.fieldId !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.formula.name.toLowerCase().includes(q) ||
          item.formula.expression.toLowerCase().includes(q) ||
          item.formula.explanation.toLowerCase().includes(q) ||
          item.lessonTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allFormulas, activeTab, searchQuery]);

  // Calculations
  const calculatedWeight = (parseFloat(massInput) || 0) * (parseFloat(gInput) || 0);
  const calculatedUmax = (parseFloat(nDivsInput) || 0) * (parseFloat(svInput) || 0);
  const calculatedUeff = calculatedUmax / 1.414;
  const calculatedArchimedes =
    (parseFloat(pLiquidInput) || 0) * (parseFloat(volInput) || 0) * 10;

  return (
    <div id="formulas-summary-view" className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Binary className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>الدليل الشامل للقوانين والوحدات الفيزيائية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            جميع العلاقات الرياضية المقررة في منهاج BEM مع الرموز والوحدات الدولية (SI)
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن قانون (P=m.g, Umax)..."
            className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Interactive Physics Calculator Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white shadow-xl space-y-4 border border-indigo-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-base">الحاسبة الفيزيائية التفاعلية</h2>
          </div>
          <span className="text-[11px] text-cyan-300">جرّب الحساب المباشر بالقوانين</span>
        </div>

        {/* Calculator Tabs */}
        <div className="flex gap-2 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setCalcType('gravity')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              calcType === 'gravity'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الثقل: P = m × g
          </button>
          <button
            onClick={() => setCalcType('umax')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              calcType === 'umax'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            التوتر الأعظمي: Umax = n × Sv
          </button>
          <button
            onClick={() => setCalcType('archimedes')}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              calcType === 'archimedes'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            دافعة أرخميدس: Fa = ρ × V × g
          </button>
        </div>

        {/* Calculator Form */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          {calcType === 'gravity' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">الكتلة m (بالكيلوغرام kg):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={massInput}
                    onChange={(e) => setMassInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                  <span className="text-[10px] text-amber-300 mt-1 block">
                    ⚠️ تذكر دائماً تحويل الغرام (g) إلى (kg) بالقسمة على 1000!
                  </span>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">الجاذبية الأرضية g (بـ N/kg):</label>
                  <input
                    type="number"
                    value={gInput}
                    onChange={(e) => setGInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-between">
                <span className="text-xs text-blue-200">النتيجة المحسوبة (الثقل P):</span>
                <span className="text-lg font-extrabold text-white font-mono">
                  P = {calculatedWeight.toFixed(2)} N (نيوتن)
                </span>
              </div>
            </div>
          )}

          {calcType === 'umax' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">عدد التدريجات الشاقولية Y (div):</label>
                  <input
                    type="number"
                    value={nDivsInput}
                    onChange={(e) => setNDivsInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">الحساسية الشاقولية Sv (بـ V/div):</label>
                  <input
                    type="number"
                    value={svInput}
                    onChange={(e) => setSvInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-blue-200 block">التوتر الأعظمي Umax:</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    Umax = {calculatedUmax.toFixed(2)} V
                  </span>
                </div>
                <div>
                  <span className="text-xs text-cyan-200 block">التوتر الفعال (Ueff = Umax / √2):</span>
                  <span className="text-base font-extrabold text-cyan-300 font-mono">
                    Ueff ≈ {calculatedUeff.toFixed(2)} V
                  </span>
                </div>
              </div>
            </div>
          )}

          {calcType === 'archimedes' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">الكتلة الحجمية للسائل ρ (بـ kg/m³، الماء = 1000):</label>
                  <input
                    type="number"
                    value={pLiquidInput}
                    onChange={(e) => setPLiquidInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">حجم الجسم المغمور V (بـ m³):</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={volInput}
                    onChange={(e) => setVolInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-between">
                <span className="text-xs text-blue-200">شدة دافعة أرخميدس Fa:</span>
                <span className="text-lg font-extrabold text-white font-mono">
                  Fa = {calculatedArchimedes.toFixed(2)} N
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Field Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'جميع القوانين' },
          { id: 'electricity', label: 'الظواهر الكهربائية' },
          { id: 'matter', label: 'المادة وتحولاتها' },
          { id: 'mechanics', label: 'الظواهر الميكانيكية' },
          { id: 'optics', label: 'الظواهر الضوئية' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formulas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {item.fieldId === 'electricity' && '⚡ كهرباء'}
                  {item.fieldId === 'matter' && '🧪 مادة'}
                  {item.fieldId === 'mechanics' && '⚙️ ميكانيك'}
                  {item.fieldId === 'optics' && '🔦 ضوء'}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  {item.formula.name}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToLesson(item.lessonId)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>درس: {item.lessonTitle}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Formula Expression Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xl font-bold font-mono-formula text-blue-600 dark:text-blue-400">
                {item.formula.expression}
              </div>
              <p className="text-xs text-slate-500 mt-1">{item.formula.explanation}</p>
            </div>

            {/* Units & Symbols Table */}
            {item.formula.units.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400">
                      <th className="py-1 px-1.5">الرمز</th>
                      <th className="py-1 px-1.5">المعنى</th>
                      <th className="py-1 px-1.5">الوحدة الدولية (SI)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {item.formula.units.map((u, i) => (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-1 px-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {u.symbol}
                        </td>
                        <td className="py-1 px-1.5">{u.meaning}</td>
                        <td className="py-1 px-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          {u.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
