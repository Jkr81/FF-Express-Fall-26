# Prompt Script v2 — GameTime

## Goal

Improve my existing GameTime gaming session tracker based on testing the first version. GameTime allows users to enter a game name, select a genre, start and stop a timer, and save their gaming sessions using cookies.

The first version worked overall, but testing revealed several problems with refreshing the dashboard, navigating between pages, chart readability, and the arcade visualization.

Create an improved second version that fixes these issues while keeping the original functionality.

## Where It Lives

My application uses Express.js, `cookie-parser`, HTML, CSS, JavaScript, Chart.js, and p5.js.

The original version is located in:

`public/tracker/v1/`

Create the improved version in:

`public/tracker/v2/`

Use these files:

- `public/tracker/v2/index.html`
- `public/tracker/v2/dashboard.html`
- `public/tracker/v2/css/style.css`
- `public/tracker/v2/js/tracker.js`
- `public/tracker/v2/js/dashboard.js`
- `public/tracker/v2/js/sketch.js`

Add the new routes to the existing `app.js`.

Do not modify or delete the v1 files or existing Express functionality.

## Data

Keep the same gaming session data structure:

```json
{
  "date": "2026-11-10",
  "game": "Minecraft",
  "genre": "Sandbox",
  "minutes": 90
}
```

Use a new cookie named `gameTime_v2`, separate from the v1 cookie.

The cookie should expire after 30 days and store up to 30 recent gaming sessions.

All saved sessions must remain available after refreshing the browser.

## Routes

Create three new Express routes:

**POST `/tracker/v2/save`**

- Receive gaming session data from the frontend.
- Validate the game name, genre, date, and duration.
- Read existing sessions from `req.cookies.gameTime_v2`.
- Add the new session to the array.
- Keep the most recent 30 sessions.
- Save the updated data using `res.cookie()`.
- Return a JSON confirmation.

**GET `/tracker/v2/data`**

- Retrieve the saved gaming sessions using `req.cookies`.
- Return the sessions as JSON.
- Return an empty array if no data exists.

**POST `/tracker/v2/clear`**

- Clear the `gameTime_v2` cookie.
- Return a JSON confirmation.

Do not use `localStorage` or `document.cookie`.

Keep the original v1 routes and the gaming poll routes unchanged.

## Pages

### Timer Page

Keep the existing GameTime timer functionality.

Include the game name input, genre dropdown, Start Session button, Stop & Save button, and dashboard navigation.

Improve the user experience by:

- Making the Start and Stop button states clear.
- Displaying a noticeable confirmation after saving.
- Preventing users from starting an empty session.
- Making navigation between the timer and dashboard reliable.
- Maintaining the existing dark gaming theme.

### Dashboard Page

Display:

- Total gaming time.
- Total number of sessions.
- Most played genre.
- Gaming Time by Day chart.
- Gaming Time by Genre chart.
- My Gaming Arcade visualization.
- Clear All Data button.

The dashboard should load saved sessions reliably whenever the page opens or refreshes.

During v1 testing, the dashboard statistics sometimes remained visible after refreshing, but the arcade machines disappeared. After refreshing several more times, the machines returned.

Fix this issue by ensuring the p5.js visualization is initialized before session data is displayed, or by updating the sketch when the data becomes available.

Also fix the intermittent navigation issue where the Timer link temporarily stopped working after refreshing.

## Chart 1 — Gaming Time by Day

Keep the Chart.js bar chart showing total gaming minutes per day.

Improve the chart by:

- Making axis labels brighter and easier to read.
- Using brighter titles and legends.
- Keeping the blue gaming color scheme.
- Displaying dates clearly.
- Combining multiple sessions recorded on the same date.
- Updating correctly whenever session data changes.
- Showing an appropriate empty state when there are no sessions.

## Chart 2 — Gaming Time by Genre

Keep the Chart.js doughnut chart.

Improve the chart by:

- Using distinct colors for each genre.
- Making the legend easier to read against the dark background.
- Displaying the total minutes for each genre.
- Keeping the chart centered and properly sized.
- Updating whenever new sessions are saved.
- Showing an appropriate empty state when there are no sessions.

## p5.js Sketch — My Gaming Arcade

Redesign the arcade visualization to make it more visually interesting and informative.

During v1 testing, the arcade machines were very small and appeared in the top-left corner of a large empty area.

Improve the sketch by:

- Making the arcade machines larger.
- Arranging machines in a centered grid.
- Using better spacing between machines.
- Making each machine look more like a recognizable arcade cabinet.
- Keeping genre-based colors.
- Using session duration to affect the machine's height or brightness.
- Displaying the game name below each machine.
- Displaying the session duration in minutes.
- Making the visualization responsive to different screen sizes.
- Ensuring the machines always appear after refreshing the dashboard.
- Removing all machines immediately after clearing the saved data.

The arcade should still create one machine per saved gaming session.

## Testing Results from v1

The following tests were completed using the original GameTime application.

**Successful tests:**

- Started and stopped a gaming session.
- Saved a Minecraft session under Sandbox.
- Recorded approximately 0.5 minutes.
- Saved a second session under Shooter.
- Displayed two sessions totaling approximately 1.5 minutes.
- Correctly identified Shooter as the most played genre.
- Displayed both genres in the doughnut chart.
- Combined gaming time on the same date in the bar chart.
- Displayed two arcade machines.
- Preserved gaming session data after refreshing.
- Successfully cleared all saved data.

**Problems discovered:**

1. Arcade machines occasionally disappeared after refreshing, even though session data remained saved.
2. Navigation back to the timer temporarily stopped working after refreshing.
3. Chart labels and legends were difficult to read because of their dark colors.
4. Arcade machines were too small and left excessive empty space.
5. Arcade machines displayed genre names but not game names or playtime.

Use these observations to guide the improvements in v2.

## Rules / Constraints

- Use plain HTML, CSS, and JavaScript.
- Keep Express.js and `cookie-parser`.
- Use Chart.js and p5.js through CDN links.
- Do not install additional npm packages.
- Do not use `localStorage` or `document.cookie`.
- Keep the code straightforward and understandable.
- Comment JavaScript functions to explain their purpose.
- Preserve the existing Express routes and gaming poll.
- Do not modify any v1 files.
- Keep the original dark blue and purple gaming theme.
- Make the layout responsive.
- Use actual cookie data for all charts and visualizations.
- Ensure navigation works after refreshing.
- Handle empty data and server errors.
- Provide complete code for all six v2 frontend files.
- Provide the additional Express routes separately, showing exactly where to insert them in `app.js`.

Generate the complete improved GameTime v2 based on these instructions.
