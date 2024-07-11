import { Subject, Course } from '@prisma/client';

export function getSubjects(
  courses: Course[],
  allSubjects: Subject[],
): Course[] {
  courses = courses.map((course) => {
    return {
      ...course,
      subjects: allSubjects.filter(
        (subject) => subject.course_id === course.id,
      ),
    };
  });

  return courses;
}
