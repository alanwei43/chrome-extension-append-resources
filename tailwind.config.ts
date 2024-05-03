import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx,tsx,mdx}",
    // Path to Tremor module
    // './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 这是个示例, 代码里可以使用 font-code 作为 className 名称
        code: "Consolas, 'Courier New', monospace",
      },
    },
  },
  safelist: [],
  plugins: [],
  prefix: "tw-",
} satisfies Config;
