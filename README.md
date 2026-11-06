# Diet Manager & Food Exchange App (v3 Modular Edition)

A single-page, bilingual (Arabic RTL / English LTR) web application for planning diets, converting foods between equivalent portions, calculating energy needs, logging daily intake, tracking body progress, and generating grocery lists. Everything runs natively in the browser with no backend, no build steps, and zero external dependencies.

---

## Table of Contents

1. [Features](#features)
2. [Project Architecture](#project-architecture)
3. [Quick Start & Hosting](#quick-start--hosting)
4. [Installing on Mobile (PWA/iOS)](#installing-on-mobile-pwaios)
5. [Using the App](#using-the-app)
6. [Calculation Details](#calculation-details)
7. [Nutrition Data & Custom Foods](#nutrition-data--custom-foods)
8. [Data Model & Storage](#data-model--storage)
9. [Backup and Restore](#backup-and-restore)
10. [Internationalization](#internationalization)
11. [Theming](#theming)
12. [Mobile & Print Support](#mobile--print-support)
13. [Troubleshooting](#troubleshooting)

---

## Features

### Authentication
- Account creation screen on first launch (username + password, minimum 4 characters).
- Active session persistence using browser storage until clicking **Log out**.
- Password and username changes managed in **Settings** (user profile follows username changes).

### Language & Localization
- Dynamic switching between English (LTR) and Arabic (RTL) across the app.
- Updates `lang` and `dir` on `<html>`, formats dates and numbers using localized number systems (Arabic-Indic digits in Arabic mode).
- Standardized Arabic food keys preserve diet plans safely during language toggles.

### Food Exchange Calculator
- Covers 7 standard food exchange categories: Protein, Carbohydrates, Healthy Fats, Fruits, Vegetables, Dairy, Legumes.
- Converts portion sizes based on dietary reference weights.
- Standard reference weights can be edited under **Settings**.

### Energy Needs Calculator (BMR / TDEE)
- Calculates BMR using Mifflin-St Jeor or Katch-McArdle (when body fat % is provided).
- Computes TDEE, target calories (Cut -500, Maintain, Bulk +300), BMI, and macro breakdowns.

### Saved Profile
- Save calculated or manual fitness metrics (height, weight, body fat %, target calories, macros).
- Serves as the target reference baseline for daily tracking visualizers.

### Diet Plan Builder & Meal Engine
- Create multiple plans with customizable, renamable meals.
- Input **exact gram weights** per food item.
- Automatic real-time macro calculation (Calories, Protein, Carbs, Fat) per item and meal based on a 100g database.
- **One-Tap Food Swap:** Swap any food item with an equivalent from its exchange category, automatically recalculating the adjusted weight.
- Support for **Custom Foods** and **Manual Macro Overrides**.

### Daily Tracker & Interactive Macro Gauges
- Assign plans to specific calendar dates or recurring weekdays.
- Check off eaten items/meals while monitoring intake via interactive SVG macro progress gauges.
- Tracks daily water consumption against customizable target goals.

### Body Progress Tracker
- Record date-stamped logs for Weight, Body Fat %, and Waist measurements.
- Interactive SVG line chart displays progress trends over time.

### Grocery List Generator
- Aggregates plan ingredients into categorized shopping lists (**Produce, Proteins, Dairy, Pantry**).
- Generate lists for a specific plan multiplied by days or aggregated across **This week (calendar)**.

---

## Project Architecture

The application is structured into clean, decoupled ES Modules:

```
diet-app/
├── index.html         # Main DOM structure and app views
├── css/
│   └── styles.css     # Unified CSS tokens, themes, layouts, and print rules
└── js/
    ├── data.js        # Default exchange weights, nutrition table & translations
    ├── store.js       # Persistence engine (localStorage + IndexedDB key-value mirror)
    ├── ui.js          # Rendering engine for views, tables, gauges, and charts
    ├── handlers.js    # Event delegation, navigation, and logic listeners
    └── app.js         # Entry point initializing storage, state, and UI binding
```

---

## Quick Start & Hosting

1. Clone or download the project files into a folder.
2. Serve the folder using any HTTP static server (e.g., `python -m http.server 8000` or VS Code Live Server).
3. Open `index.html` in your web browser.

---

## Installing on Mobile (PWA/iOS)

1. Open the hosted HTTPS URL in Safari (iOS) or Chrome (Android).
2. Tap **Share → Add to Home Screen**.
3. Launch the app from your home screen for full-screen offline access.

---

## Using the App

| Task | Location | Steps |
|---|---|---|
| Convert a Food | Exchange | Choose group, select base food, enter plan grams. |
| Calculate Needs | Needs | Input age, weight, height, goal, then click **Calculate**. |
| Save Targets | Needs | Adjust calculated numbers and click **Save to my profile**. |
| Build Plan | Plans | Click **New plan** → **+ Add meal** → select food, enter grams, click **+ Add**. |
| Swap a Food | Plans | Click **Swap** on a food item row and choose an equivalent. |
| Assign Daily Plan | Daily | Pick a date, select a plan, click **This date** or **Every [weekday]**. |
| Log Intake | Daily | Tick eaten food checkboxes to fill the macro gauges. |
| Log Progress | Progress | Enter date, weight/body fat/waist, click **Add entry**. |
| Grocery List | Grocery | Select source (Plan or "This week"), check items while shopping. |
| Change Theme | Header / Settings | Select any of the 8 available themes. |
| Backup Data | Settings | Click **Download backup** or **Share / Save to Files**. |

---

## Calculation Details

### Exchange Portion Conversion
$$\text{Required Amount (g)} = \frac{\text{Plan Quantity (g)} \times \text{Substitute Standard Weight (g)}}{\text{Original Standard Weight (g)}}$$

### Item Macro Calculation
$$\text{Item Macro} = \frac{\text{Macro per 100g} \times \text{Weight (g)}}{100}$$

### Energy Formulae
- **BMR (Mifflin-St Jeor):**
  - Male: $10 \times \text{weight(kg)} + 6.25 \times \text{height(cm)} - 5 \times \text{age} + 5$
  - Female: $10 \times \text{weight(kg)} + 6.25 \times \text{height(cm)} - 5 \times \text{age} - 161$
- **BMR (Katch-McArdle with Body Fat %):**
  - $370 + 21.6 \times \text{Lean Mass(kg)}$

---

## Data Model & Storage

All data is stored locally via `localStorage` and mirrored asynchronously to `IndexedDB` (`dietapp` database, `kv` store).

| Key | Description |
|---|---|
| `theme` | Selected theme ID |
| `lang` | Language selection (`ar` or `en`) |
| `acc` | Stored credentials `{ u: username, p: passwordHash }` |
| `plans` | Array of user diet plans and meal items |
| `cur` | ID of the currently selected plan |
| `cf` | Custom foods map with per-100g nutrition data |
| `log` | Daily intake check-offs and water tracking |
| `assign` | Plan assignments by calendar date or weekday |
| `prog` | Historical weight, body fat, and waist entries |
| `prof:<user>` | Saved user profile targets |

---

## Backup and Restore

- **Export:** Generates a full `.json` file (`diet-backup-YYYY-MM-DD.json`) containing all plans, profile data, custom foods, logs, and progress history.
- **Import:** Select a valid backup `.json` file under **Settings → Backup & data** to restore your data on any device.

---

## Theming

Supports 8 CSS tokenized themes:
1. **Diet & Cheat Max** (Default dark neon)
2. **Dark Cyberpunk**
3. **Fitness Gold**
4. **Modern Light**
5. **Emerald Health**
6. **Ocean Blue**
7. **Crimson Power**
8. **Minimal Slate**

---

## Mobile & Print Support

- **Responsive Navigation:** Converts to a fixed bottom navigation tab bar on viewports under 700px.
- **Print / Save PDF:** Dedicated CSS print styles (`@media print`) hide UI controls and format active views for clean PDF printing.