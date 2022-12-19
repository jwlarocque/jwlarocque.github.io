import type { PageLoad } from './$types';

import card2022Data from "$lib/data/card2022ImageTimeline.json";

export const prerender = true;

export const load = (async ({ fetch, params }) => {
    card2022Data.items.forEach(async (item) => {
        const res = await fetch(card2022Data.descPath + item.desc);
        item["descHtml"] = await res.text();
    });

    return { card2022Data };
  }) satisfies PageLoad;