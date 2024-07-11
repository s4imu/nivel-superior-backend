import { Media, Subject } from '@prisma/client';

export function getMedias(subjects: Subject[], allMedias: Media[]): Subject[] {
  subjects = subjects.map((subject) => {
    return {
      ...subject,
      medias: allMedias.filter((media) => media.subject_id === subject.id),
    };
  });

  return subjects;
}
