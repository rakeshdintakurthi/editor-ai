import { useState, useEffect } from 'react';
import { BookOpen, Play, FileText, Code2, Clock, CheckCircle, Lock } from 'lucide-react';
import { gamificationService, CareerTrack, Course, Lesson } from '../lib/gamification';

interface LearningLibraryProps {
  userId: string;
  onSelectLesson?: (lessonId: string) => void;
}

export default function LearningLibrary({ userId, onSelectLesson }: LearningLibraryProps) {
  const [tracks, setTracks] = useState<CareerTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      loadCourses(selectedTrack.id);
    }
  }, [selectedTrack]);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse.id);
    }
  }, [selectedCourse]);

  async function loadTracks() {
    try {
      const data = await gamificationService.getAllTracks();
      setTracks(data);
      if (data.length > 0) {
        setSelectedTrack(data[0]);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourses(trackId: string) {
    try {
      const data = await gamificationService.getCoursesByTrack(trackId);
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0]);
      } else {
        setSelectedCourse(null);
        setLessons([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  async function loadLessons(courseId: string) {
    try {
      const data = await gamificationService.getLessonsByCourse(courseId);
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading library...</div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'text-green-400 bg-green-500/20',
    intermediate: 'text-yellow-400 bg-yellow-500/20',
    advanced: 'text-red-400 bg-red-500/20',
  };

  return (
    <div className="h-full flex bg-slate-900">
      <div className="w-80 border-r border-slate-700 overflow-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Learning Library
          </h2>

          <div className="space-y-2">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTrack?.id === track.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <Code2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{track.track_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-75 ml-8">
                  <span className="capitalize">{track.difficulty}</span>
                  <span>•</span>
                  <span>{track.estimated_hours}h</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-80 border-r border-slate-700 overflow-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Courses</h3>
            {courses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No courses available yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCourse?.id === course.id
                        ? 'bg-slate-700 border border-blue-500'
                        : 'bg-slate-800 hover:bg-slate-750'
                    }`}
                  >
                    <h4 className="text-white font-medium text-sm mb-1">{course.course_name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={`px-2 py-0.5 rounded capitalize ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
                        {course.difficulty}
                      </span>
                      <span>{course.estimated_hours}h</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {selectedCourse ? (
              <>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedCourse.course_name}</h1>
                  <p className="text-slate-400 mb-4">{selectedCourse.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full capitalize ${difficultyColors[selectedCourse.difficulty as keyof typeof difficultyColors]}`}>
                      {selectedCourse.difficulty}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedCourse.estimated_hours} hours
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-white mb-4">Lessons</h2>
                  {lessons.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No lessons available yet</p>
                    </div>
                  ) : (
                    lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group"
                        onClick={() => onSelectLesson && onSelectLesson(lesson.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                            {lesson.lesson_type === 'video' ? (
                              <Play className="w-5 h-5 text-white" />
                            ) : (
                              <FileText className="w-5 h-5 text-white" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                  {index + 1}. {lesson.lesson_title}
                                </h3>
                                <p className="text-sm text-slate-400 capitalize">{lesson.lesson_type} lesson</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                                  +{lesson.xp_reward} XP
                                </span>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-blue-500 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a course to view lessons</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
