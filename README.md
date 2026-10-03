# Ayush’s portfolio

Static HTML, CSS, and JavaScript. No build step or backend required.

## Local preview

Run `python3 -m http.server 8765` from this directory, then open
`http://localhost:8765`. Use the **Rusty CLI** link beside **Play intro**,
or visit `/rusty.html` directly. Use an HTTP server instead of opening the
HTML file directly: Rusty fetches `index.html` for current portfolio content.

## Rusty CLI

The framed black-and-green terminal uses `rusty.html`, `rusty.css`, and `rusty.js`.
Try `help`, `rusty start`, `about`, `projects`, `skills`, `education`,
`achievements`, `contact`, `github`, or `resume`.

Music commands: `play`, `pause`, `stop`, `music`, and `volume 50`.
The terminal soundtrack is `assets/rusty-music.mp3`; it loads only on demand.
Tab completes a unique command prefix, arrow keys recall command history,
and `clear` / Ctrl+L clear output. `exit` returns to the main portfolio.
Rusty is a browser command interface, not an operating-system shell.

## Hosting

Keep these files in the same repository as the portfolio. They can be served
by the existing static host; a separate Render service is unnecessary.
For GitHub Pages, select the publishing branch and root folder in the
repository’s Settings → Pages. Relative URLs also support repository subpaths.
No Rust toolchain, npm dependencies, or compilation is needed.

## Terminal themes

`themes` lists the reference presets: `default`, `theme1`, `theme2`, `theme3`,
and `theme4`. Use `setheme theme2` (or `rusty setheme theme2`) to switch.
Each new page load starts with `theme1`. Themes affect only Rusty.
Palettes match https://ahmad-bradii.github.io/Terminal-Portfolio/;
its invalid theme3 banner color is replaced with white for readability.
