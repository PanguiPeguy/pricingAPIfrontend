// vite.config.ts
import { defineConfig } from "file:///home/pangui/Bureau/API_REST/frontend_api/node_modules/vite/dist/node/index.js";
import react from "file:///home/pangui/Bureau/API_REST/frontend_api/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/pangui/Bureau/API_REST/frontend_api";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    // Changé de "::" à "localhost" pour éviter les problèmes réseau
    port: 8080,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    }
  },
  build: {
    target: "es2015",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode === "development"
  },
  plugins: [
    react({
      tsDecorators: true,
      plugins: []
    })
    // Commentez temporairement le plugin problématique
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wYW5ndWkvQnVyZWF1L0FQSV9SRVNUL2Zyb250ZW5kX2FwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcGFuZ3VpL0J1cmVhdS9BUElfUkVTVC9mcm9udGVuZF9hcGkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcGFuZ3VpL0J1cmVhdS9BUElfUkVTVC9mcm9udGVuZF9hcGkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG4vLyBSZXRpcmV6IHRlbXBvcmFpcmVtZW50IGxvdmFibGUtdGFnZ2VyXG4vLyBpbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwibG9jYWxob3N0XCIsIC8vIENoYW5nXHUwMEU5IGRlIFwiOjpcIiBcdTAwRTAgXCJsb2NhbGhvc3RcIiBwb3VyIFx1MDBFOXZpdGVyIGxlcyBwcm9ibFx1MDBFOG1lcyByXHUwMEU5c2VhdVxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHtcbiAgICAgIHRzRGVjb3JhdG9yczogdHJ1ZSxcbiAgICAgIHBsdWdpbnM6IFtdLFxuICAgIH0pLFxuICAgIC8vIENvbW1lbnRleiB0ZW1wb3JhaXJlbWVudCBsZSBwbHVnaW4gcHJvYmxcdTAwRTltYXRpcXVlXG4gICAgLy8gbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsb0JBQW9CO0FBQzFVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVEsU0FBUyxlQUFlLFlBQVk7QUFBQSxJQUM1QyxXQUFXLFNBQVM7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osY0FBYztBQUFBLE1BQ2QsU0FBUyxDQUFDO0FBQUEsSUFDWixDQUFDO0FBQUE7QUFBQTtBQUFBLEVBR0gsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
