import type { Comic } from "./farside.ts";

export async function isDuplicate(comics: Comic[]): Promise<[boolean, string]> {
  const hash = await hashComics(comics);
  try {
    const oldHash = await Deno.readTextFile("/var/cache/farside/hash");
    return [hash === oldHash, hash];
  } catch (_error) {
    return [false, hash];
  }
}

export async function storeDuplicate(hash: string) {
  await Deno.writeTextFile("/var/cache/farside/hash", hash);
}

async function hashComics(comics: Comic[]): Promise<string> {
  const comicJson = JSON.stringify(comics);
  const buffer = new TextEncoder().encode(comicJson);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
