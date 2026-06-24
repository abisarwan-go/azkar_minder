#!/usr/bin/env python3
"""
Extract Hisn al-Muslim from Sunnah.com-compatible data and write the JSON
schema agreed in the ChatGPT conversation.

Usage:
    python web/scripts/extract-hisn.py

The script uses a GitHub mirror of the Sunnah.com Hisn al-Muslim rendered data
for the item text because it is already parsed as JSON, then optionally reads
Sunnah.com itself to enrich chapter Arabic titles from the table of contents.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import OrderedDict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.request import Request, urlopen

DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / "data/source/hisn_al_muslim_full.json"

SUNNAH_PAGE_URL = "https://sunnah.com/hisn#C1.00"
SUNNAH_BASE_URL = "https://sunnah.com/hisn"
RAW_ITEMS_URL = (
    "https://raw.githubusercontent.com/4thel00z/hadith.json/"
    "8b17ff383abd5c06c4a28f6bbded866b7eba57f8/"
    "hisnulmuslim/hisnulmuslim.json"
)

ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
HISN_REF_RE = re.compile(r"Hisn\s+al-Muslim\s+(\d+)", re.IGNORECASE)
TOC_LINE_RE = re.compile(r"^\s*(\d{1,3})\s+(.*?)([\u0600-\u06FF].*)\s*$")


def fetch_text(url: str, timeout: int = 30) -> str:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; HisnExtractor/1.0)",
            "Accept": "text/html,application/json,text/plain,*/*",
        },
    )
    with urlopen(req, timeout=timeout) as response:
        raw = response.read()
    # Try UTF-8 with BOM first; fall back leniently.
    return raw.decode("utf-8-sig", errors="replace")


def clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.replace("\ufeff", "").replace("\xa0", " ").strip()
    lines = [line.strip() for line in value.splitlines()]
    # Preserve paragraph boundaries but remove excessive empty lines.
    out: List[str] = []
    previous_blank = False
    for line in lines:
        if not line:
            if not previous_blank and out:
                out.append("")
            previous_blank = True
        else:
            out.append(line)
            previous_blank = False
    while out and out[-1] == "":
        out.pop()
    return "\n".join(out) if out else None


def parse_hisn_number(reference: str) -> int:
    match = HISN_REF_RE.search(reference.replace("\xa0", " "))
    if not match:
        raise ValueError(f"Could not parse Hisn reference: {reference!r}")
    return int(match.group(1))


def split_english_field(english: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """Return transliteration, English translation, and source reference."""
    english = clean_text(english) or ""

    # The mirrored Sunnah data usually has a standalone "Reference:" paragraph.
    reference = None
    body = english
    marker = "\nReference:\n"
    if marker in english:
        body, reference = english.split(marker, 1)
    else:
        # Fallback for one-line/HTML-collapsed forms.
        idx = english.find("Reference:")
        if idx != -1:
            body = english[:idx]
            reference = english[idx + len("Reference:"):]

    body = clean_text(body) or ""
    reference = clean_text(reference)

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    if len(paragraphs) >= 2:
        transliteration = clean_text(paragraphs[0])
        translation_en = clean_text("\n\n".join(paragraphs[1:]))
    elif len(paragraphs) == 1:
        # Not enough structure to split safely.
        transliteration = None
        translation_en = clean_text(paragraphs[0])
    else:
        transliteration = None
        translation_en = None

    return transliteration, translation_en, reference


def strip_chapter_prefix(title: str) -> str:
    title = title.strip()
    if title.lower().startswith("chapter:"):
        return title.split(":", 1)[1].strip()
    return title


def extract_toc_from_sunnah_page(html_or_text: str) -> Dict[str, Dict[str, Any]]:
    """Extract chapter number + Arabic title from Sunnah.com rendered text/HTML."""
    # Use a simple text-strip approach so this works with or without BeautifulSoup.
    text = re.sub(r"<[^>]+>", "\n", html_or_text)
    text = text.replace("&nbsp;", " ").replace("\xa0", " ")
    lines = [clean_text(line) or "" for line in text.splitlines()]

    toc: Dict[str, Dict[str, Any]] = {}
    for line in lines:
        line = line.strip()
        match = TOC_LINE_RE.match(line)
        if not match:
            continue
        chapter_number = int(match.group(1))
        if chapter_number < 1 or chapter_number > 200:
            continue
        english = clean_text(match.group(2)) or ""
        arabic = clean_text(match.group(3)) or ""
        # Avoid matching hadith text lines that start with numbers/references.
        if not english or len(english) > 160 or not ARABIC_RE.search(arabic):
            continue
        toc[english] = {
            "chapter_number": chapter_number,
            "arabic": arabic,
            "english": english,
        }
    return toc


def load_flat_items(raw_url: str = RAW_ITEMS_URL) -> List[Dict[str, Any]]:
    raw = fetch_text(raw_url)
    data = json.loads(raw)
    if not isinstance(data, list):
        raise TypeError("Expected a JSON list of Hisn al-Muslim items")
    return data


def build_json(flat_items: List[Dict[str, Any]], toc: Optional[Dict[str, Dict[str, Any]]] = None) -> Dict[str, Any]:
    toc = toc or {}
    chapters: "OrderedDict[str, Dict[str, Any]]" = OrderedDict()

    for item in flat_items:
        raw_title = str(item.get("title", "")).strip()
        chapter_title_en = strip_chapter_prefix(raw_title)
        if not chapter_title_en:
            chapter_title_en = "Untitled"

        if chapter_title_en not in chapters:
            chapter_number = toc.get(chapter_title_en, {}).get("chapter_number", len(chapters) + 1)
            chapters[chapter_title_en] = {
                "chapter_number": chapter_number,
                "title": {
                    "arabic": toc.get(chapter_title_en, {}).get("arabic"),
                    "english": chapter_title_en,
                    "french": None,
                },
                "items": [],
            }

        hisn_number = parse_hisn_number(str(item.get("reference", "")))
        transliteration, translation_en, source_reference = split_english_field(str(item.get("english", "")))
        chapter = chapters[chapter_title_en]
        chapter["items"].append(
            {
                "id": f"hisn_{hisn_number:03d}",
                "item_number": len(chapter["items"]) + 1,
                "hisn_reference": f"Hisn al-Muslim {hisn_number}",
                "url": f"{SUNNAH_BASE_URL}:{hisn_number}",
                "text": {
                    "arabic": clean_text(item.get("arabic")),
                    "transliteration": transliteration,
                    "translation_en": translation_en,
                    "translation_fr": None,
                },
                "reference": source_reference,
            }
        )

    # Sort by chapter number, preserving item order inside each chapter.
    chapter_list = sorted(chapters.values(), key=lambda ch: ch["chapter_number"])

    return {
        "source": {
            "site": "sunnah.com",
            "url": SUNNAH_PAGE_URL,
            "collection": "Hisn al-Muslim",
            "collection_arabic": "حصن المسلم",
            "item_data_mirror": RAW_ITEMS_URL,
        },
        "chapters": chapter_list,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract Hisn al-Muslim as structured JSON.")
    parser.add_argument(
        "--output",
        "-o",
        default=str(DEFAULT_OUTPUT),
        help="Output JSON file path",
    )
    parser.add_argument(
        "--skip-sunnah-toc",
        action="store_true",
        help="Do not fetch Sunnah.com for Arabic chapter titles; titles.arabic will be null",
    )
    args = parser.parse_args()

    flat_items = load_flat_items()

    toc: Dict[str, Dict[str, Any]] = {}
    if not args.skip_sunnah_toc:
        try:
            toc = extract_toc_from_sunnah_page(fetch_text("https://sunnah.com/hisn"))
        except Exception as exc:  # noqa: BLE001 - keep extraction resilient.
            print(f"Warning: could not fetch/parse Sunnah.com TOC: {exc}", file=sys.stderr)

    result = build_json(flat_items, toc=toc)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")

    item_count = sum(len(ch["items"]) for ch in result["chapters"])
    print(f"Wrote {args.output}")
    print(f"Chapters: {len(result['chapters'])}")
    print(f"Items: {item_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
