import dayjs from "dayjs";
import { chromium } from "playwright";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Comic {
  src: URL;
  link: URL;
  caption?: string;
}

export async function* getComics(date?: string) {
  console.debug("Launching browser to fetch comics");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  date = date ?? dayjs().format("YYYY/MM/DD");
  const url = `https://www.thefarside.com/${date}`;
  await page.goto(url);
  await sleep(5000);

  const comic_cards = page.locator("div[data-position]");
  const comic_count = await comic_cards.count();

  if (comic_count === 0) return;
  console.log(`Found ${comic_count} comics`);

  for (const [index, comic] of (await comic_cards.all()).entries()) {
    const src = await comic.locator("img").getAttribute("data-src");

    const captionElement = comic.locator(".figure-caption");
    const captionCount = await captionElement.count();
    let caption;
    if (captionCount > 0) {
      caption = await captionElement.innerText();
      caption.trim();
      caption = caption == "" ? null : caption;
    } else {
      caption = null;
    }

    const link = new URL(url);
    link.pathname += `/${index}`;

    yield {
      src: new URL(src!),
      link,
      caption,
    } as Comic;
  }

  await browser.close();
}
