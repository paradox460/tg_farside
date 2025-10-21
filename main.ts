import { getComics } from "./src/farside.ts";
import type { Comic } from "./src/farside.ts";
import { send } from "./src/telegram.ts";

const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
if (!CHAT_ID) {
  throw new Error("TELEGRAM_CHAT_ID is not set");
}

let date;
if (Deno.args.length > 0) {
  [date] = Deno.args;
}

for await (const comic of getComics(date)) {
  try {
    const result = await send(comic, CHAT_ID);
    console.log(
      `Sent comic to chat ${result.from_chat_id} with message ID ${result.message_id}`,
    );
  } catch (error) {
    console.error("Error sending comic:", error);
  }
}
