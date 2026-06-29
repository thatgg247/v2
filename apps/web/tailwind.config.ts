import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { brand: { 50:"#EBF2FA",100:"#C7DCEF",200:"#8FBBE0",300:"#5799D0",400:"#2E75B6",500:"#1F4E79",600:"#173A5A",700:"#0F2740" } } } },
  plugins: [],
};
export default config;
