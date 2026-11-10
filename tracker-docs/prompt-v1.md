# Prompt Script v1

## Goal

Create a gaming session tracker called **GameTime** that allows users to track how much time they spend playing video games. Users should be able to enter a game name, choose a genre, start a timer, and stop it when they finish playing. The app should save each gaming session and display the data through a dashboard with charts and a creative visualization.

## Where it lives

- The tracker is part of my existing Express.js application, which already uses `cookie-parser`.
- All frontend files should go inside `public/tracker/v1/`.
- The pages should be served using my existing `express.static("public")` setup.
- Add the tracker cookie routes to my existing `app.js` file.
- Every tracker route must start with `/tracker/v1/`.
- Do not remove, replace, or modify my existing survey, animal, form, or voting routes.
- Do not install additional npm packages.
- Keep the code simple and similar to my existing coding style.

## Data

Each gaming session should contain the following information:

```json
{
  "date": "2026-11-10",
  "game": "Minecraft",
  "genre": "Sandbox",
  "minutes": 90
}
```

- `date`: The date of the gaming session, stored as a string.
- `game`: The name of the game, stored as a string.
- `genre`: The type of game, stored as a string.
- `minutes`: The total amount of time played, stored as a number.

Use a cookie named `gameTime_v1`.

Set the cookie to last 30 days using `maxAge`.

Store up to 30 recent gaming sessions to avoid exceeding the cookie size limit.

## Routes (Express + cookie-parser)

Add three routes to my existing `app.js` file.

**1. Save Session — POST `/tracker/v1/save`**

- Receive the game name, genre, date, and session duration from the frontend.
- Use `req.cookies` to read the existing `gameTime_v1` cookie.
- If no cookie exists, start with an empty array.
- Add the new session to the array.
- Keep only the most recent 30 sessions.
- Save the updated array using `res.cookie()`.
- Set the cookie to expire after 30 days.
- Return a JSON response confirming the session was saved.

**2. Get Sessions — GET `/tracker/v1/data`**

- Read the `gameTime_v1` cookie using `req.cookies`.
- Return all saved gaming sessions as JSON.
- If no sessions exist, return an empty array.

**3. Clear Sessions — POST `/tracker/v1/clear`**

- Delete the `gameTime_v1` cookie using `res.clearCookie()`.
- Return a JSON response confirming the data was cleared.

Add the routes below my existing `/api/animals` route and above my `/:name` route.

Add `app.use(express.json())` near my existing middleware so the server can receive JSON from `fetch()`.

Do not change any of my existing routes.

## Pages

**index.html — Gaming Session Timer**

Create a page where users can record their gaming sessions.

Include:

- A heading that says "GameTime".
- A text input for the game name.
- A dropdown menu for selecting the genre.
- Genre options: Action, Adventure, RPG, Shooter, Sports, Racing, Simulation, Strategy, Sandbox, and Other.
- A timer displaying hours, minutes, and seconds in `00:00:00` format.
- A Start Session button.
- A Stop & Save button.
- A link to the dashboard.

When the user clicks Start Session, the timer should begin counting upward.

When the user clicks Stop & Save, calculate the elapsed time in minutes and send the session information to the Express save route using `fetch()`.

Display a confirmation message when the session is saved successfully.

Prevent users from starting a session without entering a game name or selecting a genre.

**dashboard.html — Gaming Dashboard**

Create a dashboard that displays:

- Total gaming time.
- Total number of gaming sessions.
- Most played genre.
- Two Chart.js charts.
- One p5.js sketch.
- A Clear All Data button.
- A link back to the gaming timer.

The dashboard must retrieve its information using `fetch()` from `/tracker/v1/data`.

All statistics, charts, and visualizations must use the actual saved cookie data.

## Chart 1 (Chart.js)

**Title: Gaming Time by Day**

- Use a bar chart.
- X-axis: Date of gaming session.
- Y-axis: Total minutes played.
- Combine multiple sessions recorded on the same day.
- Use blue bars.
- Include readable labels and a chart title.
- Update the chart based on saved session data.

## Chart 2 (Chart.js)

**Title: Gaming Time by Genre**

- Use a doughnut chart.
- Display the total gaming time for each genre.
- Give each genre a different color.
- Include a legend showing the genre names.
- Use the session data stored in cookies.
- Update the chart when new sessions are added.

## p5.js Sketch

**Title: My Gaming Arcade**

Create a pixel-art-inspired arcade that visualizes gaming sessions.

- Each saved gaming session should create one arcade machine.
- Different game genres should have different colors.
- The duration of each session should affect the height or brightness of its arcade machine.
- Arrange the arcade machines in rows.
- Draw the machines inside the dashboard rather than in a separate window.
- When new sessions are saved, the arcade should reflect the updated data.
- When the user clears their data, the arcade should become empty.

Keep the visualization simple enough to understand and modify.

## Rules / Constraints

- Use plain HTML, CSS, and JavaScript.
- Do not use React or other frontend frameworks.
- Use Chart.js and p5.js from CDN links.
- Use Express and `cookie-parser` for saving data.
- Do not use `localStorage` or `document.cookie`.
- Comment every JavaScript function to explain what it does.
- Include a Clear All Data button.
- Make sure saved data remains after refreshing the dashboard.
- Use a dark gaming-inspired design with blue and purple colors.
- Keep the layout clean and organized.
- Make the pages work on desktop and mobile.
- Do not modify unrelated files or existing Express functionality.
- Keep the existing `app.js` structure and coding style.
- Provide the complete code for every new HTML, CSS, and JavaScript file.
- Provide the additional Express routes separately and explain exactly where they should be inserted in `app.js`.

## Expected File Structure

```text
public/
└── tracker/
    └── v1/
        ├── index.html
        ├── dashboard.html
        ├── css/
        │   └── style.css
        └── js/
            ├── tracker.js
            ├── dashboard.js
            └── sketch.js
```

Generate the complete first version of GameTime using these instructions.