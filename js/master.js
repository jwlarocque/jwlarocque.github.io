footerStrings = [
    "<a href=\"http://www.ibiblio.org/apollo/ScansForConversion/\" style=\"text-decoration:none; color:inherit\">Apollo source code scans</a>",
    "<a href=\"https://en.wikipedia.org/wiki/Collier_(ship)#Coals_from_Newcastle\" style=\"text-decoration:none; color:inherit\">Wikipedia - Collier (ship)</a>",
    "<a href=\"https://www.goodreads.com/book/show/23444482-the-traitor-baru-cormorant\" style=\"text-decoration:none; color:inherit\">The Traitor Baru Cormorant (novel)</a>", // Sorry for the Goodreads link, but I think it's more useful than the author's website.
    "<a href=\"http://www.charts.noaa.gov/OnLineViewer/17382.shtml\" style=\"text-decoration:none; color:inherit\">NOAA chart 17382 (Zarembo Island)</a>",
    "<a href=\"https://www.youtube.com/channel/UCworsKCR-Sx6R6-BnIjS2MA\" style=\"text-decoration:none; color:inherit\">Clickspring (Clockmaking videos)</a>"
]

function fillFooterText() {
    year = String(new Date().getFullYear()); // _always_ copywritten!
    $("footer").html("<p><span style=\"font-size: 0.8em; padding-left: 0em;\">Interesting link: "
        + footerStrings[Math.floor(Math.random() * footerStrings.length)]
        + "</span></p>");
}

window.onload = function() {
    initMenu(); // in menuMagic.js
    fillFooterText();
}
