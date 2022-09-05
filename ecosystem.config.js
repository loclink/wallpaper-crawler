module.exports = {
  apps: [
    {
      name: 'crawler',
      script: './src/index.js',
      cwd: './',
      watch: true,
      ignore_watch: ['src/logs', 'src/imgData', 'node_modules']
    }
  ]
}
