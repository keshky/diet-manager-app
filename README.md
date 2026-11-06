# Diet Planner & Food Exchange App (v2)

A single-page, bilingual (Arabic RTL / English LTR) web application for planning diets, converting foods between equivalent portions, calculating energy needs, logging daily intake, tracking body progress, and generating grocery lists. Everything runs in the browser: no backend, no build step, no external scripts or fonts.

The app is delivered as one file: `diet-app.html`.

---

## Table of contents

1. [Features](#features)
2. [Quick start](#quick-start)
3. [Installing on iPhone / iPad](#installing-on-iphone--ipad)
4. [Using the app](#using-the-app)
5. [Calculation details](#calculation-details)
6. [Nutrition data](#nutrition-data)
7. [Architecture](#architecture)
8. [Data model and storage](#data-model-and-storage)
9. [Backup and restore](#backup-and-restore)
10. [Internationalization](#internationalization)
11. [Theming](#theming)
12. [Mobile and iOS notes](#mobile-and-ios-notes)
13. [Printing and PDF](#printing-and-pdf)
14. [Security notes](#security-notes)
15. [Limitations](#limitations)
16. [Troubleshooting](#troubleshooting)
17. [Extending the app](#extending-the-app)
18. [Changes from v1](#changes-from-v1)

---

## Features

### Authentication
- First launch shows an account-creation screen (username + password, minimum 4 characters). Later launches show a login screen.
- A session flag keeps you signed in until you press **Log out**.
- Username and password can be changed in **Settings**. Your saved profile follows a username change.

### Language
- English and Arabic, switchable from the header button, the login screen, or Settings. The choice is remembered.
- Switching sets `lang` and `dir` on the `<html>` element (`rtl` for Arabic, `ltr` for English), re-renders every view, and formats numbers and dates for the language (Arabic-Indic digits in Arabic).
- Food and group names are translated. Stored data always keeps the original Arabic food keys, so switching language never breaks plans.

### Food Exchange Calculator
- Seven groups: protein, carbohydrates, healthy fats, fruits, vegetables, dairy, legumes.
- Pick a group, an original food and the quantity in your plan; the app lists every equivalent with the exact weight to eat.
- Standard weights come from the supplied "Food Exchange List" and are editable in **Settings**. Changes apply everywhere instantly.

### Energy Needs Calculator (BMR / TDEE)
- Inputs: age, weight, height, sex, activity level, goal (cut −500 kcal, maintain, bulk +300 kcal) and optional body fat %.
- Outputs: BMR, TDEE, target calories, BMI, suggested macros. With body fat % it also shows fat mass and lean mass and uses Katch-McArdle.

### Saved Profile
- Enter results you already have (from a coach or report), or calculate and then adjust and save.
- Stored per user and shown as a dashboard: BMI and category, healthy weight range, macro percentages, gap between target and maintenance.
- The saved profile is the **target** used by the Daily tab gauges.

### Diet Plan Builder and Meal Engine
- Multiple named plans, any number of meals per plan, renamable meals.
- Every item has an **exact gram weight** you can type (for example boiled egg 35 g, chicken 175 g). You are not locked to exchange multiples.
- Macros (calories, protein, carbs, fat) are calculated automatically per item and per meal from a built-in per-100 g table, proportional to the grams entered.
- **Custom foods:** add your own foods with per-100 g macros in Settings. They appear in a "Custom foods" group when adding items.
- **Manual macros:** tick "Enter macros manually" on a meal to type its totals yourself (this was the only mode in v1, so old plans keep their typed values).
- **Swap:** one tap shows every exchange equivalent with its converted weight; choosing one replaces the item, and macros recalculate from the new food.
- A summary bar totals the whole plan.

### Daily Log / Tracker
- Pick any date (previous, next, today, or a date picker).
- Assign a plan to **that date** or to **every [weekday]** (for example every Monday). A date assignment overrides the weekday rule.
- Tick items (or a whole meal with "Check all") as you eat them. Rows are large for touch.
- Four gauges (calories, protein, carbs, fat) compare what you ticked against your saved profile targets; a gauge turns red when you exceed the target by more than 5%.
- A water counter for the selected date is included.

### Progress Tracker
- Log weight, body fat % and waist by date. Logging the same date again updates that entry.
- A responsive SVG trend chart (weight, body fat or waist) with start, latest and change values. It scales to any screen width.
- A history table with delete buttons.

### Grocery List
- Aggregates all foods from a plan into one list, grouped as **Produce, Proteins, Dairy, Pantry**, with quantities summed.
- Sources: any single plan multiplied by a number of days, or **This week (calendar)**, which adds up the plans you assigned to the next seven days.
- Large checkboxes for shopping; checks are remembered. "Uncheck all" resets them.

### Water Tracker
- A header counter (− / + with a glass count against your goal) always applies to **today**.
- The Daily tab has a counter for the selected date, showing glasses and litres.
- Goal (glasses) and glass size (ml) are set in Settings. Defaults: 8 glasses of 250 ml.

### Themes
Eight themes, switchable from Settings (and the header on larger screens), remembered between sessions: Diet & Cheat Max (default), Dark Cyberpunk, Fitness Gold, Modern Light, Emerald Health, Ocean Blue, Crimson Power, Minimal Slate.

### Backup and restore
One-click JSON export of all data, a Share / Save to Files button for iOS, and a JSON import to restore on any device. See [Backup and restore](#backup-and-restore).

---

## Quick start

1. Open `diet-app.html` in any modern browser.
2. Create your account on the first screen.
3. Use the navigation (bottom bar on phones, top bar on larger screens): **Exchange, Needs, Plans, Daily, Progress, Grocery, Settings**.

No installation is required. To host it, upload the single file to any static host (HTTPS recommended, see iOS notes).

---

## Installing on iPhone / iPad

1. Open the hosted page in Safari.
2. Tap **Share → Add to Home Screen**.
3. Launch it from the home screen icon for a full-screen, app-like experience.

Storage is more durable for a home-screen web app than for a regular Safari tab (see [Mobile and iOS notes](#mobile-and-ios-notes)). Make a backup anyway.

---

## Using the app

| Task | Where | Steps |
|---|---|---|
| Convert a food | Exchange | Choose group, original food, quantity. Read the table. |
| Calculate needs | Needs | Fill the fields (body fat optional), press **Calculate**. |
| Save results / targets | Needs, "My saved profile" | Fill or adjust the fields, press **Save to my profile**. |
| Build a plan | Plans | **New plan**, **+ Add meal**, then choose group, food, grams and **+ Add**. |
| Use exact grams | Plans | Edit the number next to an item; macros update. |
| Swap a food | Plans | Press **Swap** on an item and choose an equivalent. |
| Type macros by hand | Plans | Tick "Enter macros manually" on a meal. |
| Add a custom food | Settings, "Custom foods" | Name, category, and per-100 g kcal / protein / carbs / fat, then **+ Add**. |
| Assign a plan to a day | Daily | Choose the plan, press **This date** or **Every [weekday]**. **Clear** removes both. |
| Log what you ate | Daily | Tick items; watch the gauges. |
| Log body progress | Progress | Date, weight / body fat / waist, **Add entry**. |
| Make a shopping list | Grocery | Choose a plan and days, or "This week". Tick items in the store. |
| Track water | Header (+/−) or Daily | Tap + for each glass. |
| Change language | Header or Settings | Tap EN / ع or choose in Settings. |
| Back up | Settings, "Backup & data" | **Download backup** or **Share / Save to Files**. |
| Restore | Settings, "Backup & data" | Choose a `.json` backup file and confirm. |
| Print / PDF | Plans, Grocery (or any view) | **Print / PDF**, then choose "Save as PDF". |
| Change a standard weight | Settings | Edit the number; it saves automatically. |
| Change password | Settings | Enter new username and password, press **Save**. |

---

## Calculation details

**Exchange conversion** (cross-multiplication):

```
required = quantity_in_plan × standard_weight(substitute) ÷ standard_weight(original)
```

Example: 60 g rice is equivalent to 260 g potato. For 100 g rice: 100 × 260 ÷ 60 ≈ 433.3 g potato.

Carbohydrates, fruits and legumes are weighed before cooking; protein is weighed after cooking, without fat, skin or bones.

**Item macros** (exact grams):

```
macro(item) = per_100g_value × grams ÷ 100
meal total  = sum of its items (or the typed values in manual mode)
plan total  = sum of its meals
```

Foods with no nutrition data count as zero and show "—" in place of calories.

**BMR**

- Without body fat: Mifflin-St Jeor
  - Male: `10·kg + 6.25·cm − 5·age + 5`
  - Female: `10·kg + 6.25·cm − 5·age − 161`
- With body fat % (valid below 70%): Katch-McArdle
  - `370 + 21.6 × lean_mass_kg`, where `lean_mass = weight × (1 − bf/100)`

**TDEE** = BMR × activity factor (1.2, 1.375, 1.55, 1.725).

**Target calories** = TDEE + goal adjustment (−500, 0, +300).

**Suggested macros**

- Protein: 2.0 g/kg when cutting, 1.8 g/kg otherwise
- Fat: 25% of target calories (÷ 9)
- Carbohydrates: the remaining calories (÷ 4)

**BMI** = `kg / m²`. Categories: under 18.5 underweight, under 25 normal, under 30 overweight, otherwise obese. The healthy weight range is the weight giving BMI 18.5 to 24.9 at your height.

**Daily gauges**

```
percent = consumed ÷ target × 100   (ring capped at 100%, label shows the real value)
consumed = sum of macros of the ticked items for the selected date
target   = saved profile (calories, protein, carbs, fat)
```

**Grocery quantities**

```
single plan : sum of grams per food × days
this week   : sum over the next 7 dates of the plan assigned to each date
```

Quantities of 1000 g or more are shown in kg.

These are general estimates, not medical advice.

---

## Nutrition data

The built-in table gives approximate values per 100 g (calories, protein, carbs, fat) for every food in the exchange list. Values follow the list's weighing convention: protein foods are cooked weight, carbohydrates and legumes are raw weight (lupini beans are treated as cooked).

They are typical reference values, not laboratory results, and regional products vary. If you need exact numbers, add the food in **Settings, Custom foods** with the values from your package label. A custom food with the same name as a built-in food overrides it.

Custom foods have a category (Produce, Proteins, Dairy, Pantry) used by the grocery list. Built-in foods are categorized automatically: protein group to Proteins, fruits and vegetables to Produce, dairy to Dairy, carbs, healthy fats and legumes to Pantry, with cottage cheese and light feta placed under Dairy.

---

## Architecture

A dependency-free single HTML file with three layers in one document.

```
diet-app.html
├── <style>   Design tokens (CSS variables), themes, layout, components, print rules
├── <body>    Static markup: login screen + app shell + seven view sections
└── <script>  Data, i18n, storage, state, views, event handling, backup
```

### Views

| Section id | Purpose |
|---|---|
| `#login` | Account creation / login |
| `#v-ex` | Exchange calculator |
| `#v-tdee` | Needs calculator + saved profile |
| `#v-plan` | Plan and meal builder |
| `#v-log` | Daily log (rendered entirely from script) |
| `#v-prog` | Progress entry form, chart, history |
| `#v-shop` | Grocery list |
| `#v-set` | Language, themes, account, water, custom foods, backup, weights |

Navigation toggles the `hide` class on view sections and calls the matching render function through the `R` map. There is no router and no framework.

### Script sections (in order)

| Section | Responsibility |
|---|---|
| DATA (`DEF`, `GN`, `FN`, `NS`/`NUT`, `THEMES`, `KEYS`) | Exchange weights, group and food English names, nutrition table, theme list, storage key whitelist |
| I18N (`TR`, `t`, `applyLang`) | Translation dictionary, `lang`/`dir` switching, re-render |
| STORE (`DB`, `ls`, `bootStore`) | `localStorage` + IndexedDB mirror with in-memory cache |
| HELPERS / STATE | Formatting, date helpers, macro helpers, state loading (`loadState`) |
| AUTH | Create account, login, logout, credential change |
| NAV | View switching (`go`, `renderAll`) |
| WATER | Header chip and per-date water counter |
| EXCHANGE | Group / food selects and equivalents table |
| NEEDS + PROFILE | BMR / TDEE / macro calculation and saved profile |
| PLANS | Plan, meal and item CRUD, swap, exact grams, manual macros |
| DAILY LOG | Date navigation, plan assignment, checkboxes, gauges |
| PROGRESS | Entries, SVG chart, history |
| GROCERY | Aggregation and categorized checklist |
| SETTINGS | Water goal, custom foods, exchange weights |
| BACKUP / RESTORE | Export, share, import |
| BOOT | Async start-up sequence |

### Rendering approach

- Views are re-rendered with template strings assigned to `innerHTML`.
- All user-provided text is escaped through `esc()` before insertion.
- Interactions use event delegation: one `click` and one `change` listener per container, dispatching on `data-a` (action) attributes.
- Static labels carry `data-i="key"` attributes; dynamic text uses `t('key')`.

### Boot sequence

1. Load the key whitelist from `localStorage` into memory.
2. Open IndexedDB (1.5 s timeout), restore any keys missing from `localStorage`, mirror everything back.
3. Request persistent storage where the browser supports it.
4. Read language, run `loadState()`, apply theme and language.
5. Show the app if an account exists and the session flag is set; otherwise show login.

---

## Data model and storage

All data is JSON. Every write goes to `localStorage`, and the same value is mirrored to IndexedDB (`dietapp` database, `kv` store). Nothing leaves the device.

| Key | Content |
|---|---|
| `theme` | Selected theme id |
| `lang` | `ar` or `en` |
| `acc` | `{ u: username, p: password hash }` |
| `sess` | `true` while signed in (never included in backups) |
| `dw` | Customized exchange weights `{ group: { food: grams } }` |
| `plans` | Array of plans |
| `cur` | Id of the active plan |
| `cf` | Custom foods |
| `log` | Daily logs by date |
| `assign` | Plan assignments by date or weekday |
| `prog` | Progress entries |
| `gck` | Grocery checked items |
| `wg` | Water goal (glasses) |
| `wml` | Glass size (ml) |
| `prof:<username>` | Saved profile for that user |

**Plan**

```json
{
  "id": 1,
  "name": "My first plan",
  "meals": [
    {
      "name": "Breakfast",
      "man": false,
      "k": 0, "p": 0, "c": 0, "f": 0,
      "items": [
        { "g": "بروتين", "n": "بيض كامل", "q": 100 },
        { "g": "cf",  "n": "My protein bar", "q": 45 }
      ]
    }
  ]
}
```

- `g` is the exchange group key, or `cf` for a custom food.
- `n` is the food key (the original Arabic name, or the custom food name).
- `q` is the weight in **grams**.
- `man: true` means the meal uses its typed `k / p / c / f` instead of computing from items.

**Custom foods (`cf`)**

```json
{ "My protein bar": { "cat": "pantry", "k": 380, "p": 30, "c": 35, "f": 12 } }
```

**Daily log (`log`)**

```json
{ "2026-11-05": { "w": 6, "c": { "0-0": 1, "0-1": 1, "m2": 1 } } }
```

`w` is glasses of water. In `c`, `"<mealIndex>-<itemIndex>"` marks a ticked item and `"m<mealIndex>"` marks a ticked manual meal.

**Assignments (`assign`)**

```json
{ "2026-11-05": 1730000000000, "d1": 1730000000001 }
```

A date key assigns a plan to one date. `d0` to `d6` assign a plan to a weekday (0 = Sunday). The date key wins over the weekday key.

**Progress (`prog`)**

```json
[ { "d": "2026-11-05", "w": 91.4, "bf": 28.6, "wa": 102 } ]
```

**Profile**

```json
{ "age": 36, "h": 170, "w": 92, "bf": 29,
  "bmr": 1751, "tdee": 2760, "tk": 2260,
  "p": 170, "f": 88, "c": 198 }
```

Clearing browser data erases all of the above unless you have a backup.

---

## Backup and restore

**Export** produces `diet-backup-YYYY-MM-DD.json`:

```json
{
  "app": "diet-planner",
  "v": 2,
  "ts": "2026-11-05T10:00:00.000Z",
  "data": { "plans": [], "cur": 1, "prof:alex": {}, "log": {}, "prog": [] }
}
```

- **Download backup** creates the file with a normal browser download.
- **Share / Save to Files** opens the system share sheet with the file attached (iOS: choose "Save to Files", AirDrop, Mail, and so on). If the browser cannot share files, it falls back to a download.

**Import** reads a `.json` file, checks that it is a Diet Planner backup, asks for confirmation, then overwrites the keys it contains and re-renders. Keys not in the backup are left alone. The session flag is never imported or exported, and files from other apps are rejected.

The backup includes the account (username and password hash), so restoring on a new device restores your login too.

**Recommended routine:** export a backup after major changes and weekly, and keep a copy in iCloud Drive or another cloud folder.

---

## Internationalization

- Strings live in the `TR` dictionary, built from a block of `key|English|Arabic` lines. `t('key')` returns the string for the current language, falling back to English, then to the key itself.
- Static HTML uses `data-i="key"`; `applyLang()` fills them. Option elements and buttons work the same way.
- Direction and alignment follow `dir`; layout uses logical properties (`text-align: start`), so no per-language CSS is needed.
- The progress chart is always drawn left-to-right (time runs left to right in both languages).
- Numbers and dates use `toLocaleString` / `toLocaleDateString` with `ar-EG` or `en-US` / `en-GB`. Form inputs keep ASCII digits because browsers require them for number fields.

**Adding a language:** add a new entry to the `TR` object and a matching column to the `key|English|Arabic` block parser, add a `FN`/`GN` equivalent for food names, allow the new code in `setLang` and the boot line that reads `lang`, and add a button in Settings.

---

## Theming

- All colors are CSS variables on `:root`, overridden per theme by `[data-theme="..."]` selectors.
- The default theme "Diet & Cheat Max" is the `:root` block itself.
- To add a theme: add a `[data-theme=name]{...}` block redefining `--bg --panel --panel2 --text --mute --acc --acc2 --line --onacc`, and add the id to `THEMES`.

---

## Mobile and iOS notes

- **Viewport and safe areas:** `viewport-fit=cover` is set. The header pads for the top inset, the bottom navigation pads for the home-indicator inset, and the page pads left and right for landscape notches.
- **Layout:** flexbox and grid with wrapping. Wide tables scroll inside their own container, and the page itself never scrolls horizontally. The navigation becomes a bottom tab bar below 700 px wide (iPhone and iPad portrait split view) and a top bar above.
- **Touch:** controls are at least 44 px tall, form fields use 16 px text (prevents iOS from zooming on focus), and `touch-action: manipulation` removes tap delay.
- **Keyboards:** numeric fields use `inputmode` (`decimal` / `numeric`) so the right keypad appears.
- **Storage durability:** Safari can delete website data after about seven days without use for sites opened in a regular tab. This app mitigates that three ways: data is mirrored to IndexedDB, the browser is asked for persistent storage, and installing to the Home Screen exempts the app from that cleanup. Even so, treat backups as the real safety net.
- **Private browsing:** storage may be restricted or cleared when the tab closes. The app keeps working in memory but will not persist.
- **Downloads:** modern iOS Safari downloads the JSON file via the normal download flow; if you prefer the share sheet, use **Share / Save to Files**.
- **Hosting:** serve over HTTPS so storage persistence and the share sheet work reliably. Opening the file from a local path works for desktop browsers but is not recommended on iOS.

---

## Printing and PDF

**Print / PDF** calls the browser print dialog; choose "Save as PDF". The print stylesheet:

- hides the header, navigation, buttons and all controls,
- prints only the view you are on (a plan, the daily log, the grocery list, the progress chart and history),
- switches to a light, ink-friendly palette and flattens inputs into plain text.

---

## Security notes

- The password is stored as a simple non-cryptographic hash in browser storage. It is a convenience lock for a shared device, **not** real security. Anyone with access to the browser profile can read or reset the data.
- Backups contain the password hash. Keep backup files private.
- There is no server, so there is no password recovery. If you forget the credentials, clear the site's storage (this deletes your data) or restore a backup made on another device.
- Do not reuse an important password here.
- All user-entered text is HTML-escaped before display, and imports are limited to a whitelist of known keys.

---

## Limitations

- Data is local to one browser on one device. Moving between devices requires the backup and restore flow; there is no live sync.
- Only one account is stored per browser.
- Nutrition values are approximate (see [Nutrition data](#nutrition-data)).
- Daily ticks are tied to a meal's position in its plan. Reordering or deleting meals or items later can shift old ticks.
- The grocery list sums gram weights per food as entered; it does not convert to packages or units.
- Exchange equivalents come only from the exchange list; custom foods have no swap options.
- PDF export uses the browser's print function.
- Calculations are estimates for general guidance, not medical advice.

---

## Troubleshooting

| Problem | What to try |
|---|---|
| Asked to sign in every time | Make sure you are not in private browsing, and that site data is not set to clear on exit. |
| Data disappeared on iPhone | Safari may have cleared site data. Restore your latest backup, and add the app to the Home Screen. |
| Backup button does nothing | Use **Share / Save to Files**, or allow downloads for the site in Safari settings. |
| Restore says "Invalid backup file" | The file must be a `.json` produced by this app's export. |
| A food shows "—" instead of calories | It has no nutrition data. Add it under Settings, Custom foods. |
| Gauges show no target | Save a profile under Needs first. |
| Plan appears in the wrong language | Food names and labels follow the language toggle; plan and meal names are text you typed and are not translated. |

---

## Extending the app

- **Add a food:** add an entry to the matching group in `DEF` (grams of the standard portion), an English name in `FN`, and a `name:kcal,protein,carbs,fat` entry in the `NS` string.
- **Add a group:** add a new key to `DEF` (and `GN`, plus a category in `CATM` for the grocery list). Selects, settings and plans pick it up automatically.
- **Add a theme:** see [Theming](#theming).
- **Change macro defaults:** edit the protein and fat factors in the calculate handler (`$('tc').onclick`).
- **Change water defaults:** edit the fallbacks in `loadState` (`WG`, `WML`).
- **Add a stored key:** add it to `KEYS` so it is mirrored, backed up and restorable.
- **Ideas:** barcode or label scanning for custom foods, weekly calorie summaries, per-meal targets, photo logging, multiple accounts, optional encrypted backups.

---

## Changes from v1

| Area | v1 | v2 |
|---|---|---|
| Language | Arabic only | English and Arabic, with RTL / LTR switching |
| Layout | Desktop-first, top tabs | Mobile-first, bottom tab bar, safe-area insets, 44 px touch targets |
| Fonts | Google Font (Cairo) | System fonts only, no external requests |
| Storage | `localStorage` only | `localStorage` + IndexedDB mirror + persistence request |
| Backup | None | JSON export, share sheet, JSON import |
| Item quantity | Grams entered, macros typed by hand per meal | Exact grams, automatic macros from a per-100 g table, optional manual mode |
| Foods | Fixed exchange list | Plus custom foods with their own macros |
| Daily use | Plans only | Daily log with calendar / weekday assignment, check-offs and macro gauges |
| Body tracking | Saved profile only | Weight, body fat and waist history with trend charts |
| Shopping | None | Categorized, aggregated grocery list |
| Hydration | None | Header counter, daily log, goal and glass size |
| Views | 4 | 7 |
