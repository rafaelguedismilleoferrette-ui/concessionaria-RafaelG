import { isAbsolute, relative } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'relative-test-paths',
      enforce: 'post',
      config(config) {
        if (config.test?.include) {
          config.test.include = config.test.include.map((file) =>
            isAbsolute(file)
              ? relative(config.root ?? process.cwd(), file).replaceAll('\\', '/')
              : file,
          );
        }
      },
    },
  ],
});
