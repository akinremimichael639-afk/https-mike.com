import { TimetableModel, LectureTimetable, ExamTimetable } from '../models/Timetable';
import { Course } from '../models/Course';

export interface Clash<T> {
  event1: T;
  event2: T;
  reason: string;
}

export interface TAGResult {
  lectures: LectureTimetable[];
  exams: ExamTimetable[];
  lectureClashes: Clash<LectureTimetable>[];
  examClashes: Clash<ExamTimetable>[];
}

// Helper to check if two time ranges overlap (format "HH:MM:SS" or "HH:MM")
const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = new Date(`1970-01-01T${start1}Z`).getTime();
  const e1 = new Date(`1970-01-01T${end1}Z`).getTime();
  const s2 = new Date(`1970-01-01T${start2}Z`).getTime();
  const e2 = new Date(`1970-01-01T${end2}Z`).getTime();
  
  // Overlap condition: start of one is before end of another, and vice versa
  return s1 < e2 && s2 < e1;
};

export const TAGEngine = {
  generatePersonalizedTimetable: async (selectedCourseIds: number[]): Promise<TAGResult> => {
    // 1. Fetch all timetables
    const allLectures = await TimetableModel.getAllLectures();
    const allExams = await TimetableModel.getAllExams();

    // 2. Filter by selected courses
    const userLectures = allLectures.filter(l => selectedCourseIds.includes(l.course_id));
    const userExams = allExams.filter(e => selectedCourseIds.includes(e.course_id));

    // 3. Detect Lecture Clashes
    const lectureClashes: Clash<LectureTimetable>[] = [];
    for (let i = 0; i < userLectures.length; i++) {
      for (let j = i + 1; j < userLectures.length; j++) {
        const l1 = userLectures[i];
        const l2 = userLectures[j];
        if (l1.day === l2.day && isTimeOverlap(l1.start_time, l1.end_time, l2.start_time, l2.end_time)) {
          lectureClashes.push({
            event1: l1,
            event2: l2,
            reason: `Time overlap on ${l1.day} between ${l1.start_time}-${l1.end_time} and ${l2.start_time}-${l2.end_time}`
          });
        }
      }
    }

    // 4. Detect Exam Clashes
    const examClashes: Clash<ExamTimetable>[] = [];
    for (let i = 0; i < userExams.length; i++) {
      for (let j = i + 1; j < userExams.length; j++) {
        const e1 = userExams[i];
        const e2 = userExams[j];
        
        // Date format from DB might include time or be ISO, slice first 10 chars (YYYY-MM-DD)
        const date1 = new Date(e1.exam_date).toISOString().slice(0, 10);
        const date2 = new Date(e2.exam_date).toISOString().slice(0, 10);

        if (date1 === date2 && isTimeOverlap(e1.start_time, e1.end_time, e2.start_time, e2.end_time)) {
          examClashes.push({
            event1: e1,
            event2: e2,
            reason: `Time overlap on ${date1} between ${e1.start_time}-${e1.end_time} and ${e2.start_time}-${e2.end_time}`
          });
        }
      }
    }

    return {
      lectures: userLectures,
      exams: userExams,
      lectureClashes,
      examClashes
    };
  }
};
