"""Refresh the public contribution calendar: python3 scripts/update-github-activity.py."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from datetime import date
from html import escape
import sys

class Calendar(HTMLParser):
    def __init__(self):
        super().__init__(); self.days = {}; self.tips = {}; self.current = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'data-date' in a:
            self.days[a['data-date']] = (int(a['data-level']), a['id'])
        if tag == 'tool-tip': self.current = a.get('for')
    def handle_data(self, text):
        if self.current: self.tips[self.current] = self.tips.get(self.current, '') + text
    def handle_endtag(self, tag):
        if tag == 'tool-tip': self.current = None

source = Path(sys.argv[1]).read_text() if len(sys.argv) > 1 else urlopen(Request('https://github.com/users/ayushgopal17/contributions', headers={'User-Agent': 'portfolio-calendar'}), timeout=30).read().decode()
p = Calendar(); p.feed(source)
assert len(p.days) >= 350, 'Incomplete GitHub calendar; keeping the existing version.'
days = sorted(p.days)
start = date.fromisoformat(days[0]); today = date.today()
colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 130" role="img" aria-labelledby="title desc"><title id="title">Ayush Gopal’s GitHub contribution calendar</title><desc id="desc">Daily contributions over the past year. Darker cells indicate less activity and brighter green cells indicate more.</desc>']
month = None; total = 0
for day in days:
    d = date.fromisoformat(day); offset = (d-start).days; col, row = divmod(offset,7)
    level, key = p.days[day]; tip = p.tips.get(key, day).strip()
    if d <= today and tip.split()[0].isdigit(): total += int(tip.split()[0])
    if row == 0 and d.month != month and col < 51:
        svg.append(f'<text x="{col*14}" y="13" fill="#8b949e" font-family="system-ui,sans-serif" font-size="10">{d:%b}</text>'); month=d.month
    svg.append(f'<rect x="{col*14}" y="{25+row*14}" width="11" height="11" rx="2" fill="{colors[level]}"><title>{escape(day+": "+tip)}</title></rect>')
svg.append('</svg>')
root = Path(__file__).resolve().parents[1]
(root/'assets/github-activity.svg').write_text(''.join(svg))
page = root/'index.html'; html = page.read_text()
import re
html = re.sub(r'(<span id="contribution-count">).*?(</span>)', rf'\g<1>{total:,} contributions in the past year\2', html)
html = re.sub(r'(<span id="activity-updated">).*?(</span>)', rf'\g<1>Updated {today:%d %b %Y}\2', html)
page.write_text(html)
print(f'Updated {len(days)} days; {total} contributions.')
