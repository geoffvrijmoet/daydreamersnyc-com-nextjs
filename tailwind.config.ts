import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			cutiepie: "#FFA87D",
  			lolligag: "#D37CFF",
  			daydreamer: "#F3DCFF",
  			creamsicle: "#FFF4EE",
  			aquamarine: "#D4FFFA",
  			eggplant: "#72357C",
  			goodboy: "#94B5E5",
  			woof: "#FFCFE6",
  			shrek: "#E1FF6B",
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			primary: {
  				DEFAULT: "#72357C",
  				foreground: "#FFF4EE",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			aloevera: ['var(--font-aloevera)'],
  			quicksand: ['var(--font-quicksand)'],
  		},
  		container: {
  			center: true,
  			padding: "2rem",
  			screens: {
  				"2xl": "1400px",
  			},
  		},
  	}
  },
  plugins: [animate],
};
export default config;
