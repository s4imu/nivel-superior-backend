import { Course, Subject } from '@prisma/client';

export function subjectCoursesMap(
  subjects: Subject[],
  courses: Course[],
): Subject[] {
  let newSubjects = subjects.map((subject) => {
    return {
      course_name: undefined,
      ...subject,
    };
  });
  newSubjects = newSubjects.map((subject) => {
    const course = courses.find((course) => subject.course_id === course.id);
    if (course) subject = { ...subject, course_name: course.title };
    return subject;
  });
  return newSubjects;
}
