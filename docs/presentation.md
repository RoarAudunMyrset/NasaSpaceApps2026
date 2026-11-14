# AimForTheStars: Hearing the Ocean

## NASA Space Apps Challenge 2026

**Project:** Ocean tones  
**Challenge:** [The Earth Information Jukebox](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/)  
**Format:** A slide-by-slide presentation with first-person speaker notes, suitable for presenting live, recording, or reading independently.  
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

- I could not work full days during the challenge.
- I could not attend the Sunday afternoon presentations.
- I formed my own team so I could participate on my own schedule.
- I chose **The Earth Information Jukebox** from the beginner challenges.

### Speaker notes

I wanted to take part even though I had limited time and could not be there
for the final presentations. Creating my own team let me work around those
constraints and document the result for others.

I quickly reviewed the challenges, chose The Earth Information Jukebox,
and then read the complete assignment and explored its resources.
Starting with one concrete image felt like a manageable way to learn
and build something useful.

---

## Slide 3 - Starting with water temperature

- I chose a sea surface temperature image.
- A sighted person can recognize broad patterns through color.
- Water is generally colder toward the poles and warmer near the equator.
- My question: **Could pitch make that contrast audible?**

### Speaker notes

When I look at a global ocean temperature map, I can see the broad contrast
between colder polar regions and warmer equatorial regions. There are also
local differences, so it is not just a simple north-to-south gradient.

I wanted to explore whether a person who cannot see the colors could hear
some of that information instead. The approach is called sonification:
representing data through sound.

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

## Slide 5 - First version: move across the world

- Select a date and load a NASA temperature map.
- Enable sound and move across the image.
- **Colder water = lower pitch. Warmer water = higher pitch.**
- Land or missing data produces silence.

### Speaker notes

The first version let me choose a date and move around the world while
the sound changed according to the temperature at the selected point.

Moving north and south across ocean areas made the broad temperature
differences audible. The app also supports arrow-key exploration, so
the interaction is not limited to using a mouse.

The tone can be a little annoying! But it demonstrates the concept:
sound can provide clues that would otherwise be communicated by color.
That is a starting point for accessibility, not evidence that the app
already meets the needs of blind users.

---

## Slide 6 - The next question: what if I stay in one place?

- The first version changes **location** while keeping the date fixed.
- But temperature also changes through the year at the same location.
- I wanted to make that second pattern audible.
- That led to **Listen through a year**.

### Speaker notes

After trying the map, I thought about what else a sighted person can
understand from temperature imagery. Geography is only one dimension.
The same ocean location can have different temperatures during the year.

Instead of moving the pointer across the map, what if I kept the location
fixed and moved through time? This became the second function.

The progression was not about adding an unrelated feature. It was about
asking what information the first interaction still left out.

---

## Slide 7 - Second version: listen through a year

- Choose a fixed latitude, longitude, and completed year.
- Play 12 samples, from January through December.
- Optional spoken labels announce the month and approximate temperature.
- The same temperature-to-pitch scale makes the samples comparable.

### Speaker notes

The year playback holds one location fixed and plays a sequence of
temperatures. Each sample comes from the first day of a month; these
are not monthly averages or a continuous recording.

This lets the listener explore seasonal changes without navigating the
map throughout playback. Missing data is announced and remains silent,
rather than being mistaken for cold water.

Comparing ocean locations north and south of the equator is another way
to explore seasonal timing. A single year illustrates variation within
that year; it does not establish a long-term climate trend.

---

## Slide 8 - A short demonstration

1. Start at low volume and explain the pitch mapping.
2. Load a NASA map for an available date and enable sound.
3. Move between warmer and colder ocean areas.
4. Choose a fixed ocean location and play a year.
5. Listen for changes in pitch while the location stays unchanged.

### Speaker notes

The key comparison is between two questions: "How does temperature change
across the ocean on one date?" and "How does temperature change through
the year at one ocean location?"

For year playback, the default location is 30 degrees north, 40 degrees
west in the Atlantic. The app can also copy the current map position.
Loading all 12 samples may take a while, so prepare the demonstration
with a working internet connection and an authorized Azure login.

The initial synthetic demo is not NASA data. If NASA requests fail, make
that distinction clear rather than presenting the demo as observations.
A recording can accompany this presentation when I cannot attend.

---

## Slide 9 - What this proof of concept does and does not show

- NASA imagery provides the starting point.
- Temperatures are **estimated from image colors and the published palette**.
- Sound offers an additional way to explore spatial and seasonal patterns.
- Accessibility and listening comfort still need evaluation with users.

### Speaker notes

The app uses NASA GIBS imagery for the GHRSST MUR sea surface temperature
layer. It translates image colors into approximate temperatures using
the published color palette, then maps those temperatures to pitch.
It does not download raw scientific temperature measurements.

That limits precision, and silence can mean land or unavailable data,
not a low temperature. The result is an exploratory prototype, not a
scientific measurement tool.

I would want feedback from blind and low-vision users before claiming
that the experience is genuinely useful to them. Improving the sound
and navigation would be important next steps.

---

## Slide 10 - What I learned

- A small starting point can lead to a meaningful experiment.
- Constraints shaped the implementation, but did not prevent participation.
- **GitHub Copilot helped me create the application and iterate on the idea.**
- First, I explored temperature across space. Then, I explored it through time.

### Speaker notes

My contribution was choosing the problem, deciding what I wanted to
communicate, trying the result, and identifying the next question.
GitHub Copilot was the AI coding assistant I used to create the application;
it was part of the development process, not something I want to leave
uncredited.

The biggest lesson was that translating an image into sound is not just
about replacing a color with a note. It is about deciding which patterns
someone should be able to explore and how to make those patterns understandable.

AimForTheStars started with a simple question: can we hear what this map
shows? This proof of concept offers two small ways to try.

---

## Credits and references

- **Challenge:** [The Earth Information Jukebox - NASA Space Apps 2026](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/).
- **Imagery and palette:** [NASA Global Imagery Browse Services (GIBS)](https://nasa-gibs.github.io/gibs-api-docs/), using `GHRSST_L4_MUR_Sea_Surface_Temperature` imagery.
- **Source exploration:** [NASA Worldview sea surface temperature layer](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR_Sea_Surface_Temperature).
- **AI-assisted development:** GitHub Copilot was used to create the application.
- **Hosting:** Microsoft Azure Static Web Apps, Free plan, with restricted access.
- **Usage and technical details:** [Project README](../README.md).
