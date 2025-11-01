import { useState, useEffect } from 'react';
import {
  BookOpen, Play, FileText, Lock, CheckCircle, Star, Award,
  Clock, TrendingUp, Video, FileCode, MessageCircle, ArrowRight, Trophy
} from 'lucide-react';
import {
  gamificationService, CourseLevel, LevelModule, Course, CourseMaterial,
  MaterialProgress, ModuleCompletion, UserCourseProgress
} from '../lib/gamification';

interface CourseDetailViewProps {
  courseId: string;
  userId: string;
  onModuleSelect?: (moduleId: string) => void;
  onClose?: () => void;
}

export default function CourseDetailView({ courseId, userId, onModuleSelect, onClose }: CourseDetailViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null);
  const [modules, setModules] = useState<LevelModule[]>([]);
  const [materials, setMaterials] = useState<{ [key: string]: CourseMaterial[] }>({});
  const [completions, setCompletions] = useState<{ [key: string]: ModuleCompletion }>({});
  const [progress, setProgress] = useState<UserCourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId, userId]);

  useEffect(() => {
    if (selectedLevel) {
      loadLevelModules(selectedLevel.id);
    }
  }, [selectedLevel]);

  async function loadCourseData() {
    try {
      const [courseData, levelsData, progressData] = await Promise.all([
        gamificationService.getCourse(courseId),
        gamificationService.getCourseLevels(courseId),
        gamificationService.getUserCourseProgress(userId, courseId)
      ]);

      setCourse(courseData);
      setLevels(levelsData);
      setProgress(progressData);

      if (!progressData && levelsData.length > 0) {
        const newProgress = await gamificationService.startCourse(userId, courseId);
        setProgress(newProgress);
        setSelectedLevel(levelsData[0]);
      } else if (progressData && levelsData.length > 0) {
        const currentLevel = levelsData.find(l => l.level_number === progressData.current_level_number);
        setSelectedLevel(currentLevel || levelsData[0]);
      } else if (levelsData.length > 0) {
        setSelectedLevel(levelsData[0]);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadLevelModules(levelId: string) {
    try {
      const modulesData = await gamificationService.getLevelModules(levelId);
      setModules(modulesData);

      const completionsMap: { [key: string]: ModuleCompletion } = {};
      const materialsMap: { [key: string]: CourseMaterial[] } = {};

      for (const module of modulesData) {
        const completion = await gamificationService.getModuleCompletion(userId, module.id);
        if (completion) {
          completionsMap[module.id] = completion;
        }

        const moduleMaterials = await gamificationService.getMaterialsByModule(module.id);
        materialsMap[module.id] = moduleMaterials;
      }

      setCompletions(completionsMap);
      setMaterials(materialsMap);
    } catch (error) {
      console.error('Error loading level modules:', error);
    }
  }

  async function handleStartModule(moduleId: string) {
    if (onModuleSelect) {
      onModuleSelect(moduleId);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-slate-400">Loading course...</div>
      </div>
    );
  }

  const completedModulesCount = Object.values(completions).filter(c => c.completed).length;
  const totalModulesCount = modules.length;

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{course?.course_name}</h1>
              <p className="text-blue-100 mb-4">{course?.description}</p>
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">{progress?.total_xp_earned || 0} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Level {progress?.current_level_number || 1} / 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{completedModulesCount} / {totalModulesCount} Modules</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-blue-100 mb-1">
                  <span>Course Progress</span>
                  <span>{progress?.completion_percentage || 0}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progress?.completion_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="w-80 border-r border-slate-700 overflow-auto bg-slate-800">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Course Levels</h2>
            <div className="space-y-2">
              {levels.map((level) => {
                const isUnlocked = (progress?.current_level_number || 1) >= level.level_number;
                const isCurrent = selectedLevel?.id === level.id;

                return (
                  <button
                    key={level.id}
                    onClick={() => isUnlocked && setSelectedLevel(level)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isUnlocked
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{level.level_name}</span>
                      {!isUnlocked && <Lock className="w-4 h-4" />}
                      {isUnlocked && level.level_number < (progress?.current_level_number || 1) && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <TrendingUp className="w-3 h-3" />
                      <span>{level.xp_required} XP Required</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {selectedLevel && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedLevel.level_name}</h2>
                  <p className="text-slate-400">{selectedLevel.level_description}</p>
                </div>

                <div className="grid gap-4">
                  {modules.map((module, index) => {
                    const completion = completions[module.id];
                    const isCompleted = completion?.completed || false;
                    const moduleMaterials = materials[module.id] || [];

                    const moduleIcon = {
                      lesson: BookOpen,
                      challenge: FileCode,
                      quiz: MessageCircle,
                      project: Trophy
                    }[module.module_type] || BookOpen;

                    const ModuleIcon = moduleIcon;

                    return (
                      <div
                        key={module.id}
                        className={`bg-slate-800 rounded-lg border ${
                          isCompleted ? 'border-green-500/30' : 'border-slate-700'
                        } p-5 hover:border-blue-500 transition-all cursor-pointer`}
                        onClick={() => handleStartModule(module.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <ModuleIcon className="w-6 h-6 text-white" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-white font-medium mb-1">{module.module_title}</h3>
                                <p className="text-sm text-slate-400">{module.module_description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                  +{module.xp_reward} XP
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{module.estimated_minutes} min</span>
                              </div>
                              <div className="flex items-center gap-1 capitalize">
                                <span>{module.module_type}</span>
                              </div>
                              {moduleMaterials.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span>{moduleMaterials.length} materials</span>
                                </div>
                              )}
                            </div>

                            {moduleMaterials.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {moduleMaterials.map((material) => (
                                  <div
                                    key={material.id}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                                  >
                                    {material.material_type === 'video' && <Video className="w-3 h-3" />}
                                    {material.material_type === 'pdf' && <FileText className="w-3 h-3" />}
                                    {material.material_type === 'article' && <BookOpen className="w-3 h-3" />}
                                    <span className="capitalize">{material.material_type}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {isCompleted && completion && (
                              <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-4 text-sm">
                                <span className="text-green-400">Completed</span>
                                {completion.score && (
                                  <span className="text-slate-400">Score: {completion.score}%</span>
                                )}
                                {completion.time_spent_minutes > 0 && (
                                  <span className="text-slate-400">Time: {completion.time_spent_minutes}min</span>
                                )}
                              </div>
                            )}
                          </div>

                          <ArrowRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {modules.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No modules available yet for this level</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
