'use strict';
(() => {
  const input = document.getElementById('command');
  const output = document.getElementById('output');
  const screen = document.getElementById('screen');
  const audio = document.getElementById('rusty-music');
  const musicStatus = document.getElementById('music-status');
  // Palette values from ahmad-bradii.github.io/Terminal-Portfolio/.
  // Its invalid theme3 banner color is replaced with readable white.
  const themes = {
  "default": {
    "font-color": "#ebebeb",
    "background-color": "#1b1b1b",
    "accent-color": "#02d0df",
    "prompt-color": "#577bf1",
    "input-color": "rgb(201, 82, 35)",
    "banner-color": "rgb(201, 82, 35)",
    "command-output-color": "rgb(201, 82, 35)",
    "link-color": "#c5ee0f",
    "text-shadow": "0px 0px 10px rgba(11, 202, 231, 0.75)"
  },
  "theme1": {
    "font-color": "#00ff00",
    "background-color": "#1e1e1e",
    "accent-color": "gold",
    "prompt-color": "#00ffff",
    "input-color": "#ffffff",
    "banner-color": "#ff8c00",
    "command-output-color": "#c0c0c0",
    "link-color": "#87cefa",
    "text-shadow": "none"
  },
  "theme2": {
    "font-color": "#ff00ff",
    "background-color": "#000000",
    "accent-color": "#ffff00",
    "prompt-color": "#ff69b4",
    "input-color": "#f0f8ff",
    "banner-color": "#8a2be2",
    "command-output-color": "#add8e6",
    "link-color": "#9370db",
    "text-shadow": "1px 1px 2px rgba(0, 0, 0, 0.7)"
  },
  "theme3": {
    "font-color": "#ffffff",
    "background-color": "#00008b",
    "accent-color": "#ff4500",
    "prompt-color": "#ffa500",
    "input-color": "#f8f8f8",
    "banner-color": "#ffffff",
    "command-output-color": "#e0ffff",
    "link-color": "#4169e1",
    "text-shadow": "none"
  },
  "theme4": {
    "font-color": "#eee8aa",
    "background-color": "#2f4f4f",
    "accent-color": "#ffd700",
    "prompt-color": "#7fffd4",
    "input-color": "#f5f5dc",
    "banner-color": "rgb(255, 255, 255)",
    "command-output-color": "#f0e68c",
    "link-color": "#afeeee",
    "text-shadow": "2px 2px 3px rgba(0, 0, 0, 0.4)"
  }
};
  let currentTheme = 'theme1';
  function applyTerminalTheme(name) {
    for (const [key, value] of Object.entries(themes[name])) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
    currentTheme = name;
    document.documentElement.dataset.theme = name;
    document.querySelector('meta[name="theme-color"]').content = themes[name]['background-color'];
  }
  applyTerminalTheme('theme1');
  const history = [];
  let historyIndex = 0;
  let draft = '';
  const commands = {
    themes: 'List available color themes', setheme: 'Switch theme: setheme theme1',
    help: 'Show all commands', start: 'Welcome to Rusty', about: 'Meet Ayush',
    projects: 'Projects, live demos & source code', skills: 'Languages, frameworks & tools',
    education: 'Education', achievements: 'Achievements & open source',
    contact: 'Email & social links', github: 'GitHub profile', resume: 'View my resume',
    play: 'Play / resume the soundtrack', pause: 'Pause the soundtrack',
    stop: 'Stop & rewind the soundtrack', volume: 'Set volume: volume 0–100',
    music: 'Show soundtrack & playback status', clear: 'Clear the terminal', exit: 'Back to the portfolio'
  };
  const track = 'Soap&Skin — Me And The Devil (SLOWED + ECO Remix)';
  audio.volume = 0.5;
  // Read portfolio content from the existing page so both views stay in sync.
  const portfolio = fetch('index.html').then(response => {
    if (!response.ok) throw new Error('Portfolio unavailable');
    return response.text();
  }).then(html => new DOMParser().parseFromString(html, 'text/html'));
  portfolio.catch(() => {});
  const scroll = () => { screen.scrollTop = screen.scrollHeight; };
  function text(parent, value, tag = 'p') {
    const element = document.createElement(tag);
    element.textContent = value;
    parent.append(element);
    return element;
  }
  function link(parent, label, href) {
    const url = new URL(href, location.href);
    if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) return;
    const anchor = text(parent, label, 'a');
    anchor.href = url.href;
    if (url.protocol !== 'mailto:') { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
    parent.append(document.createTextNode('   '));
  }
  function updateMusic() {
    musicStatus.textContent = audio.paused ? '♫ music paused' : '♫ playing · Me And The Devil';
  }
  ['play', 'pause', 'ended'].forEach(event => audio.addEventListener(event, updateMusic));
  audio.addEventListener('error', () => { musicStatus.textContent = '♫ audio unavailable · try play again'; });
  window.addEventListener('pagehide', () => audio.pause());
  async function run(raw) {
    const value = raw.trim();
    if (!value) return;
    history.push(value);
    historyIndex = history.length;
    draft = '';
    input.value = '';
    const entry = document.createElement('div');
    entry.className = 'entry';
    text(entry, `guest@rusty:~$ ${value}`, 'div').className = 'echo';
    const response = document.createElement('div');
    response.className = 'response';
    entry.append(response);
    output.append(entry);
    while (output.children.length > 100) output.firstElementChild.remove();
    const tokens = value.toLowerCase().split(/\s+/);
    if (tokens[0] === 'rusty') tokens.shift();
    let [command = 'start', ...args] = tokens;
    if (command === '--help') command = 'help';
    try {
      if (!(command in commands) || !Object.hasOwn(commands, command)) {
        response.classList.add('error');
        const suggestion = Object.keys(commands).find(name => name.startsWith(command.slice(0, 2)));
        text(response, `Unknown command: ${command}.${suggestion ? ` Try ${suggestion}.` : ''} Type help for commands.`);
      } else if ((!['volume', 'setheme'].includes(command) && args.length) || (['volume', 'setheme'].includes(command) && args.length !== 1)) {
        text(response, command === 'setheme' ? 'Usage: setheme <theme name>. Type themes to list presets.' : command === 'volume' ? 'Usage: volume 0–100' : `Usage: ${command} (or rusty ${command})`);
      } else if (command === 'themes') {
        text(response, Object.keys(themes).map(name => `${name.padEnd(10)}${name === currentTheme ? ' [active]' : ''}${name === 'theme1' ? ' (startup default)' : ''}`).join('\n'));
        text(response, 'To change the theme, type: setheme <theme name> (e.g., setheme theme1)');
      } else if (command === 'setheme') {
        if (!Object.hasOwn(themes, args[0])) text(response, `Unknown theme: ${args[0]}. Type themes to list presets.`);
        else { applyTerminalTheme(args[0]); text(response, `Theme changed to ${args[0]}.`); }
      } else if (command === 'clear') {
        output.replaceChildren();
        document.querySelector('.welcome').hidden = true;
      } else if (command === 'exit') {
        audio.pause();
        location.href = 'index.html';
      } else if (command === 'help') {
        text(response, Object.entries(commands).map(([name, description]) => `${name.padEnd(14)} ${description}`).join('\n'));
        text(response, 'Use commands directly or prefix them with rusty, e.g. rusty play.\nTab completes commands. ↑ / ↓ recalls history. Ctrl+L clears.');
      } else if (command === 'start') {
        text(response, 'Welcome to Rusty, Ayush’s interactive portfolio.\nStart with about, explore projects, or type play for some music.');
      } else if (command === 'play') {
        text(response, 'Loading soundtrack…');
        try {
          await audio.play();
          response.replaceChildren();
          text(response, audio.paused ? 'Playback paused.' : `Playing: ${track}\nUse pause, stop, or volume 50.`);
        } catch (error) {
          response.replaceChildren();
          text(response, error.name === 'AbortError' ? 'Playback cancelled.' : 'Could not play audio. Check your connection and try play again.');
        }
      } else if (command === 'pause' || command === 'stop') {
        audio.pause();
        if (command === 'stop') audio.currentTime = 0;
        updateMusic();
        text(response, command === 'stop' ? 'Soundtrack stopped and rewound.' : 'Soundtrack paused. Type play to resume.');
      } else if (command === 'volume') {
        const amount = Number(args[0]);
        if (!Number.isFinite(amount) || amount < 0 || amount > 100) text(response, 'Usage: volume 0–100');
        else { audio.volume = amount / 100; text(response, `Volume: ${amount}%`); }
      } else if (command === 'music') {
        text(response, `${track}\n${audio.paused ? 'Paused' : 'Playing'} · volume ${Math.round(audio.volume * 100)}%\nCommands: play / pause / stop / volume 50`);
      } else {
        text(response, 'Loading portfolio…');
        const doc = await portfolio;
        response.replaceChildren();
        if (command === 'about') text(response, doc.querySelector('.about-copy').textContent);
        if (command === 'skills') text(response, Array.from(doc.querySelectorAll('#skills .pill-tag'), node => node.textContent).join(' · '));
        if (command === 'education') {
          doc.querySelectorAll('#education .bordered-card > *').forEach(node => text(response, node.textContent));
        }
        if (command === 'achievements') {
          doc.querySelectorAll('.roadmap-body').forEach(node => { text(response, node.querySelector('h3').textContent, 'h2'); text(response, node.querySelector('p').textContent); });
        }
        if (command === 'projects') {
          doc.querySelectorAll('.project').forEach(node => {
            text(response, node.querySelector('h3').textContent, 'h2');
            text(response, node.querySelector('p').textContent);
            node.querySelectorAll('.project-links a').forEach(anchor => link(response, anchor.textContent.trim() + ' ↗', anchor.getAttribute('href')));
          });
        }
        if (command === 'contact') {
          link(response, 'ayushgopal17@gmail.com', 'mailto:ayushgopal17@gmail.com');
          const anchor = doc.querySelector('[aria-label="LinkedIn"]');
          link(response, 'LinkedIn ↗', anchor.href);
        }
        if (command === 'github' || command === 'contact') link(response, 'GitHub ↗', doc.querySelector('[aria-label="GitHub"]').href);
        if (command === 'resume') link(response, 'View resume ↗', doc.querySelector('[aria-label="View resume"]').href);
      }
    } catch {
      response.replaceChildren();
      text(response, 'Could not load portfolio content. Reload to try again, or type exit to return to the portfolio.');
    }
    scroll();
  }
  document.getElementById('command-form').addEventListener('submit', event => { event.preventDefault(); void run(input.value); });
  screen.addEventListener('click', event => {
    if (!event.target.closest('a') && !window.getSelection().toString()) input.focus({ preventScroll: true });
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === history.length) draft = input.value;
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
      input.value = historyIndex === history.length ? draft : history[historyIndex];
      input.setSelectionRange(input.value.length, input.value.length);
    }
    if (event.key === 'Tab' && !event.shiftKey) {
      const value = input.value.toLowerCase().trimStart();
      const prefix = value.startsWith('rusty ') ? 'rusty ' : '';
      const remainder = value.slice(prefix.length);
      const themePrefix = remainder.startsWith('setheme ') ? 'setheme ' : '';
      const partial = remainder.slice(themePrefix.length);
      const matches = Object.keys(themePrefix ? themes : commands).filter(name => name.startsWith(partial));
      if (partial && matches.length === 1) { event.preventDefault(); input.value = prefix + themePrefix + matches[0]; }
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); void run('clear'); }
  });
  if (matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
})();
