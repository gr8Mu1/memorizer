import hash from "object-hash";

/**
 * Knows all available tags and what tags have been added to each task
 * (In order not to confuse the similar looking words `task` and `tag`
 * we sometimes use the synonym `exercise` for `task` within this class)
 */
export class TagCollection {
  _tagsByExerciseHash: Map<string, Set<string>> = new Map();
  _tagsByHash: Map<string, Tag> = new Map();

  constructor(tagsByExerciseHash: Map<string, Set<string>>, tagsByHash: Map<string, Tag>) {
    this._tagsByExerciseHash = tagsByExerciseHash;
    this._tagsByHash = tagsByHash;
  }

  public addTag(tag: Tag) {
    this._tagsByHash.set(this.computeHash(tag), tag);
  }

  public removeTag(tagHash: string) {
    this.removeTagFromAllTasks(tagHash);
    this._tagsByHash.delete(tagHash);
  }

  public addTagsToTask(exeHash: string, tagHashes: string[]) {
    if (!this._tagsByExerciseHash.has(exeHash)) {
      this._tagsByExerciseHash.set(exeHash, new Set<string>());
    }
    let tagsForThisTask = this._tagsByExerciseHash.get(exeHash);
    for (let tagHash of tagHashes) {
      tagsForThisTask.add(tagHash);
    }
  }

  public removeTagsFromTask(exeHash: string, tagHashes: string[]) {
    if (!this._tagsByExerciseHash.has(exeHash)) {
      return;
    }
    for (let tagHash of tagHashes) {
      this._tagsByExerciseHash.get(exeHash).delete(tagHash);
    }
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

  public filterByTags(exeHashes: string[], tagHashes: string[]): [string[], string[]] {
    let hasTag: string[] = [];
    let doesNotHave: string[] = []
    for (let exeHash of exeHashes) {
      if (this.hasAll(this._tagsByExerciseHash.get(exeHash), tagHashes)) {
        hasTag.push(exeHash);
      } else {
        doesNotHave.push(exeHash);
      }
    }
    return [hasTag, doesNotHave];
  }

  private hasAll(tagHashesOfThisTask: Set<string>, requiredTagHashes: string[]): boolean {
    if (!tagHashesOfThisTask) {
      return false;
    }
    for (const tagHash of requiredTagHashes) {
      if (!tagHashesOfThisTask.has(tagHash)) return false;
    }

    return true;
  }

  private computeHash(tag: Tag): string {
    return hash(tag, { encoding: 'base64' });
  }

  getAllTags(): Tag[] {
    return Array.from(this._tagsByHash.values());
  }

  public static createEmpty(): TagCollection {
    return new TagCollection(new Map(), new Map());
  }

  /**
   * Typically the AppState translates a `Tag[]` to a `string[]`
   */
  getHashesFor(tags: Tag[]): string[] {
    let hashes: string[] = [];
    for (const tag of tags) {
      hashes.push(this.computeHash(tag));
    }
    return hashes;
  }

  getTagsOfTask(exeHash: string): Tag[] {
    let tagHashes = this._tagsByExerciseHash.get(exeHash);
    if (!tagHashes) {
      return [];
    }
    let tags: Tag[] = [];
    for (let tagHash of tagHashes.values()) {
      tags.push(this._tagsByHash.get(tagHash));
    }
    return tags;
  }
}

export interface Tag {
  shortName: string;
  description: string;
}
