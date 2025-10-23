import leoProfanity from "leo-profanity";
import { badWords } from "./bad-word";

export default function badWordsFilter(text: string) {
  leoProfanity.loadDictionary("pt" as any);
  leoProfanity.add(badWords);
  return leoProfanity.clean(text);
}
