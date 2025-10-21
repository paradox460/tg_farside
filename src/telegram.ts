import type { Comic } from "./farside.ts";

interface SuccessfulSend {
  message_id: number;
  from_chat_id: number;
}

export async function send(
  comic: Comic,
  chat_id: string,
): Promise<SuccessfulSend> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }

  let caption = comic.caption ? `_${escape(comic.caption)}_\n\n` : "";
  caption += `\[[link](${comic.link.toString()})\]`;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendPhoto`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        chat_id,
        photo: comic.src.toString(),
        caption,
        parse_mode: "MarkdownV2",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to send comic: ${response.statusText}`);
  }

  const json = await response.json();

  const { message_id, chat: { id: from_chat_id } } = json.result;

  return { message_id, from_chat_id };
}

function escape(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
