import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { render } = await import(resolve(root, 'dist-ssr/entry-server.js'))
const appHtml = render()

const templatePath = resolve(root, 'dist/index.html')
const template = readFileSync(templatePath, 'utf-8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find empty #root in dist/index.html')
}

writeFileSync(
  templatePath,
  template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
)
console.log('prerender: injected static markup into dist/index.html')
