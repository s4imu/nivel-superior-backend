import { Subject, Media } from '@prisma/client';

export function mediaSubjectsMap(
  medias: Media[],
  subjects: Subject[],
): Media[] {
  let newMedias = medias.map((media) => {
    return {
      ...media,
      subject_name: undefined,
    };
  });
  newMedias = newMedias.map((media) => {
    const subject = subjects.find((subject) => media.subject_id === subject.id);
    if (subject) media = { ...media, subject_name: subject.title };
    return media;
  });
  return newMedias;
}
