import { getComics } from "./src/farside.ts";
import type { Comic } from "./src/farside.ts";
import { send } from "./src/telegram.ts";
import { isDuplicate, storeDuplicate } from "./src/dupe_preventer.ts";

const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
if (!CHAT_ID) {
  throw new Error("TELEGRAM_CHAT_ID is not set");
}

let date;
if (Deno.args.length > 0) {
  [date] = Deno.args;
}

const comics = await Array.fromAsync(getComics(date));

if (!date) {
  const [dupe, hash] = await isDuplicate(comics);
  if (dupe) {
    console.log("Duplicate as last run, exiting");
    Deno.exit(0);
  }
  await storeDuplicate(hash);
}

for (const comic of comics) {
  try {
    const result = await send(comic, CHAT_ID);
    console.log(
      `Sent comic to chat ${result.from_chat_id} with message ID ${result.message_id}`,
    );
  } catch (error) {
    console.error("Error sending comic:", error);
  }
}
