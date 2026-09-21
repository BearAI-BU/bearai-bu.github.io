# Event management

[README](../README.md) · [Content maintenance](maintenance.md) · [Publishing and recovery](publishing.md)

## Add an event

1. Obtain the approved title, description, date, start/end times, location, and any media or links. Do not invent missing facts.
2. Open `content.js`. Find the `"events": [` array (a list). Each `{ ... }` is one event record. Separate records with commas.
3. Copy a record and give it a unique lowercase, hyphenated `id`. This becomes an address like `#/events/general-interest`. Keep existing IDs when editing so shared links remain valid.
4. Enter both dates with explicit time-zone offsets as shown below.
5. Copy approved images into `assets/` and enter their paths. Images and registration links are optional.
6. Run `npm start`; refresh Home and Events and follow **Full event details**. Check all facts, images, and links.
7. Run `npm test` and `npm run build`, then follow [routine publication](publishing.md#routine-publication).

## Complete GIM example

This record already exists. Edit it rather than duplicating it. For another event, change the ID and all relevant facts and media references.

```json
{
  "id": "general-interest",
  "title": "BearAI General Interest Meeting",
  "description": "Join us for BearAI’s General Interest Meeting in Cashion C311! Meet the officers, learn about the club, and share what you’d like to explore in AI this semester. All majors and experience levels are welcome, and we’ll have Shorty’s pizza!",
  "start": "2026-09-24T19:30:00-05:00",
  "end": "2026-09-24T20:30:00-05:00",
  "timeZone": "America/Chicago",
  "location": "Cashion C311",
  "food": "Shorty’s pizza will be available.",
  "image": "assets/gim-september-2026.png",
  "imageAlt": "Promotional artwork for the BearAI General Interest Meeting showing BearAI branding in a classroom.",
  "imageCaption": "General Interest Meeting promotional artwork.",
  "photos": []
}
```

Add a comma after the closing `}` if another event follows it. Do not paste the Markdown fence lines into the file. The supplied artwork is promotional material, not a photo of an event that has already happened.

## Dates and automatic classification

Use 24-hour time: `19:30` means 7:30 PM. Waco’s display zone is `America/Chicago`. September 24, 2026 uses daylight-saving offset `-05:00`; a winter date such as December 1, 2026 uses `-06:00`. Confirm the offset for each event, especially around daylight-saving transitions. Changing `timeZone` alone does not correct the timestamp’s offset.

Provide an end at or after the start, including the next date when crossing midnight. Classification requires a start with an explicit offset or `Z`. Missing or malformed starts are unconfirmed.

`events.js` uses the visitor’s clock and absolute timestamps:

- **Upcoming:** start is later than now, earliest first.
- **Happening now:** start has arrived and end is still in the future.
- **Past:** the end has arrived, including the exact end instant; newest start first.
- **Dates to be confirmed:** no valid start with an offset.
- `hidden: true` or `cancelled: true` removes the event from lists, homepage selection, and its detail page.

A missing, invalid, or earlier-than-start end falls back to the start. This prevents an event staying ongoing forever; it is not a substitute for providing the correct end.

Home shows **one next upcoming event**, the earliest future start. It does not feature ongoing or ended events. With no future event, it shows the first undated record, if available, or a check-back message. Events retains the complete classified list.

Classification runs when a page renders: first load, reload, or navigation to another site page. A browser left on the same page has **no live timer** that moves cards at the exact end time; refresh it. No rebuild or scheduled deployment is needed just because time passes. Editing event data does require publication. An incorrect device clock can affect selection.

## Optional fields

| Field | Purpose |
| --- | --- |
| `image`, `imageAlt`, `imageCaption` | Promotional artwork, alternative text, optional caption |
| `flyer`, `flyerAlt` | Real supplied flyer, automatically captioned **Promotional flyer** |
| `url`, `urlLabel` | Approved HTTPS event-information link and optional label |
| `registration` | Approved HTTPS registration link; omit if unavailable |
| `details`, `food`, `mealNote`, `virtual` | Optional factual details, food, deadlines, and remote-attendance text |
| `sponsor` | Confirmed event sponsor, not a site-wide partner |
| `recap` | Approved account of what happened; omit until supplied |
| `photos` | Gallery records: `src`, `alt`, `caption` |
| `hidden`, `cancelled` | Optional booleans controlling visibility |

Missing links are omitted. Use `"start": null` and `"end": null` for an unconfirmed date and `"location": null` for an unknown location. Do not guess a date to make a card appear. No draft flag is needed.

## Edit, postpone, or cancel

1. Find the record by ID.
2. Change the relevant facts. For postponement, update both dates and offsets; use `null` dates if the replacement date is unknown.
3. To cancel, add `"cancelled": true`. This removes the card rather than displaying a cancellation notice. Notify members separately through normal club channels.
4. Preview, check, build, and publish. To restore the event, remove the flag or set it to `false`.

## Afterward: recap and gallery

Leave the original dates and flyer intact. The event appears in Past Events on the next render after ending. Add a verified `recap` only when available. Add actual approved photos, for example:

```json
"photos": [
  {
    "src": "assets/gim-2026-members.jpg",
    "alt": "Students discussing project ideas at the BearAI meeting.",
    "caption": "Members sharing ideas after the general interest meeting."
  }
]
```

That filename and caption are illustrative: add a real file and an accurate caption before using them. `photos: []` displays **Event photos coming soon.** on a past event. Flyers stay separate from photos. The ECS Tailgate currently has that placeholder and no invented recap.

Picnic Palooza keeps its approved special two-image layout. Its legacy gallery includes a captioned flyer and the officer photo, and its description supplies the recap. For new events use `flyer` separately, reserve `photos` for actual photos, and use `recap` for the retrospective text.

To feature a real photo on Community, add `{ "eventId": "general-interest", "photoIndex": 0 }` to `communityHighlights` after the photo exists. Index `0` means the first photo, `1` the second. The first eligible highlight becomes the large featured image. Do not use promotional artwork as evidence of attendance.
