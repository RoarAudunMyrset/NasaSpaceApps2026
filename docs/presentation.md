# AimForTheStars: Hearing the Ocean

## NASA Space Apps Challenge 2026

**Project:** Ocean tones  
**Challenge:** [The Earth Information Jukebox](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/)  
**Format:** A seven-slide presentation with first-person speaker notes, suitable for presenting live, recording, or reading independently.
**Suggested duration:** 6-8 minutes.

---

## Slide 1 - Can we hear what an ocean temperature map shows?

- Team: **AimForTheStars**
- Turning sea surface temperature imagery into sound.
- A proof of concept built with **GitHub Copilot**.

### Speaker notes

For NASA Space Apps 2026, I created a team called AimForTheStars and built
Ocean tones. The idea is simple: a temperature map communicates through
colors, but could sound communicate some of the same patterns?

This is the story of how I went from exploring a NASA image to creating two
ways to listen to ocean temperatures.

---

## Slide 2 - A challenge that fit my circumstances

- I could not work full days or attend the Sunday afternoon presentations.
- I formed my own team so I could participate on my own schedule.
- I chose **The Earth Information Jukebox**, one of the beginner challenges.
- Starting with one concrete NASA image made the project manageable.

### Speaker notes

I wanted to take part even though I had limited time and could not be there
for the final presentations. Creating my own team let me work around those
constraints and document the result for others.

I reviewed the challenges, chose The Earth Information Jukebox, and explored
its assignment and resources. Starting with one concrete image felt like a
manageable way to learn and build something useful.

---

## Slide 3 - From NASA image to sound

- I chose a NASA sea surface temperature image.
- The app estimates temperatures from image colors and NASA's published palette.
- **Colder water = lower pitch. Warmer water = higher pitch.**
- Land or missing data produces silence.

### Speaker notes

When I look at a global ocean temperature map, I can see broad contrasts:
water is generally colder toward the poles and warmer near the equator, with
local differences too. I wanted to explore whether sound could communicate
some of those patterns.

The app uses NASA GIBS imagery for the GHRSST MUR sea surface temperature
layer. It translates image colors into approximate temperatures using the
published color palette, then maps those temperatures to pitch. It does not
download raw scientific temperature measurements. Silence can mean land or
unavailable data, not a low temperature.

---

## Slide 4 - Building within practical constraints

- My laptop is locked down, so I could not install development tools.
- I used **GitHub Copilot to create the application**.
- I reused an existing Azure account and deployed to **Azure Static Web Apps**.
- I chose the Free plan and restricted access through sign-in and an owner role.

### Speaker notes

The technical approach had to fit the equipment I already had. I used
GitHub Copilot to turn the idea into a working proof of concept, and hosted
it on Azure Static Web Apps without needing to install tools on my laptop.

I was concerned about running costs, so I chose a simple static application
on the Free plan rather than adding a backend or paid services. Free-tier
quotas and account terms still matter; this was a cost-conscious choice,
not a promise that every related service is unlimited.

I also restricted access to the application. For a demonstration, the
presenter needs an authorized account; signing in alone does not grant access.

---

## Slide 5 - Explore temperature across the ocean

- Select a date, load a NASA map, enable sound, and move across the image.
- Explore warmer and colder ocean areas; arrow keys work too.
- Start at low volume and explain the pitch mapping.
- If NASA requests fail, the synthetic demo is **not** NASA data.

### Speaker notes

The first version lets me choose a date and move around the world while
the sound changes according to the temperature at the selected point.
Moving across ocean areas makes broad temperature differences audible.

For a demonstration, I start at low volume, explain that colder water has
lower pitch, load an available NASA date, and compare warmer and colder
locations. The tone can be a little annoying, but it demonstrates the concept.
The initial synthetic demo is not NASA data; if NASA requests fail, I make
that distinction clear.

This is a starting point for accessibility, not evidence that the app already
meets the needs of blind users.

---

## Slide 6 - Listen through a year

- Keep one latitude and longitude fixed; choose a completed year.
- Play 12 samples, from January through December.
- Optional spoken labels announce the month and approximate temperature.
- Compare seasonal timing without treating one year as a climate trend.

### Speaker notes

After trying the map, I wondered what happens if I stay in one place and
listen as the year changes. This second function holds a location fixed and
plays a sequence of temperatures.

Each sample comes from the first day of a month; these are not monthly
averages or a continuous recording. Missing data is announced and remains
silent, rather than being mistaken for cold water. The default location is
30 degrees north, 40 degrees west in the Atlantic, and the app can also copy
the current map position.

Comparing ocean locations north and south of the equator is another way to
explore seasonal timing. A single year illustrates variation within that
year; it does not establish a long-term climate trend. Loading all 12 samples
may take a while, so prepare with a working internet connection and an
authorized Azure login.

---

## Slide 7 - What this proof of concept shows

- Two ways to explore temperature: across **space** and through **time**.
- Image-color estimates are exploratory, not scientific measurements.
- Accessibility and listening comfort need evaluation with users.
- **Credits:** NASA GIBS imagery and palette; GitHub Copilot; Azure Static Web Apps.

### Speaker notes

My contribution was choosing the problem, deciding what I wanted to
communicate, trying the result, and identifying the next question. GitHub
Copilot was the AI coding assistant I used to create the application; it was
part of the development process, not something I want to leave uncredited.

The biggest lesson was that translating an image into sound is not just
about replacing a color with a note. It is about deciding which patterns
someone should be able to explore and how to make those patterns understandable.
I would want feedback from blind and low-vision users before claiming that
the experience is genuinely useful to them.

**References:** [The Earth Information Jukebox - NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/); [NASA Global Imagery Browse Services (GIBS)](https://nasa-gibs.github.io/gibs-api-docs/); [NASA Worldview sea surface temperature layer](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR_Sea_Surface_Temperature). See the [project README](../README.md) for usage and technical details.
