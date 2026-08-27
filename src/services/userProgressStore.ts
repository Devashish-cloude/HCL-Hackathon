export interface StoredProgress {
  completedFocusTaskIds: string[];
  completedLessonKeys: string[];
  completedModuleIds: string[];
  completedCourseSlugs: string[];
  timeInvestedMinutes: number;
}

function getStorageKey(userId?: string): string {
  return `learnpath_progress_${userId || 'default_user'}`;
}

export const userProgressStore = {
  getProgress(userId?: string): StoredProgress {
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          completedFocusTaskIds: parsed.completedFocusTaskIds || [],
          completedLessonKeys: parsed.completedLessonKeys || [],
          completedModuleIds: parsed.completedModuleIds || [],
          completedCourseSlugs: parsed.completedCourseSlugs || [],
          timeInvestedMinutes: parsed.timeInvestedMinutes || 0,
        };
      }
    } catch (e) {
      console.error('Failed to read stored progress:', e);
    }
    return {
      completedFocusTaskIds: [],
      completedLessonKeys: [],
      completedModuleIds: [],
      completedCourseSlugs: [],
      timeInvestedMinutes: 0,
    };
  },

  saveProgress(progress: StoredProgress, userId?: string): void {
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(progress));
      window.dispatchEvent(new CustomEvent('learnpath:refresh'));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },

  toggleFocusTask(taskId: string, userId?: string): StoredProgress {
    const current = this.getProgress(userId);
    const exists = current.completedFocusTaskIds.includes(taskId);
    const updatedTaskIds = exists
      ? current.completedFocusTaskIds.filter((id) => id !== taskId)
      : [...current.completedFocusTaskIds, taskId];

    // If adding a task, add ~15 min invested
    const timeDelta = exists ? -15 : 15;
    const newMinutes = Math.max(0, current.timeInvestedMinutes + timeDelta);

    const updated: StoredProgress = {
      ...current,
      completedFocusTaskIds: updatedTaskIds,
      timeInvestedMinutes: newMinutes,
    };

    this.saveProgress(updated, userId);
    return updated;
  },

  markLessonComplete(
    courseSlug: string,
    moduleIndex: number,
    lessonIndex: number,
    userId?: string
  ): StoredProgress {
    const current = this.getProgress(userId);
    const key = `${courseSlug}:${moduleIndex}:${lessonIndex}`;
    
    if (current.completedLessonKeys.includes(key)) {
      return current;
    }

    const updatedLessonKeys = [...current.completedLessonKeys, key];
    const updated: StoredProgress = {
      ...current,
      completedLessonKeys: updatedLessonKeys,
      timeInvestedMinutes: current.timeInvestedMinutes + 20,
    };

    this.saveProgress(updated, userId);
    return updated;
  },

  markCourseComplete(courseSlug: string, userId?: string): StoredProgress {
    const current = this.getProgress(userId);
    if (current.completedCourseSlugs.includes(courseSlug)) {
      return current;
    }

    const updated: StoredProgress = {
      ...current,
      completedCourseSlugs: [...current.completedCourseSlugs, courseSlug],
      timeInvestedMinutes: current.timeInvestedMinutes + 30,
    };

    this.saveProgress(updated, userId);
    return updated;
  },

  isLessonComplete(
    courseSlug: string,
    moduleIndex: number,
    lessonIndex: number,
    userId?: string
  ): boolean {
    const current = this.getProgress(userId);
    const key = `${courseSlug}:${moduleIndex}:${lessonIndex}`;
    return current.completedLessonKeys.includes(key);
  },
};
