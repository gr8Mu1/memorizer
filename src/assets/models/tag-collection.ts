import hash from "object-hash";
import {Task} from "./task-collection";

/**
 * Knows all available tags and what tags have been added to each task
 * (In order not to confuse the similar looking words `task` and `tag`
 * we sometimes use the synonym `exercise` for `task` within this class)
 */
export class TagCollection {
  _tagsByExerciseHash: Map<string, Set<string>> = new Map();
  _tagsByHash: Map<string, Tag> = new Map();

  public addTag(shortName: string, description: string) {
    let tag: Tag = {shortName, description};
    this._tagsByHash.set(this.computeHash(tag), tag);
  }

  public removeTag(tagHash: string) {
    this.removeTagFromAllTasks(tagHash);
    this._tagsByHash.delete(tagHash);
  }

  public addTagToTask(exeHash: string, tagHash: string) {
    if (!this._tagsByExerciseHash.has(exeHash)) {
      this._tagsByExerciseHash.set(exeHash, new Set<string>());
    }
    this._tagsByExerciseHash.get(exeHash).add(tagHash);
  }

  public removeTagFromTask(exeHash: string, tagHash: string) {
    if (!this._tagsByExerciseHash.has(exeHash)) {
      return;
    }
    this._tagsByExerciseHash.get(exeHash).delete(tagHash);
  }

  public removeAllTagsFromTask(exeHash: string) {
    if (!this._tagsByExerciseHash.has(exeHash)) {
      return;
    }
    this._tagsByExerciseHash.delete(exeHash);
  }

  public removeTagFromAllTasks(tagHash: string) {
    for (let tagHashes of this._tagsByExerciseHash.values()) {
      tagHashes.delete(tagHash);
    }
  }

  public filterByTag(exeHashes: string[], tagHash: string): [string[], string[]] {
    let hasTag: string[] = [];
    let doesNotHave: string[] = []
    for (let exeHash of exeHashes) {
      if (this._tagsByExerciseHash.get(exeHash).has(tagHash)) {
        hasTag.push(exeHash);
      } else {
        doesNotHave.push(exeHash);
      }
    }
    return [hasTag, doesNotHave];
  }

  private computeHash(tag: Tag): string {
    return hash(tag, { encoding: 'base64' });
  }

  getAllTags(): Tag[] {
    return Array.from(this._tagsByHash.values());
  }
}

export interface Tag {
  shortName: string;
  description: string;
}
