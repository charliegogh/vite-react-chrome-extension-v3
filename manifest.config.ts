import { defineManifest } from '@crxjs/vite-plugin'
// @ts-ignore
import packageJson from './package.json'

const { version, name, description, displayName } = packageJson
// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(async(env) => ({
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : displayName || name,
  description,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  // key: 'ekgmcbpgglflmgcfajnglpbcbdccnnje',
  action: {
    // default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts'
  },
  content_scripts: [
    {
      all_frames: true,
      js: ['src/content-script/index.ts'],
      // matches: ['*://*/*'],
      matches: [
        'https://www.liblib.art/*'
      ],
      run_at: 'document_start'
    },
    {
      all_frames: true,
      js: ['src/inject-script/index.ts'],
      run_at: 'document_start',
      // matches: ['*://*/*'],
      matches: [
        'https://www.liblib.art/*'
      ]
    }
  ],
  // host_permissions: ['*://*/*'],
  host_permissions: ['https://www.liblib.art/*'],
  options_page: 'src/options/index.html',
  permissions: ['storage', 'activeTab', 'sidePanel', 'scripting'],
  side_panel: {
    default_path: 'src/tabs/sidepanel.html'
  },
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: ['src/inject-script/index.ts']
    },
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/index.ts']
    },
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/iframe/index.html']
    },
    {
      matches: ['*://*/*'],
      resources: ['.vite/manifest.json']
    },
    {
      matches: ['*://*/*'],
      resources: ['src/tabs/xlsx.full.min.js']
    }
  ]
}))
