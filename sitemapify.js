// sitemap-generator.js
const fs = require("fs");
const path = require("path");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;

// Immediately Invoked Async Function Expression (IIFE) for top-level await
(async () => {
  const fetch = (await import("node-fetch")).default;
  const Sitemap = (await import("react-router-sitemap")).default.default;

  // Function to fetch dynamic paths from external JSON
  async function fetchDynamicPaths() {
    const externalRepoUrl =
      "https://raw.githubusercontent.com/farnostsverepec/content/main/content/external/foto/list.json";
    const response = await fetch(externalRepoUrl);
    const data = await response.json();
    return data;
  }

  // Function to extract routes from App.js
  function extractRoutesFromApp() {
    const appFilePath = path.resolve(__dirname, "src", "App.js");
    const appCode = fs.readFileSync(appFilePath, "utf-8");
    const ast = babelParser.parse(appCode, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    const routes = [];

    babelTraverse(ast, {
      JSXElement(path) {
        if (path.node.openingElement.name.name === "Route") {
          const pathAttribute = path.node.openingElement.attributes.find(
            (attr) => attr.name.name === "path"
          );

          if (pathAttribute && !["/", "*"].includes(pathAttribute?.value?.value)) {
            routes.push(pathAttribute.value.value);
          }
        }
      },
    });

    return routes;
  }

  async function generateSitemap() {
    // Fetch dynamic paths
    const dynamicPaths = await fetchDynamicPaths();

    // Extract static routes from App.js
    const staticRoutes = extractRoutesFromApp();

    // Create router configuration
    const routerConfig = {
      path: "/",
      component: "Root",
      childRoutes: staticRoutes.map((route) => ({
        path: route,
      })),
    };

    // Create a configuration object for dynamic paths
    const paramsConfig = {
      "/fotogaleria/:id": dynamicPaths.map((title) => ({ id: title })),
    };

    // Build and save the sitemap
    new Sitemap(routerConfig)
      .applyParams(paramsConfig)
      .build("https://farnostsverepec.sk")
      .save(path.resolve(__dirname, "public", "sitemap.xml"));
  }

  generateSitemap().catch((error) => {
    console.error("Error generating sitemap:", error);
  });
})();
