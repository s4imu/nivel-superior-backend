import { Comment, Subject } from '@prisma/client';

export function getComments(
  subjects: Subject[],
  allComments: Comment[],
): Subject[] {
  subjects = subjects.map((subject) => {
    return {
      ...subject,
      comments: allComments.filter(
        (comment) => comment.subject_id === subject.id,
      ),
    };
  });

  return subjects;
}
