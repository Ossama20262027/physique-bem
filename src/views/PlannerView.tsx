import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Award,
  ArrowLeft
} from 'lucide-react';
import { StudyPlanTask, UserProgress } from '../types';
import { dataStore } from '../services/store';
import { triggerConfetti } from '../utils/confetti';

interface PlannerViewProps {
  userProgress: UserProgress;
  onRefresh: () => void;
  onNavigateToLesson: (lessonId: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  userProgress,
  onRefresh,
  onNavigateToLesson
}) => {
  const [tasks, setTasks] = useState<StudyPlanTask[]>(() => dataStore.getStudyPlan());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState('30');
  const [newTaskField, setNewTaskField] = useState('الظواهر الكهربائية');

  const handleToggleTask = (taskId: string) => {
    dataStore.toggleStudyTaskCompleted(taskId);
    setTasks(dataStore.getStudyPlan());
    triggerConfetti();
    onRefresh();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    dataStore.addStudyTask({
      dayNumber: tasks.length + 1,
      title: newTaskTitle,
      durationMinutes: parseInt(newTaskMinutes, 10) || 30,
      field: newTaskField,
      description: 'مهمة مراجعة مخصصة لشهادة BEM.'
    });

    setTasks(dataStore.getStudyPlan());
    setNewTaskTitle('');
    onRefresh();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div id="planner-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
          <CalendarDays className="w-4 h-4" />
          <span>جدول مراجعة فيزياء BEM المنظم</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
          خطتي الذكية نحو الامتياز 📅
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
          خطة يومية محكمة تغطي الميادين الأربعة وتضمن تكرار حل الوضعيات الإدماجية والتمارين قبل موعد الامتحان الرسمي.
        </p>

        {/* Progress bar inside banner */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-emerald-100">
            <span>المهام المنجزة</span>
            <span>{completedCount} من {tasks.length} مهام ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-emerald-950/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Task Form */}
      <form
        onSubmit={handleAddTask}
        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center gap-2 text-xs"
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="أضف مهمة مراجعة جديدة (مثال: حل مسألة BEM 2023)"
          className="flex-1 w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
        />

        <select
          value={newTaskField}
          onChange={(e) => setNewTaskField(e.target.value)}
          className="w-full sm:w-auto p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          <option value="الظواهر الكهربائية">الظواهر الكهربائية</option>
          <option value="المادة وتحولاتها">المادة وتحولاتها</option>
          <option value="الظواهر الميكانيكية">الظواهر الميكانيكية</option>
          <option value="الظواهر الضوئية">الظواهر الضوئية</option>
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة للمخطط</span>
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            id={`planner-task-${task.id}`}
            onClick={() => handleToggleTask(task.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
              task.completed
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  task.completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {task.field}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.durationMinutes} د</span>
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                +{task.completed ? '25 XP ✓' : '25 XP'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
