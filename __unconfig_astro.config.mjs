
let __unconfig_data;
let __unconfig_stub = function (data = {}) { __unconfig_data = data };
__unconfig_stub.default = (data = {}) => { __unconfig_data = data };
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react'; 


// https://astro.build/config
const __unconfig_default =  defineConfig({
	site: 'https://trading-vibes.web.app/',
	integrations: [mdx(), sitemap(), react()],
	vite: {
		plugins: [tailwindcss()],
	},
});

if (typeof __unconfig_default === "function") __unconfig_default(...[]);export default __unconfig_data;