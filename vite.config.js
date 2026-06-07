import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        school: resolve(__dirname, 'school.html'),
        grants: resolve(__dirname, 'grants.html'),
        news: resolve(__dirname, 'news.html'),
        team: resolve(__dirname, 'team.html'),
        competitions: resolve(__dirname, "competitions.html"),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});