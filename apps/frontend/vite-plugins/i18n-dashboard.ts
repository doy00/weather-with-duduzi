import type { Plugin } from 'vite';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface TranslationStats {
  language: string;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  coverage: number;
}

export function i18nDashboardPlugin(): Plugin {
  return {
    name: 'i18n-dashboard',

    configureServer(server) {
      // API 엔드포인트
      server.middlewares.use('/api/i18n/stats', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end();
          return;
        }

        try {
          const stats = await calculateStats();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(stats));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(error) }));
        }
      });

      // 대시보드 페이지
      server.middlewares.use('/i18n-dashboard', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end();
          return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.end(generateDashboardHTML());
      });
    },
  };
}

async function getAllKeys(langDir: string): Promise<Set<string>> {
  const keys = new Set<string>();
  const files = await readdir(langDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const namespace = file.replace('.json', '');
    const content = JSON.parse(await readFile(join(langDir, file), 'utf-8')) as Record<
      string,
      unknown
    >;

    const flattenKeys = (obj: Record<string, unknown>, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenKeys(value as Record<string, unknown>, fullKey);
        } else {
          keys.add(`${namespace}:${fullKey}`);
        }
      }
    };

    flattenKeys(content);
  }

  return keys;
}

async function calculateStats(): Promise<TranslationStats[]> {
  const localesDir = 'public/locales';
  const languages = ['ko', 'en', 'ja', 'id', 'th', 'vi', 'es'];
  const koKeys = await getAllKeys(join(localesDir, 'ko'));

  return Promise.all(
    languages.map(async (lang) => {
      const langKeys = await getAllKeys(join(localesDir, lang));
      const missingKeys = [...koKeys].filter((k) => !langKeys.has(k));

      return {
        language: lang,
        totalKeys: koKeys.size,
        translatedKeys: langKeys.size,
        missingKeys,
        coverage: (langKeys.size / koKeys.size) * 100,
      };
    })
  );
}

function generateDashboardHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i18n Coverage Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #334155;
    }
    .stat-card h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .stat-card .count {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }
    .progress-bar {
      height: 8px;
      background: #334155;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      transition: width 0.3s ease;
    }
    .coverage {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    details {
      margin-top: 1rem;
      cursor: pointer;
    }
    summary {
      font-size: 0.875rem;
      color: #ef4444;
      font-weight: 500;
    }
    details ul {
      margin-top: 0.5rem;
      padding-left: 1.5rem;
      font-size: 0.75rem;
      color: #cbd5e1;
    }
    details li {
      margin-bottom: 0.25rem;
    }
    .complete {
      color: #10b981;
      font-weight: bold;
    }
    .chart-container {
      background: #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #334155;
    }
    canvas {
      max-height: 400px;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <h1>📊 Translation Coverage Dashboard</h1>
  <div id="loading" class="loading">Loading translation stats...</div>
  <div id="stats" class="stats-grid" style="display: none;"></div>
  <div id="chart-wrapper" class="chart-container" style="display: none;">
    <canvas id="chart"></canvas>
  </div>

  <script>
    fetch('/api/i18n/stats')
      .then(r => r.json())
      .then(data => {
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        document.getElementById('stats').style.display = 'grid';
        document.getElementById('chart-wrapper').style.display = 'block';

        // Render stats cards
        document.getElementById('stats').innerHTML = data.map(stat => {
          const isComplete = stat.coverage === 100;
          return \`
            <div class="stat-card">
              <h3>\${stat.language.toUpperCase()}</h3>
              <div class="count">\${stat.translatedKeys} / \${stat.totalKeys} keys</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: \${stat.coverage}%"></div>
              </div>
              <div class="coverage">\${stat.coverage.toFixed(1)}% coverage</div>
              \${isComplete
                ? '<p class="complete">✅ Complete</p>'
                : \`
                  <details>
                    <summary>\${stat.missingKeys.length} missing keys</summary>
                    <ul>\${stat.missingKeys.slice(0, 10).map(k => \`<li>\${k}</li>\`).join('')}</ul>
                    \${stat.missingKeys.length > 10 ? \`<p style="margin-top: 0.5rem; color: #64748b;">...and \${stat.missingKeys.length - 10} more</p>\` : ''}
                  </details>
                \`
              }
            </div>
          \`;
        }).join('');

        // Render chart
        new Chart(document.getElementById('chart'), {
          type: 'bar',
          data: {
            labels: data.map(s => s.language.toUpperCase()),
            datasets: [{
              label: 'Translation Coverage (%)',
              data: data.map(s => s.coverage),
              backgroundColor: data.map(s => s.coverage === 100 ? '#10b981' : '#3b82f6'),
              borderRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
              },
              x: {
                ticks: { color: '#94a3b8' },
                grid: { display: false }
              }
            },
            plugins: {
              legend: {
                labels: { color: '#e2e8f0' }
              }
            }
          }
        });
      })
      .catch(err => {
        console.error('Failed to load i18n stats:', err);
        document.getElementById('loading').innerHTML = '<p style="color: #ef4444;">Failed to load translation stats</p>';
      });
  </script>
</body>
</html>
  `;
}
