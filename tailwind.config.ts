/** @format */

import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        linear:
          "linear-gradient(77deg, rgba(10,38,64,1) 16%, rgba(28,61,91,1) 79%)",
        "1": "url('/images/bg/2.jpg')",
      },
      fontFamily: {
        cabin: ["Cabin", "sans-serif"],
        "comic-neue": ["Comic Neue", "sans-serif"],
        arvo: ["Arvo", "serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["fantasy", "dark"],
  },
};
export default config;
