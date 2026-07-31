# Frontend Code


## .editorconfig

``
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single
ij_typescript_use_double_quotes = false

[*.md]
max_line_length = off
trim_trailing_whitespace = false

``

## .gitignore

``
# See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
__screenshots__/

# System files
.DS_Store
Thumbs.db

``

## angular.json

``json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "npm"
  },
  "newProjectRoot": "projects",
  "projects": {
    "budgetha-web": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.css"
            ],
            "serviceWorker": "ngsw-config.json"
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all",
              "serviceWorker": "ngsw-config.json"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "budgetha-web:build:production"
            },
            "development": {
              "buildTarget": "budgetha-web:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular/build:extract-i18n"
        },
        "test": {
          "builder": "@angular/build:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}

``

## ngsw-config.json

``json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "navigationUrls": [
    "/**",
    "!/**/*.*",
    "!/**/*__*",
    "!/**/*__*/**",
    "!/api/**"
  ],
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.csr.html",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js",
          "/media/*"
        ]
      }
    },
    {
      "name": "app-shell-icons",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/icons/icon-192x192.png",
          "/icons/icon-512x512.png"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/**/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    },
    {
      "name": "fonts",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "urls": [
          "https://fonts.googleapis.com/**",
          "https://fonts.gstatic.com/**"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-catalog",
      "urls": [
        "/api/products/**",
        "/api/categories/**",
        "/api/brands/**",
        "/api/reviews/**",
        "http://localhost:5272/api/products/**",
        "http://localhost:5272/api/categories/**",
        "http://localhost:5272/api/brands/**",
        "http://localhost:5272/api/reviews/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 200,
        "maxAge": "6h",
        "timeout": "3s"
      }
    },
    {
      "name": "product-images",
      "urls": [
        "https://images.unsplash.com/**",
        "https://picsum.photos/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 250,
        "maxAge": "14d"
      }
    },
    {
      "name": "api-account",
      "urls": [
        "/api/cart/**",
        "/api/orders/**",
        "/api/account/**",
        "/api/wishlist/**",
        "http://localhost:5272/api/cart/**",
        "http://localhost:5272/api/orders/**",
        "http://localhost:5272/api/account/**",
        "http://localhost:5272/api/wishlist/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 60,
        "maxAge": "1h",
        "timeout": "5s"
      }
    }
  ]
}

``

## package-lock.json

``json
{
  "name": "budgetha-web",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "budgetha-web",
      "version": "0.0.0",
      "dependencies": {
        "@angular/common": "^20.3.0",
        "@angular/compiler": "^20.3.0",
        "@angular/core": "^20.3.0",
        "@angular/forms": "^20.3.0",
        "@angular/platform-browser": "^20.3.0",
        "@angular/router": "^20.3.0",
        "@angular/service-worker": "^20.3.0",
        "@microsoft/signalr": "^10.0.0",
        "jimp": "^1.6.1",
        "ngx-image-cropper": "^9.1.6",
        "ngx-paypal": "^11.0.0",
        "rxjs": "~7.8.0",
        "tslib": "^2.3.0",
        "zone.js": "~0.15.0"
      },
      "devDependencies": {
        "@angular/build": "^20.3.32",
        "@angular/cli": "^20.3.32",
        "@angular/compiler-cli": "^20.3.0",
        "@tailwindcss/forms": "^0.5.7",
        "@types/jasmine": "~5.1.0",
        "autoprefixer": "^10.5.4",
        "jasmine-core": "~5.9.0",
        "karma": "~6.4.0",
        "karma-chrome-launcher": "~3.2.0",
        "karma-coverage": "~2.2.0",
        "karma-jasmine": "~5.1.0",
        "karma-jasmine-html-reporter": "~2.1.0",
        "postcss": "^8.5.24",
        "tailwindcss": "^3.4.19",
        "typescript": "~5.9.2"
      }
    },
    "node_modules/@algolia/abtesting": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@algolia/abtesting/-/abtesting-1.1.0.tgz",
      "integrity": "sha512-sEyWjw28a/9iluA37KLGu8vjxEIlb60uxznfTUmXImy7H5NvbpSO6yYgmgH5KiD7j+zTUUihiST0jEP12IoXow==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-abtesting": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-abtesting/-/client-abtesting-5.35.0.tgz",
      "integrity": "sha512-uUdHxbfHdoppDVflCHMxRlj49/IllPwwQ2cQ8DLC4LXr3kY96AHBpW0dMyi6ygkn2MtFCc6BxXCzr668ZRhLBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-analytics": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-analytics/-/client-analytics-5.35.0.tgz",
      "integrity": "sha512-SunAgwa9CamLcRCPnPHx1V2uxdQwJGqb1crYrRWktWUdld0+B2KyakNEeVn5lln4VyeNtW17Ia7V7qBWyM/Skw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-common": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-common/-/client-common-5.35.0.tgz",
      "integrity": "sha512-ipE0IuvHu/bg7TjT2s+187kz/E3h5ssfTtjpg1LbWMgxlgiaZIgTTbyynM7NfpSJSKsgQvCQxWjGUO51WSCu7w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-insights": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-insights/-/client-insights-5.35.0.tgz",
      "integrity": "sha512-UNbCXcBpqtzUucxExwTSfAe8gknAJ485NfPN6o1ziHm6nnxx97piIbcBQ3edw823Tej2Wxu1C0xBY06KgeZ7gA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-personalization": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-personalization/-/client-personalization-5.35.0.tgz",
      "integrity": "sha512-/KWjttZ6UCStt4QnWoDAJ12cKlQ+fkpMtyPmBgSS2WThJQdSV/4UWcqCUqGH7YLbwlj3JjNirCu3Y7uRTClxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-query-suggestions": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-query-suggestions/-/client-query-suggestions-5.35.0.tgz",
      "integrity": "sha512-8oCuJCFf/71IYyvQQC+iu4kgViTODbXDk3m7yMctEncRSRV+u2RtDVlpGGfPlJQOrAY7OONwJlSHkmbbm2Kp/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/client-search": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/client-search/-/client-search-5.35.0.tgz",
      "integrity": "sha512-FfmdHTrXhIduWyyuko1YTcGLuicVbhUyRjO3HbXE4aP655yKZgdTIfMhZ/V5VY9bHuxv/fGEh3Od1Lvv2ODNTg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/ingestion": {
      "version": "1.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/ingestion/-/ingestion-1.35.0.tgz",
      "integrity": "sha512-gPzACem9IL1Co8mM1LKMhzn1aSJmp+Vp434An4C0OBY4uEJRcqsLN3uLBlY+bYvFg8C8ImwM9YRiKczJXRk0XA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/monitoring": {
      "version": "1.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/monitoring/-/monitoring-1.35.0.tgz",
      "integrity": "sha512-w9MGFLB6ashI8BGcQoVt7iLgDIJNCn4OIu0Q0giE3M2ItNrssvb8C0xuwJQyTy1OFZnemG0EB1OvXhIHOvQwWw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/recommend": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/recommend/-/recommend-5.35.0.tgz",
      "integrity": "sha512-AhrVgaaXAb8Ue0u2nuRWwugt0dL5UmRgS9LXe0Hhz493a8KFeZVUE56RGIV3hAa6tHzmAV7eIoqcWTQvxzlJeQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/requester-browser-xhr": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/requester-browser-xhr/-/requester-browser-xhr-5.35.0.tgz",
      "integrity": "sha512-diY415KLJZ6x1Kbwl9u96Jsz0OstE3asjXtJ9pmk1d+5gPuQ5jQyEsgC+WmEXzlec3iuVszm8AzNYYaqw6B+Zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/requester-fetch": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/requester-fetch/-/requester-fetch-5.35.0.tgz",
      "integrity": "sha512-uydqnSmpAjrgo8bqhE9N1wgcB98psTRRQXcjc4izwMB7yRl9C8uuAQ/5YqRj04U0mMQ+fdu2fcNF6m9+Z1BzDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@algolia/requester-node-http": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/@algolia/requester-node-http/-/requester-node-http-5.35.0.tgz",
      "integrity": "sha512-RgLX78ojYOrThJHrIiPzT4HW3yfQa0D7K+MQ81rhxqaNyNBu4F1r+72LNHYH/Z+y9I1Mrjrd/c/Ue5zfDgAEjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/client-common": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@ampproject/remapping": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@ampproject/remapping/-/remapping-2.3.0.tgz",
      "integrity": "sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@angular-devkit/architect": {
      "version": "0.2003.32",
      "resolved": "https://registry.npmjs.org/@angular-devkit/architect/-/architect-0.2003.32.tgz",
      "integrity": "sha512-V5d531w97LENARKdYk5Km0F2rt8NPEL3rXUQk7+gbo9r/jgLWn9GU3VHQ30oBWXnU7Vu00Hdp/8yFeYgpWqSow==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "20.3.32",
        "rxjs": "7.8.2"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular-devkit/core": {
      "version": "20.3.32",
      "resolved": "https://registry.npmjs.org/@angular-devkit/core/-/core-20.3.32.tgz",
      "integrity": "sha512-pXipSsYP/XTEAljmwqgy1u3GR/ZzSMg1FERINekGT61Th1pGhzjs02rPgbyftqz2e5/tfQ6XgTP7xYzm3+S35Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "8.18.0",
        "ajv-formats": "3.0.1",
        "jsonc-parser": "3.3.1",
        "picomatch": "4.0.4",
        "rxjs": "7.8.2",
        "source-map": "0.7.6"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      },
      "peerDependencies": {
        "chokidar": "^4.0.0"
      },
      "peerDependenciesMeta": {
        "chokidar": {
          "optional": true
        }
      }
    },
    "node_modules/@angular-devkit/schematics": {
      "version": "20.3.32",
      "resolved": "https://registry.npmjs.org/@angular-devkit/schematics/-/schematics-20.3.32.tgz",
      "integrity": "sha512-UxWncmJTcYMDEaAKRi3QHU3qXivIcIOulFOKozW8svfs/A43Oq1GG4kvDZ+WVf/w2UWTmMaSlfFa4KIQciSIDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "20.3.32",
        "jsonc-parser": "3.3.1",
        "magic-string": "0.30.17",
        "ora": "8.2.0",
        "rxjs": "7.8.2"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular/build": {
      "version": "20.3.32",
      "resolved": "https://registry.npmjs.org/@angular/build/-/build-20.3.32.tgz",
      "integrity": "sha512-ph/qcT6C7RYriU5dxXfNrYBEvCwU4acxTNoxkdGQHYxM7iOKT0K1YO6v5JBNRZ1S4LOJhWmGaWzJ+sRei0iGsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@ampproject/remapping": "2.3.0",
        "@angular-devkit/architect": "0.2003.32",
        "@babel/core": "7.29.7",
        "@babel/helper-annotate-as-pure": "7.27.3",
        "@babel/helper-split-export-declaration": "7.24.7",
        "@inquirer/confirm": "5.1.14",
        "@vitejs/plugin-basic-ssl": "2.1.0",
        "beasties": "0.3.5",
        "browserslist": "^4.23.0",
        "esbuild": "0.28.1",
        "https-proxy-agent": "7.0.6",
        "istanbul-lib-instrument": "6.0.3",
        "jsonc-parser": "3.3.1",
        "listr2": "9.0.1",
        "magic-string": "0.30.17",
        "mrmime": "2.0.1",
        "parse5-html-rewriting-stream": "8.0.0",
        "picomatch": "4.0.4",
        "piscina": "5.2.0",
        "rollup": "4.59.0",
        "sass": "1.90.0",
        "semver": "7.7.2",
        "source-map-support": "0.5.21",
        "tinyglobby": "0.2.14",
        "vite": "7.3.6",
        "watchpack": "2.4.4"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      },
      "optionalDependencies": {
        "lmdb": "3.4.2"
      },
      "peerDependencies": {
        "@angular/compiler": "^20.0.0",
        "@angular/compiler-cli": "^20.0.0",
        "@angular/core": "^20.0.0",
        "@angular/localize": "^20.0.0",
        "@angular/platform-browser": "^20.0.0",
        "@angular/platform-server": "^20.0.0",
        "@angular/service-worker": "^20.0.0",
        "@angular/ssr": "^20.3.32",
        "karma": "^6.4.0",
        "less": "^4.2.0",
        "ng-packagr": "^20.0.0",
        "postcss": "^8.4.0",
        "tailwindcss": "^2.0.0 || ^3.0.0 || ^4.0.0",
        "tslib": "^2.3.0",
        "typescript": ">=5.8 <6.0",
        "vitest": "^3.1.1"
      },
      "peerDependenciesMeta": {
        "@angular/core": {
          "optional": true
        },
        "@angular/localize": {
          "optional": true
        },
        "@angular/platform-browser": {
          "optional": true
        },
        "@angular/platform-server": {
          "optional": true
        },
        "@angular/service-worker": {
          "optional": true
        },
        "@angular/ssr": {
          "optional": true
        },
        "karma": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "ng-packagr": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tailwindcss": {
          "optional": true
        },
        "vitest": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/cli": {
      "version": "20.3.32",
      "resolved": "https://registry.npmjs.org/@angular/cli/-/cli-20.3.32.tgz",
      "integrity": "sha512-WIMbTrEJYVVz4Phs8nn6yK/bzCSt1dDlxtAEnS2melTWXKGF6WK/OqVaH0+Cox0SNagA81dvvSbGlFYCxncYfQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/architect": "0.2003.32",
        "@angular-devkit/core": "20.3.32",
        "@angular-devkit/schematics": "20.3.32",
        "@inquirer/prompts": "7.8.2",
        "@listr2/prompt-adapter-inquirer": "3.0.1",
        "@modelcontextprotocol/sdk": "1.26.0",
        "@schematics/angular": "20.3.32",
        "@yarnpkg/lockfile": "1.1.0",
        "algoliasearch": "5.35.0",
        "ini": "5.0.0",
        "jsonc-parser": "3.3.1",
        "listr2": "9.0.1",
        "npm-package-arg": "13.0.0",
        "pacote": "21.5.1",
        "resolve": "1.22.10",
        "semver": "7.7.2",
        "yargs": "18.0.0",
        "zod": "4.1.13"
      },
      "bin": {
        "ng": "bin/ng.js"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular/common": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/common/-/common-20.3.26.tgz",
      "integrity": "sha512-35+aHaCmldFZ2qFiH83+cHcDXwUqSEuUR5DVApcd+Ku8PfIIGo8uMiD5++Qq7QIUTbZCD2glAiE9jLroGrf1Cw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/core": "20.3.26",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@angular/compiler": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/compiler/-/compiler-20.3.26.tgz",
      "integrity": "sha512-H4DVTBCiyM4dGytFi2C8sMGflxXzPnoQ6Ajfs4hJ/Dekg6ypfvW5Ze7BDh4TaMQvaX2joM5LhBYW5jTxBx66hA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      }
    },
    "node_modules/@angular/compiler-cli": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/compiler-cli/-/compiler-cli-20.3.26.tgz",
      "integrity": "sha512-3rHtC87ecldvaiFHwQEZ6Wx3QaZ/Q7b0Gb7XORDOjn/M+5CYZ4rQsvbxE5TUjwreg07oQ4Y2h8ADESXTJEUYOQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/core": "7.29.7",
        "@jridgewell/sourcemap-codec": "^1.4.14",
        "chokidar": "^4.0.0",
        "convert-source-map": "^1.5.1",
        "reflect-metadata": "^0.2.0",
        "semver": "^7.0.0",
        "tslib": "^2.3.0",
        "yargs": "^18.0.0"
      },
      "bin": {
        "ng-xi18n": "bundles/src/bin/ng_xi18n.js",
        "ngc": "bundles/src/bin/ngc.js"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/compiler": "20.3.26",
        "typescript": ">=5.8 <6.0"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/core": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/core/-/core-20.3.26.tgz",
      "integrity": "sha512-v+YtZ9eQVDb6v3V1TbUUBHU63FEp8Hqqqb3UhM4MLAOm0chyyh9jah7FiHr3HbCKrV1f4long1coftFK/KThog==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/compiler": "20.3.26",
        "rxjs": "^6.5.3 || ^7.4.0",
        "zone.js": "~0.15.0"
      },
      "peerDependenciesMeta": {
        "@angular/compiler": {
          "optional": true
        },
        "zone.js": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/forms": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/forms/-/forms-20.3.26.tgz",
      "integrity": "sha512-ia0YaPVjlG2oBFKCfaAgqQ0jGRrhGTAcrbZG3tVeFDpi7LQ6WdP3Syw2H+0D3GPyzpl/5UqU10Fum5Wr1br4QQ==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/common": "20.3.26",
        "@angular/core": "20.3.26",
        "@angular/platform-browser": "20.3.26",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@angular/platform-browser": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/platform-browser/-/platform-browser-20.3.26.tgz",
      "integrity": "sha512-In4wUiLUUT9LqyV9Rjz78k/dsnKAwec4AtDmwZoX8/ZmeJOSH7g5X1gTM+hxTxmifmZkrapQjXR299IcfIkzrw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/animations": "20.3.26",
        "@angular/common": "20.3.26",
        "@angular/core": "20.3.26"
      },
      "peerDependenciesMeta": {
        "@angular/animations": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/router": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/router/-/router-20.3.26.tgz",
      "integrity": "sha512-q0k0b5uuQx93Trk4qEMYe8LoPOozheRBIjze51q+LUTlLXWik4W0ughXLiTJL346KRudR/vB5ksfZP8b6WlQyA==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/common": "20.3.26",
        "@angular/core": "20.3.26",
        "@angular/platform-browser": "20.3.26",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@angular/service-worker": {
      "version": "20.3.26",
      "resolved": "https://registry.npmjs.org/@angular/service-worker/-/service-worker-20.3.26.tgz",
      "integrity": "sha512-Lham5sD4yc6lDUgxyRm3i7zo9fjla4HfQAo3uoU4cA4iJ9pRmtTxWPJUA4/YFOD+pCDT7ffV4X9VfGmwvThwyw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "bin": {
        "ngsw-config": "ngsw-config.js"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
      },
      "peerDependencies": {
        "@angular/core": "20.3.26",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@babel/core/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.7.tgz",
      "integrity": "sha512-DkXD5OJQaAQIdZ1bt3UZdEnHAn9Imd3IVBdX03UFe+ony9Ojw5pzr9YVKGDY1jt+Gcn/FnGkNf8r+Vj5NOJWtQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-annotate-as-pure": {
      "version": "7.27.3",
      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.27.3.tgz",
      "integrity": "sha512-fXSwMQqitTGeHLBC08Eq5yXz2m37E4pJX1qAU1+2cNedz/ifv/bVXft90VeSav5nFO61EcNgwr0aJxbyPaWBPg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.27.3"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-split-export-declaration": {
      "version": "7.24.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-split-export-declaration/-/helper-split-export-declaration-7.24.7.tgz",
      "integrity": "sha512-oy5V7pD+UvfkEATUKvIjvIAH/xCzfsFVw7ygW2SI6NClZzquT+mwdTfgfdbUiceh6iQO0CHtCPsyze/MZ2YbAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.24.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.7.tgz",
      "integrity": "sha512-hnORnjP/1P/zFEndoeX+n+t1RwWRJiJpM/jO7FW32Kn9r5+sJB2JWOdYo4L6k78j15eCwY3Gm/7364B1EMwtNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.7"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.7.tgz",
      "integrity": "sha512-EhlfNQtZ+NK22w5BM61ciuiq1m58ed33Wr1Xan//ZRTy6hgjnwyCffRYwzsGXdASJSUJ1guZILsErh1eQcl+zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.7.tgz",
      "integrity": "sha512-4zBIxpPzowiZpusoFkyGVwakdRJUyuH5PxQ/PrqghfdFWWasvnCdPfQXHrenDai+gyLARulZjZowCOj6fjT4pA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@borewit/text-codec": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/@borewit/text-codec/-/text-codec-0.2.2.tgz",
      "integrity": "sha512-DDaRehssg1aNrH4+2hnj1B7vnUGEjU6OIlyRdkMd0aUdIUvKXrJfXsy8LVtXAy7DRvYVluWbMspsRhz2lcW0mQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/@colors/colors": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/@colors/colors/-/colors-1.5.0.tgz",
      "integrity": "sha512-ooWCrlZP11i8GImSjTHYHLkvFDP48nS4+204nGb1RiX/WXYHmJA2III9/e2DWVabCESdW7hBAEzHRqUn9OUVvQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.1.90"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.1.tgz",
      "integrity": "sha512-Svl7tq8k/08+p6CXPpRjQ1fKX+1odH/BQbb48fV6fj3CWHhsoIOoY87w1oHXm0qEpkIK3ZfVgp0hed3XBXzXMQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.1.tgz",
      "integrity": "sha512-0k2F129Xdio1TdJfzJ8sy1Q47vUD2NnwdhiAf7drUN1EBTfPf4hsFCtmMgu/6m8JSzsBrlmVjudMBQqOfG8usQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.1.tgz",
      "integrity": "sha512-34EGEbCIAgosYz6goLcopX6Mo7NyGv9tfwEM2/7Ce2VcVRk568iSvniGWcUXIy7wEDR1wzolcxcriFVrWYcwBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.1.tgz",
      "integrity": "sha512-dbwY7ltSMDWsRatcRpCnES4F+im88OCUgGZjy52shC7GqHRE/cYlxNbB4Z4UpJswpcc4Qxd2oE/ufM0p61IKng==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.1.tgz",
      "integrity": "sha512-TZbWkQY7kvTAXbXUT7uVACR5cMHsDiSz9z7ZKAX/RTq/WJEk3QyRr0wZpNhBDX+/0CtdqUIJlOiodQcta6tY3Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.1.tgz",
      "integrity": "sha512-zfdzgK9ACBNZLI/CyHTOx81SyNbM6YXn7rxSgX97VjyiPl9W1i4Ka4fgKECEoFCKGpvBj5qArWIGgQjOwkgskQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.1.tgz",
      "integrity": "sha512-wG2EA8ENdEI0qhkSZMjfqrdY+ziCYCPMmtZjjIwOmXFjmyzEHn+UUxk5of+SYsjtfs3VpnlC7QLzSI5hY/rOAw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.1.tgz",
      "integrity": "sha512-i7dZ9vQgnvSCzi/rYCXNgtF/U+eKZNJBzu3eTQbRgHnM7tNSizLOkRFAl3qzVc/Op/u5YkHHa4pf/3DOYHthLQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.1.tgz",
      "integrity": "sha512-qVXBOHQS+d5Y722GwJzJUtOLlX7km3CraOaGormF1pDtPd2C/l1SHRPgjLunLGe51Sh5YYWKMFDyV4SxgMQYTQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.1.tgz",
      "integrity": "sha512-yHs+0uc8+nvEAfAfxrWQKK5peSNzBc4PegcMO0EJ2hT71uA7vB8Ihg2e77R2P7SG5uYjPbHlLLmve4LLLRCf0g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.1.tgz",
      "integrity": "sha512-d1z4ZuP0ajrfz/FhGT4vv278rX8KnPPJx8i5+AtK7TYbx9Le9F1hyzurZpkEyjkGa9dUGhQow4C1NmeGvqxN2w==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.1.tgz",
      "integrity": "sha512-M5sRjUVZrkm1OAPR3dlOYzNmN+loZKGVi1VUQGrwuqLcbR6qeAz+famMhjASeH3YVKvZz+zT1jlh/keC3Rj/lg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.1.tgz",
      "integrity": "sha512-mRObBZeHh2OxcBFPWE/FjylkRgZdYuiTR3vaTozquCGOH14iP9oN4x4Ge81CoIDYQrXmIxpFumJBu5MtZpnQJQ==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.1.tgz",
      "integrity": "sha512-slScBsMAb3GFDcdrCgLwZtPYRoH2H/youv10QiZyRjmsP48fznoveWytSgCI/R0ZcUgpc0ZhIUEx6LHts8yrfQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.1.tgz",
      "integrity": "sha512-kw0owk1o0GFETUJyW0jc0G4Yzs0BHZn0JDZ8JRT088vjJYX777BAs1fDGxAC+q831qOs2DTC96mNsG2opdfyyQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.1.tgz",
      "integrity": "sha512-/lAIjX8aYFRByhh6L5rYtPEDRqa9de/4V/juOXcta5frjvzXO4/sqEtyytse0g3zZFuWu5cDN0MkLz2qRDD2Ag==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.1.tgz",
      "integrity": "sha512-u/anNYF2mmVOEDwLtnQ1wOr3EZ9sTNGLWrsYGYwHWzGA3Si84IOkHXlbWTD1NB+9/1lcnweYKO54uhxZydNzfA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.1.tgz",
      "integrity": "sha512-oks0DYbLwWMmaakTsCb+zL4E+aHRVLom9IJZOAthMQEPiQmydXHkziYEsGYRx0uNV/IjEKGAV941JzH02pflqw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.1.tgz",
      "integrity": "sha512-aeL6lAnN89Hz43Mlh1G8ARasbuoYvSITDEx0tHh5b7jJnHcssqgjy9Yx430GDpmCa6OyrKoS0aNRjKundRizGg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.1.tgz",
      "integrity": "sha512-MEFJe5C3R8pwXdZ5Y21oo6m7ePiS0d9pWucn99O/wvyJZChoIQKrQDxKrGeW8F5+T0okTHesAmDeiHDTIq0V/Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.1.tgz",
      "integrity": "sha512-i/ZLIOafE0Z8cI/XANJAixoJL/uRAoS2xOA3rb0xN+KK0K177cMAsQYkzHtBrtMXAKuAc7HGgcWiZ/sRC1Nxgw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.1.tgz",
      "integrity": "sha512-ge+Z7EXFNt2BO1oAMsVpiQ8EwndV9i1xXerAeTIK7AtPs3bKFXQM7nlRxDSIUIMeueR1CNXxqztLzdNeReKBJg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.1.tgz",
      "integrity": "sha512-BEjgtECkL3vY+SaSQ6nzVfiALUeFxpawyp8Jmf5PtYhf1Ug40N1h/hxlhts+f1FvSvarEigdxS3BlSMI2PJLcQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.1.tgz",
      "integrity": "sha512-lCv9eK/H6ZJWbE7bh2nw54CZ9M2nupBxJcTsdk/QQnWkdSjKGuxmmH8/GWrlT1eMmZfn4dGcCjRte397WqfQXA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.1.tgz",
      "integrity": "sha512-zvb/mB2bSCoJOpoCBgYKKpX6YM6mJBlBUVUtVj41DlZJVEB6/0CKlRYxP5wWl1C1ILiCoAU5wZZ4q1P3qeS6Eg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.1.tgz",
      "integrity": "sha512-bm4Mowrv+GXMlpWX++EcXw/iLyd1o3+bJkC2DkWXYVvgZCqD/bSj9ctZeAMC3cIxgjRVR2Dufaiu4YPxr5gW1A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@gar/promise-retry": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@gar/promise-retry/-/promise-retry-1.0.3.tgz",
      "integrity": "sha512-GmzA9ckNokPypTg10pgpeHNQe7ph+iIKKmhKu3Ob9ANkswreCx7R3cKmY781K8QK3AqVL3xVh9A42JvIAbkkSA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@hono/node-server": {
      "version": "1.19.17",
      "resolved": "https://registry.npmjs.org/@hono/node-server/-/node-server-1.19.17.tgz",
      "integrity": "sha512-dSneS5qhiauZWGDCeK4o695Xd9nUNjviSZCMQrj10eetr8Uln1ucn6bbphOM6UynAMMtNIzZNSpL9vnASJwrPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.14.1"
      },
      "peerDependencies": {
        "hono": "^4"
      }
    },
    "node_modules/@inquirer/ansi": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/@inquirer/ansi/-/ansi-1.0.2.tgz",
      "integrity": "sha512-S8qNSZiYzFd0wAcyG5AXCvUHC5Sr7xpZ9wZ2py9XR88jUz8wooStVx5M6dRzczbBWjic9NP7+rY0Xi7qqK/aMQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@inquirer/checkbox": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/@inquirer/checkbox/-/checkbox-4.3.2.tgz",
      "integrity": "sha512-VXukHf0RR1doGe6Sm4F0Em7SWYLTHSsbGfJdS9Ja2bX5/D5uwVOEjr07cncLROdBvmnvCATYEWlHqYmXv2IlQA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^1.0.2",
        "@inquirer/core": "^10.3.2",
        "@inquirer/figures": "^1.0.15",
        "@inquirer/type": "^3.0.10",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/confirm": {
      "version": "5.1.14",
      "resolved": "https://registry.npmjs.org/@inquirer/confirm/-/confirm-5.1.14.tgz",
      "integrity": "sha512-5yR4IBfe0kXe59r1YCTG8WXkUbl7Z35HK87Sw+WUyGD8wNUx7JvY7laahzeytyE1oLn74bQnL7hstctQxisQ8Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.1.15",
        "@inquirer/type": "^3.0.8"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/core": {
      "version": "10.3.2",
      "resolved": "https://registry.npmjs.org/@inquirer/core/-/core-10.3.2.tgz",
      "integrity": "sha512-43RTuEbfP8MbKzedNqBrlhhNKVwoK//vUFNW3Q3vZ88BLcrs4kYpGg+B2mm5p2K/HfygoCxuKwJJiv8PbGmE0A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^1.0.2",
        "@inquirer/figures": "^1.0.15",
        "@inquirer/type": "^3.0.10",
        "cli-width": "^4.1.0",
        "mute-stream": "^2.0.0",
        "signal-exit": "^4.1.0",
        "wrap-ansi": "^6.2.0",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/editor": {
      "version": "4.2.23",
      "resolved": "https://registry.npmjs.org/@inquirer/editor/-/editor-4.2.23.tgz",
      "integrity": "sha512-aLSROkEwirotxZ1pBaP8tugXRFCxW94gwrQLxXfrZsKkfjOYC1aRvAZuhpJOb5cu4IBTJdsCigUlf2iCOu4ZDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/external-editor": "^1.0.3",
        "@inquirer/type": "^3.0.10"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/expand": {
      "version": "4.0.23",
      "resolved": "https://registry.npmjs.org/@inquirer/expand/-/expand-4.0.23.tgz",
      "integrity": "sha512-nRzdOyFYnpeYTTR2qFwEVmIWypzdAx/sIkCMeTNTcflFOovfqUk+HcFhQQVBftAh9gmGrpFj6QcGEqrDMDOiew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/type": "^3.0.10",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/external-editor": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@inquirer/external-editor/-/external-editor-1.0.3.tgz",
      "integrity": "sha512-RWbSrDiYmO4LbejWY7ttpxczuwQyZLBUyygsA9Nsv95hpzUWwnNTVQmAq3xuh7vNwCp07UTmE5i11XAEExx4RA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chardet": "^2.1.1",
        "iconv-lite": "^0.7.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/figures": {
      "version": "1.0.15",
      "resolved": "https://registry.npmjs.org/@inquirer/figures/-/figures-1.0.15.tgz",
      "integrity": "sha512-t2IEY+unGHOzAaVM5Xx6DEWKeXlDDcNPeDyUpsRc6CUhBfU3VQOEl+Vssh7VNp1dR8MdUJBWhuObjXCsVpjN5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@inquirer/input": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/@inquirer/input/-/input-4.3.1.tgz",
      "integrity": "sha512-kN0pAM4yPrLjJ1XJBjDxyfDduXOuQHrBB8aLDMueuwUGn+vNpF7Gq7TvyVxx8u4SHlFFj4trmj+a2cbpG4Jn1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/type": "^3.0.10"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/number": {
      "version": "3.0.23",
      "resolved": "https://registry.npmjs.org/@inquirer/number/-/number-3.0.23.tgz",
      "integrity": "sha512-5Smv0OK7K0KUzUfYUXDXQc9jrf8OHo4ktlEayFlelCjwMXz0299Y8OrI+lj7i4gCBY15UObk76q0QtxjzFcFcg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/type": "^3.0.10"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/password": {
      "version": "4.0.23",
      "resolved": "https://registry.npmjs.org/@inquirer/password/-/password-4.0.23.tgz",
      "integrity": "sha512-zREJHjhT5vJBMZX/IUbyI9zVtVfOLiTO66MrF/3GFZYZ7T4YILW5MSkEYHceSii/KtRk+4i3RE7E1CUXA2jHcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^1.0.2",
        "@inquirer/core": "^10.3.2",
        "@inquirer/type": "^3.0.10"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/prompts": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/@inquirer/prompts/-/prompts-7.8.2.tgz",
      "integrity": "sha512-nqhDw2ZcAUrKNPwhjinJny903bRhI0rQhiDz1LksjeRxqa36i3l75+4iXbOy0rlDpLJGxqtgoPavQjmmyS5UJw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@inquirer/checkbox": "^4.2.1",
        "@inquirer/confirm": "^5.1.14",
        "@inquirer/editor": "^4.2.17",
        "@inquirer/expand": "^4.0.17",
        "@inquirer/input": "^4.2.1",
        "@inquirer/number": "^3.0.17",
        "@inquirer/password": "^4.0.17",
        "@inquirer/rawlist": "^4.1.5",
        "@inquirer/search": "^3.1.0",
        "@inquirer/select": "^4.3.1"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/rawlist": {
      "version": "4.1.11",
      "resolved": "https://registry.npmjs.org/@inquirer/rawlist/-/rawlist-4.1.11.tgz",
      "integrity": "sha512-+LLQB8XGr3I5LZN/GuAHo+GpDJegQwuPARLChlMICNdwW7OwV2izlCSCxN6cqpL0sMXmbKbFcItJgdQq5EBXTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/type": "^3.0.10",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/search": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/@inquirer/search/-/search-3.2.2.tgz",
      "integrity": "sha512-p2bvRfENXCZdWF/U2BXvnSI9h+tuA8iNqtUKb9UWbmLYCRQxd8WkvwWvYn+3NgYaNwdUkHytJMGG4MMLucI1kA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^10.3.2",
        "@inquirer/figures": "^1.0.15",
        "@inquirer/type": "^3.0.10",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/select": {
      "version": "4.4.2",
      "resolved": "https://registry.npmjs.org/@inquirer/select/-/select-4.4.2.tgz",
      "integrity": "sha512-l4xMuJo55MAe+N7Qr4rX90vypFwCajSakx59qe/tMaC1aEHWLyw68wF4o0A4SLAY4E0nd+Vt+EyskeDIqu1M6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^1.0.2",
        "@inquirer/core": "^10.3.2",
        "@inquirer/figures": "^1.0.15",
        "@inquirer/type": "^3.0.10",
        "yoctocolors-cjs": "^2.1.3"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/type": {
      "version": "3.0.10",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-3.0.10.tgz",
      "integrity": "sha512-BvziSRxfz5Ov8ch0z/n3oijRSEcEsHnhggm4xFZe93DHcUCTlutlq9Ox4SVENAfcRD22UQq7T/atg9Wr3k09eA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@isaacs/fs-minipass": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/@isaacs/fs-minipass/-/fs-minipass-4.0.1.tgz",
      "integrity": "sha512-wgm9Ehl2jpeqP3zw/7mo3kRHFp5MEDhqAdwy1fTGkHAwnkGOVsgpvQhL8B5n1qlb01jV3n/bI0ZfZp5lWA1k4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.4"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@istanbuljs/schema": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/@istanbuljs/schema/-/schema-0.1.6.tgz",
      "integrity": "sha512-+Sg6GCR/wy1oSmQDFq4LQDAhm3ETKnorxN+y5nbLULOR3P0c14f2Wurzj3/xqPXtasLFfHd5iRFQ7AJt4KH2cw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/@jimp/core": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/core/-/core-1.6.1.tgz",
      "integrity": "sha512-+BoKC5G6hkrSy501zcJ2EpfnllP+avPevcBfRcZe/CW+EwEfY6X1EZ8QWyT7NpDIvEEJb1fdJnMMfUnFkxmw9A==",
      "license": "MIT",
      "dependencies": {
        "@jimp/file-ops": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "await-to-js": "^3.0.0",
        "exif-parser": "^0.1.12",
        "file-type": "^21.3.3",
        "mime": "3"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/core/node_modules/mime": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-3.0.0.tgz",
      "integrity": "sha512-jSCU7/VB1loIWBZe14aEYHU/+1UMEHoaO7qxCOVJOw9GgH72VAWppxNcjU+x9a2k3GSIBXNKxXQFqRvvZ7vr3A==",
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/@jimp/diff": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/diff/-/diff-1.6.1.tgz",
      "integrity": "sha512-YkKDPdHjLgo1Api3+Bhc0GLAygldlpt97NfOKoNg1U6IUNXA6X2MgosCjPfSBiSvJvrrz1fsIR+/4cfYXBI/HQ==",
      "license": "MIT",
      "dependencies": {
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "pixelmatch": "^5.3.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/file-ops": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/file-ops/-/file-ops-1.6.1.tgz",
      "integrity": "sha512-T+gX6osHjprbDRad0/B71Evyre7ZdVY1z/gFGEG9Z8KOtZPKboWvPeP2UjbZYWQLy9UKCPQX1FNAnDiOPkJL7w==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/js-bmp": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/js-bmp/-/js-bmp-1.6.1.tgz",
      "integrity": "sha512-xzWzNT4/u5zGrTT3Tme9sGU7YzIKxi13+BCQwLqACbt5DXf9SAfdzRkopZQnmDko+6In5nqaT89Gjs43/WdnYQ==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "bmp-ts": "^1.0.9"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/js-gif": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/js-gif/-/js-gif-1.6.1.tgz",
      "integrity": "sha512-YjY2W26rQa05XhanYhRZ7dingCiNN+T2Ymb1JiigIbABY0B28wHE3v3Cf1/HZPWGu0hOg36ylaKgV5KxF2M58w==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "gifwrap": "^0.10.1",
        "omggif": "^1.0.10"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/js-jpeg": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/js-jpeg/-/js-jpeg-1.6.1.tgz",
      "integrity": "sha512-HT9H3yOmlOFzYmdI15IYdfy6ggQhSRIaHeA+OTJSEORXBqEo97sUZu/DsgHIcX5NJ7TkJBTgZ9BZXsV6UbsyMg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "jpeg-js": "^0.4.4"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/js-png": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/js-png/-/js-png-1.6.1.tgz",
      "integrity": "sha512-SZ/KVhI5UjcSzzlXsXdIi/LhJ7UShf2NkMOtVrbZQcGzsqNtynAelrOXeoTxcanfVqmNhAoVHg8yR2cYoqrYjA==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "pngjs": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/js-tiff": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/js-tiff/-/js-tiff-1.6.1.tgz",
      "integrity": "sha512-jDG/eJquID1M4MBlKMmDRBmz2TpXMv7TUyu2nIRUxhlUc2ogC82T+VQUkca9GJH1BBJ9dx5sSE5dGkWNjIbZxw==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "utif2": "^4.1.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-blit": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-blit/-/plugin-blit-1.6.1.tgz",
      "integrity": "sha512-MwnI7C7K81uWddY9FLw1fCOIy6SsPIUftUz36Spt7jisCn8/40DhQMlSxpxTNelnZb/2SnloFimQfRZAmHLOqQ==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-blit/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-blur": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-blur/-/plugin-blur-1.6.1.tgz",
      "integrity": "sha512-lIo7Tzp5jQu30EFFSK/phXANK3citKVEjepDjQ6ljHoIFtuMRrnybnmI2Md24ulvWlDaz+hh3n6qrMb8ydwhZQ==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/utils": "1.6.1"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-circle": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-circle/-/plugin-circle-1.6.1.tgz",
      "integrity": "sha512-kK1PavY6cKHNNKce37vdV4Tmpc1/zDKngGoeOV3j+EMatoHFZUinV3s6F9aWryPs3A0xhCLZgdJ6Zeea1d5LCQ==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-circle/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-color": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-color/-/plugin-color-1.6.1.tgz",
      "integrity": "sha512-LtUN1vAP+LRlZAtTNVhDRSiXx+26Kbz3zJaG6a5k59gQ95jgT5mknnF8lxkHcqJthM4MEk3/tPxkdJpEybyF/A==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "tinycolor2": "^1.6.0",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-color/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-contain": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-contain/-/plugin-contain-1.6.1.tgz",
      "integrity": "sha512-m0qhrfA8jkTqretGv4w+T/ADFR4GwBpE0sCOC2uJ0dzr44/ddOMsIdrpi89kabqYiPYIrxkgdCVCLm3zn1Vkkg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/plugin-blit": "1.6.1",
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-contain/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-cover": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-cover/-/plugin-cover-1.6.1.tgz",
      "integrity": "sha512-hZytnsth0zoll6cPf434BrT+p/v569Wr5tyO6Dp0dH1IDPhzhB5F38sZGMLDo7bzQiN9JFVB3fxkcJ/WYCJ3Mg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/plugin-crop": "1.6.1",
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/types": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-cover/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-crop": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-crop/-/plugin-crop-1.6.1.tgz",
      "integrity": "sha512-EerRSLlclXyKDnYc/H9w/1amZW7b7v3OGi/VlerPd2M/pAu5X8TkyYWtfqYCXnNp1Ixtd8oCo9zGfY9zoXT4rg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-crop/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-displace": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-displace/-/plugin-displace-1.6.1.tgz",
      "integrity": "sha512-K07QVl7xQwIfD6KfxRV/c3E9e7ZBXxUXdWuvoTWcKHL2qV48MOF5Nqbz/aJW4ThnQARIsxvYlZjPFiqkCjlU+g==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-displace/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-dither": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-dither/-/plugin-dither-1.6.1.tgz",
      "integrity": "sha512-+2V+GCV2WycMoX1/z977TkZ8Zq/4MVSKElHYatgUqtwXMi2fDK2gKYU2g9V39IqFvTJsTIsK0+58VFz/ROBVew==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-fisheye": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-fisheye/-/plugin-fisheye-1.6.1.tgz",
      "integrity": "sha512-XtS5ZyoZ0vxZxJ6gkqI63SivhtI58vX95foMPM+cyzYkRsJXMOYCr8DScxF5bp4Xr003NjYm/P+7+08tibwzHA==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-fisheye/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-flip": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-flip/-/plugin-flip-1.6.1.tgz",
      "integrity": "sha512-ws38W/sGj7LobNRayQ83garxiktOyWxM5vO/y4a/2cy9v65SLEUzVkrj+oeAaUSSObdz4HcCEla7XtGlnAGAaA==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-flip/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-hash": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-hash/-/plugin-hash-1.6.1.tgz",
      "integrity": "sha512-sZt6ZcMX6i8vFWb4GYnw0pR/o9++ef0dTVcboTB5B/g7nrxCODIB4wfEkJ/YqZM5wUvol77K1qeS0/rVO6z21A==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/js-bmp": "1.6.1",
        "@jimp/js-jpeg": "1.6.1",
        "@jimp/js-png": "1.6.1",
        "@jimp/js-tiff": "1.6.1",
        "@jimp/plugin-color": "1.6.1",
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "any-base": "^1.1.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-mask": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-mask/-/plugin-mask-1.6.1.tgz",
      "integrity": "sha512-SIG0/FcmEj3tkwFxc7fAGLO8o4uNzMpSOdQOhbCgxefQKq5wOVMk9BQx/sdMPBwtMLr9WLq0GzLA/rk6t2v20A==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-mask/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-print": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-print/-/plugin-print-1.6.1.tgz",
      "integrity": "sha512-BYVz/X3Xzv8XYilVeDy11NOp0h7BTDjlOtu0BekIFHP1yHVd24AXNzbOy52XlzYZWQ0Dl36HOHEpl/nSNrzc6w==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/js-jpeg": "1.6.1",
        "@jimp/js-png": "1.6.1",
        "@jimp/plugin-blit": "1.6.1",
        "@jimp/types": "1.6.1",
        "parse-bmfont-ascii": "^1.0.6",
        "parse-bmfont-binary": "^1.0.6",
        "parse-bmfont-xml": "^1.1.6",
        "simple-xml-to-json": "^1.2.2",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-print/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-quantize": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-quantize/-/plugin-quantize-1.6.1.tgz",
      "integrity": "sha512-J2En9PLURfP+vwYDtuZ9T8yBW6BWYZBScydAjRiPBmJfEhTcNQqiiQODrZf7EqbbX/Sy5H6dAeRiqkgoV9N6Ww==",
      "license": "MIT",
      "dependencies": {
        "image-q": "^4.0.0",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-quantize/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-resize": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-resize/-/plugin-resize-1.6.1.tgz",
      "integrity": "sha512-CLkrtJoIz2HdWnpYiN6p8KYcPc00rCH/SUu6o+lfZL05Q4uhecJlnvXuj9x+U6mDn3ldPmJj6aZqMHuUJzdVqg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/types": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-resize/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-rotate": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-rotate/-/plugin-rotate-1.6.1.tgz",
      "integrity": "sha512-nOjVjbbj705B02ksysKnh0POAwEBXZtJ9zQ5qC+X7Tavl3JNn+P3BzQovbBxLPSbUSld6XID9z5ijin4PtOAUg==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/plugin-crop": "1.6.1",
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-rotate/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/plugin-threshold": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/plugin-threshold/-/plugin-threshold-1.6.1.tgz",
      "integrity": "sha512-JOKv9F8s6tnVLf4sB/2fF0F339EFnHvgEdFYugO6VhowKLsap0pEZmLyE/DlRnYtIj2RddHZVxVMp/eKJ04l2Q==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/plugin-color": "1.6.1",
        "@jimp/plugin-hash": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1",
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/plugin-threshold/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/types": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/types/-/types-1.6.1.tgz",
      "integrity": "sha512-leI7YbveTNi565m910XgIOwXyuu074H5qazAD1357HImJSv2hqxnWXpwxQbadGWZ7goZRYBDZy5lpqud0p7q5w==",
      "license": "MIT",
      "dependencies": {
        "zod": "^3.23.8"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jimp/types/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/@jimp/utils": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@jimp/utils/-/utils-1.6.1.tgz",
      "integrity": "sha512-veFPRd93FCnS7AgmCkPgARVGoDRrJ9cm1ujuNyA+UfQ5VKbED2002sm5XfFLFwTsKC8j04heTrwe+tU1dluXOw==",
      "license": "MIT",
      "dependencies": {
        "@jimp/types": "1.6.1",
        "tinycolor2": "^1.6.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@listr2/prompt-adapter-inquirer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@listr2/prompt-adapter-inquirer/-/prompt-adapter-inquirer-3.0.1.tgz",
      "integrity": "sha512-3XFmGwm3u6ioREG+ynAQB7FoxfajgQnMhIu8wC5eo/Lsih4aKDg0VuIMGaOsYn7hJSJagSeaD4K8yfpkEoDEmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/type": "^3.0.7"
      },
      "engines": {
        "node": ">=20.0.0"
      },
      "peerDependencies": {
        "@inquirer/prompts": ">= 3 < 8",
        "listr2": "9.0.1"
      }
    },
    "node_modules/@lmdb/lmdb-darwin-arm64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-darwin-arm64/-/lmdb-darwin-arm64-3.4.2.tgz",
      "integrity": "sha512-NK80WwDoODyPaSazKbzd3NEJ3ygePrkERilZshxBViBARNz21rmediktGHExoj9n5t9+ChlgLlxecdFKLCuCKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@lmdb/lmdb-darwin-x64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-darwin-x64/-/lmdb-darwin-x64-3.4.2.tgz",
      "integrity": "sha512-zevaowQNmrp3U7Fz1s9pls5aIgpKRsKb3dZWDINtLiozh3jZI9fBrI19lYYBxqdyiIyNdlyiidPnwPShj4aK+w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-arm": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-arm/-/lmdb-linux-arm-3.4.2.tgz",
      "integrity": "sha512-OmHCULY17rkx/RoCoXlzU7LyR8xqrksgdYWwtYa14l/sseezZ8seKWXcogHcjulBddER5NnEFV4L/Jtr2nyxeg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-arm64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-arm64/-/lmdb-linux-arm64-3.4.2.tgz",
      "integrity": "sha512-ZBEfbNZdkneebvZs98Lq30jMY8V9IJzckVeigGivV7nTHJc+89Ctomp1kAIWKlwIG0ovCDrFI448GzFPORANYg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-x64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-x64/-/lmdb-linux-x64-3.4.2.tgz",
      "integrity": "sha512-vL9nM17C77lohPYE4YaAQvfZCSVJSryE4fXdi8M7uWPBnU+9DJabgKVAeyDb84ZM2vcFseoBE4/AagVtJeRE7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-win32-arm64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-win32-arm64/-/lmdb-win32-arm64-3.4.2.tgz",
      "integrity": "sha512-SXWjdBfNDze4ZPeLtYIzsIeDJDJ/SdsA0pEXcUBayUIMO0FQBHfVZZyHXQjjHr4cvOAzANBgIiqaXRwfMhzmLw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@lmdb/lmdb-win32-x64": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-win32-x64/-/lmdb-win32-x64-3.4.2.tgz",
      "integrity": "sha512-IY+r3bxKW6Q6sIPiMC0L533DEfRJSXibjSI3Ft/w9Q8KQBNqEIvUFXt+09wV8S5BRk0a8uSF19YWxuRwEfI90g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@microsoft/signalr": {
      "version": "10.0.0",
      "resolved": "https://registry.npmjs.org/@microsoft/signalr/-/signalr-10.0.0.tgz",
      "integrity": "sha512-0BRqz/uCx3JdrOqiqgFhih/+hfTERaUfCZXFB52uMaZJrKaPRzHzMuqVsJC/V3pt7NozcNXGspjKiQEK+X7P2w==",
      "license": "MIT",
      "dependencies": {
        "abort-controller": "^3.0.0",
        "eventsource": "^2.0.2",
        "fetch-cookie": "^2.0.3",
        "node-fetch": "^2.6.7",
        "ws": "^7.5.10"
      }
    },
    "node_modules/@microsoft/signalr/node_modules/eventsource": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-2.0.2.tgz",
      "integrity": "sha512-IzUmBGPR3+oUG9dUeXynyNmf91/3zUSJg1lCktzKw47OXuhco54U3r9B7O4XX+Rb1Itm9OZ2b0RkTs10bICOxA==",
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/@microsoft/signalr/node_modules/ws": {
      "version": "7.5.13",
      "resolved": "https://registry.npmjs.org/ws/-/ws-7.5.13.tgz",
      "integrity": "sha512-rsKI6xDBFVf4r/x8XyChGK04QR/XHroxs/jUcoWvtEZM8TPU/X/uIY9B1CsSzYws9ZJb/6bbBu7dPhFW00CAoA==",
      "license": "MIT",
      "engines": {
        "node": ">=8.3.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": "^5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/@modelcontextprotocol/sdk": {
      "version": "1.26.0",
      "resolved": "https://registry.npmjs.org/@modelcontextprotocol/sdk/-/sdk-1.26.0.tgz",
      "integrity": "sha512-Y5RmPncpiDtTXDbLKswIJzTqu2hyBKxTNsgKqKclDbhIgg1wgtf1fRuvxgTnRfcnxtvvgbIEcqUOzZrJ6iSReg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@hono/node-server": "^1.19.9",
        "ajv": "^8.17.1",
        "ajv-formats": "^3.0.1",
        "content-type": "^1.0.5",
        "cors": "^2.8.5",
        "cross-spawn": "^7.0.5",
        "eventsource": "^3.0.2",
        "eventsource-parser": "^3.0.0",
        "express": "^5.2.1",
        "express-rate-limit": "^8.2.1",
        "hono": "^4.11.4",
        "jose": "^6.1.3",
        "json-schema-typed": "^8.0.2",
        "pkce-challenge": "^5.0.0",
        "raw-body": "^3.0.0",
        "zod": "^3.25 || ^4.0",
        "zod-to-json-schema": "^3.25.1"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@cfworker/json-schema": "^4.1.1",
        "zod": "^3.25 || ^4.0"
      },
      "peerDependenciesMeta": {
        "@cfworker/json-schema": {
          "optional": true
        },
        "zod": {
          "optional": false
        }
      }
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-darwin-arm64": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-darwin-arm64/-/msgpackr-extract-darwin-arm64-3.0.4.tgz",
      "integrity": "sha512-LCkGo6JDfaBhgST7UpPWgNgLINpcpabaHfyz5OBx75nUYxBsaEPxjnyNjWpeb/xBup/682QnBfRBy2/LvPutZQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-darwin-x64": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-darwin-x64/-/msgpackr-extract-darwin-x64-3.0.4.tgz",
      "integrity": "sha512-zExlW9zUJKZH/tOtVMttwjKa4Xm/3KcNjnE3dPN92uCktwavMxpgCA3MoJK/DOnTWsQgo224OaST27/mPNAf+w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-arm": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-arm/-/msgpackr-extract-linux-arm-3.0.4.tgz",
      "integrity": "sha512-Tg3yX65f5GbtXLkrYEHE5oibZG9epyYWas7FogTTEJeDEF9JlXJzKgXaNhT3UXlTOeA+AfZpYZYZ0uPj7Cfquw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-arm64": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-arm64/-/msgpackr-extract-linux-arm64-3.0.4.tgz",
      "integrity": "sha512-dgX0P/9wGPJeHFBG+ZmhgE6bmtMt7NP5CRBGyyktpopdk/mW4POnrpQsSLtKI1dwpc+pPLuXHDh6vvskyQE/sw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-x64": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-x64/-/msgpackr-extract-linux-x64-3.0.4.tgz",
      "integrity": "sha512-8TNXMEjJc3QEy7R/x1INhgiU+XakDAFUzBhaz7+Rbrs8NH5UQeHQxxmzsSBJGyV6I1jW79undiQm8tOI+D+8FQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-win32-x64": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-win32-x64/-/msgpackr-extract-win32-x64-3.0.4.tgz",
      "integrity": "sha512-CmCXPQrkbwExx3j946/PtHWHbYJiCRBRDl4BlkRQcJB/YOwQxJRTpoo7aTsortjgoJ1x7opzTSxn7C+ASSLVjQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@napi-rs/nice": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice/-/nice-1.1.1.tgz",
      "integrity": "sha512-xJIPs+bYuc9ASBl+cvGsKbGrJmS6fAKaSZCnT0lhahT5rhA2VVy9/EcIgd2JhtEuFOJNx7UHNn/qiTPTY4nrQw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "optionalDependencies": {
        "@napi-rs/nice-android-arm-eabi": "1.1.1",
        "@napi-rs/nice-android-arm64": "1.1.1",
        "@napi-rs/nice-darwin-arm64": "1.1.1",
        "@napi-rs/nice-darwin-x64": "1.1.1",
        "@napi-rs/nice-freebsd-x64": "1.1.1",
        "@napi-rs/nice-linux-arm-gnueabihf": "1.1.1",
        "@napi-rs/nice-linux-arm64-gnu": "1.1.1",
        "@napi-rs/nice-linux-arm64-musl": "1.1.1",
        "@napi-rs/nice-linux-ppc64-gnu": "1.1.1",
        "@napi-rs/nice-linux-riscv64-gnu": "1.1.1",
        "@napi-rs/nice-linux-s390x-gnu": "1.1.1",
        "@napi-rs/nice-linux-x64-gnu": "1.1.1",
        "@napi-rs/nice-linux-x64-musl": "1.1.1",
        "@napi-rs/nice-openharmony-arm64": "1.1.1",
        "@napi-rs/nice-win32-arm64-msvc": "1.1.1",
        "@napi-rs/nice-win32-ia32-msvc": "1.1.1",
        "@napi-rs/nice-win32-x64-msvc": "1.1.1"
      }
    },
    "node_modules/@napi-rs/nice-android-arm-eabi": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-android-arm-eabi/-/nice-android-arm-eabi-1.1.1.tgz",
      "integrity": "sha512-kjirL3N6TnRPv5iuHw36wnucNqXAO46dzK9oPb0wj076R5Xm8PfUVA9nAFB5ZNMmfJQJVKACAPd/Z2KYMppthw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-android-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-android-arm64/-/nice-android-arm64-1.1.1.tgz",
      "integrity": "sha512-blG0i7dXgbInN5urONoUCNf+DUEAavRffrO7fZSeoRMJc5qD+BJeNcpr54msPF6qfDD6kzs9AQJogZvT2KD5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-darwin-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-darwin-arm64/-/nice-darwin-arm64-1.1.1.tgz",
      "integrity": "sha512-s/E7w45NaLqTGuOjC2p96pct4jRfo61xb9bU1unM/MJ/RFkKlJyJDx7OJI/O0ll/hrfpqKopuAFDV8yo0hfT7A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-darwin-x64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-darwin-x64/-/nice-darwin-x64-1.1.1.tgz",
      "integrity": "sha512-dGoEBnVpsdcC+oHHmW1LRK5eiyzLwdgNQq3BmZIav+9/5WTZwBYX7r5ZkQC07Nxd3KHOCkgbHSh4wPkH1N1LiQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-freebsd-x64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-freebsd-x64/-/nice-freebsd-x64-1.1.1.tgz",
      "integrity": "sha512-kHv4kEHAylMYmlNwcQcDtXjklYp4FCf0b05E+0h6nDHsZ+F0bDe04U/tXNOqrx5CmIAth4vwfkjjUmp4c4JktQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm-gnueabihf": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm-gnueabihf/-/nice-linux-arm-gnueabihf-1.1.1.tgz",
      "integrity": "sha512-E1t7K0efyKXZDoZg1LzCOLxgolxV58HCkaEkEvIYQx12ht2pa8hoBo+4OB3qh7e+QiBlp1SRf+voWUZFxyhyqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm64-gnu/-/nice-linux-arm64-gnu-1.1.1.tgz",
      "integrity": "sha512-CIKLA12DTIZlmTaaKhQP88R3Xao+gyJxNWEn04wZwC2wmRapNnxCUZkVwggInMJvtVElA+D4ZzOU5sX4jV+SmQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm64-musl": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm64-musl/-/nice-linux-arm64-musl-1.1.1.tgz",
      "integrity": "sha512-+2Rzdb3nTIYZ0YJF43qf2twhqOCkiSrHx2Pg6DJaCPYhhaxbLcdlV8hCRMHghQ+EtZQWGNcS2xF4KxBhSGeutg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-ppc64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-ppc64-gnu/-/nice-linux-ppc64-gnu-1.1.1.tgz",
      "integrity": "sha512-4FS8oc0GeHpwvv4tKciKkw3Y4jKsL7FRhaOeiPei0X9T4Jd619wHNe4xCLmN2EMgZoeGg+Q7GY7BsvwKpL22Tg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-riscv64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-riscv64-gnu/-/nice-linux-riscv64-gnu-1.1.1.tgz",
      "integrity": "sha512-HU0nw9uD4FO/oGCCk409tCi5IzIZpH2agE6nN4fqpwVlCn5BOq0MS1dXGjXaG17JaAvrlpV5ZeyZwSon10XOXw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-s390x-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-s390x-gnu/-/nice-linux-s390x-gnu-1.1.1.tgz",
      "integrity": "sha512-2YqKJWWl24EwrX0DzCQgPLKQBxYDdBxOHot1KWEq7aY2uYeX+Uvtv4I8xFVVygJDgf6/92h9N3Y43WPx8+PAgQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-x64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-x64-gnu/-/nice-linux-x64-gnu-1.1.1.tgz",
      "integrity": "sha512-/gaNz3R92t+dcrfCw/96pDopcmec7oCcAQ3l/M+Zxr82KT4DljD37CpgrnXV+pJC263JkW572pdbP3hP+KjcIg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-x64-musl": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-x64-musl/-/nice-linux-x64-musl-1.1.1.tgz",
      "integrity": "sha512-xScCGnyj/oppsNPMnevsBe3pvNaoK7FGvMjT35riz9YdhB2WtTG47ZlbxtOLpjeO9SqqQ2J2igCmz6IJOD5JYw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-openharmony-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-openharmony-arm64/-/nice-openharmony-arm64-1.1.1.tgz",
      "integrity": "sha512-6uJPRVwVCLDeoOaNyeiW0gp2kFIM4r7PL2MczdZQHkFi9gVlgm+Vn+V6nTWRcu856mJ2WjYJiumEajfSm7arPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-arm64-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-arm64-msvc/-/nice-win32-arm64-msvc-1.1.1.tgz",
      "integrity": "sha512-uoTb4eAvM5B2aj/z8j+Nv8OttPf2m+HVx3UjA5jcFxASvNhQriyCQF1OB1lHL43ZhW+VwZlgvjmP5qF3+59atA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-ia32-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-ia32-msvc/-/nice-win32-ia32-msvc-1.1.1.tgz",
      "integrity": "sha512-CNQqlQT9MwuCsg1Vd/oKXiuH+TcsSPJmlAFc5frFyX/KkOh0UpBLEj7aoY656d5UKZQMQFP7vJNa1DNUNORvug==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-x64-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-x64-msvc/-/nice-win32-x64-msvc-1.1.1.tgz",
      "integrity": "sha512-vB+4G/jBQCAh0jelMTY3+kgFy00Hlx2f2/1zjMoH821IbplbWZOkLiTYXQkygNTzQJTq5cvwBDgn2ppHD+bglQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@npmcli/agent": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@npmcli/agent/-/agent-4.0.2.tgz",
      "integrity": "sha512-EUEuWAxnL07Sp5/iC/1X6Xj+XThUvnbei9zfRWZdEXa7lss9RTHMhAHBeg+MZ5To9s/gGaSI+UwZTPdYMvKSeg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "agent-base": "^7.1.0",
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.1",
        "lru-cache": "^11.2.1",
        "socks-proxy-agent": "^8.0.3"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/agent/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@npmcli/fs": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/fs/-/fs-5.0.0.tgz",
      "integrity": "sha512-7OsC1gNORBEawOa5+j2pXN9vsicaIOH5cPXxoR6fJOmH6/EXpJB2CajXOu1fPRFun2m1lktEFX11+P89hqO/og==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "semver": "^7.3.5"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/git": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@npmcli/git/-/git-7.0.2.tgz",
      "integrity": "sha512-oeolHDjExNAJAnlYP2qzNjMX/Xi9bmu78C9dIGr4xjobrSKbuMYCph8lTzn4vnW3NjIqVmw/f8BCfouqyJXlRg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@gar/promise-retry": "^1.0.0",
        "@npmcli/promise-spawn": "^9.0.0",
        "ini": "^6.0.0",
        "lru-cache": "^11.2.1",
        "npm-pick-manifest": "^11.0.1",
        "proc-log": "^6.0.0",
        "semver": "^7.3.5",
        "which": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/git/node_modules/ini": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/ini/-/ini-6.0.0.tgz",
      "integrity": "sha512-IBTdIkzZNOpqm7q3dRqJvMaldXjDHWkEDfrwGEQTs5eaQMWV+djAhR+wahyNNMAa+qpbDUhBMVt4ZKNwpPm7xQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/git/node_modules/isexe": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-4.0.0.tgz",
      "integrity": "sha512-FFUtZMpoZ8RqHS3XeXEmHWLA4thH+ZxCv2lOiPIn1Xc7CxrqhWzNSDzD+/chS/zbYezmiwWLdQC09JdQKmthOw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@npmcli/git/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@npmcli/git/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/git/node_modules/which": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/which/-/which-6.0.1.tgz",
      "integrity": "sha512-oGLe46MIrCRqX7ytPUf66EAYvdeMIZYn3WaocqqKZAxrBpkqHfL/qvTyJ/bTk5+AqHCjXmrv3CEWgy368zhRUg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^4.0.0"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/installed-package-contents": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/installed-package-contents/-/installed-package-contents-4.0.0.tgz",
      "integrity": "sha512-yNyAdkBxB72gtZ4GrwXCM0ZUedo9nIbOMKfGjt6Cu6DXf0p8y1PViZAKDC8q8kv/fufx0WTjRBdSlyrvnP7hmA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "npm-bundled": "^5.0.0",
        "npm-normalize-package-bin": "^5.0.0"
      },
      "bin": {
        "installed-package-contents": "bin/index.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/node-gyp": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/node-gyp/-/node-gyp-5.0.0.tgz",
      "integrity": "sha512-uuG5HZFXLfyFKqg8QypsmgLQW7smiRjVc45bqD/ofZZcR/uxEjgQU8qDPv0s9TEeMUiAAU/GC5bR6++UdTirIQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/package-json": {
      "version": "7.0.5",
      "resolved": "https://registry.npmjs.org/@npmcli/package-json/-/package-json-7.0.5.tgz",
      "integrity": "sha512-iVuTlG3ORq2iaVa1IWUxAO/jIp77tUKBhoMjuzYW2kL4MLN1bi/ofqkZ7D7OOwh8coAx1/S2ge0rMdGv8sLSOQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/git": "^7.0.0",
        "glob": "^13.0.0",
        "hosted-git-info": "^9.0.0",
        "json-parse-even-better-errors": "^5.0.0",
        "proc-log": "^6.0.0",
        "semver": "^7.5.3",
        "spdx-expression-parse": "^4.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/package-json/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@npmcli/package-json/node_modules/brace-expansion": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.8.tgz",
      "integrity": "sha512-JZyDyq3D4AUifKTPOB7DELf6XsB3WdPuNxCtob1vFXPsSXhdAiHBWJ/tJ8HAc9aH84BK+5JFZLNkJKx3G9kzQg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@npmcli/package-json/node_modules/glob": {
      "version": "13.0.6",
      "resolved": "https://registry.npmjs.org/glob/-/glob-13.0.6.tgz",
      "integrity": "sha512-Wjlyrolmm8uDpm/ogGyXZXb1Z+Ca2B8NbJwqBVg0axK9GbBeoS7yGV6vjXnYdGm6X53iehEuxxbyiKp8QmN4Vw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "minimatch": "^10.2.2",
        "minipass": "^7.1.3",
        "path-scurry": "^2.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@npmcli/package-json/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@npmcli/package-json/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/promise-spawn": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/@npmcli/promise-spawn/-/promise-spawn-9.0.1.tgz",
      "integrity": "sha512-OLUaoqBuyxeTqUvjA3FZFiXUfYC1alp3Sa99gW3EUDz3tZ3CbXDdcZ7qWKBzicrJleIgucoWamWH1saAmH/l2Q==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "which": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/promise-spawn/node_modules/isexe": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-4.0.0.tgz",
      "integrity": "sha512-FFUtZMpoZ8RqHS3XeXEmHWLA4thH+ZxCv2lOiPIn1Xc7CxrqhWzNSDzD+/chS/zbYezmiwWLdQC09JdQKmthOw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@npmcli/promise-spawn/node_modules/which": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/which/-/which-6.0.1.tgz",
      "integrity": "sha512-oGLe46MIrCRqX7ytPUf66EAYvdeMIZYn3WaocqqKZAxrBpkqHfL/qvTyJ/bTk5+AqHCjXmrv3CEWgy368zhRUg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^4.0.0"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/redact": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/redact/-/redact-4.0.0.tgz",
      "integrity": "sha512-gOBg5YHMfZy+TfHArfVogwgfBeQnKbbGo3pSUyK/gSI0AVu+pEiDVcKlQb0D8Mg1LNRZILZ6XG8I5dJ4KuAd9Q==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/run-script": {
      "version": "10.0.4",
      "resolved": "https://registry.npmjs.org/@npmcli/run-script/-/run-script-10.0.4.tgz",
      "integrity": "sha512-mGUWr1uMnf0le2TwfOZY4SFxZGXGfm4Jtay/nwAa2FLNAKXUoUwaGwBMNH36UHPtinWfTSJ3nqFQr0091CxVGg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/node-gyp": "^5.0.0",
        "@npmcli/package-json": "^7.0.0",
        "@npmcli/promise-spawn": "^9.0.0",
        "node-gyp": "^12.1.0",
        "proc-log": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@npmcli/run-script/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@parcel/watcher": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher/-/watcher-2.6.0.tgz",
      "integrity": "sha512-7FNeNl8NCE7aINx7WXiKQrPYZWC/hvrTsmk6zmxbI7LTXE7hVek/n8AfVgpe2y82zl3w0HvCHN0bVKMBoJcC0w==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "detect-libc": "^2.0.3",
        "is-glob": "^4.0.3",
        "node-addon-api": "^7.0.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "@parcel/watcher-android-arm64": "2.6.0",
        "@parcel/watcher-darwin-arm64": "2.6.0",
        "@parcel/watcher-darwin-x64": "2.6.0",
        "@parcel/watcher-freebsd-x64": "2.6.0",
        "@parcel/watcher-linux-arm-glibc": "2.6.0",
        "@parcel/watcher-linux-arm-musl": "2.6.0",
        "@parcel/watcher-linux-arm64-glibc": "2.6.0",
        "@parcel/watcher-linux-arm64-musl": "2.6.0",
        "@parcel/watcher-linux-x64-glibc": "2.6.0",
        "@parcel/watcher-linux-x64-musl": "2.6.0",
        "@parcel/watcher-win32-arm64": "2.6.0",
        "@parcel/watcher-win32-x64": "2.6.0"
      }
    },
    "node_modules/@parcel/watcher-android-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-android-arm64/-/watcher-android-arm64-2.6.0.tgz",
      "integrity": "sha512-trgpLSCKRC/huFjXX/Smh+0sWe4+YtKfktIToiMl59ghz7z+qkH6kMvNnUbLyRs9N11t8l4svSCs1+5B3rOAhA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-darwin-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-darwin-arm64/-/watcher-darwin-arm64-2.6.0.tgz",
      "integrity": "sha512-Y3QV0gl7Q1zbfueunkWIERICbEojQFCgpyG7YqOGNFLsckXyI1xu9mAIUpKY9QBYzBtSkN8dBPwd3yiAO9ovMw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-darwin-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-darwin-x64/-/watcher-darwin-x64-2.6.0.tgz",
      "integrity": "sha512-Ohv6OpzhUfKYD7Beb8kDvG0jbIxORCYY1JRdZnaBtnjjkJxgD7ZVL0nw2sCYd0yTMKTvz3nnTnOF3cDifK+kvw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-freebsd-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-freebsd-x64/-/watcher-freebsd-x64-2.6.0.tgz",
      "integrity": "sha512-5HmXvDgs8VK+74jF9y9/2FE3/OnlcKmc56tjmSrEuZjpSZOGL+fvAu+HKJBdPs9uwoP2hE6TlSUpXZ/C5jUFmQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm-glibc/-/watcher-linux-arm-glibc-2.6.0.tgz",
      "integrity": "sha512-Ps/hui3A+vMbjdqlqAowK2ZL8+BO8dBjxeWXj6npTBs3jx4wWmbPpaLuqwrQrSqIVMCnpWo238bJ1U37GhQOYg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm-musl/-/watcher-linux-arm-musl-2.6.0.tgz",
      "integrity": "sha512-9c6AUHgHoG+IY88MRIHupztQiQnrbqHYQjkM2btA+Bf/wQnQMuiD0Wfk1EVv3TlNT3x41uU71rn6E4xh/+zvkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm64-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm64-glibc/-/watcher-linux-arm64-glibc-2.6.0.tgz",
      "integrity": "sha512-yHRqS2owEXe6Hic9z6Mh1ECsCd+ODVOGvZDyciqRd21+v+o+DnXMOrw50DSpIG2sb8GPEaPPmfeCAWKPJdq46g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm64-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm64-musl/-/watcher-linux-arm64-musl-2.6.0.tgz",
      "integrity": "sha512-WhB2e/V7rqdHHWZusBSPuy5Ei8S6lSz6FE5TKKQz5h3a0O+C+mhY7vxU9b/stqvMb8beLnPY82ZrFTLKs+SrKA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-x64-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-x64-glibc/-/watcher-linux-x64-glibc-2.6.0.tgz",
      "integrity": "sha512-ulGE6x6Oz6iAwg75T8YQSoguBWasniIbX+QWpaYPcCnDOpdWX3k+4xbEYPZVLxOuoJI+svJJPD3sEj8G7lrQ3A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-x64-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-x64-musl/-/watcher-linux-x64-musl-2.6.0.tgz",
      "integrity": "sha512-tkBYKt7YQrjIJWYDnto2YgO8MRkjlMTSNoRHzsXinBqbLdeOM3L32wPZJvIZxqaLMfSlS/4sUjH/6STVP/XDLw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-win32-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-win32-arm64/-/watcher-win32-arm64-2.6.0.tgz",
      "integrity": "sha512-gIZAP23jaHjGWasY/TY6yL7NHFClf0Ga7FN+iINvk+KN94rhm94lYZhFsbYFNcA04/onvGD9kKmiJLJB2HbNwQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-win32-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-win32-x64/-/watcher-win32-x64-2.6.0.tgz",
      "integrity": "sha512-cA+/pXV2YkfxlIcXOQ5fSWqAzzPyD78/x5qbK/I0vUkrlYHA8TIz+MXjAbGouguKVSI4bOmkTSJ1/poVSsgt+A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher/node_modules/node-addon-api": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-7.1.1.tgz",
      "integrity": "sha512-5m3bsyrjFWE1xf7nz7YXdN4udnVtXK6/Yfgn5qnahL6bCkf2yKt4k3nuTKAtT4r3IG8JNR2ncsIMdZuAzJjHQQ==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.59.0.tgz",
      "integrity": "sha512-upnNBkA6ZH2VKGcBj9Fyl9IGNPULcjXRlg0LLeaioQWueH30p6IXtJEbKAgvyv+mJaMxSm1l6xwDXYjpEMiLMg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.59.0.tgz",
      "integrity": "sha512-hZ+Zxj3SySm4A/DylsDKZAeVg0mvi++0PYVceVyX7hemkw7OreKdCvW2oQ3T1FMZvCaQXqOTHb8qmBShoqk69Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.59.0.tgz",
      "integrity": "sha512-W2Psnbh1J8ZJw0xKAd8zdNgF9HRLkdWwwdWqubSVk0pUuQkoHnv7rx4GiF9rT4t5DIZGAsConRE3AxCdJ4m8rg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.59.0.tgz",
      "integrity": "sha512-ZW2KkwlS4lwTv7ZVsYDiARfFCnSGhzYPdiOU4IM2fDbL+QGlyAbjgSFuqNRbSthybLbIJ915UtZBtmuLrQAT/w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.59.0.tgz",
      "integrity": "sha512-EsKaJ5ytAu9jI3lonzn3BgG8iRBjV4LxZexygcQbpiU0wU0ATxhNVEpXKfUa0pS05gTcSDMKpn3Sx+QB9RlTTA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.59.0.tgz",
      "integrity": "sha512-d3DuZi2KzTMjImrxoHIAODUZYoUUMsuUiY4SRRcJy6NJoZ6iIqWnJu9IScV9jXysyGMVuW+KNzZvBLOcpdl3Vg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.59.0.tgz",
      "integrity": "sha512-t4ONHboXi/3E0rT6OZl1pKbl2Vgxf9vJfWgmUoCEVQVxhW6Cw/c8I6hbbu7DAvgp82RKiH7TpLwxnJeKv2pbsw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.59.0.tgz",
      "integrity": "sha512-CikFT7aYPA2ufMD086cVORBYGHffBo4K8MQ4uPS/ZnY54GKj36i196u8U+aDVT2LX4eSMbyHtyOh7D7Zvk2VvA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.59.0.tgz",
      "integrity": "sha512-jYgUGk5aLd1nUb1CtQ8E+t5JhLc9x5WdBKew9ZgAXg7DBk0ZHErLHdXM24rfX+bKrFe+Xp5YuJo54I5HFjGDAA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.59.0.tgz",
      "integrity": "sha512-peZRVEdnFWZ5Bh2KeumKG9ty7aCXzzEsHShOZEFiCQlDEepP1dpUl/SrUNXNg13UmZl+gzVDPsiCwnV1uI0RUA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.59.0.tgz",
      "integrity": "sha512-gbUSW/97f7+r4gHy3Jlup8zDG190AuodsWnNiXErp9mT90iCy9NKKU0Xwx5k8VlRAIV2uU9CsMnEFg/xXaOfXg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.59.0.tgz",
      "integrity": "sha512-yTRONe79E+o0FWFijasoTjtzG9EBedFXJMl888NBEDCDV9I2wGbFFfJQQe63OijbFCUZqxpHz1GzpbtSFikJ4Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.59.0.tgz",
      "integrity": "sha512-sw1o3tfyk12k3OEpRddF68a1unZ5VCN7zoTNtSn2KndUE+ea3m3ROOKRCZxEpmT9nsGnogpFP9x6mnLTCaoLkA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.59.0.tgz",
      "integrity": "sha512-+2kLtQ4xT3AiIxkzFVFXfsmlZiG5FXYW7ZyIIvGA7Bdeuh9Z0aN4hVyXS/G1E9bTP/vqszNIN/pUKCk/BTHsKA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.59.0.tgz",
      "integrity": "sha512-NDYMpsXYJJaj+I7UdwIuHHNxXZ/b/N2hR15NyH3m2qAtb/hHPA4g4SuuvrdxetTdndfj9b1WOmy73kcPRoERUg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.59.0.tgz",
      "integrity": "sha512-nLckB8WOqHIf1bhymk+oHxvM9D3tyPndZH8i8+35p/1YiVoVswPid2yLzgX7ZJP0KQvnkhM4H6QZ5m0LzbyIAg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.59.0.tgz",
      "integrity": "sha512-oF87Ie3uAIvORFBpwnCvUzdeYUqi2wY6jRFWJAy1qus/udHFYIkplYRW+wo+GRUP4sKzYdmE1Y3+rY5Gc4ZO+w==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.59.0.tgz",
      "integrity": "sha512-3AHmtQq/ppNuUspKAlvA8HtLybkDflkMuLK4DPo77DfthRb71V84/c4MlWJXixZz4uruIH4uaa07IqoAkG64fg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.59.0.tgz",
      "integrity": "sha512-2UdiwS/9cTAx7qIUZB/fWtToJwvt0Vbo0zmnYt7ED35KPg13Q0ym1g442THLC7VyI6JfYTP4PiSOWyoMdV2/xg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.59.0.tgz",
      "integrity": "sha512-M3bLRAVk6GOwFlPTIxVBSYKUaqfLrn8l0psKinkCFxl4lQvOSz8ZrKDz2gxcBwHFpci0B6rttydI4IpS4IS/jQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.59.0.tgz",
      "integrity": "sha512-tt9KBJqaqp5i5HUZzoafHZX8b5Q2Fe7UjYERADll83O4fGqJ49O1FsL6LpdzVFQcpwvnyd0i+K/VSwu/o/nWlA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.59.0.tgz",
      "integrity": "sha512-V5B6mG7OrGTwnxaNUzZTDTjDS7F75PO1ae6MJYdiMu60sq0CqN5CVeVsbhPxalupvTX8gXVSU9gq+Rx1/hvu6A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.59.0.tgz",
      "integrity": "sha512-UKFMHPuM9R0iBegwzKF4y0C4J9u8C6MEJgFuXTBerMk7EJ92GFVFYBfOZaSGLu6COf7FxpQNqhNS4c4icUPqxA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.59.0.tgz",
      "integrity": "sha512-laBkYlSS1n2L8fSo1thDNGrCTQMmxjYY5G0WFWjFFYZkKPjsMBsgJfGf4TLxXrF6RyhI60L8TMOjBMvXiTcxeA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.59.0.tgz",
      "integrity": "sha512-2HRCml6OztYXyJXAvdDXPKcawukWY2GpR5/nxKp4iBgiO3wcoEGkAaqctIbZcNB6KlUQBIqt8VYkNSj2397EfA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@schematics/angular": {
      "version": "20.3.32",
      "resolved": "https://registry.npmjs.org/@schematics/angular/-/angular-20.3.32.tgz",
      "integrity": "sha512-asporFGNP/U4p/A6jHqRmC8zGBxsSbjA/17I0p1tIW4HLbDTwJ0Z1gTSGpkHGRGTeowPZZSCj7s0IWVoaBCjnA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "20.3.32",
        "@angular-devkit/schematics": "20.3.32",
        "jsonc-parser": "3.3.1"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=24.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@sigstore/bundle": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@sigstore/bundle/-/bundle-4.0.0.tgz",
      "integrity": "sha512-NwCl5Y0V6Di0NexvkTqdoVfmjTaQwoLM236r89KEojGmq/jMls8S+zb7yOwAPdXvbwfKDlP+lmXgAL4vKSQT+A==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@sigstore/protobuf-specs": "^0.5.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@sigstore/core": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/@sigstore/core/-/core-3.2.1.tgz",
      "integrity": "sha512-qRsxPnCrbC/puegGxKuynfnxgLiHqWStrSjxkoB4YKqq3Z3s4cyZyj42ZdWFAEblNP65C+rBH8EuREHIXoi83g==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@sigstore/protobuf-specs": {
      "version": "0.5.1",
      "resolved": "https://registry.npmjs.org/@sigstore/protobuf-specs/-/protobuf-specs-0.5.1.tgz",
      "integrity": "sha512-/ScWUhhoFasJsSRGTVBwId1loQjjnjAfE4djL6ZhrXRpNCmPTnUKF5Jokd58ILseOMjzET3UrMOtJPS9sYeI0g==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/@sigstore/sign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/@sigstore/sign/-/sign-4.1.1.tgz",
      "integrity": "sha512-Hf4xglukg0XXQ2RiD5vSoLjdPe8OBUPA8XeVjUObheuDcWdYWrnH/BNmxZCzkAy68MzmNCxXLeurJvs6hcP2OQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@gar/promise-retry": "^1.0.2",
        "@sigstore/bundle": "^4.0.0",
        "@sigstore/core": "^3.2.0",
        "@sigstore/protobuf-specs": "^0.5.0",
        "make-fetch-happen": "^15.0.4",
        "proc-log": "^6.1.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@sigstore/sign/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@sigstore/tuf": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@sigstore/tuf/-/tuf-4.0.2.tgz",
      "integrity": "sha512-TCAzTy0xzdP79EnxSjq9KQ3eaR7+FmudLC6eRKknVKZbV7ZNlGLClAAQb/HMNJ5n2OBNk2GT1tEmU0xuPr+SLQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@sigstore/protobuf-specs": "^0.5.0",
        "tuf-js": "^4.1.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@sigstore/verify": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@sigstore/verify/-/verify-3.1.1.tgz",
      "integrity": "sha512-qv7+G3J2cc6wwFj3yKvXOamzqhMwSk1ogPGmhpS8iXllcPrJaIIBA+4HbttlHVu1pqWTdmaCH/WE7UOC51kdoA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@sigstore/bundle": "^4.0.0",
        "@sigstore/core": "^3.2.1",
        "@sigstore/protobuf-specs": "^0.5.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@socket.io/component-emitter": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@socket.io/component-emitter/-/component-emitter-3.1.2.tgz",
      "integrity": "sha512-9BCxFwvbGg/RsZK9tjXd8s4UcwR0MWeFQ1XEKIQVVvAGJyINdrqKMcTRyLoK8Rse1GjzLV9cwjWV1olXRWEXVA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tailwindcss/forms": {
      "version": "0.5.11",
      "resolved": "https://registry.npmjs.org/@tailwindcss/forms/-/forms-0.5.11.tgz",
      "integrity": "sha512-h9wegbZDPurxG22xZSoWtdzc41/OlNEUQERNqI/0fOwa2aVlWGu7C35E/x6LDyD3lgtztFSSjKZyuVM0hxhbgA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mini-svg-data-uri": "^1.2.3"
      },
      "peerDependencies": {
        "tailwindcss": ">=3.0.0 || >= 3.0.0-alpha.1 || >= 4.0.0-alpha.20 || >= 4.0.0-beta.1"
      }
    },
    "node_modules/@tokenizer/inflate": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@tokenizer/inflate/-/inflate-0.4.1.tgz",
      "integrity": "sha512-2mAv+8pkG6GIZiF1kNg1jAjh27IDxEPKwdGul3snfztFerfPGI1LjDezZp3i7BElXompqEtPmoPx6c2wgtWsOA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "token-types": "^6.1.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/@tokenizer/token": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@tokenizer/token/-/token-0.3.0.tgz",
      "integrity": "sha512-OvjF+z51L3ov0OyAU0duzsYuvO01PH7x4t6DJx+guahgTnBHkhJdG7soQeTSFLWN3efnHyibZ4Z8l2EuWwJN3A==",
      "license": "MIT"
    },
    "node_modules/@tufjs/canonical-json": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@tufjs/canonical-json/-/canonical-json-2.0.0.tgz",
      "integrity": "sha512-yVtV8zsdo8qFHe+/3kw81dSLyF7D576A5cCFCi4X7B39tWT7SekaEFUnvnWJHz+9qO7qJTah1JbrDjWKqFtdWA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/@tufjs/models": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/@tufjs/models/-/models-4.1.0.tgz",
      "integrity": "sha512-Y8cK9aggNRsqJVaKUlEYs4s7CvQ1b1ta2DVPyAimb0I2qhzjNk+A+mxvll/klL0RlfuIUei8BF7YWiua4kQqww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@tufjs/canonical-json": "2.0.0",
        "minimatch": "^10.1.1"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/@tufjs/models/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@tufjs/models/node_modules/brace-expansion": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.8.tgz",
      "integrity": "sha512-JZyDyq3D4AUifKTPOB7DELf6XsB3WdPuNxCtob1vFXPsSXhdAiHBWJ/tJ8HAc9aH84BK+5JFZLNkJKx3G9kzQg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@tufjs/models/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/jasmine": {
      "version": "5.1.15",
      "resolved": "https://registry.npmjs.org/@types/jasmine/-/jasmine-5.1.15.tgz",
      "integrity": "sha512-ZAC8KjmV2MJxbNTrwXFN+HKeajpXQZp6KpPiR6Aa4XvaEnjP6qh23lL/Rqb7AYzlp3h/rcwDrQ7Gg7q28cQTQg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "26.1.2",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-26.1.2.tgz",
      "integrity": "sha512-Vu4a5UFA9rIIFJ7rB/Vaafh9lrCQszopTCx6KjFboXTGQbPNasehVR5TEiithSDGyd1DEiUByggTZsg8jukeIg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "undici-types": "~8.3.0"
      }
    },
    "node_modules/@types/ws": {
      "version": "8.18.1",
      "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",
      "integrity": "sha512-ThVF6DCVhA8kUGy+aazFQ4kXQ7E1Ty7A3ypFOe0IcJV8O/M511G99AW24irKrW56Wt44yG9+ij8FaqoBGkuBXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@vitejs/plugin-basic-ssl": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-basic-ssl/-/plugin-basic-ssl-2.1.0.tgz",
      "integrity": "sha512-dOxxrhgyDIEUADhb/8OlV9JIqYLgos03YorAueTIeOUskLJSEsfwCByjbu98ctXitUN3znXKp0bYD/WHSudCeA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.0.0 || ^20.0.0 || >=22.0.0"
      },
      "peerDependencies": {
        "vite": "^6.0.0 || ^7.0.0"
      }
    },
    "node_modules/@yarnpkg/lockfile": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@yarnpkg/lockfile/-/lockfile-1.1.0.tgz",
      "integrity": "sha512-GpSwvyXOcOOlV70vbnzjj4fW5xW/FdUF6nQEt1ENy7m4ZCczi1+/buVUPAqmGfqznsORNFzUMjctTIp8a9tuCQ==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/abbrev": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-4.0.0.tgz",
      "integrity": "sha512-a1wflyaL0tHtJSmLSOVybYhy22vRih4eduhhrkcjgrWGnRfrZtovJ2FRjxuTtkkj47O/baf0R86QU5OuYpz8fA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/abort-controller": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
      "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
      "license": "MIT",
      "dependencies": {
        "event-target-shim": "^5.0.0"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ajv": {
      "version": "8.18.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.18.0.tgz",
      "integrity": "sha512-PlXPeEWMXMZ7sPYOHqmDyCJzcfNrUr3fGNKtezX14ykXOEIvyK81d+qydx89KY5O71FKMPaQ2vBfBFI5NHR63A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/ajv-formats/-/ajv-formats-3.0.1.tgz",
      "integrity": "sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/algoliasearch": {
      "version": "5.35.0",
      "resolved": "https://registry.npmjs.org/algoliasearch/-/algoliasearch-5.35.0.tgz",
      "integrity": "sha512-Y+moNhsqgLmvJdgTsO4GZNgsaDWv8AOGAaPeIeHKlDn/XunoAqYbA+XNpBd1dW8GOXAUDyxC9Rxc7AV4kpFcIg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@algolia/abtesting": "1.1.0",
        "@algolia/client-abtesting": "5.35.0",
        "@algolia/client-analytics": "5.35.0",
        "@algolia/client-common": "5.35.0",
        "@algolia/client-insights": "5.35.0",
        "@algolia/client-personalization": "5.35.0",
        "@algolia/client-query-suggestions": "5.35.0",
        "@algolia/client-search": "5.35.0",
        "@algolia/ingestion": "1.35.0",
        "@algolia/monitoring": "1.35.0",
        "@algolia/recommend": "5.35.0",
        "@algolia/requester-browser-xhr": "5.35.0",
        "@algolia/requester-fetch": "5.35.0",
        "@algolia/requester-node-http": "5.35.0"
      },
      "engines": {
        "node": ">= 14.0.0"
      }
    },
    "node_modules/ansi-escapes": {
      "version": "7.3.0",
      "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-7.3.0.tgz",
      "integrity": "sha512-BvU8nYgGQBxcmMuEeUEmNTvrMVjJNSH7RgW24vXexN4Ven6qCvy4TntnvlnwnMLTVlcRQQdbRY8NKnaIoeWDNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "environment": "^1.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.2.2.tgz",
      "integrity": "sha512-Bq3SmSpyFHaWjPk8If9yc6svM8c56dB5BAtW4Qbw5jHTwwXXcTLoRMkpDJp6VL0XzlWaCHTXrkFURMYmD0sLqg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/any-base": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/any-base/-/any-base-1.1.0.tgz",
      "integrity": "sha512-uMgjozySS8adZZYePpaWs8cxB9/kdzmpX6SgJZ+wbz1K5eYk5QMYDVJaZKhxyIHUdnnJkfR7SVgStgH7LkGUyg==",
      "license": "MIT"
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/anymatch/node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/autoprefixer": {
      "version": "10.5.4",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.4.tgz",
      "integrity": "sha512-MaU0U/za7N3r6brxD4YB/l4NSrFzLPlANv6wEuQVaIPlD3L4W9rFcQPbL/EilY9BHhHvhfcz3gInDLrEtWT4EA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.6",
        "caniuse-lite": "^1.0.30001806",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/await-to-js": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/await-to-js/-/await-to-js-3.0.0.tgz",
      "integrity": "sha512-zJAaP9zxTcvTHRlejau3ZOY4V7SRpiByf3/dxx2uyKxxor19tpmpV2QRsTKikckwhaPmr2dVpxxMr7jOCYVp5g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/base64id": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/base64id/-/base64id-2.0.0.tgz",
      "integrity": "sha512-lGe34o6EHj9y3Kts9R4ZYs/Gr+6N7MCaMlIFA3F1R2O5/m7K06AxfSeO5530PEERE6/WyEg3lsuyw4GHlPZHog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^4.5.0 || >= 5.9"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.5",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.5.tgz",
      "integrity": "sha512-xJo6a6YZnwZfnyGmQKWMbVOcii7XRibjOskRh+WJ9UHQoX16xrQrcIgAMQOzfvs8XiLMx6ih/fsLPF73iY2D1A==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/beasties": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/beasties/-/beasties-0.3.5.tgz",
      "integrity": "sha512-NaWu+f4YrJxEttJSm16AzMIFtVldCvaJ68b1L098KpqXmxt9xOLtKoLkKxb8ekhOrLqEJAbvT6n6SEvB/sac7A==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "css-select": "^6.0.0",
        "css-what": "^7.0.0",
        "dom-serializer": "^2.0.0",
        "domhandler": "^5.0.3",
        "htmlparser2": "^10.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.49",
        "postcss-media-query-parser": "^0.2.3"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/bmp-ts": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/bmp-ts/-/bmp-ts-1.0.9.tgz",
      "integrity": "sha512-cTEHk2jLrPyi+12M3dhpEbnnPOsaZuq7C45ylbbQIiWgDFZq4UVYPEY5mlqjvsj/6gJv9qX5sa+ebDzLXT28Vw==",
      "license": "MIT"
    },
    "node_modules/body-parser": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.3.0.tgz",
      "integrity": "sha512-2cGmJupaNgg+QUwVLAucDuWuoMZ6EX9iHDRswZ5lsNYEmwPaRknMPCLZz07yTzVq/83p4o/wzbDZbBrTvGGTIw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^2.0.0",
        "debug": "^4.4.3",
        "http-errors": "^2.0.1",
        "iconv-lite": "^0.7.2",
        "on-finished": "^2.4.1",
        "qs": "^6.15.2",
        "raw-body": "^3.0.2",
        "type-is": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/body-parser/node_modules/content-type": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.0.0.tgz",
      "integrity": "sha512-j/O/d7GcZCyNl7/hwZAb606rzqkyvaDctLmckbxLzHvFBzTJHuGEdodATcP3yIRoDrLHkIATJuvzbFlp/ki2cQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/boolbase": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz",
      "integrity": "sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/brace-expansion": {
      "version": "1.1.16",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.16.tgz",
      "integrity": "sha512-IDw48K2/2kRkg9LdJxurvq3lV3aBgq0REY89duEqFRthjlPdXHKMj7EnQOXVckxzgisinf3nHfrcE2FufFLXMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.7",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.7.tgz",
      "integrity": "sha512-JxV13hNrFxqjOc8alRbq9dK1MM79NEXYpma2B2J4wAtpWS5zIEIKqWPGCl7N4o7Uc7B7itylh7SuDujATRyyTw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.10.44",
        "caniuse-lite": "^1.0.30001806",
        "electron-to-chromium": "^1.5.393",
        "node-releases": "^2.0.51",
        "update-browserslist-db": "^1.2.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/cacache": {
      "version": "20.0.4",
      "resolved": "https://registry.npmjs.org/cacache/-/cacache-20.0.4.tgz",
      "integrity": "sha512-M3Lab8NPYlZU2exsL3bMVvMrMqgwCnMWfdZbK28bn3pK6APT/Te/I8hjRPNu1uwORY9a1eEQoifXbKPQMfMTOA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/fs": "^5.0.0",
        "fs-minipass": "^3.0.0",
        "glob": "^13.0.0",
        "lru-cache": "^11.1.0",
        "minipass": "^7.0.3",
        "minipass-collect": "^2.0.1",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "p-map": "^7.0.2",
        "ssri": "^13.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/cacache/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/cacache/node_modules/brace-expansion": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.8.tgz",
      "integrity": "sha512-JZyDyq3D4AUifKTPOB7DELf6XsB3WdPuNxCtob1vFXPsSXhdAiHBWJ/tJ8HAc9aH84BK+5JFZLNkJKx3G9kzQg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/cacache/node_modules/glob": {
      "version": "13.0.6",
      "resolved": "https://registry.npmjs.org/glob/-/glob-13.0.6.tgz",
      "integrity": "sha512-Wjlyrolmm8uDpm/ogGyXZXb1Z+Ca2B8NbJwqBVg0axK9GbBeoS7yGV6vjXnYdGm6X53iehEuxxbyiKp8QmN4Vw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "minimatch": "^10.2.2",
        "minipass": "^7.1.3",
        "path-scurry": "^2.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/cacache/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/cacache/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001806",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001806.tgz",
      "integrity": "sha512-72Cuvd95zbSYPKq6Fhg8eDJRlzgWDf7/mtoZv6Qe/DYNCEBdNxoA3+rZAU2ZhGCpZlns3EssFavaZomckT5Uuw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "5.6.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-5.6.2.tgz",
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.17.0 || ^14.13 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chardet": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/chardet/-/chardet-2.2.0.tgz",
      "integrity": "sha512-rddelWYNPRrXq6PtNEN2S3f6t9ILzvqaN5pVgi4kqt9jHQaXIial9PznB5iSPVlQSLNaaH22ItWz3EJtQ10+OA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/chokidar": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-4.0.3.tgz",
      "integrity": "sha512-Qgzu8kfBvo+cA4962jnP1KkS6Dop5NS6g7R5LFYJr4b8Ub94PPQXUksCw9PvXoeXPRRddRNC5C1JQUR2SMGtnA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "readdirp": "^4.0.1"
      },
      "engines": {
        "node": ">= 14.16.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/chownr": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-3.0.0.tgz",
      "integrity": "sha512-+IxzY9BZOQd/XuYPRmrvEVjF/nqj5kgT4kEq7VofrDoM1MxoRjEWkrCC3EtLi59TVawxTAn+orJwFQcrqEN1+g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/cli-cursor": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-5.0.0.tgz",
      "integrity": "sha512-aCj4O5wKyszjMmDT4tZj93kxyydN/K5zPWSCe6/0AV/AA1pqe5ZBIw0a2ZfPQV7lL5/yb5HsUreJ6UFAF1tEQw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "restore-cursor": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-spinners": {
      "version": "2.9.2",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
      "integrity": "sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-truncate": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/cli-truncate/-/cli-truncate-4.0.0.tgz",
      "integrity": "sha512-nPdaFdQ0h/GEigbPClz11D0v/ZJEwxmeVZGeMo3Z5StPtUTkA9o1lD6QwoirYiSDzbcwn2XcjwmCp68W1IS4TA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "slice-ansi": "^5.0.0",
        "string-width": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-width": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-4.1.0.tgz",
      "integrity": "sha512-ouuZd4/dm2Sw5Gmqy6bGyNNNe1qt9RpmxveLSO7KcgsTnU7RXfsw+/bukWGo1abgBiMAic068rclZsO4IWmmxQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/cliui": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-9.0.1.tgz",
      "integrity": "sha512-k7ndgKhwoQveBL+/1tqGJYNz097I7WOvwbmmU2AR5+magtbjPWQTS1C5vzGkBC8Ym8UWRzfKUzUUqFLypY4Q+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^7.2.0",
        "strip-ansi": "^7.1.0",
        "wrap-ansi": "^9.0.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/cliui/node_modules/wrap-ansi": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-9.0.2.tgz",
      "integrity": "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "string-width": "^7.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/colorette": {
      "version": "2.0.20",
      "resolved": "https://registry.npmjs.org/colorette/-/colorette-2.0.20.tgz",
      "integrity": "sha512-IfEDxwoWIjkeXL1eXcDiow4UbKjhLdq6/EuSVR9GMN7KVH3r9gQ83e73hsz1Nd1T3ijd5xv1wcWRYO+D6kCI2w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/connect": {
      "version": "3.7.0",
      "resolved": "https://registry.npmjs.org/connect/-/connect-3.7.0.tgz",
      "integrity": "sha512-ZqRXc+tZukToSNmh5C2iWMSoV3X1YUcPbqEM4DkEG5tNQXrQUZCNVGGv3IuicnkMtPfGf3Xtp8WCXs295iQ1pQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "finalhandler": "1.1.2",
        "parseurl": "~1.3.3",
        "utils-merge": "1.0.1"
      },
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/connect/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/connect/node_modules/encodeurl": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz",
      "integrity": "sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/connect/node_modules/finalhandler": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.1.2.tgz",
      "integrity": "sha512-aAWcW57uxVNrQZqFXjITpW3sIUQmHGG3qSb9mUah9MgMC4NeWhNOlNjXEYq3HjRAvL6arUviZGGJsBg6z0zsWA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "on-finished": "~2.3.0",
        "parseurl": "~1.3.3",
        "statuses": "~1.5.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/connect/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/connect/node_modules/on-finished": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.3.0.tgz",
      "integrity": "sha512-ikqdkGAAyf/X/gPhXGvfgAytDZtDbr+bkNUJ0N9h5MI/dmdgCs3l6hoHrcUv41sRKew3jIwrp4qQDXiK99Utww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/connect/node_modules/statuses": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-1.5.0.tgz",
      "integrity": "sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-disposition": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.1.0.tgz",
      "integrity": "sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/convert-source-map": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-1.9.0.tgz",
      "integrity": "sha512-ASFBup0Mz1uyiIjANan1jzLQami9z1PoYSZCiiYW2FczPbenXc45FZdBZLzOT+r6+iciuEModtmCti+hjaAk0A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/css-select": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/css-select/-/css-select-6.0.0.tgz",
      "integrity": "sha512-rZZVSLle8v0+EY8QAkDWrKhpgt6SA5OtHsgBnsj6ZaLb5dmDVOWUDtQitd9ydxxvEjhewNudS6eTVU7uOyzvXw==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0",
        "css-what": "^7.0.0",
        "domhandler": "^5.0.3",
        "domutils": "^3.2.2",
        "nth-check": "^2.1.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/css-what": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/css-what/-/css-what-7.0.0.tgz",
      "integrity": "sha512-wD5oz5xibMOPHzy13CyGmogB3phdvcDaB5t0W/Nr5Z2O/agcB8YwOz6e2Lsp10pNDzBoDO9nVa3RGs/2BttpHQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">= 6"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/custom-event": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/custom-event/-/custom-event-1.0.1.tgz",
      "integrity": "sha512-GAj5FOq0Hd+RsCGVJxZuKaIDXDf3h6GQoNEjFgbLLI/trgtavwUbSnZ5pVfg27DVCaWjIohryS0JFwIJyT2cMg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/date-format": {
      "version": "4.0.14",
      "resolved": "https://registry.npmjs.org/date-format/-/date-format-4.0.14.tgz",
      "integrity": "sha512-39BOQLs9ZjKh0/patS9nrT8wc3ioX3/eA/zgbKNopnF2wCqJEoxywwwElATYvRsXdnOxA/OQeQoFZ3rFjVajhg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/di": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/di/-/di-0.0.1.tgz",
      "integrity": "sha512-uJaamHkagcZtHPqCIHZxnFrXlunQXgBOsZSUOWwFw31QJCAbyTBoHMW75YOTur5ZNx8pIeAKgf6GWIgaqqiLhA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/dom-serialize": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/dom-serialize/-/dom-serialize-2.2.1.tgz",
      "integrity": "sha512-Yra4DbvoW7/Z6LBN560ZwXMjoNOSAN2wRsKFGc4iBeso+mpIA6qj1vfdf9HpMaKAqG6wXTy+1SYEzmNpKXOSsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "custom-event": "~1.0.0",
        "ent": "~2.2.0",
        "extend": "^3.0.0",
        "void-elements": "^2.0.0"
      }
    },
    "node_modules/dom-serializer": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-2.0.0.tgz",
      "integrity": "sha512-wIkAryiqt/nV5EQKqQpo3SToSOV9J0DnbJqwK7Wv/Trc92zIAYZ4FlMu+JPFW1DfGFt81ZTCGgDEabffXeLyJg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.2",
        "entities": "^4.2.0"
      },
      "funding": {
        "url": "https://github.com/cheeriojs/dom-serializer?sponsor=1"
      }
    },
    "node_modules/domelementtype": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-2.3.0.tgz",
      "integrity": "sha512-OLETBj6w0OsagBwdXnPdN0cnMfF9opN69co+7ZrbfPGrdpPVNBUj02spi6B1N7wChLQiPn4CSH/zJvXw56gmHw==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "BSD-2-Clause"
    },
    "node_modules/domhandler": {
      "version": "5.0.3",
      "resolved": "https://registry.npmjs.org/domhandler/-/domhandler-5.0.3.tgz",
      "integrity": "sha512-cgwlv/1iFQiFnU96XXgROh8xTeetsnJiDsTc7TYCLFd9+/WNkIqPTxiM/8pSd8VIrhXGTf1Ny1q1hquVqDJB5w==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "domelementtype": "^2.3.0"
      },
      "engines": {
        "node": ">= 4"
      },
      "funding": {
        "url": "https://github.com/fb55/domhandler?sponsor=1"
      }
    },
    "node_modules/domutils": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/domutils/-/domutils-3.2.2.tgz",
      "integrity": "sha512-6kZKyUajlDuqlHKVX1w7gyslj9MPIXzIFiz/rGu35uC1wMi+kMhQwGhl4lt9unC9Vb9INnY9Z3/ZA3+FhASLaw==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "dom-serializer": "^2.0.0",
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.3"
      },
      "funding": {
        "url": "https://github.com/fb55/domutils?sponsor=1"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.396",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.396.tgz",
      "integrity": "sha512-yHiw2Y3C3H9U6TMbOfoWK/BPreiOPXRfTWPBwQBoZG6/8TB6eOPnsy5oaRYuatR7Fw2SJ4kKforgufeo7fq0EQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "10.6.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-10.6.0.tgz",
      "integrity": "sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/engine.io": {
      "version": "6.6.9",
      "resolved": "https://registry.npmjs.org/engine.io/-/engine.io-6.6.9.tgz",
      "integrity": "sha512-clKkw4C7nJ22mGgoVcCg6V/W/TxdNyIOTr89k2ONZu81qqkddPFDF0LXcbAwhzPD8DjkiRCjzuiO6Y+fkpD4vg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/cors": "^2.8.12",
        "@types/node": ">=10.0.0",
        "@types/ws": "^8.5.12",
        "accepts": "~1.3.4",
        "base64id": "2.0.0",
        "cookie": "~0.7.2",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.21.0"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/engine.io-parser": {
      "version": "5.2.3",
      "resolved": "https://registry.npmjs.org/engine.io-parser/-/engine.io-parser-5.2.3.tgz",
      "integrity": "sha512-HqD3yTBfnBxIrbnM1DoD6Pcq8NECnh8d4As1Qgh0z5Gg3jRRIqijury0CL3ghu/edArpUYiYqQiDUQBIs4np3Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/engine.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ent": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/ent/-/ent-2.2.2.tgz",
      "integrity": "sha512-kKvD1tO6BM+oK9HzCPpUdRb4vKFQY/FPTFmurMvh6LlN68VMrdj77w8yp51/kDbpkFOS9J8w5W6zIzgM2H8/hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "punycode": "^1.4.1",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/entities": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-4.5.0.tgz",
      "integrity": "sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/env-paths": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
      "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/environment": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/environment/-/environment-1.1.0.tgz",
      "integrity": "sha512-xUtoPkMggbz0MPyPiIWr1Kp4aeWJjDZ6SMvURhimjdZgsRuDplF5/s9hcgGhyXMhs+6vpnuoiZ2kFiu3FMnS8Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.1",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.1.tgz",
      "integrity": "sha512-HrJrvZv5ayxBzPfwphOoNzkzOIIlifzk0KJrGK2c8R4+LKpMtpYLQeUdjnwjWv/LZlkH2laZk+4w78pi99D4Vw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.1",
        "@esbuild/android-arm": "0.28.1",
        "@esbuild/android-arm64": "0.28.1",
        "@esbuild/android-x64": "0.28.1",
        "@esbuild/darwin-arm64": "0.28.1",
        "@esbuild/darwin-x64": "0.28.1",
        "@esbuild/freebsd-arm64": "0.28.1",
        "@esbuild/freebsd-x64": "0.28.1",
        "@esbuild/linux-arm": "0.28.1",
        "@esbuild/linux-arm64": "0.28.1",
        "@esbuild/linux-ia32": "0.28.1",
        "@esbuild/linux-loong64": "0.28.1",
        "@esbuild/linux-mips64el": "0.28.1",
        "@esbuild/linux-ppc64": "0.28.1",
        "@esbuild/linux-riscv64": "0.28.1",
        "@esbuild/linux-s390x": "0.28.1",
        "@esbuild/linux-x64": "0.28.1",
        "@esbuild/netbsd-arm64": "0.28.1",
        "@esbuild/netbsd-x64": "0.28.1",
        "@esbuild/openbsd-arm64": "0.28.1",
        "@esbuild/openbsd-x64": "0.28.1",
        "@esbuild/openharmony-arm64": "0.28.1",
        "@esbuild/sunos-x64": "0.28.1",
        "@esbuild/win32-arm64": "0.28.1",
        "@esbuild/win32-ia32": "0.28.1",
        "@esbuild/win32-x64": "0.28.1"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/event-target-shim": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
      "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/eventemitter3": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/eventemitter3/-/eventemitter3-4.0.7.tgz",
      "integrity": "sha512-8guHBZCwKnFhYdHr2ysuRWErTwhoN2X8XELRlrRwpmfeY2jjuUN4taQMsULKUVo1K4DvZl+0pgfyoysHxvmvEw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/eventsource": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-3.0.7.tgz",
      "integrity": "sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eventsource-parser": "^3.0.1"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.1.0.tgz",
      "integrity": "sha512-kJezFj9YFAMLeORyi7aCLxLbD5/qWMQnoMVlVPyHIll7lgRJCc3JVln9Vgl9nwQi0YkMnhdGTMNn7CkRRAptMg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/exif-parser": {
      "version": "0.1.12",
      "resolved": "https://registry.npmjs.org/exif-parser/-/exif-parser-0.1.12.tgz",
      "integrity": "sha512-c2bQfLNbMzLPmzQuOr8fy0csy84WmwnER81W88DzTp9CYNPJ6yzOj2EZAh9pywYpqHnshVLHQJ8WzldAyfY+Iw=="
    },
    "node_modules/exponential-backoff": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/exponential-backoff/-/exponential-backoff-3.1.3.tgz",
      "integrity": "sha512-ZgEeZXj30q+I0EN+CbSSpIyPaJ5HVQD18Z1m+u1FXbAeT94mr1zw50q4q6jiiC447Nl/YTcIYSAftiGqetwXCA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/express": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/express/-/express-5.2.1.tgz",
      "integrity": "sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.1",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/express-rate-limit": {
      "version": "8.6.1",
      "resolved": "https://registry.npmjs.org/express-rate-limit/-/express-rate-limit-8.6.1.tgz",
      "integrity": "sha512-0D493aP61w0TJ2A0wy27riRsO7FMQ7FK+KUHOKCSfPvYo0R55aiC6emCVgFUeShH0fq0ICPVzNcgoS+BsbXQCA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "ip-address": "^10.2.0"
      },
      "engines": {
        "node": ">= 16"
      },
      "funding": {
        "url": "https://github.com/sponsors/express-rate-limit"
      },
      "peerDependencies": {
        "express": ">= 4.11"
      }
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-uri": {
      "version": "3.1.4",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.1.4.tgz",
      "integrity": "sha512-8JnbkQ4juDyvYs4mgFGQqg4yCYtFDtUtmp2QIQq11ZZe5CFQ5wcqm1rqDgAh/QdMySuBnPzMUiJUNZG5N/AiQw==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fetch-cookie": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/fetch-cookie/-/fetch-cookie-2.2.0.tgz",
      "integrity": "sha512-h9AgfjURuCgA2+2ISl8GbavpUdR+WGAM2McW/ovn4tVccegp8ZqCKWSBR8uRdM8dDNlx5WdKRWxBYUwteLDCNQ==",
      "license": "Unlicense",
      "dependencies": {
        "set-cookie-parser": "^2.4.8",
        "tough-cookie": "^4.0.0"
      }
    },
    "node_modules/file-type": {
      "version": "21.3.4",
      "resolved": "https://registry.npmjs.org/file-type/-/file-type-21.3.4.tgz",
      "integrity": "sha512-Ievi/yy8DS3ygGvT47PjSfdFoX+2isQueoYP1cntFW1JLYAuS4GD7NUPGg4zv2iZfV52uDyk5w5Z0TdpRS6Q1g==",
      "license": "MIT",
      "dependencies": {
        "@tokenizer/inflate": "^0.4.1",
        "strtok3": "^10.3.4",
        "token-types": "^6.1.1",
        "uint8array-extras": "^1.4.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/file-type?sponsor=1"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.3.tgz",
      "integrity": "sha512-/zipXxyO6rGvuNGDiULY9MvEGSkb2gaG4GGH4ygMi0ZZzyMHdUZBmntJmx5x1G2VuPytCwGN4xsJP6cw+sK+vQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/follow-redirects": {
      "version": "1.16.0",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.0.tgz",
      "integrity": "sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/fs-extra": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-8.1.0.tgz",
      "integrity": "sha512-yhlQgA6mnOJUKOsRUFsgJdQCvkKhcz8tlZG5HBQfReYZy46OwLcY+Zia0mtdHsOo9y/hP+CxMN0TU9QxoOtG4g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.0",
        "jsonfile": "^4.0.0",
        "universalify": "^0.1.0"
      },
      "engines": {
        "node": ">=6 <7 || >=8"
      }
    },
    "node_modules/fs-minipass": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/fs-minipass/-/fs-minipass-3.0.3.tgz",
      "integrity": "sha512-XUBA9XClHbnJWSfBzjkm6RvPsyg3sryZt06BEQoXcF7EK/xpGaQYJgQKDJSUH5SGZ76Y7pFx1QBnXz09rU5Fbw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-east-asian-width": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/get-east-asian-width/-/get-east-asian-width-1.6.0.tgz",
      "integrity": "sha512-QRbvDIbx6YklUe6RxeTeleMR0yv3cYH6PsPZHcnVn7xv7zO1BHN8r0XETu8n6Ye3Q+ahtSarc3WgtNWmehIBfA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gifwrap": {
      "version": "0.10.1",
      "resolved": "https://registry.npmjs.org/gifwrap/-/gifwrap-0.10.1.tgz",
      "integrity": "sha512-2760b1vpJHNmLzZ/ubTtNnEx5WApN/PYWJvXvgS+tL1egTTthayFYIQQNi136FLEDcN/IyEY2EcGpIITD6eYUw==",
      "license": "MIT",
      "dependencies": {
        "image-q": "^4.0.0",
        "omggif": "^1.0.10"
      }
    },
    "node_modules/glob": {
      "version": "7.2.3",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz",
      "integrity": "sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==",
      "deprecated": "Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.1.1",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/glob-to-regexp": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/glob-to-regexp/-/glob-to-regexp-0.4.1.tgz",
      "integrity": "sha512-lkX1HJXwyMcprw/5YUZc2s7DrpAiHB21/V+E1rHUrVNokkvB6bqMzT0VfV6/86ZNabt1k14YOIaT7nDvOX3Iiw==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hono": {
      "version": "4.12.32",
      "resolved": "https://registry.npmjs.org/hono/-/hono-4.12.32.tgz",
      "integrity": "sha512-XcuyW9qE2kJn07PkecMOBd5Vq/hMy7mmGw+idz1yblbg9N17ijJODrvPkn7/dwL3Kulj8LcRJ69DLOWf91dRUg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=16.9.0"
      }
    },
    "node_modules/hosted-git-info": {
      "version": "9.0.3",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-9.0.3.tgz",
      "integrity": "sha512-Hc+ghLoSt6QaYZUv0WBiIvmMDZuZZ7oaDvdH8MbfOO4lOsxdXLEvuC6ePoGs9H1X9oCLyq6+NVN0MKqD+ydxyg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "lru-cache": "^11.1.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/hosted-git-info/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/html-escaper": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/html-escaper/-/html-escaper-2.0.2.tgz",
      "integrity": "sha512-H2iMtd0I4Mt5eYiapRdIDjp+XzelXQ0tFE4JS7YFwFevXXMmOp9myNrUvCg0D6ws8iqkRPBfKHgbwig1SmlLfg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/htmlparser2": {
      "version": "10.1.0",
      "resolved": "https://registry.npmjs.org/htmlparser2/-/htmlparser2-10.1.0.tgz",
      "integrity": "sha512-VTZkM9GWRAtEpveh7MSF6SjjrpNVNNVJfFup7xTY3UpFtm67foy9HDVXneLtFVt4pMz5kZtgNcvCniNFb1hlEQ==",
      "dev": true,
      "funding": [
        "https://github.com/fb55/htmlparser2?sponsor=1",
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.3",
        "domutils": "^3.2.2",
        "entities": "^7.0.1"
      }
    },
    "node_modules/htmlparser2/node_modules/entities": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/entities/-/entities-7.0.1.tgz",
      "integrity": "sha512-TWrgLOFUQTH994YUyl1yT4uyavY5nNB5muff+RtWaqNVCAK408b5ZnnbNAUEWLTCpum9w6arT70i1XdQ4UeOPA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/http-cache-semantics": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/http-cache-semantics/-/http-cache-semantics-4.2.0.tgz",
      "integrity": "sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/http-proxy": {
      "version": "1.18.1",
      "resolved": "https://registry.npmjs.org/http-proxy/-/http-proxy-1.18.1.tgz",
      "integrity": "sha512-7mz/721AbnJwIVbnaSv1Cz3Am0ZLT/UBwkC92VlxhXv/k/BBQfM2fXElQNC27BVGr0uwUpplYPQM9LnaBMR5NQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eventemitter3": "^4.0.0",
        "follow-redirects": "^1.0.0",
        "requires-port": "^1.0.0"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/http-proxy-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.2.tgz",
      "integrity": "sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.0",
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/ignore-walk": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/ignore-walk/-/ignore-walk-8.0.0.tgz",
      "integrity": "sha512-FCeMZT4NiRQGh+YkeKMtWrOmBgWjHjMJ26WQWrRQyoyzqevdaGSakUaJW5xQYmjLlUVk2qUnCjYVBax9EKKg8A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minimatch": "^10.0.3"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/ignore-walk/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/ignore-walk/node_modules/brace-expansion": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.8.tgz",
      "integrity": "sha512-JZyDyq3D4AUifKTPOB7DELf6XsB3WdPuNxCtob1vFXPsSXhdAiHBWJ/tJ8HAc9aH84BK+5JFZLNkJKx3G9kzQg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/ignore-walk/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/image-q": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/image-q/-/image-q-4.0.0.tgz",
      "integrity": "sha512-PfJGVgIfKQJuq3s0tTDOKtztksibuUEbJQIYT3by6wctQo+Rdlh7ef4evJ5NCdxY4CfMbvFkocEwbl4BF8RlJw==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "16.9.1"
      }
    },
    "node_modules/image-q/node_modules/@types/node": {
      "version": "16.9.1",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-16.9.1.tgz",
      "integrity": "sha512-QpLcX9ZSsq3YYUUnD3nFDY8H7wctAhQj/TFKL8Ya8v5fMm3CFXxo8zStsLAl780ltoYoo1WvKUVGBQK+1ifr7g==",
      "license": "MIT"
    },
    "node_modules/immutable": {
      "version": "5.1.9",
      "resolved": "https://registry.npmjs.org/immutable/-/immutable-5.1.9.tgz",
      "integrity": "sha512-m8nVez3rwrgmWxtLMt1ZYXB2Lv7OKYn/disyxAlSDYAlKSlFoPPfIAmAM/M5xqL4m4C/wAPw7S2/CNaUii1Hxg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/ini": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/ini/-/ini-5.0.0.tgz",
      "integrity": "sha512-+N0ngpO3e7cRUWOJAS7qw0IZIVc6XPrW4MlFBdD066F2L4k1L6ker3hLqSq7iXxU5tgS4WGkIUElWn5vogAEnw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/ip-address": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-10.3.1.tgz",
      "integrity": "sha512-1e9d3kb97NHJTIJDZW9rKqW2h6+dFa50Dy0fpPSMQp2ADje5gvKsXmdiK6dwY5t76TaTt5+P5N1Y/LoToIxP6g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-4.0.0.tgz",
      "integrity": "sha512-O4L094N2/dZ7xqVdrXhh9r1KODPJpFms8B5sGdJLPy664AgvXsreZUyCQQNItZRDlYug4xStLjNp/sz3HvBowQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-interactive": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-interactive/-/is-interactive-2.0.0.tgz",
      "integrity": "sha512-qP1vozQRI+BMOPcjFzrjXuQvdak2pHNUMZoeG2eRbiSqyvbEf/wQtEOTOX1guk6E3t36RkaqiSt8A/6YElNxLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-unicode-supported": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-2.1.0.tgz",
      "integrity": "sha512-mE00Gnza5EEB3Ds0HfMyllZzbBrmLOX3vfWoj9A9PEnTfratQ/BcaJOuMhnkhjXvb2+FkY3VuHqtAGpTPmglFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/isbinaryfile": {
      "version": "4.0.10",
      "resolved": "https://registry.npmjs.org/isbinaryfile/-/isbinaryfile-4.0.10.tgz",
      "integrity": "sha512-iHrqe5shvBUcFbmZq9zOQHBoeOhZJu6RQGrDpBgenUm/Am+F3JM2MgQj+rK3Z601fzrL5gLZWtAPH2OBaSVcyw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/gjtorikian/"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/istanbul-lib-coverage": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/istanbul-lib-coverage/-/istanbul-lib-coverage-3.2.2.tgz",
      "integrity": "sha512-O8dpsF+r0WV/8MNRKfnmrtCWhuKjxrq2w+jpzBL5UZKTi2LeVWnWOmWRxFlesJONmc+wLAGvKQZEOanko0LFTg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/istanbul-lib-instrument": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/istanbul-lib-instrument/-/istanbul-lib-instrument-6.0.3.tgz",
      "integrity": "sha512-Vtgk7L/R2JHyyGW07spoFlB8/lpjiOLTjMdms6AFMraYt3BaJauod/NGrfnVG/y4Ix1JEuMRPDPEj2ua+zz1/Q==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@babel/core": "^7.23.9",
        "@babel/parser": "^7.23.9",
        "@istanbuljs/schema": "^0.1.3",
        "istanbul-lib-coverage": "^3.2.0",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-report": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-report/-/istanbul-lib-report-3.0.1.tgz",
      "integrity": "sha512-GCfE1mtsHGOELCU8e/Z7YWzpmybrx/+dSTfLrvY8qRmaY6zXTKWn6WQIjaAFw069icm6GVMNkgu0NzI4iPZUNw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "istanbul-lib-coverage": "^3.0.0",
        "make-dir": "^4.0.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-source-maps": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-source-maps/-/istanbul-lib-source-maps-4.0.1.tgz",
      "integrity": "sha512-n3s8EwkdFIJCG3BPKBYvskgXGoy88ARzvegkitk60NxRdwltLOTaH7CUiMRXvwYorl0Q712iEjcWB+fK/MrWVw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "debug": "^4.1.1",
        "istanbul-lib-coverage": "^3.0.0",
        "source-map": "^0.6.1"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/istanbul-lib-source-maps/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/istanbul-reports": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/istanbul-reports/-/istanbul-reports-3.2.0.tgz",
      "integrity": "sha512-HGYWWS/ehqTV3xN10i23tkPkpH46MLCIMFNCaaKNavAXTF1RkqxawEPtnjnGZ6XKSInBKkiOA5BKS+aZiY3AvA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "html-escaper": "^2.0.0",
        "istanbul-lib-report": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/jasmine-core": {
      "version": "5.9.0",
      "resolved": "https://registry.npmjs.org/jasmine-core/-/jasmine-core-5.9.0.tgz",
      "integrity": "sha512-OMUvF1iI6+gSRYOhMrH4QYothVLN9C3EJ6wm4g7zLJlnaTl8zbaPOr0bTw70l7QxkoM7sVFOWo83u9B2Fe2Zng==",
      "dev": true,
      "license": "MIT",
      "peer": true
    },
    "node_modules/jimp": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/jimp/-/jimp-1.6.1.tgz",
      "integrity": "sha512-hNQh6rZtWfSVWSNVmvq87N5BPJsNH7k7I7qyrXf9DOma9xATQk3fsyHazCQe51nCjdkoWdTmh0vD7bjVSLoxxw==",
      "license": "MIT",
      "dependencies": {
        "@jimp/core": "1.6.1",
        "@jimp/diff": "1.6.1",
        "@jimp/js-bmp": "1.6.1",
        "@jimp/js-gif": "1.6.1",
        "@jimp/js-jpeg": "1.6.1",
        "@jimp/js-png": "1.6.1",
        "@jimp/js-tiff": "1.6.1",
        "@jimp/plugin-blit": "1.6.1",
        "@jimp/plugin-blur": "1.6.1",
        "@jimp/plugin-circle": "1.6.1",
        "@jimp/plugin-color": "1.6.1",
        "@jimp/plugin-contain": "1.6.1",
        "@jimp/plugin-cover": "1.6.1",
        "@jimp/plugin-crop": "1.6.1",
        "@jimp/plugin-displace": "1.6.1",
        "@jimp/plugin-dither": "1.6.1",
        "@jimp/plugin-fisheye": "1.6.1",
        "@jimp/plugin-flip": "1.6.1",
        "@jimp/plugin-hash": "1.6.1",
        "@jimp/plugin-mask": "1.6.1",
        "@jimp/plugin-print": "1.6.1",
        "@jimp/plugin-quantize": "1.6.1",
        "@jimp/plugin-resize": "1.6.1",
        "@jimp/plugin-rotate": "1.6.1",
        "@jimp/plugin-threshold": "1.6.1",
        "@jimp/types": "1.6.1",
        "@jimp/utils": "1.6.1"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/jose": {
      "version": "6.2.4",
      "resolved": "https://registry.npmjs.org/jose/-/jose-6.2.4.tgz",
      "integrity": "sha512-N8acGzVsQy6M/fjFcxtysNc4Q379TcM5dM/qKkNtsHFji88yANnXTr7BLeP75iPnFwBfQzM/jg2BZ9+HZrHCZA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/jpeg-js": {
      "version": "0.4.4",
      "resolved": "https://registry.npmjs.org/jpeg-js/-/jpeg-js-0.4.4.tgz",
      "integrity": "sha512-WZzeDOEtTOBK4Mdsar0IqEU5sMr3vSV2RqkAIzUEV2BHnUfKGyswWFPFwK5EeDo93K3FohSHbLAjj0s1Wzd+dg==",
      "license": "BSD-3-Clause"
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-parse-even-better-errors": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-5.0.0.tgz",
      "integrity": "sha512-ZF1nxZ28VhQouRWhUcVlUIN3qwSgPuswK05s/HIaoetAoE/9tngVmCHjSxmSQPav1nd+lPtTL0YZ/2AFdR/iYQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-schema-typed": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/json-schema-typed/-/json-schema-typed-8.0.2.tgz",
      "integrity": "sha512-fQhoXdcvc3V28x7C7BMs4P5+kNlgUURe2jmUT1T//oBRMDrqy1QPelJimwZGo7Hg9VPV3EQV5Bnq4hbFy2vetA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsonc-parser": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.3.1.tgz",
      "integrity": "sha512-HUgH65KyejrUFPvHFPbqOY0rsFip3Bo5wb4ngvdi1EpCYWUQDC5V+Y7mZws+DLkr4M//zQJoanu1SP+87Dv1oQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/jsonfile": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-4.0.0.tgz",
      "integrity": "sha512-m6F1R3z8jjlf2imQHS2Qez5sjKWQzbuuhuJ/FKYFRZvPE3PuHcSMVZzfsLhGVOkfd20obL5SWEBew5ShlquNxg==",
      "dev": true,
      "license": "MIT",
      "optionalDependencies": {
        "graceful-fs": "^4.1.6"
      }
    },
    "node_modules/jsonparse": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/jsonparse/-/jsonparse-1.3.1.tgz",
      "integrity": "sha512-POQXvpdL69+CluYsillJ7SUhKvytYjW9vG/GKpnf+xP8UWgYEM/RaMzHHofbALDiKbbP1W8UEYmgGl39WkPZsg==",
      "dev": true,
      "engines": [
        "node >= 0.2.0"
      ],
      "license": "MIT"
    },
    "node_modules/karma": {
      "version": "6.4.4",
      "resolved": "https://registry.npmjs.org/karma/-/karma-6.4.4.tgz",
      "integrity": "sha512-LrtUxbdvt1gOpo3gxG+VAJlJAEMhbWlM4YrFQgql98FwF7+K8K12LYO4hnDdUkNjeztYrOXEMqgTajSWgmtI/w==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@colors/colors": "1.5.0",
        "body-parser": "^1.19.0",
        "braces": "^3.0.2",
        "chokidar": "^3.5.1",
        "connect": "^3.7.0",
        "di": "^0.0.1",
        "dom-serialize": "^2.2.1",
        "glob": "^7.1.7",
        "graceful-fs": "^4.2.6",
        "http-proxy": "^1.18.1",
        "isbinaryfile": "^4.0.8",
        "lodash": "^4.17.21",
        "log4js": "^6.4.1",
        "mime": "^2.5.2",
        "minimatch": "^3.0.4",
        "mkdirp": "^0.5.5",
        "qjobs": "^1.2.0",
        "range-parser": "^1.2.1",
        "rimraf": "^3.0.2",
        "socket.io": "^4.7.2",
        "source-map": "^0.6.1",
        "tmp": "^0.2.1",
        "ua-parser-js": "^0.7.30",
        "yargs": "^16.1.1"
      },
      "bin": {
        "karma": "bin/karma"
      },
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/karma-chrome-launcher": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/karma-chrome-launcher/-/karma-chrome-launcher-3.2.0.tgz",
      "integrity": "sha512-rE9RkUPI7I9mAxByQWkGJFXfFD6lE4gC5nPuZdobf/QdTEJI6EU4yIay/cfU/xV4ZxlM5JiTv7zWYgA64NpS5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which": "^1.2.1"
      }
    },
    "node_modules/karma-chrome-launcher/node_modules/which": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/which/-/which-1.3.1.tgz",
      "integrity": "sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "which": "bin/which"
      }
    },
    "node_modules/karma-coverage": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/karma-coverage/-/karma-coverage-2.2.1.tgz",
      "integrity": "sha512-yj7hbequkQP2qOSb20GuNSIyE//PgJWHwC2IydLE6XRtsnaflv+/OSGNssPjobYUlhVVagy99TQpqUt3vAUG7A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "istanbul-lib-coverage": "^3.2.0",
        "istanbul-lib-instrument": "^5.1.0",
        "istanbul-lib-report": "^3.0.0",
        "istanbul-lib-source-maps": "^4.0.1",
        "istanbul-reports": "^3.0.5",
        "minimatch": "^3.0.4"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/karma-coverage/node_modules/istanbul-lib-instrument": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/istanbul-lib-instrument/-/istanbul-lib-instrument-5.2.1.tgz",
      "integrity": "sha512-pzqtp31nLv/XFOzXGuvhCb8qhjmTVo5vjVk19XE4CRlSWz0KoeJ3bw9XsA7nOp9YBf4qHjwBxkDzKcME/J29Yg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@babel/core": "^7.12.3",
        "@babel/parser": "^7.14.7",
        "@istanbuljs/schema": "^0.1.2",
        "istanbul-lib-coverage": "^3.2.0",
        "semver": "^6.3.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/karma-coverage/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/karma-jasmine": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/karma-jasmine/-/karma-jasmine-5.1.0.tgz",
      "integrity": "sha512-i/zQLFrfEpRyQoJF9fsCdTMOF5c2dK7C7OmsuKg2D0YSsuZSfQDiLuaiktbuio6F2wiCsZSnSnieIQ0ant/uzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "jasmine-core": "^4.1.0"
      },
      "engines": {
        "node": ">=12"
      },
      "peerDependencies": {
        "karma": "^6.0.0"
      }
    },
    "node_modules/karma-jasmine-html-reporter": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/karma-jasmine-html-reporter/-/karma-jasmine-html-reporter-2.1.0.tgz",
      "integrity": "sha512-sPQE1+nlsn6Hwb5t+HHwyy0A1FNCVKuL1192b+XNauMYWThz2kweiBVW1DqloRpVvZIJkIoHVB7XRpK78n1xbQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "jasmine-core": "^4.0.0 || ^5.0.0",
        "karma": "^6.0.0",
        "karma-jasmine": "^5.0.0"
      }
    },
    "node_modules/karma-jasmine/node_modules/jasmine-core": {
      "version": "4.6.1",
      "resolved": "https://registry.npmjs.org/jasmine-core/-/jasmine-core-4.6.1.tgz",
      "integrity": "sha512-VYz/BjjmC3klLJlLwA4Kw8ytk0zDSmbbDLNs794VnWmkcCB7I9aAL/D48VNQtmITyPvea2C3jdUMfc3kAoy0PQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/karma/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/karma/node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/karma/node_modules/body-parser": {
      "version": "1.20.6",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.6.tgz",
      "integrity": "sha512-p5tAzS57i5MV9fZFDj9LeIiTZEufbSe2eDozP+ElheSUq1m74CRq1jI4mYNDdVs9vQztXFLuk/Gd6BWTdwRJ5g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "~1.2.0",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "on-finished": "~2.4.1",
        "qs": "~6.15.1",
        "raw-body": "~2.5.3",
        "type-is": "~1.6.18",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/karma/node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/karma/node_modules/cliui": {
      "version": "7.0.4",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-7.0.4.tgz",
      "integrity": "sha512-OcRE68cOsVMXp1Yvonl/fzkQOyjLSu/8bhPDfQt0e0/Eb283TKP20Fs2MqoPsr9SwA595rRCA+QMzYc9nBP+JQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.0",
        "wrap-ansi": "^7.0.0"
      }
    },
    "node_modules/karma/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/karma/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/karma/node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/karma/node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/karma/node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/karma/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/karma/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/karma/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/karma/node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/karma/node_modules/raw-body": {
      "version": "2.5.3",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.3.tgz",
      "integrity": "sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/karma/node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/karma/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/karma/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/karma/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/karma/node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/karma/node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/karma/node_modules/yargs": {
      "version": "16.2.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-16.2.2.tgz",
      "integrity": "sha512-Nt9ZJjXTv5R8MHbqby/wXQ6Gi0Bb3TcYZkR1bzuL4yB2OxWPkXknz513gEF0GoA6tn00UpbPvERW8rzCuWCA6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^7.0.2",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.0",
        "y18n": "^5.0.5",
        "yargs-parser": "^20.2.2"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/karma/node_modules/yargs-parser": {
      "version": "20.2.9",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-20.2.9.tgz",
      "integrity": "sha512-y11nGElTIV+CT3Zv9t7VKl+Q3hTQoT9a1Qzezhhl6Rp21gJ/IVTW7Z3y9EWXhuUBC2Shnf+DX0antecpAwSP8w==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/listr2": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/listr2/-/listr2-9.0.1.tgz",
      "integrity": "sha512-SL0JY3DaxylDuo/MecFeiC+7pedM0zia33zl0vcjgwcq1q1FWWF1To9EIauPbl8GbMCU0R2e0uJ8bZunhYKD2g==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "cli-truncate": "^4.0.0",
        "colorette": "^2.0.20",
        "eventemitter3": "^5.0.1",
        "log-update": "^6.1.0",
        "rfdc": "^1.4.1",
        "wrap-ansi": "^9.0.0"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/listr2/node_modules/eventemitter3": {
      "version": "5.0.4",
      "resolved": "https://registry.npmjs.org/eventemitter3/-/eventemitter3-5.0.4.tgz",
      "integrity": "sha512-mlsTRyGaPBjPedk6Bvw+aqbsXDtoAyAzm5MO7JgU+yVRyMQ5O8bD4Kcci7BS85f93veegeCPkL8R4GLClnjLFw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/listr2/node_modules/wrap-ansi": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-9.0.2.tgz",
      "integrity": "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "string-width": "^7.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/lmdb": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/lmdb/-/lmdb-3.4.2.tgz",
      "integrity": "sha512-nwVGUfTBUwJKXd6lRV8pFNfnrCC1+l49ESJRM19t/tFb/97QfJEixe5DYRvug5JO7DSFKoKaVy7oGMt5rVqZvg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "msgpackr": "^1.11.2",
        "node-addon-api": "^6.1.0",
        "node-gyp-build-optional-packages": "5.2.2",
        "ordered-binary": "^1.5.3",
        "weak-lru-cache": "^1.2.2"
      },
      "bin": {
        "download-lmdb-prebuilds": "bin/download-prebuilds.js"
      },
      "optionalDependencies": {
        "@lmdb/lmdb-darwin-arm64": "3.4.2",
        "@lmdb/lmdb-darwin-x64": "3.4.2",
        "@lmdb/lmdb-linux-arm": "3.4.2",
        "@lmdb/lmdb-linux-arm64": "3.4.2",
        "@lmdb/lmdb-linux-x64": "3.4.2",
        "@lmdb/lmdb-win32-arm64": "3.4.2",
        "@lmdb/lmdb-win32-x64": "3.4.2"
      }
    },
    "node_modules/lodash": {
      "version": "4.18.1",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.18.1.tgz",
      "integrity": "sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/log-symbols": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-6.0.0.tgz",
      "integrity": "sha512-i24m8rpwhmPIS4zscNzK6MSEhk0DUWa/8iYQWxhffV8jkI4Phvs3F+quL5xvS0gdQR0FyTCMMH33Y78dDTzzIw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chalk": "^5.3.0",
        "is-unicode-supported": "^1.3.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-symbols/node_modules/is-unicode-supported": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-1.3.0.tgz",
      "integrity": "sha512-43r2mRvz+8JRIKnWJ+3j8JtjRKZ6GmjzfaE/qiBJnikNnYv/6bagRJ1kUhNk8R5EX/GkobD+r+sfxCPJsiKBLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-update": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/log-update/-/log-update-6.1.0.tgz",
      "integrity": "sha512-9ie8ItPR6tjY5uYJh8K/Zrv/RMZ5VOlOWvtZdEHYSTFKZfIBPQa9tOAEeAWhd+AnIneLJ22w5fjOYtoutpWq5w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-escapes": "^7.0.0",
        "cli-cursor": "^5.0.0",
        "slice-ansi": "^7.1.0",
        "strip-ansi": "^7.1.0",
        "wrap-ansi": "^9.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-update/node_modules/is-fullwidth-code-point": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-5.1.0.tgz",
      "integrity": "sha512-5XHYaSyiqADb4RnZ1Bdad6cPp8Toise4TzEjcOYDHZkTCbKgiUl7WTUCpNWHuxmDt91wnsZBc9xinNzopv3JMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-east-asian-width": "^1.3.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-update/node_modules/slice-ansi": {
      "version": "7.1.2",
      "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-7.1.2.tgz",
      "integrity": "sha512-iOBWFgUX7caIZiuutICxVgX1SdxwAVFFKwt1EvMYYec/NWO5meOJ6K5uQxhrYBdQJne4KxiqZc+KptFOWFSI9w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "is-fullwidth-code-point": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
      }
    },
    "node_modules/log-update/node_modules/wrap-ansi": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-9.0.2.tgz",
      "integrity": "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "string-width": "^7.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/log4js": {
      "version": "6.9.1",
      "resolved": "https://registry.npmjs.org/log4js/-/log4js-6.9.1.tgz",
      "integrity": "sha512-1somDdy9sChrr9/f4UlzhdaGfDR2c/SaD2a4T7qEkG4jTS57/B3qmnjLYePwQ8cqWnUHZI0iAKxMBpCZICiZ2g==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "date-format": "^4.0.14",
        "debug": "^4.3.4",
        "flatted": "^3.2.7",
        "rfdc": "^1.3.0",
        "streamroller": "^3.1.5"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.17",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.17.tgz",
      "integrity": "sha512-sNPKHvyjVf7gyjwS4xGTaW/mCnF8wnjtifKBEhxfZ7E/S8tQ0rssrwGNn6q8JH/ohItJfSQp9mBtQYuTlH5QnA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0"
      }
    },
    "node_modules/make-dir": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-4.0.0.tgz",
      "integrity": "sha512-hXdUTZYIVOt1Ex//jAQi+wTZZpUpwBj/0QsOzqegb3rGMMeJiSEu5xLHnYfBrRV4RH2+OCSOO95Is/7x1WJ4bw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.5.3"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/make-fetch-happen": {
      "version": "15.0.6",
      "resolved": "https://registry.npmjs.org/make-fetch-happen/-/make-fetch-happen-15.0.6.tgz",
      "integrity": "sha512-Je0fLJ0F5atA7F+eIlLzk+Wkcl57JDf4kf+EW8xiP5E31xOQxkIxTbgf1Oi1Lw9tRI9UEMRdI5Vz2xTzoNU1Jw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@gar/promise-retry": "^1.0.0",
        "@npmcli/agent": "^4.0.0",
        "@npmcli/redact": "^4.0.0",
        "cacache": "^20.0.1",
        "http-cache-semantics": "^4.1.1",
        "minipass": "^7.0.2",
        "minipass-fetch": "^5.0.0",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "negotiator": "^1.0.0",
        "proc-log": "^6.0.0",
        "ssri": "^13.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/make-fetch-happen/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.1.tgz",
      "integrity": "sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/micromatch/node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/mime": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-2.6.0.tgz",
      "integrity": "sha512-USPkMeET31rOMiarsBNIHZKLGgvKc/LrjofAnBlOttf5ajRvqiRA8QsenbcooctK6d6Ts6aqZXBA+XbkKthiQg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/mimic-function": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/mimic-function/-/mimic-function-5.0.1.tgz",
      "integrity": "sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mini-svg-data-uri": {
      "version": "1.4.4",
      "resolved": "https://registry.npmjs.org/mini-svg-data-uri/-/mini-svg-data-uri-1.4.4.tgz",
      "integrity": "sha512-r9deDe9p5FJUPZAk3A59wGH7Ii9YrjjWw0jmw/liSbHl2CHiyXj6FcDXDu2K3TjVAXqiJdaw3xxwlZZr9E6nHg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "mini-svg-data-uri": "cli.js"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.3.tgz",
      "integrity": "sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-collect": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/minipass-collect/-/minipass-collect-2.0.1.tgz",
      "integrity": "sha512-D7V8PO9oaz7PWGLbCACuI1qEOsq7UKfLotx/C0Aet43fCUB/wfQ7DYeq2oR/svFJGYDHPr38SHATeaj/ZoKHKw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-fetch": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/minipass-fetch/-/minipass-fetch-5.0.2.tgz",
      "integrity": "sha512-2d0q2a8eCi2IRg/IGubCNRJoYbA1+YPXAzQVRFmB45gdGZafyivnZ5YSEfo3JikbjGxOdntGFvBQGqaSMXlAFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minipass": "^7.0.3",
        "minipass-sized": "^2.0.0",
        "minizlib": "^3.0.1"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      },
      "optionalDependencies": {
        "iconv-lite": "^0.7.2"
      }
    },
    "node_modules/minipass-flush": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/minipass-flush/-/minipass-flush-1.0.7.tgz",
      "integrity": "sha512-TbqTz9cUwWyHS2Dy89P3ocAGUGxKjjLuR9z8w4WUTGAVgEj17/4nhgo2Du56i0Fm3Pm30g4iA8Lcqctc76jCzA==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/minipass-flush/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-flush/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/minipass-pipeline": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/minipass-pipeline/-/minipass-pipeline-1.2.4.tgz",
      "integrity": "sha512-xuIq7cIOt09RPRJ19gdi4b+RiNvDFYe5JH+ggNvBqGqpQXcru3PcRmOZuHBKWK1Txf9+cQ+HMVN4d6z46LZP7A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/minipass-sized": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/minipass-sized/-/minipass-sized-2.0.0.tgz",
      "integrity": "sha512-zSsHhto5BcUVM2m1LurnXY6M//cGhVaegT71OfOXoprxT6o780GZd792ea6FfrQkuU4usHZIUczAQMRUE2plzA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minizlib": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/minizlib/-/minizlib-3.1.0.tgz",
      "integrity": "sha512-KZxYo1BUkWD2TVFLr0MQoM8vUUigWD3LlD83a/75BqC+4qE0Hb1Vo5v1FgcfaNXvfXzr+5EhQ6ing/CaBijTlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mkdirp": {
      "version": "0.5.6",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.6.tgz",
      "integrity": "sha512-FP+p8RB8OWpF3YZBCrP5gtADmtXApB5AMLn+vdyA+PyxCjrCs00mjyUozssO33cwDeT3wNGdLxJ5M//YqtHAJw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.6"
      },
      "bin": {
        "mkdirp": "bin/cmd.js"
      }
    },
    "node_modules/mrmime": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mrmime/-/mrmime-2.0.1.tgz",
      "integrity": "sha512-Y3wQdFg2Va6etvQ5I82yUhGdsKrcYox6p7FfL1LbK2J4V01F9TGlepTIhnK24t7koZibmg82KGglhA1XK5IsLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/msgpackr": {
      "version": "1.12.1",
      "resolved": "https://registry.npmjs.org/msgpackr/-/msgpackr-1.12.1.tgz",
      "integrity": "sha512-4EUH9tQHnMmEgzW/MdAP0KIfa1T9AF+htl0ffe2n5vb2EKn9y2co8ccpgWko6S52Jy1PQZKwRnx5/KkYjtd9MQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "optionalDependencies": {
        "msgpackr-extract": "^3.0.2"
      }
    },
    "node_modules/msgpackr-extract": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/msgpackr-extract/-/msgpackr-extract-3.0.4.tgz",
      "integrity": "sha512-4kmO/MdyUIkLIvTPr8VHLil4AtoKIoniWPIEk5+CDy0xnWC84azhSFmuJ7PxZdsYtiP5kEeQsORAVIeMgxT+Hw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "node-gyp-build-optional-packages": "5.2.2"
      },
      "bin": {
        "download-msgpackr-prebuilds": "bin/download-prebuilds.js"
      },
      "optionalDependencies": {
        "@msgpackr-extract/msgpackr-extract-darwin-arm64": "3.0.4",
        "@msgpackr-extract/msgpackr-extract-darwin-x64": "3.0.4",
        "@msgpackr-extract/msgpackr-extract-linux-arm": "3.0.4",
        "@msgpackr-extract/msgpackr-extract-linux-arm64": "3.0.4",
        "@msgpackr-extract/msgpackr-extract-linux-x64": "3.0.4",
        "@msgpackr-extract/msgpackr-extract-win32-x64": "3.0.4"
      }
    },
    "node_modules/mute-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-2.0.0.tgz",
      "integrity": "sha512-WWdIxpyjEn+FhQJQQv9aQAYlHoNVdzIzUySNV1gHUPDSdZJ3yZn7pAAbQcV7B56Mvu881q9FZV+0Vx2xC44VWA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.16",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.16.tgz",
      "integrity": "sha512-bzlKTyNJ7+LdGIIwy8ijFpIqEQIvafahV7eYykJ8Cvh42EdJeODoJ6gUJXpQJvej1BddH8OqTXZNE/KfbWAu8Q==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/negotiator": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
      "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ngx-image-cropper": {
      "version": "9.1.6",
      "resolved": "https://registry.npmjs.org/ngx-image-cropper/-/ngx-image-cropper-9.1.6.tgz",
      "integrity": "sha512-b250YJ+jZovfqIj8vdEOrpEFay34be5f1Hpvg6Db68VMlvdyyuzboJdR0gCupbXtVcG6qQ86L7YG+SYxXJwApw==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "peerDependencies": {
        "@angular/common": ">=17.3.0",
        "@angular/core": ">=17.3.0"
      }
    },
    "node_modules/ngx-paypal": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/ngx-paypal/-/ngx-paypal-11.0.0.tgz",
      "integrity": "sha512-ABISig5C868S3KAylZr1iG9/ydjBDqqKOyuPBpaPeqDfkBz2kSZsgX+JXvrS4oT7C3SFf3NOrN3h1ECaltx1/g==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "peerDependencies": {
        "@angular/common": ">= 15.0.0",
        "@angular/core": ">= 15.0.0"
      }
    },
    "node_modules/node-addon-api": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-6.1.0.tgz",
      "integrity": "sha512-+eawOlIgy680F0kBzPUNFhMZGtJ1YmqM6l4+Crf4IkImjYrO/mqPwRMh352g23uIaQKFItcQ64I7KMaJxHgAVA==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/node-fetch": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
      "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
      "license": "MIT",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/node-gyp": {
      "version": "12.4.0",
      "resolved": "https://registry.npmjs.org/node-gyp/-/node-gyp-12.4.0.tgz",
      "integrity": "sha512-OMcPNvqTCFUnNaBlmdgq+lfNqY7gTiSmNRDjY3uAXRyudeKZEZxu3CLtjMQrx4zZxCX2b/mpNqTtwuCJgXhHkw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "env-paths": "^2.2.0",
        "exponential-backoff": "^3.1.1",
        "graceful-fs": "^4.2.6",
        "nopt": "^9.0.0",
        "proc-log": "^6.0.0",
        "semver": "^7.3.5",
        "tar": "^7.5.4",
        "tinyglobby": "^0.2.12",
        "undici": "^6.25.0",
        "which": "^6.0.0"
      },
      "bin": {
        "node-gyp": "bin/node-gyp.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/node-gyp-build-optional-packages": {
      "version": "5.2.2",
      "resolved": "https://registry.npmjs.org/node-gyp-build-optional-packages/-/node-gyp-build-optional-packages-5.2.2.tgz",
      "integrity": "sha512-s+w+rBWnpTMwSFbaE0UXsRlg7hU4FjekKU4eyAih5T8nJuNZT1nNsskXpxmeqSK9UzkBl6UgRlnKc8hz8IEqOw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "detect-libc": "^2.0.1"
      },
      "bin": {
        "node-gyp-build-optional-packages": "bin.js",
        "node-gyp-build-optional-packages-optional": "optional.js",
        "node-gyp-build-optional-packages-test": "build-test.js"
      }
    },
    "node_modules/node-gyp/node_modules/isexe": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-4.0.0.tgz",
      "integrity": "sha512-FFUtZMpoZ8RqHS3XeXEmHWLA4thH+ZxCv2lOiPIn1Xc7CxrqhWzNSDzD+/chS/zbYezmiwWLdQC09JdQKmthOw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/node-gyp/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/node-gyp/node_modules/which": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/which/-/which-6.0.1.tgz",
      "integrity": "sha512-oGLe46MIrCRqX7ytPUf66EAYvdeMIZYn3WaocqqKZAxrBpkqHfL/qvTyJ/bTk5+AqHCjXmrv3CEWgy368zhRUg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^4.0.0"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.51",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.51.tgz",
      "integrity": "sha512-wRNIrw4DmVLKQlbgOMdkMx27Wrpzes2hh5Jtbi2bjPd+4wJstWIqP5A+lscnqbm0xxmT5Bpg8Lec5ItEBwx6BQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/nopt": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/nopt/-/nopt-9.0.0.tgz",
      "integrity": "sha512-Zhq3a+yFKrYwSBluL4H9XP3m3y5uvQkB/09CwDruCiRmR/UJYnn9W4R48ry0uGC70aeTPKLynBtscP9efFFcPw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "abbrev": "^4.0.0"
      },
      "bin": {
        "nopt": "bin/nopt.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/npm-bundled": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/npm-bundled/-/npm-bundled-5.0.0.tgz",
      "integrity": "sha512-JLSpbzh6UUXIEoqPsYBvVNVmyrjVZ1fzEFbqxKkTJQkWBO3xFzFT+KDnSKQWwOQNbuWRwt5LSD6HOTLGIWzfrw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "npm-normalize-package-bin": "^5.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-install-checks": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/npm-install-checks/-/npm-install-checks-8.0.0.tgz",
      "integrity": "sha512-ScAUdMpyzkbpxoNekQ3tNRdFI8SJ86wgKZSQZdUxT+bj0wVFpsEMWnkXP0twVe1gJyNF5apBWDJhhIbgrIViRA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "semver": "^7.1.1"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-normalize-package-bin": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/npm-normalize-package-bin/-/npm-normalize-package-bin-5.0.0.tgz",
      "integrity": "sha512-CJi3OS4JLsNMmr2u07OJlhcrPxCeOeP/4xq67aWNai6TNWWbTrlNDgl8NcFKVlcBKp18GPj+EzbNIgrBfZhsag==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-package-arg": {
      "version": "13.0.0",
      "resolved": "https://registry.npmjs.org/npm-package-arg/-/npm-package-arg-13.0.0.tgz",
      "integrity": "sha512-+t2etZAGcB7TbbLHfDwooV9ppB2LhhcT6A+L9cahsf9mEUAoQ6CktLEVvEnpD0N5CkX7zJqnPGaFtoQDy9EkHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "hosted-git-info": "^9.0.0",
        "proc-log": "^5.0.0",
        "semver": "^7.3.5",
        "validate-npm-package-name": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-packlist": {
      "version": "10.0.4",
      "resolved": "https://registry.npmjs.org/npm-packlist/-/npm-packlist-10.0.4.tgz",
      "integrity": "sha512-uMW73iajD8hiH4ZBxEV3HC+eTnppIqwakjOYuvgddnalIw2lJguKviK1pcUJDlIWm1wSJkchpDZDSVVsZEYRng==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "ignore-walk": "^8.0.0",
        "proc-log": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-packlist/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-pick-manifest": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/npm-pick-manifest/-/npm-pick-manifest-11.0.3.tgz",
      "integrity": "sha512-buzyCfeoGY/PxKqmBqn1IUJrZnUi1VVJTdSSRPGI60tJdUhUoSQFhs0zycJokDdOznQentgrpf8LayEHyyYlqQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "npm-install-checks": "^8.0.0",
        "npm-normalize-package-bin": "^5.0.0",
        "npm-package-arg": "^13.0.0",
        "semver": "^7.3.5"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-registry-fetch": {
      "version": "19.1.1",
      "resolved": "https://registry.npmjs.org/npm-registry-fetch/-/npm-registry-fetch-19.1.1.tgz",
      "integrity": "sha512-TakBap6OM1w0H73VZVDf44iFXsOS3h+L4wVMXmbWOQroZgFhMch0juN6XSzBNlD965yIKvWg2dfu7NSiaYLxtw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/redact": "^4.0.0",
        "jsonparse": "^1.3.1",
        "make-fetch-happen": "^15.0.0",
        "minipass": "^7.0.2",
        "minipass-fetch": "^5.0.0",
        "minizlib": "^3.0.1",
        "npm-package-arg": "^13.0.0",
        "proc-log": "^6.0.0"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/npm-registry-fetch/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/nth-check": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/nth-check/-/nth-check-2.1.1.tgz",
      "integrity": "sha512-lqjrjmaOoAnWfMmBPL+XNnynZh2+swxiX3WUE0s4yEHI6m+AwrK2UZOimIRl3X/4QctVqS8AiZjFqyOGrMXb/w==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/fb55/nth-check?sponsor=1"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/omggif": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/omggif/-/omggif-1.0.10.tgz",
      "integrity": "sha512-LMJTtvgc/nugXj0Vcrrs68Mn2D1r0zf630VNtqtpI1FEO7e+O9FP4gqs9AcnBaSEeoHIPm28u6qgPR0oyEpGSw==",
      "license": "MIT"
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/onetime": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-7.0.0.tgz",
      "integrity": "sha512-VXJjc87FScF88uafS3JllDgvAm+c/Slfz06lorj2uAY34rlUu0Nt+v8wreiImcrgAjjIHp1rXpTDlLOGw29WwQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mimic-function": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ora": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/ora/-/ora-8.2.0.tgz",
      "integrity": "sha512-weP+BZ8MVNnlCm8c0Qdc1WSWq4Qn7I+9CJGm7Qali6g44e/PUzbjNqJX5NJ9ljlNMosfJvg1fKEGILklK9cwnw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chalk": "^5.3.0",
        "cli-cursor": "^5.0.0",
        "cli-spinners": "^2.9.2",
        "is-interactive": "^2.0.0",
        "is-unicode-supported": "^2.0.0",
        "log-symbols": "^6.0.0",
        "stdin-discarder": "^0.2.2",
        "string-width": "^7.2.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ordered-binary": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/ordered-binary/-/ordered-binary-1.6.1.tgz",
      "integrity": "sha512-QkCdPooczexPLiXIrbVOPYkR3VO3T6v2OyKRkR1Xbhpy7/LAVXwahnRCgRp78Oe/Ehf0C/HATAxfSr6eA1oX+w==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/p-map": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/p-map/-/p-map-7.0.6.tgz",
      "integrity": "sha512-I4Prw6ivkd6p8PiYR1tXASOAOBzIJwu0TB7fqaX0c/8c3QAehNYmX57EijyGGGBt3c/BIowGwV03RVBtXvHEVg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/pacote": {
      "version": "21.5.1",
      "resolved": "https://registry.npmjs.org/pacote/-/pacote-21.5.1.tgz",
      "integrity": "sha512-KvcJ9iy3crysCsgqc4+PknH/w6jkrp8JN36mpZBPwNaDRwTfMZD37YzRazNstiZUOhuF5pno9f78n9mEJBavwg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@gar/promise-retry": "^1.0.0",
        "@npmcli/git": "^7.0.0",
        "@npmcli/installed-package-contents": "^4.0.0",
        "@npmcli/package-json": "^7.0.0",
        "@npmcli/promise-spawn": "^9.0.0",
        "@npmcli/run-script": "^10.0.0",
        "cacache": "^20.0.0",
        "fs-minipass": "^3.0.0",
        "minipass": "^7.0.2",
        "npm-package-arg": "^13.0.0",
        "npm-packlist": "^10.0.1",
        "npm-pick-manifest": "^11.0.1",
        "npm-registry-fetch": "^19.0.0",
        "proc-log": "^6.0.0",
        "sigstore": "^4.0.0",
        "ssri": "^13.0.0",
        "tar": "^7.4.3"
      },
      "bin": {
        "pacote": "bin/index.js"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/pacote/node_modules/proc-log": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-6.1.0.tgz",
      "integrity": "sha512-iG+GYldRf2BQ0UDUAd6JQ/RwzaQy6mXmsk/IzlYyal4A4SNFw54MeH4/tLkF4I5WoWG9SQwuqWzS99jaFQHBuQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/pako": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/pako/-/pako-1.0.11.tgz",
      "integrity": "sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==",
      "license": "(MIT AND Zlib)"
    },
    "node_modules/parse-bmfont-ascii": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/parse-bmfont-ascii/-/parse-bmfont-ascii-1.0.6.tgz",
      "integrity": "sha512-U4RrVsUFCleIOBsIGYOMKjn9PavsGOXxbvYGtMOEfnId0SVNsgehXh1DxUdVPLoxd5mvcEtvmKs2Mmf0Mpa1ZA==",
      "license": "MIT"
    },
    "node_modules/parse-bmfont-binary": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/parse-bmfont-binary/-/parse-bmfont-binary-1.0.6.tgz",
      "integrity": "sha512-GxmsRea0wdGdYthjuUeWTMWPqm2+FAd4GI8vCvhgJsFnoGhTrLhXDDupwTo7rXVAgaLIGoVHDZS9p/5XbSqeWA==",
      "license": "MIT"
    },
    "node_modules/parse-bmfont-xml": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/parse-bmfont-xml/-/parse-bmfont-xml-1.1.6.tgz",
      "integrity": "sha512-0cEliVMZEhrFDwMh4SxIyVJpqYoOWDJ9P895tFuS+XuNzI5UBmBk5U5O4KuJdTnZpSBI4LFA2+ZiJaiwfSwlMA==",
      "license": "MIT",
      "dependencies": {
        "xml-parse-from-string": "^1.0.0",
        "xml2js": "^0.5.0"
      }
    },
    "node_modules/parse5": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/parse5/-/parse5-8.0.1.tgz",
      "integrity": "sha512-z1e/HMG90obSGeidlli3hj7cbocou0/wa5HacvI3ASx34PecNjNQeaHNo5WIZpWofN9kgkqV1q5YvXe3F0FoPw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "entities": "^8.0.0"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5-html-rewriting-stream": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/parse5-html-rewriting-stream/-/parse5-html-rewriting-stream-8.0.0.tgz",
      "integrity": "sha512-wzh11mj8KKkno1pZEu+l2EVeWsuKDfR5KNWZOTsslfUX8lPDZx77m9T0kIoAVkFtD1nx6YF8oh4BnPHvxMtNMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "entities": "^6.0.0",
        "parse5": "^8.0.0",
        "parse5-sax-parser": "^8.0.0"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5-html-rewriting-stream/node_modules/entities": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/entities/-/entities-6.0.1.tgz",
      "integrity": "sha512-aN97NXWF6AWBTahfVOIrB/NShkzi5H7F9r1s9mD3cDj4Ko5f2qhhVoYMibXF7GlLveb/D2ioWay8lxI97Ven3g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/parse5-sax-parser": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/parse5-sax-parser/-/parse5-sax-parser-8.0.0.tgz",
      "integrity": "sha512-/dQ8UzHZwnrzs3EvDj6IkKrD/jIZyTlB+8XrHJvcjNgRdmWruNdN9i9RK/JtxakmlUdPwKubKPTCqvbTgzGhrw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parse5": "^8.0.0"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5/node_modules/entities": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-8.0.0.tgz",
      "integrity": "sha512-zwfzJecQ/Uej6tusMqwAqU/6KL2XaB2VZ2Jg54Je6ahNBGNH6Ek6g3jjNCF0fG9EWQKGZNddNjU5F1ZQn/sBnA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/path-scurry": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-2.0.2.tgz",
      "integrity": "sha512-3O/iVVsJAPsOnpwWIeD+d6z/7PmqApyQePUtCndjatj/9I5LylHvt5qluFaBT3I5h3r1ejfR056c+FCv+NnNXg==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "lru-cache": "^11.0.0",
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/path-scurry/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.4.2",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.4.2.tgz",
      "integrity": "sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/piscina": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/piscina/-/piscina-5.2.0.tgz",
      "integrity": "sha512-DszUCKeVN/5G5QKo6jAVHL8fmKnkJvQ0ACiVgY7YGCq3TUB2oznAOayvZPIAdEThvhczkXR+qm3IHsNXpFCYfA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=20.x"
      },
      "optionalDependencies": {
        "@napi-rs/nice": "^1.0.4"
      }
    },
    "node_modules/pixelmatch": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/pixelmatch/-/pixelmatch-5.3.0.tgz",
      "integrity": "sha512-o8mkY4E/+LNUf6LzX96ht6k6CEDi65k9G2rjMtBe9Oo+VPKSvl+0GKHuH/AlG+GA5LPG/i5hrekkxUc3s2HU+Q==",
      "license": "ISC",
      "dependencies": {
        "pngjs": "^6.0.0"
      },
      "bin": {
        "pixelmatch": "bin/pixelmatch"
      }
    },
    "node_modules/pixelmatch/node_modules/pngjs": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/pngjs/-/pngjs-6.0.0.tgz",
      "integrity": "sha512-TRzzuFRRmEoSW/p1KVAmiOgPco2Irlah+bGFCeNfJXxxYGwSw7YwAOAcd7X28K/m5bjBWKsC29KyoMfHbypayg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.13.0"
      }
    },
    "node_modules/pkce-challenge": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/pkce-challenge/-/pkce-challenge-5.0.1.tgz",
      "integrity": "sha512-wQ0b/W4Fr01qtpHlqSqspcj3EhBvimsdh0KlHhH8HRZnMsEa0ea2fTULOXOS9ccQr3om+GcGRk4e+isrZWV8qQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/pngjs": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/pngjs/-/pngjs-7.0.0.tgz",
      "integrity": "sha512-LKWqWJRhstyYo9pGvgor/ivk2w94eSjE3RGVuzLGlr3NmD8bf7RcYGze1mNdEHRP6TRP6rMuDHk5t44hnTRyow==",
      "license": "MIT",
      "engines": {
        "node": ">=14.19.0"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.24",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.24.tgz",
      "integrity": "sha512-8RyVklq0owXUTa4xlpzu4l9AaVKIdQvAcOHZWaMh98HgySsUtxRVf/chRe3dsSLqb6i40BzGRzEUddRaI+9TSw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
      "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.1.1"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "jiti": ">=1.21.0",
        "postcss": ">=8.0.9",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-media-query-parser": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/postcss-media-query-parser/-/postcss-media-query-parser-0.2.3.tgz",
      "integrity": "sha512-3sOlxmbKcSHMjlUXQZKQ06jOswE7oVkXPxmZdoB1r5l0q6gTFTQSHxNxOrCccElbW7dxNytifNEo8qidX2Vsig==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.4.tgz",
      "integrity": "sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/proc-log": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-5.0.0.tgz",
      "integrity": "sha512-Azwzvl90HaF0aCz1JrDdXQykFakSSNPaPoiZ9fm5qJIMHioDZEi7OAdRwSm6rSoPtY3Qutnm3L7ogmg3dc+wbQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/psl": {
      "version": "1.15.0",
      "resolved": "https://registry.npmjs.org/psl/-/psl-1.15.0.tgz",
      "integrity": "sha512-JZd3gMVBAVQkSs6HdNZo9Sdo0LNcQeMNP3CozBJb3JYC/QUYZTnKxP+f8oWRX4rHP5EurWxqAHTSwUCjlNKa1w==",
      "license": "MIT",
      "dependencies": {
        "punycode": "^2.3.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/lupomontero"
      }
    },
    "node_modules/psl/node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/punycode": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-1.4.1.tgz",
      "integrity": "sha512-jmYNElW7yvO7TV33CjSmvSiE2yco3bV2czu/OzDKdMNVZQWfxCblURLhf+47syQRBntjfLdd/H0egrzIG+oaFQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/qjobs": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/qjobs/-/qjobs-1.2.0.tgz",
      "integrity": "sha512-8YOJEHtxpySA3fFDyCRxA+UUV+fA+rTWnuWvylOK/NCjhY+b4ocCtmu8TtsWb+mYeU+GCHf/S66KZF/AsteKHg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.9"
      }
    },
    "node_modules/qs": {
      "version": "6.15.3",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.15.3.tgz",
      "integrity": "sha512-O9gl3zCl5h5blw1KGUzQKhA5oUXSl8rwUIM5o0S3nCXMliSvy5Dzx7/DJcI+SwgICv+IneSZwhBh1oSyEHA71A==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/querystringify": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/querystringify/-/querystringify-2.2.0.tgz",
      "integrity": "sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==",
      "license": "MIT"
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/range-parser": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.3.0.tgz",
      "integrity": "sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
      "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readdirp": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-4.1.2.tgz",
      "integrity": "sha512-GDhwkLfywWL2s6vEjyhri+eXmfH6j1L7JE27WhqLeYzoh/A3DBaYGEj2H/HFZCn/kMfim73FXxEJTw06WtxQwg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 14.18.0"
      },
      "funding": {
        "type": "individual",
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/reflect-metadata": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/reflect-metadata/-/reflect-metadata-0.2.2.tgz",
      "integrity": "sha512-urBwgfrvVP/eAyXx4hluJivBKzuEbSQs9rKWCrCkbSxNv8mxPcUZKeuoF3Uy4mJl3Lwprp6yy5/39VWigZ4K6Q==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/requires-port": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/requires-port/-/requires-port-1.0.0.tgz",
      "integrity": "sha512-KigOCHcocU3XODJxsu8i/j8T9tzT4adHiecwORRQ0ZZFcp7ahwXuRU1m+yuO90C5ZUyGeGfocHDI14M3L3yDAQ==",
      "license": "MIT"
    },
    "node_modules/resolve": {
      "version": "1.22.10",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.10.tgz",
      "integrity": "sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-core-module": "^2.16.0",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/restore-cursor": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-5.1.0.tgz",
      "integrity": "sha512-oMA2dcrw6u0YfxJQXm342bFKX/E4sG9rbTzO9ptUcR/e8A33cHuvStiYOwH7fszkZlZ1z/ta9AAoPk2F4qIOHA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "onetime": "^7.0.0",
        "signal-exit": "^4.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/rfdc": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/rfdc/-/rfdc-1.4.1.tgz",
      "integrity": "sha512-q1b3N5QkRUWUl7iyylaaj3kOpIT0N2i9MqIEQXP73GVsN9cw3fdx8X63cEmWhJGi2PPCF23Ijp7ktmd39rawIA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/rimraf": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-3.0.2.tgz",
      "integrity": "sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==",
      "deprecated": "Rimraf versions prior to v4 are no longer supported",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "glob": "^7.1.3"
      },
      "bin": {
        "rimraf": "bin.js"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/rollup": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.59.0.tgz",
      "integrity": "sha512-2oMpl67a3zCH9H79LeMcbDhXW/UmWG/y2zuqnF2jQq5uq9TbM9TVyXvA4+t+ne2IIkBdrLpAaRQAvo7YI/Yyeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.59.0",
        "@rollup/rollup-android-arm64": "4.59.0",
        "@rollup/rollup-darwin-arm64": "4.59.0",
        "@rollup/rollup-darwin-x64": "4.59.0",
        "@rollup/rollup-freebsd-arm64": "4.59.0",
        "@rollup/rollup-freebsd-x64": "4.59.0",
        "@rollup/rollup-linux-arm-gnueabihf": "4.59.0",
        "@rollup/rollup-linux-arm-musleabihf": "4.59.0",
        "@rollup/rollup-linux-arm64-gnu": "4.59.0",
        "@rollup/rollup-linux-arm64-musl": "4.59.0",
        "@rollup/rollup-linux-loong64-gnu": "4.59.0",
        "@rollup/rollup-linux-loong64-musl": "4.59.0",
        "@rollup/rollup-linux-ppc64-gnu": "4.59.0",
        "@rollup/rollup-linux-ppc64-musl": "4.59.0",
        "@rollup/rollup-linux-riscv64-gnu": "4.59.0",
        "@rollup/rollup-linux-riscv64-musl": "4.59.0",
        "@rollup/rollup-linux-s390x-gnu": "4.59.0",
        "@rollup/rollup-linux-x64-gnu": "4.59.0",
        "@rollup/rollup-linux-x64-musl": "4.59.0",
        "@rollup/rollup-openbsd-x64": "4.59.0",
        "@rollup/rollup-openharmony-arm64": "4.59.0",
        "@rollup/rollup-win32-arm64-msvc": "4.59.0",
        "@rollup/rollup-win32-ia32-msvc": "4.59.0",
        "@rollup/rollup-win32-x64-gnu": "4.59.0",
        "@rollup/rollup-win32-x64-msvc": "4.59.0",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",
      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/sass": {
      "version": "1.90.0",
      "resolved": "https://registry.npmjs.org/sass/-/sass-1.90.0.tgz",
      "integrity": "sha512-9GUyuksjw70uNpb1MTYWsH9MQHOHY6kwfnkafC24+7aOMZn9+rVMBxRbLvw756mrBFbIsFg6Xw9IkR2Fnn3k+Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "chokidar": "^4.0.0",
        "immutable": "^5.0.2",
        "source-map-js": ">=0.6.2 <2.0.0"
      },
      "bin": {
        "sass": "sass.js"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "optionalDependencies": {
        "@parcel/watcher": "^2.4.1"
      }
    },
    "node_modules/sax": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/sax/-/sax-1.6.1.tgz",
      "integrity": "sha512-42tBVwLWnaQvW5zc4HbZrTuWccECCZfBi92FDuwtqxasH+JbPB3/FOKb1m222K42R4WxuxzzMsTswfzgtSu64Q==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=11.0.0"
      }
    },
    "node_modules/semver": {
      "version": "7.7.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.2.tgz",
      "integrity": "sha512-RF0Fw+rO5AMf9MAyaRXI4AV0Ulj5lMHqVxxdSgiVbixSCXoEmmX/jk0CuJw4+3SqroYO9VoUh+HcuJivvtJemA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/set-cookie-parser": {
      "version": "2.7.2",
      "resolved": "https://registry.npmjs.org/set-cookie-parser/-/set-cookie-parser-2.7.2.tgz",
      "integrity": "sha512-oeM1lpU/UvhTxw+g3cIfxXHyJRc/uidd3yK1P242gzHds0udQBYzs3y8j4gCCW+ZJ7ad0yctld8RYO+bdurlvw==",
      "license": "MIT"
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/sigstore": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/sigstore/-/sigstore-4.1.1.tgz",
      "integrity": "sha512-endqECJkfhozrXMK5ngu/UAA0xVcVEFdnHJCElGaExypjW+HK5i6zu3NteLoaX/iFbRUbC3+DjttQs0GARr+5w==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@sigstore/bundle": "^4.0.0",
        "@sigstore/core": "^3.2.1",
        "@sigstore/protobuf-specs": "^0.5.0",
        "@sigstore/sign": "^4.1.1",
        "@sigstore/tuf": "^4.0.2",
        "@sigstore/verify": "^3.1.1"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/simple-xml-to-json": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/simple-xml-to-json/-/simple-xml-to-json-1.2.7.tgz",
      "integrity": "sha512-mz9VXphOxQWX3eQ/uXCtm6upltoN0DLx8Zb5T4TFC4FHB7S9FDPGre8CfLWqPWQQH/GrQYd2AXhhVM5LDpYx6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=20.12.2"
      }
    },
    "node_modules/slice-ansi": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-5.0.0.tgz",
      "integrity": "sha512-FC+lgizVPfie0kkhqUScwRu1O/lF6NOgJmlCgK+/LYxDCTk8sGelYaHDhFcDN+Sn3Cv+3VSa4Byeo+IMCzpMgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.0.0",
        "is-fullwidth-code-point": "^4.0.0"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
      }
    },
    "node_modules/smart-buffer": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/smart-buffer/-/smart-buffer-4.2.0.tgz",
      "integrity": "sha512-94hK0Hh8rPqQl2xXc3HsaBoOXKV20MToPkcXvwbISWLEs+64sBq5kFgn2kJDHb1Pry9yrP0dxrCI9RRci7RXKg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socket.io": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io/-/socket.io-4.8.3.tgz",
      "integrity": "sha512-2Dd78bqzzjE6KPkD5fHZmDAKRNe3J15q+YHDrIsy9WEkqttc7GY+kT9OBLSMaPbQaEd0x1BjcmtMtXkfpc+T5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "accepts": "~1.3.4",
        "base64id": "~2.0.0",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io": "~6.6.0",
        "socket.io-adapter": "~2.5.2",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/socket.io-adapter": {
      "version": "2.5.8",
      "resolved": "https://registry.npmjs.org/socket.io-adapter/-/socket.io-adapter-2.5.8.tgz",
      "integrity": "sha512-6Oy52pbg+kvdCVvjcN+FnY7BvxZ7cIHNScbvztT/It5d0vbwoJoVZmF2gjJmnV0/4WlXRfG15zc45ySk9Ah8bw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "~4.4.1",
        "ws": "~8.21.0"
      }
    },
    "node_modules/socket.io-parser": {
      "version": "4.2.7",
      "resolved": "https://registry.npmjs.org/socket.io-parser/-/socket.io-parser-4.2.7.tgz",
      "integrity": "sha512-IH/iSeO9T6gz1KkFleGDWkG9N3dl4jXVYUtMhIqH10Md0ttMer8nUNWiP1DKuNrybD2xBrixLJdCC9J6ECoYkg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socks": {
      "version": "2.8.9",
      "resolved": "https://registry.npmjs.org/socks/-/socks-2.8.9.tgz",
      "integrity": "sha512-LJhUYUvItdQ0LkJTmPeaEObWXAqFyfmP85x0tch/ez9cahmhlBBLbIqDFnvBnUJGagb0JbIQrkBs1wJ+yRYpEw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ip-address": "^10.1.1",
        "smart-buffer": "^4.2.0"
      },
      "engines": {
        "node": ">= 10.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks-proxy-agent": {
      "version": "8.0.5",
      "resolved": "https://registry.npmjs.org/socks-proxy-agent/-/socks-proxy-agent-8.0.5.tgz",
      "integrity": "sha512-HehCEsotFqbPW9sJ8WVYB6UbmIMv7kUUORIF2Nncq4VQvBfNBLibW9YZR5dlYCSUhwcD628pRllm7n+E+YTzJw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "^4.3.4",
        "socks": "^2.8.3"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/source-map": {
      "version": "0.7.6",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.7.6.tgz",
      "integrity": "sha512-i5uvt8C3ikiWeNZSVZNWcfZPItFQOsYTUAOkcUPGd8DqDy1uOUikjt5dG+uRlwyvR108Fb9DOd4GvXfT0N2/uQ==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/source-map-support/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/spdx-exceptions": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/spdx-exceptions/-/spdx-exceptions-2.5.0.tgz",
      "integrity": "sha512-PiU42r+xO4UbUS1buo3LPJkjlO7430Xn5SVAhdpzzsPHsjbYVflnnFdATgabnLude+Cqu25p6N+g2lw/PFsa4w==",
      "dev": true,
      "license": "CC-BY-3.0"
    },
    "node_modules/spdx-expression-parse": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-4.0.0.tgz",
      "integrity": "sha512-Clya5JIij/7C6bRR22+tnGXbc4VKlibKSVj2iHvVeX5iMW7s1SIQlqu699JkODJJIhh/pUu8L0/VLh8xflD+LQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-license-ids": {
      "version": "3.0.23",
      "resolved": "https://registry.npmjs.org/spdx-license-ids/-/spdx-license-ids-3.0.23.tgz",
      "integrity": "sha512-CWLcCCH7VLu13TgOH+r8p1O/Znwhqv/dbb6lqWy67G+pT1kHmeD/+V36AVb/vq8QMIQwVShJ6Ssl5FPh0fuSdw==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/ssri": {
      "version": "13.0.1",
      "resolved": "https://registry.npmjs.org/ssri/-/ssri-13.0.1.tgz",
      "integrity": "sha512-QUiRf1+u9wPTL/76GTYlKttDEBWV1ga9ZXW8BG6kfdeyyM8LGPix9gROyg9V2+P0xNyF3X2Go526xKFdMZrHSQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/stdin-discarder": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/stdin-discarder/-/stdin-discarder-0.2.2.tgz",
      "integrity": "sha512-UhDfHmA92YAlNnCfhmq0VeNL5bDbiZGg7sZ2IvPsXubGkiNa9EC+tUTsjBRsYUAz87btI6/1wf4XoVvQ3uRnmQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/streamroller": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/streamroller/-/streamroller-3.1.5.tgz",
      "integrity": "sha512-KFxaM7XT+irxvdqSP1LGLgNWbYN7ay5owZ3r/8t77p+EtSUAfUgtl7be3xtqtOmGUl9K9YPO2ca8133RlTjvKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "date-format": "^4.0.14",
        "debug": "^4.3.4",
        "fs-extra": "^8.1.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/string-width": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-7.2.0.tgz",
      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^10.3.0",
        "get-east-asian-width": "^1.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.2.0.tgz",
      "integrity": "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.2.2"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/strtok3": {
      "version": "10.3.5",
      "resolved": "https://registry.npmjs.org/strtok3/-/strtok3-10.3.5.tgz",
      "integrity": "sha512-ki4hZQfh5rX0QDLLkOCj+h+CVNkqmp/CMf8v8kZpkNVK6jGQooMytqzLZYUVYIZcFZ6yDB70EfD8POcFXiF5oA==",
      "license": "MIT",
      "dependencies": {
        "@tokenizer/token": "^0.3.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.19",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
      "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.7",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/tailwindcss/node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/tailwindcss/node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/tailwindcss/node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/tailwindcss/node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/tailwindcss/node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/tar": {
      "version": "7.5.22",
      "resolved": "https://registry.npmjs.org/tar/-/tar-7.5.22.tgz",
      "integrity": "sha512-MFO/QzvtAOmJbkhOaCTvbGcFN9L9b+JunIsDwaKljSOdcLMea3NJ1k9Usz/rjdfSXTq4dfzfeS7W4p4YOAAHeA==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "@isaacs/fs-minipass": "^4.0.0",
        "chownr": "^3.0.0",
        "minipass": "^7.1.2",
        "minizlib": "^3.1.0",
        "yallist": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tar/node_modules/yallist": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-5.0.0.tgz",
      "integrity": "sha512-YgvUTfwqyc7UXVMrB+SImsVYSmTS8X/tSrtdNZMImM+n7+QTriRXyXim0mBrTXNeqzVF0KWGgHPeiyViFFrNDw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/tinycolor2": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/tinycolor2/-/tinycolor2-1.6.0.tgz",
      "integrity": "sha512-XPaBkWQJdsf3pLKJV9p4qN/S+fm2Oj8AIPo1BTUhg5oxkvm9+SVEGFdhyOz7tTdUTfvxMiAs4sp6/eZO2Ew+pw==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.14",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.14.tgz",
      "integrity": "sha512-tX5e7OM1HnYr2+a2C/4V0htOcSQcoSTH9KgJnVvNm5zm/cyEWKJ7j7YutsH9CxMdtOkkLFy2AHrMci9IM8IPZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.4.4",
        "picomatch": "^4.0.2"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tmp": {
      "version": "0.2.7",
      "resolved": "https://registry.npmjs.org/tmp/-/tmp-0.2.7.tgz",
      "integrity": "sha512-e0votIpp4Uo2AJYSzVHV6xCcawuiez3DzqDAbrTc3YxBkplN6e+dM13ZeIcZnDg/QpSuU2zfZ3rzwY8ukEnaXw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14.14"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/token-types": {
      "version": "6.1.2",
      "resolved": "https://registry.npmjs.org/token-types/-/token-types-6.1.2.tgz",
      "integrity": "sha512-dRXchy+C0IgK8WPC6xvCHFRIWYUbqqdEIKPaKo/AcTUNzwLTK6AH7RjdLWsEZcAN/TBdtfUw3PYEgPr5VPr6ww==",
      "license": "MIT",
      "dependencies": {
        "@borewit/text-codec": "^0.2.1",
        "@tokenizer/token": "^0.3.0",
        "ieee754": "^1.2.1"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/tough-cookie": {
      "version": "4.1.4",
      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-4.1.4.tgz",
      "integrity": "sha512-Loo5UUvLD9ScZ6jh8beX1T6sO1w2/MpCRpEP7V280GKMVUQ0Jzar2U3UJPsrdbziLEMMhu3Ujnq//rhiFuIeag==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "psl": "^1.1.33",
        "punycode": "^2.1.1",
        "universalify": "^0.2.0",
        "url-parse": "^1.5.3"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/tough-cookie/node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/tough-cookie/node_modules/universalify": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-0.2.0.tgz",
      "integrity": "sha512-CJ1QgKmNg3CwvAv/kOFmtnEN05f0D/cn9QntgNOQlQF9dgvVTHj3t+8JPdjqawCHk7V/KA+fbUqzZ9XWhcqPUg==",
      "license": "MIT",
      "engines": {
        "node": ">= 4.0.0"
      }
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==",
      "license": "MIT"
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD",
      "peer": true
    },
    "node_modules/tuf-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/tuf-js/-/tuf-js-4.1.0.tgz",
      "integrity": "sha512-50QV99kCKH5P/Vs4E2Gzp7BopNV+KzTXqWeaxrfu5IQJBOULRsTIS9seSsOVT8ZnGXzCyx55nYWAi4qJzpZKEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@tufjs/models": "4.1.0",
        "debug": "^4.4.3",
        "make-fetch-happen": "^15.0.1"
      },
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/type-is": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.1.0.tgz",
      "integrity": "sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.0.0",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/type-is/node_modules/content-type": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.0.0.tgz",
      "integrity": "sha512-j/O/d7GcZCyNl7/hwZAb606rzqkyvaDctLmckbxLzHvFBzTJHuGEdodATcP3yIRoDrLHkIATJuvzbFlp/ki2cQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/ua-parser-js": {
      "version": "0.7.41",
      "resolved": "https://registry.npmjs.org/ua-parser-js/-/ua-parser-js-0.7.41.tgz",
      "integrity": "sha512-O3oYyCMPYgNNHuO7Jjk3uacJWZF8loBgwrfd/5LE/HyZ3lUIOdniQ7DNXJcIgZbwioZxk0fLfI4EVnetdiX5jg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/ua-parser-js"
        },
        {
          "type": "paypal",
          "url": "https://paypal.me/faisalman"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/faisalman"
        }
      ],
      "license": "MIT",
      "bin": {
        "ua-parser-js": "script/cli.js"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/uint8array-extras": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/uint8array-extras/-/uint8array-extras-1.5.0.tgz",
      "integrity": "sha512-rvKSBiC5zqCCiDZ9kAOszZcDvdAHwwIKJG33Ykj43OKcWsnmcBRL09YTU4nOeHZ8Y2a7l1MgTd08SBe9A8Qj6A==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/undici": {
      "version": "6.28.0",
      "resolved": "https://registry.npmjs.org/undici/-/undici-6.28.0.tgz",
      "integrity": "sha512-LIY910g9TI13YS95lrMFrs8Rm/u/irgHeTWoKCoteeJ04CUJ92eEfj0rVn+7VKMPBpUPiUoBKfhNyLI23EE/KA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.17"
      }
    },
    "node_modules/undici-types": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-8.3.0.tgz",
      "integrity": "sha512-j375ScV60dom+YkPFIfTLcOiPxkN/buHz5GobjLhixFuANaNs3C9l4GmrWqejgXWJ7BbJcFYpTEUkS1Ge8bpZQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/universalify": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-0.1.2.tgz",
      "integrity": "sha512-rBJeI5CXAlmy1pV+617WB9J63U6XcazHHF2f2dbJix4XzpUF0RS3Zbj0FGIOCAva5P/d/GBOYaACQ1w+0azUkg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4.0.0"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/url-parse": {
      "version": "1.5.10",
      "resolved": "https://registry.npmjs.org/url-parse/-/url-parse-1.5.10.tgz",
      "integrity": "sha512-WypcfiRhfeUP9vvF0j6rw0J3hrWrw6iZv3+22h6iRMJ/8z1Tj6XfLP4DsUix5MhMPnXpiHDoKyoZ/bdCkwBCiQ==",
      "license": "MIT",
      "dependencies": {
        "querystringify": "^2.1.1",
        "requires-port": "^1.0.0"
      }
    },
    "node_modules/utif2": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/utif2/-/utif2-4.1.0.tgz",
      "integrity": "sha512-+oknB9FHrJ7oW7A2WZYajOcv4FcDR4CfoGB0dPNfxbi4GO05RRnFmt5oa23+9w32EanrYcSJWspUiJkLMs+37w==",
      "license": "MIT",
      "dependencies": {
        "pako": "^1.0.11"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/validate-npm-package-name": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/validate-npm-package-name/-/validate-npm-package-name-6.0.2.tgz",
      "integrity": "sha512-IUoow1YUtvoBBC06dXs8bR8B9vuA3aJfmQNKMoaPG/OFsPmoQvw8xh+6Ye25Gx9DQhoEom3Pcu9MKHerm/NpUQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vite": {
      "version": "7.3.6",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.6.tgz",
      "integrity": "sha512-4XP60spRGjSZFf1qYH+dJIkK2znL3zQfl9KkOV9MkkRR/3Dls0dxaBsQPTloEc5BLXWPL9vsOxopxyKoMmDueg==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "esbuild": "^0.27.0 || ^0.28.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/vite/node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/void-elements": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/void-elements/-/void-elements-2.0.1.tgz",
      "integrity": "sha512-qZKX4RnBzH2ugr8Lxa7x+0V6XD9Sb/ouARtiasEQCHB1EVU4NXtmHsDDrx1dO4ne5fc3J6EW05BP1Dl0z0iung==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/watchpack": {
      "version": "2.4.4",
      "resolved": "https://registry.npmjs.org/watchpack/-/watchpack-2.4.4.tgz",
      "integrity": "sha512-c5EGNOiyxxV5qmTtAB7rbiXxi1ooX1pQKMLX/MIabJjRA0SJBQOjKF+KSVfHkr9U1cADPon0mRiVe/riyaiDUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "glob-to-regexp": "^0.4.1",
        "graceful-fs": "^4.1.2"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/weak-lru-cache": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/weak-lru-cache/-/weak-lru-cache-1.2.2.tgz",
      "integrity": "sha512-DEAoo25RfSYMuTGc9vPJzZcZullwIqRDSI9LOy+fkCJPi6hykCnfKaXTuPBDuXAUcqHXyOgFtHNp/kB2FjYHbw==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==",
      "license": "BSD-2-Clause"
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "license": "MIT",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-6.2.0.tgz",
      "integrity": "sha512-r6lPcBGxZXlIcymEu7InxDMhdW0KDxpLgoFLcguasxCaJ/SOIZwINatK9KY/tf+ZrlywOKU0UDj3ATXUBfxJXA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/wrap-ansi/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/wrap-ansi/node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/ws": {
      "version": "8.21.1",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.21.1.tgz",
      "integrity": "sha512-+0NTnW77fFN/DjQi6k/Sq/Yvk4Sgajw7urW8V+asjXnRgDs9gyGkdb7EzgfhA4goXsRIZKE28fzIXBHEzhuiWw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/xml-parse-from-string": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/xml-parse-from-string/-/xml-parse-from-string-1.0.1.tgz",
      "integrity": "sha512-ErcKwJTF54uRzzNMXq2X5sMIy88zJvfN2DmdoQvy7PAFJ+tPRU6ydWuOKNMyfmOjdyBQTFREi60s0Y0SyI0G0g==",
      "license": "MIT"
    },
    "node_modules/xml2js": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/xml2js/-/xml2js-0.5.0.tgz",
      "integrity": "sha512-drPFnkQJik/O+uPKpqSgr22mpuFHqKdbS835iAQrUC73L2F5WkboIRd63ai/2Yg6I1jzifPFKH2NTK+cfglkIA==",
      "license": "MIT",
      "dependencies": {
        "sax": ">=0.6.0",
        "xmlbuilder": "~11.0.0"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/xmlbuilder": {
      "version": "11.0.1",
      "resolved": "https://registry.npmjs.org/xmlbuilder/-/xmlbuilder-11.0.1.tgz",
      "integrity": "sha512-fDlsI/kFEx7gLvbecc0/ohLG50fugQp8ryHzMTuW9vSa1GJ0XYWKnhsUx7oie3G98+r56aTQIUB4kht42R3JvA==",
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yargs": {
      "version": "18.0.0",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-18.0.0.tgz",
      "integrity": "sha512-4UEqdc2RYGHZc7Doyqkrqiln3p9X2DZVxaGbwhn2pi7MrRagKaOcIKe8L3OxYcbhXLgLFUS3zAYuQjKBQgmuNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^9.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "string-width": "^7.2.0",
        "y18n": "^5.0.5",
        "yargs-parser": "^22.0.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/yargs-parser": {
      "version": "22.0.0",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-22.0.0.tgz",
      "integrity": "sha512-rwu/ClNdSMpkSrUb+d6BRsSkLUq1fmfsY6TOpYzTwvwkg1/NRG85KBy3kq++A8LKQwX6lsu+aWad+2khvuXrqw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/yoctocolors-cjs": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/yoctocolors-cjs/-/yoctocolors-cjs-2.1.3.tgz",
      "integrity": "sha512-U/PBtDf35ff0D8X8D0jfdzHYEPFxAI7jJlxZXwCSez5M3190m+QobIfh+sWDWSHMCWWJN2AWamkegn6vr6YBTw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.1.13",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.1.13.tgz",
      "integrity": "sha512-AvvthqfqrAhNH9dnfmrfKzX5upOdjUVJYFqNSlkmGf64gRaTzlPwz99IHYnVs28qYAybvAlBV+H7pn0saFY4Ig==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-to-json-schema": {
      "version": "3.25.2",
      "resolved": "https://registry.npmjs.org/zod-to-json-schema/-/zod-to-json-schema-3.25.2.tgz",
      "integrity": "sha512-O/PgfnpT1xKSDeQYSCfRI5Gy3hPf91mKVDuYLUHZJMiDFptvP41MSnWofm8dnCm0256ZNfZIM7DSzuSMAFnjHA==",
      "dev": true,
      "license": "ISC",
      "peerDependencies": {
        "zod": "^3.25.28 || ^4"
      }
    },
    "node_modules/zone.js": {
      "version": "0.15.1",
      "resolved": "https://registry.npmjs.org/zone.js/-/zone.js-0.15.1.tgz",
      "integrity": "sha512-XE96n56IQpJM7NAoXswY3XRLcWFW83xe0BiAOeMD7K5k5xecOeul3Qcpx6GqEeeHNkW5DWL5zOyTbEfB4eti8w==",
      "license": "MIT",
      "peer": true
    }
  }
}

``

## package.json

``json
{
  "name": "budgetha-web",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.html",
        "options": {
          "parser": "angular"
        }
      }
    ]
  },
  "private": true,
  "dependencies": {
    "@angular/common": "^20.3.0",
    "@angular/compiler": "^20.3.0",
    "@angular/core": "^20.3.0",
    "@angular/forms": "^20.3.0",
    "@angular/platform-browser": "^20.3.0",
    "@angular/router": "^20.3.0",
    "@angular/service-worker": "^20.3.0",
    "@microsoft/signalr": "^10.0.0",
    "jimp": "^1.6.1",
    "ngx-image-cropper": "^9.1.6",
    "ngx-paypal": "^11.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular/build": "^20.3.32",
    "@angular/cli": "^20.3.32",
    "@angular/compiler-cli": "^20.3.0",
    "@tailwindcss/forms": "^0.5.7",
    "@types/jasmine": "~5.1.0",
    "autoprefixer": "^10.5.4",
    "jasmine-core": "~5.9.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "postcss": "^8.5.24",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.2"
  }
}

``

## postcss.config.js

``javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

``

## README.md

``markdown
# BudgethaWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.32.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

``

## tailwind.config.js

``javascript

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

``

## tsconfig.app.json

``json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}

``

## tsconfig.json

``json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "typeCheckHostBindings": true,
    "strictTemplates": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}

``

## tsconfig.spec.json

``json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine"
    ]
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.spec.ts"
  ]
}

``

## public\manifest.webmanifest

``
{
  "id": "/",
  "name": "Budgetha â€” Shop smarter, spend wiser",
  "short_name": "Budgetha",
  "description": "Discover the best deals from 200+ trusted vendors in one beautiful storefront. Browse, save, and check out in seconds.",
  "lang": "en",
  "dir": "ltr",
  "display": "standalone",
  "display_override": ["standalone", "minimal-ui", "browser"],
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/?source=pwa",
  "theme_color": "#0f766e",
  "background_color": "#ffffff",
  "categories": ["shopping", "lifestyle"],
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Browse the shop",
      "short_name": "Shop",
      "url": "/shop?source=pwa-shortcut",
      "icons": [{ "src": "icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" }]
    },
    {
      "name": "Today's deals",
      "short_name": "Deals",
      "url": "/shop?deals=1&source=pwa-shortcut",
      "icons": [{ "src": "icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" }]
    },
    {
      "name": "My cart",
      "short_name": "Cart",
      "url": "/cart?source=pwa-shortcut",
      "icons": [{ "src": "icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" }]
    },
    {
      "name": "My orders",
      "short_name": "Orders",
      "url": "/account/orders?source=pwa-shortcut",
      "icons": [{ "src": "icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" }]
    }
  ]
}

``

## public\manifest_backup.webmanifest

``
{
  "name": "Budgetha Market",
  "short_name": "Budgetha",
  "description": "Premium multi-vendor marketplace",
  "theme_color": "#7c5cff",
  "background_color": "#06060b",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    { "src": "icons/icon-72x72.png",   "sizes": "72x72",   "type": "image/png" },
    { "src": "icons/icon-96x96.png",   "sizes": "96x96",   "type": "image/png" },
    { "src": "icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}

``

## scratch\remove_bg.js

``javascript
const { Jimp } = require('jimp');
const path = require('path');

async function processLogo() {
  const inputPath = 'C:/Users/moham/.gemini/antigravity-ide/brain/9965b8bf-9e0a-4302-9cc8-7910bcb46cc5/media__1785423235672.png';
  const outputPath = 'd:/Projects/Budgetha/src/frontend/public/images/logo.png';

  console.log('Reading image from:', inputPath);
  const image = await Jimp.read(inputPath);
  
  console.log('Processing pixels...');
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    
    if (r > 240 && g > 240 && b > 240) {
      this.bitmap.data[idx + 3] = 0; 
    }
  });

  
  await image.write(outputPath);
  console.log('Successfully wrote transparent logo to:', outputPath);
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
});

``

## src\google.d.ts

``typescript
declare namespace google {
  namespace accounts {
    namespace id {
      interface IdConfiguration {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        context?: string;
      }

      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      function initialize(config: IdConfiguration): void;
      function prompt(momentListener?: (notification: any) => void): void;
      function renderButton(parent: HTMLElement, options: any): void;
      function disableAutoSelect(): void;
    }
  }
}

``

## src\index.html

``html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Budgetha â€” Shop smarter, spend wiser</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Discover the best deals from 200+ trusted vendors in one beautiful storefront. Browse, save, and check out in seconds.">

  <!-- PWA -->
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#0f766e">
  <meta name="color-scheme" content="light">
  <meta name="application-name" content="Budgetha">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Budgetha">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" sizes="192x192" href="icons/icon-192x192.png">
  <link rel="apple-touch-icon" sizes="152x152" href="icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="144x144" href="icons/icon-144x144.png">
  <link rel="icon" type="image/png" sizes="512x512" href="icons/icon-512x512.png">
  <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-96x96.png">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <!-- Social preview -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Budgetha">
  <meta property="og:title" content="Budgetha â€” Shop smarter, spend wiser">
  <meta property="og:description" content="Discover the best deals from 200+ trusted vendors in one beautiful storefront.">
  <meta property="og:image" content="icons/icon-512x512.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  <script src="https://accounts.google.com/gsi/client" async="" defer=""></script>
  <script src="https://scaleflex.cloudimg.io/v7/plugins/filerobot-image-editor/latest/filerobot-image-editor.min.js"></script>
</head>
<body>
  <app-root></app-root>
  <noscript>Please enable JavaScript to continue using this application.</noscript>
</body>
</html>

``

## src\main.ts

``typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

``

## src\styles.css

``css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .animate-gradient-slow {
    animation: gradientShift 15s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-pan-bg {
    animation: panBg 40s linear infinite;
  }

  @keyframes panBg {
    0% { background-position: 0px 0px; }
    100% { background-position: 100px 100px; }
  }
}

/* â”€â”€ Global resets â”€â”€ */

* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

::selection {
  background-color: #ddd6fe;
  color: #4c1d95;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #1e293b;
}

/* â”€â”€ Component classes â”€â”€ */

@layer components {
  .input-field {
    @apply w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900
           placeholder:text-slate-400
           focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
           transition-all duration-200;
  }

  .input-error {
    @apply border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-500;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3
           text-sm font-semibold text-white shadow-sm shadow-violet-600/25
           hover:bg-violet-500 hover:shadow-md hover:shadow-violet-600/30
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-violet-600
           transition-all duration-300;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3
           text-sm font-semibold text-slate-700 shadow-sm
           hover:bg-slate-50 hover:border-slate-300
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           disabled:opacity-60 disabled:cursor-not-allowed
           transition-all duration-300;
  }

  .btn-social {
    @apply inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5
           text-sm font-medium text-slate-700
           hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           transition-all duration-300;
  }

  .card {
    @apply bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50;
  }

  .badge {
    @apply inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold;
  }

  .icon-btn {
    @apply inline-flex items-center justify-center rounded-full text-slate-500
           hover:text-violet-600 hover:bg-violet-50
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
           transition-all duration-300;
  }

  .qty-btn {
    @apply inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600
           hover:bg-white hover:text-violet-600 hover:shadow-sm
           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none
           transition-all duration-200;
  }
}

/* â”€â”€ Utility classes â”€â”€ */

.text-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #c026d3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Dual-thumb price range slider */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 4px rgba(124, 58, 237, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
}
.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.range-slider::-moz-range-thumb {
  pointer-events: auto;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 4px rgba(124, 58, 237, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
}
.range-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}

``

## src\app\app.config.ts

``typescript
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { GlobalErrorHandler } from './core/errors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    
    
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};

``

## src\app\app.html

``html
<router-outlet />
<app-toast />

``

## src\app\app.routes.ts

``typescript
import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { sellerGuard } from './core/guards/seller.guard';

export const routes: Routes = [
  
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'users/:id', loadComponent: () => import('./features/admin/admin-user-profile.component').then(m => m.AdminUserProfileComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'add-product', loadComponent: () => import('./features/admin/admin-add-product.component').then(m => m.AdminAddProductComponent) },
      { path: 'edit-product/:id', loadComponent: () => import('./features/admin/admin-add-product.component').then(m => m.AdminAddProductComponent) },
      { path: 'categories', loadComponent: () => import('./features/admin/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'seller-requests', loadComponent: () => import('./features/admin/admin-seller-requests.component').then(m => m.AdminSellerRequestsComponent) },
      { path: 'announcements', loadComponent: () => import('./features/admin/admin-announcements.component').then(m => m.AdminAnnouncementsComponent) },
      { path: 'logs', loadComponent: () => import('./features/admin/admin-logs.component').then(m => m.AdminLogsComponent) }
    ]
  },



  
  
  {
    path: 'auth/login',
    title: 'Sign in Â· Budgetha',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    title: 'Create an account Â· Budgetha',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    title: 'Reset your password Â· Budgetha',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    title: 'Choose a new password Â· Budgetha',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },

  
  
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'signin', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'sign-in', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'sign-up', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'forgot-password', redirectTo: 'auth/forgot-password', pathMatch: 'full' },
  { path: 'reset-password', redirectTo: 'auth/reset-password', pathMatch: 'full' },

  
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        title: 'Budgetha â€” Shop smarter, spend wiser',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'shop',
        title: 'Shop all products Â· Budgetha',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      
      
      
      { path: 'products', redirectTo: 'shop', pathMatch: 'full' },
      { path: 'catalog', redirectTo: 'shop', pathMatch: 'full' },
      { path: 'deals', pathMatch: 'full', redirectTo: () => inject(Router).parseUrl('/shop?deals=1') },
      { path: 'wishlist', pathMatch: 'full', redirectTo: () => inject(Router).parseUrl('/shop?wishlist=1') },
      {
        path: 'products/:slug',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'cart',
        title: 'Your cart Â· Budgetha',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'checkout',
        title: 'Checkout Â· Budgetha',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
      },
      {
        path: 'checkout/success/:number',
        title: 'Order confirmed Â· Budgetha',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/order-success.component').then(m => m.OrderSuccessComponent),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () => import('./features/account/account-layout.component').then(m => m.AccountLayoutComponent),
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          {
            path: 'orders',
            title: 'My orders Â· Budgetha',
            loadComponent: () => import('./features/account/account-orders.component').then(m => m.AccountOrdersComponent),
          },
          {
            path: 'addresses',
            title: 'Saved addresses Â· Budgetha',
            loadComponent: () => import('./features/account/account-addresses.component').then(m => m.AccountAddressesComponent),
          },

          {
            path: 'settings',
            title: 'Account settings Â· Budgetha',
            loadComponent: () => import('./features/account/account-settings.component').then(m => m.AccountSettingsComponent),
          },
          
          
          { path: '**', redirectTo: 'orders' },
        ],
      },
      { path: 'dashboard', redirectTo: 'account/orders', pathMatch: 'full' },
      { path: 'orders', redirectTo: 'account/orders', pathMatch: 'full' },
      { path: 'profile', redirectTo: 'account/settings', pathMatch: 'full' },
      { path: 'settings', redirectTo: 'account/settings', pathMatch: 'full' },

      
      {
        path: 'help',
        title: 'Help Center Â· Budgetha',
        data: { key: 'help' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'shipping-returns',
        title: 'Shipping & Returns Â· Budgetha',
        data: { key: 'shipping-returns' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'warranty',
        title: 'Warranty Â· Budgetha',
        data: { key: 'warranty' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'contact',
        title: 'Contact us Â· Budgetha',
        data: { key: 'contact' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/privacy',
        title: 'Privacy Policy Â· Budgetha',
        data: { key: 'legal/privacy' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/terms',
        title: 'Terms of Service Â· Budgetha',
        data: { key: 'legal/terms' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      {
        path: 'legal/cookies',
        title: 'Cookie Policy Â· Budgetha',
        data: { key: 'legal/cookies' },
        loadComponent: () => import('./features/info/info-page.component').then(m => m.InfoPageComponent),
      },
      
      { path: 'privacy', redirectTo: 'legal/privacy', pathMatch: 'full' },
      { path: 'terms', redirectTo: 'legal/terms', pathMatch: 'full' },
      { path: 'cookies', redirectTo: 'legal/cookies', pathMatch: 'full' },
      { path: 'support', redirectTo: 'help', pathMatch: 'full' },
      { path: 'faq', redirectTo: 'help', pathMatch: 'full' },
      { path: 'shipping', redirectTo: 'shipping-returns', pathMatch: 'full' },
      { path: 'returns', redirectTo: 'shipping-returns', pathMatch: 'full' },

      {
        path: '**',
        title: 'Page not found Â· Budgetha',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];

``

## src\app\app.scss

``
``

## src\app\app.spec.ts

``typescript
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, budgetha-web');
  });
});

``

## src\app\app.ts

``typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  
  
  private readonly pwa = inject(PwaService);
}

``

## src\app\core\errors\global-error-handler.ts

``typescript
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  
  private lastMessage = '';
  private lastShownAt = 0;

  handleError(error: unknown): void {
    
    console.error(error);

    
    if (this.unwrap(error) instanceof HttpErrorResponse) return;

    const message = this.describe(error);
    if (!message) return;

    const now = performance.now();
    if (message === this.lastMessage && now - this.lastShownAt < 5000) return;
    this.lastMessage = message;
    this.lastShownAt = now;

    this.toast.error(message);
  }

  
  private unwrap(error: unknown): unknown {
    const nested = (error as { rejection?: unknown; cause?: unknown } | null);
    return nested?.rejection ?? nested?.cause ?? error;
  }

  private describe(error: unknown): string | null {
    const raw = this.unwrap(error);
    const text = raw instanceof Error ? `${raw.name}: ${raw.message}` : String(raw ?? '');

    
    
    if (/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(text)) {
      return 'A newer version of Budgetha is available. Please refresh the page to continue.';
    }

    if (/NetworkError|Failed to fetch|Load failed/i.test(text)) {
      return navigator.onLine
        ? 'A network request failed. Please try again.'
        : 'You appear to be offline. Some features wonâ€™t work until you reconnect.';
    }

    if (/QuotaExceededError/i.test(text)) {
      return 'Your browser storage is full, so we couldnâ€™t save that locally.';
    }

    
    
    return isDevMode()
      ? `Unexpected error: ${text}`
      : 'Something unexpected happened. Weâ€™ve logged it â€” please try that again.';
  }
}

``

## src\app\core\guards\admin.guard.ts

``typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = authService.user();
  
  if (user && (user.roles?.includes('Admin') || user.roles?.includes('SuperAdmin') || user.roles?.includes('Seller'))) {
    return true;
  }

  toastService.error('Unauthorized access. Admin privileges required.');
  return router.parseUrl('/');
};

``

## src\app\core\guards\auth.guard.ts

``typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';


export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  toast.info(explain(state.url), 6000);
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

function explain(url: string): string {
  if (url.startsWith('/checkout')) {
    return 'Please log in or create an account to proceed to checkout.';
  }
  if (url.startsWith('/account')) {
    return 'Please sign in to view your account.';
  }
  return 'Please sign in to continue.';
}

``

## src\app\core\guards\seller.guard.ts

``typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const sellerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = authService.user();
  
  if (user && (user.roles?.includes('Seller') || user.roles?.includes('SuperAdmin'))) {
    return true;
  }

  toastService.error('Unauthorized access. Seller privileges required.');
  return router.parseUrl('/');
};

``

## src\app\core\interceptors\auth.interceptor.ts

``typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};

``

## src\app\core\interceptors\error.interceptor.ts

``typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const silent = req.headers.has('X-Skip-Error-Toast');
  const cleaned = silent ? req.clone({ headers: req.headers.delete('X-Skip-Error-Toast') }) : req;

  return next(cleaned).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = describe(error);

      if (error.status === 401) {
        auth.clearSession();
        const current = router.url;
        
        const returnUrl = current.startsWith('/auth/') ? null : current;
        router.navigate(['/auth/login'], { queryParams: { returnUrl } });
      }

      if (!silent) {
        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};

function describe(error: HttpErrorResponse): string {
  
  
  const fromApi = extractApiMessage(error);

  switch (true) {
    case error.status === 0:
      return navigator.onLine
        ? 'We couldnâ€™t reach Budgethaâ€™s servers. Please try again in a moment.'
        : 'You appear to be offline. Check your connection and try again.';
    case error.status === 400:
    case error.status === 422:
      return fromApi ?? 'Some of the details you entered arenâ€™t quite right. Please review and try again.';
    case error.status === 401:
      return fromApi ?? 'Your session has expired. Please sign in again to continue.';
    case error.status === 403:
      return fromApi ?? 'You donâ€™t have permission to do that.';
    case error.status === 404:
      return fromApi ?? 'We couldnâ€™t find what you were looking for.';
    case error.status === 409:
      return fromApi ?? 'That conflicts with something that already exists.';
    case error.status === 429:
      return 'Too many attempts. Please wait a moment before trying again.';
    case error.status >= 500:
      return 'Something went wrong on our end. Weâ€™re on it â€” please try again shortly.';
    default:
      return fromApi ?? 'Something went wrong. Please try again.';
  }
}


function extractApiMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body) return null;
  if (typeof body === 'string') return body.trim() || null;

  if (Array.isArray(body.errors) && body.errors.length) {
    return String(body.errors[0]);
  }

  
  if (body.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors as Record<string, unknown>)
      .flat()
      .find(v => typeof v === 'string' && v.trim());
    if (first) return String(first);
  }

  return body.message || body.detail || body.title || null;
}

``

## src\app\core\mocks\info-pages.ts

``typescript

export interface InfoSection {
  heading: string;
  body: string[];
}

export interface InfoPage {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  
  updated?: string;
}

export const INFO_PAGES: Record<string, InfoPage> = {
  help: {
    eyebrow: 'Support',
    title: 'Help Center',
    intro: 'Answers to the questions we hear most. If you canâ€™t find what you need, our team is one message away.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'Every order gets a confirmation email within a few minutes of checkout, including your order number and an itemised receipt.',
          'You can follow an order end to end from My Orders in your account â€” from payment confirmed through to delivered.',
          'Orders can be changed or cancelled free of charge until they enter fulfilment, which is usually within one hour of being placed.',
        ],
      },
      {
        heading: 'Payments',
        body: [
          'We accept all major credit and debit cards. Your card is authorised at checkout and only charged when your order ships.',
          'Card details are handled by our payment processor and never stored on Budgethaâ€™s servers.',
          'Promo codes apply to the item subtotal before shipping and tax. One code per order.',
        ],
      },
      {
        heading: 'Accounts',
        body: [
          'Creating an account saves your addresses and payment methods, and keeps your order history and wishlist in one place.',
          'Forgot your password? Use the reset link on the sign-in page and weâ€™ll email you a secure link.',
          'You can update your details or close your account at any time from Account Settings.',
        ],
      },
    ],
  },

  'shipping-returns': {
    eyebrow: 'Support',
    title: 'Shipping & Returns',
    intro: 'What it costs, how long it takes, and how to send something back if it isnâ€™t right.',
    sections: [
      {
        heading: 'Shipping options',
        body: [
          'Standard shipping is $6.99 and arrives in 3â€“5 business days.',
          'Orders over $75 ship free â€” the discount is applied automatically at checkout.',
          'Express shipping is available at checkout for delivery within 1â€“2 business days.',
          'Orders placed before 2pm on a business day are dispatched the same day.',
        ],
      },
      {
        heading: 'Tracking your delivery',
        body: [
          'Youâ€™ll get a tracking link by email as soon as your parcel leaves the warehouse.',
          'The same link is always available from My Orders in your account.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Return anything unused and in its original packaging within 30 days of delivery.',
          'Start a return from My Orders and weâ€™ll email you a prepaid label.',
          'Refunds are issued to the original payment method within 5 business days of the parcel reaching us.',
          'For hygiene reasons, earphones and personal-care items can only be returned if the seal is unbroken.',
        ],
      },
    ],
  },

  warranty: {
    eyebrow: 'Support',
    title: 'Warranty',
    intro: 'Every item sold on Budgetha is covered against manufacturing defects.',
    sections: [
      {
        heading: 'Whatâ€™s covered',
        body: [
          'All products carry a minimum 12-month warranty against defects in materials and workmanship.',
          'Selected electronics carry a 24-month manufacturer warranty â€” the term is listed on the product page.',
          'Warranty cover is in addition to, and does not replace, your statutory consumer rights.',
        ],
      },
      {
        heading: 'Whatâ€™s not covered',
        body: [
          'Accidental damage, liquid damage, and normal cosmetic wear such as scratches and fading.',
          'Damage caused by unauthorised repair or modification.',
          'Consumable parts with a limited working life, such as batteries and filters, beyond their rated cycles.',
        ],
      },
      {
        heading: 'Making a claim',
        body: [
          'Open the order in My Orders and choose Report an issue, or contact us with your order number.',
          'Photos of the fault help us resolve claims faster.',
          'Approved claims are resolved by repair, replacement, or refund â€” whichever suits you best.',
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Support',
    title: 'Contact Us',
    intro: 'Real people, quick replies. Hereâ€™s the fastest way to reach the right team.',
    sections: [
      {
        heading: 'Customer support',
        body: [
          'Email support@budgetha.example and weâ€™ll reply within one business day.',
          'Support hours are Monday to Friday, 9amâ€“6pm, and Saturday, 10amâ€“4pm.',
          'Include your order number and weâ€™ll skip straight to the useful part.',
        ],
      },
      {
        heading: 'Orders and deliveries',
        body: [
          'For anything about a specific order, the quickest route is Report an issue on the order in My Orders â€” it reaches us with all the context attached.',
        ],
      },
      {
        heading: 'Selling on Budgetha',
        body: [
          'Interested in listing your products? Write to partners@budgetha.example with a short introduction and a link to your catalogue.',
        ],
      },
      {
        heading: 'Press and media',
        body: ['Media enquiries go to press@budgetha.example.'],
      },
    ],
  },

  'legal/privacy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'How Budgetha collects, uses, and protects your personal information.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'Account information you give us: your name, email address, delivery addresses, and order history.',
          'Payment information is collected and processed by our payment provider. We receive only a token and the last four digits of your card.',
          'Usage information such as pages viewed and searches run, which we use to improve the storefront.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and deliver your orders, and to provide support when something goes wrong.',
          'To keep your account secure and detect fraudulent activity.',
          'To improve our products and recommendations. You can opt out of marketing email at any time from Account Settings.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share the minimum necessary with delivery partners and payment processors to complete your order.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can request a copy of your data, correct it, or ask us to delete it by writing to privacy@budgetha.example.',
          'We keep order records for as long as tax and accounting rules require, even after an account is closed.',
        ],
      },
    ],
  },

  'legal/terms': {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated 1 July 2026',
    intro: 'The terms you agree to when you shop with or create an account on Budgetha.',
    sections: [
      {
        heading: 'Using Budgetha',
        body: [
          'You must be at least 18 years old, or have the consent of a parent or guardian, to place an order.',
          'You are responsible for keeping your account credentials confidential and for activity that happens under your account.',
          'Donâ€™t misuse the service â€” no scraping, interference with the platform, or attempts to access other peopleâ€™s accounts.',
        ],
      },
      {
        heading: 'Orders and pricing',
        body: [
          'An order is an offer to buy. The contract forms when we send your dispatch confirmation.',
          'We work hard to keep prices and stock accurate. Where an obvious error occurs, we may cancel the order and refund you in full.',
          'Prices include applicable tax unless stated otherwise at checkout.',
        ],
      },
      {
        heading: 'Cancellation and returns',
        body: [
          'Our returns terms are set out on the Shipping & Returns page and form part of these terms.',
          'Nothing here limits your statutory rights as a consumer.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'We provide the service with reasonable care and skill, but we donâ€™t guarantee uninterrupted availability.',
          'We are not liable for indirect or consequential loss to the extent permitted by law.',
        ],
      },
    ],
  },

  'legal/cookies': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    updated: 'Last updated 1 July 2026',
    intro: 'Cookies and local storage keep your basket, session, and preferences working across visits.',
    sections: [
      {
        heading: 'Essential',
        body: [
          'These keep you signed in, remember whatâ€™s in your cart and wishlist, and protect checkout against fraud.',
          'The site cannot function without them, so they canâ€™t be switched off.',
        ],
      },
      {
        heading: 'Preferences',
        body: [
          'Remember choices such as recently viewed products and whether you dismissed the install prompt.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'Aggregated, non-identifying data about which pages are used and where people run into trouble.',
          'We use it to prioritise what to fix and build next.',
        ],
      },
      {
        heading: 'Managing cookies',
        body: [
          'Every browser lets you review and delete cookies and site data in its settings.',
          'Blocking essential cookies will stop sign-in and checkout from working.',
        ],
      },
    ],
  },
};

``

## src\app\core\mocks\mock-products.ts

``typescript

export const BRANDS = ['AudioPeak', 'Vertex', 'NordicWear', 'LumenHome', 'PixelPro', 'UrbanKit'];


``

## src\app\core\models\auth.models.ts

``typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

``

## src\app\core\models\shop.models.ts

``typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  approvalStatus?: string;
  isAvailableForRent?: boolean;
  rentalPricePerDay?: number;
}

export interface Review {
  id: string | number;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  isAuthor?: boolean;
}

export interface RatingBucket {
  stars: number;
  count: number;
  percent: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  color?: string;
  size?: string;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'shipping';
  value: number;
  description: string;
}

export interface Address {
  id: number;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: number;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: number;
  number: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentSummary: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface CatalogQuery {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  totalPages: number;
}

``

## src\app\core\services\account.service.ts

``typescript
import { Injectable, effect, signal } from '@angular/core';
import { Address, PaymentCard } from '../models/shop.models';

const ADDRESS_KEY = 'budgetha_addresses_v2';
const CARDS_KEY = 'budgetha_cards_v2';

const SEED_ADDRESSES: Address[] = [];

const SEED_CARDS: PaymentCard[] = [];

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly _addresses = signal<Address[]>(this.load(ADDRESS_KEY, SEED_ADDRESSES));
  private readonly _cards = signal<PaymentCard[]>(this.load(CARDS_KEY, SEED_CARDS));

  readonly addresses = this._addresses.asReadonly();
  readonly cards = this._cards.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(this._addresses()));
      localStorage.setItem(CARDS_KEY, JSON.stringify(this._cards()));
    });
  }

  defaultAddress(): Address | undefined {
    return this._addresses().find(a => a.isDefault) ?? this._addresses()[0];
  }

  saveAddress(address: Omit<Address, 'id'> & { id?: number }): void {
    this._addresses.update(list => {
      let next = list.slice();
      if (address.isDefault) {
        next = next.map(a => ({ ...a, isDefault: false }));
      }
      if (address.id) {
        return next.map(a => (a.id === address.id ? ({ ...address, id: address.id } as Address) : a));
      }
      const id = Math.max(0, ...next.map(a => a.id)) + 1;
      return [...next, { ...address, id } as Address];
    });
  }

  deleteAddress(id: number): void {
    this._addresses.update(list => {
      const next = list.filter(a => a.id !== id);
      if (next.length && !next.some(a => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultAddress(id: number): void {
    this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
  }

  defaultCard(): PaymentCard | undefined {
    return this._cards().find(c => c.isDefault) ?? this._cards()[0];
  }

  saveCard(card: Omit<PaymentCard, 'id'> & { id?: number }): void {
    this._cards.update(list => {
      let next = list.slice();
      if (card.isDefault) {
        next = next.map(c => ({ ...c, isDefault: false }));
      }
      if (card.id) {
        return next.map(c => (c.id === card.id ? ({ ...card, id: card.id } as PaymentCard) : c));
      }
      const id = Math.max(0, ...next.map(c => c.id)) + 1;
      return [...next, { ...card, id } as PaymentCard];
    });
  }

  deleteCard(id: number): void {
    this._cards.update(list => {
      const next = list.filter(c => c.id !== id);
      if (next.length && !next.some(c => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }

  setDefaultCard(id: number): void {
    this._cards.update(list => list.map(c => ({ ...c, isDefault: c.id === id })));
  }

  private load<T>(key: string, seed: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : seed;
    } catch {
      return seed;
    }
  }
}

``

## src\app\core\services\admin.service.ts

``typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionHistoryDto } from '../../features/admin/admin-logs.component';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
}

export interface SellerStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
  isBanned?: boolean;
}

export interface AdminUserProfile extends AdminUser {
  products: any[];
}

export interface AdminProductResult {
  items: any[];
  total: number;
  totalPages: number;
}

export interface PagedUserResult {
  items: AdminUser[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly rolesUrl = `${environment.apiUrl}/roles`;
  private readonly productsUrl = `${environment.apiUrl}/products`;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getSellerStats(): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.apiUrl}/seller-stats`);
  }

  getRecentUsers(count: number = 5): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/recent-users?count=${count}`);
  }

  getAllUsers(page: number = 1, pageSize: number = 20): Observable<PagedUserResult> {
    return this.http.get<PagedUserResult>(`${this.apiUrl}/users?page=${page}&pageSize=${pageSize}`);
  }

  getAllProducts(page: number = 1, pageSize: number = 50): Observable<AdminProductResult> {
    return this.http.get<AdminProductResult>(`${this.apiUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  
  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/assign`, { userId, role });
  }

  removeRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.rolesUrl}/remove`, { userId, role });
  }

  
  approveProduct(productId: string, status: 'Approved' | 'Rejected'): Observable<any> {
    return this.http.patch(`${this.productsUrl}/${productId}/approve`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}`);
  }

  
  getUserProfile(userId: string): Observable<AdminUserProfile> {
    return this.http.get<AdminUserProfile>(`${this.apiUrl}/users/${userId}/profile`);
  }

  banUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/ban`, {});
  }

  unbanUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/unban`, {});
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getTransactionHistory(type: string, startDate?: string, endDate?: string): Observable<TransactionHistoryDto[]> {
    let params = new HttpParams().set('type', type);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionHistoryDto[]>(`${environment.apiUrl}/orders/history`, { params });
  }

  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/announcements`);
  }
}

``

## src\app\core\services\announcement.service.ts

``typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Announcement {
  id: string;
  message: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  created: string;
}

export interface CreateAnnouncementDto {
  message: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAnnouncementDto extends CreateAnnouncementDto {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/announcements`;

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  getActive(): Observable<Announcement | null> {
    return this.http.get<Announcement | null>(`${this.apiUrl}/active`);
  }

  create(dto: CreateAnnouncementDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAnnouncementDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

``

## src\app\core\services\auth.service.ts

``typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest } from '../models/auth.models';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  
  
  
  
  private readonly token = signal<string | null>(null);
  private readonly currentUser = signal<AuthResponse | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly user = this.currentUser.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredSession();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email } as ForgotPasswordRequest);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, token, newPassword } as ResetPasswordRequest);
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, { idToken } as GoogleLoginRequest).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  updateProfile(firstName: string, lastName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, { firstName, lastName }).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, firstName, lastName };
          this.currentUser.set(updated);
          localStorage.setItem(this.userKey, JSON.stringify(updated));
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  
  clearSession(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch {
      
    }
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private handleAuth(response: AuthResponse): void {
    try {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response));
    } catch {
      
    }
    this.token.set(response.token);
    this.currentUser.set(response);
  }

  private loadStoredSession(): void {
    let token: string | null = null;
    let stored: string | null = null;

    try {
      token = localStorage.getItem(this.tokenKey);
      stored = localStorage.getItem(this.userKey);
    } catch {
      return;
    }

    if (!token) {
      
      if (stored) this.clearSession();
      return;
    }

    this.token.set(token);

    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored) as AuthResponse);
      } catch {
        
        try { localStorage.removeItem(this.userKey); } catch {  }
        this.currentUser.set(null);
      }
    }
  }
}

``

## src\app\core\services\cart.service.ts

``typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product, PromoCode } from '../models/shop.models';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_cart';
const PROMO_KEY = 'budgetha_promo';

export const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SAVE20', type: 'percent', value: 20, description: '20% off your order' },
  { code: 'FREESHIP', type: 'shipping', value: 0, description: 'Free shipping' },
];

export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING = 6.99;
export const TAX_RATE = 0.08;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.load());
  private readonly _promo = signal<PromoCode | null>(this.loadPromo());
  private readonly _drawerOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly promo = this._promo.asReadonly();
  readonly drawerOpen = this._drawerOpen.asReadonly();

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, i) => sum + i.price * i.quantity, 0));
  readonly discount = computed(() => {
    const promo = this._promo();
    if (!promo || promo.type !== 'percent') return 0;
    return (this.subtotal() * promo.value) / 100;
  });
  readonly shipping = computed(() => {
    if (this._items().length === 0) return 0;
    if (this._promo()?.type === 'shipping') return 0;
    return this.subtotal() - this.discount() >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  });
  readonly tax = computed(() => (this.subtotal() - this.discount()) * TAX_RATE);
  readonly total = computed(() => this.subtotal() - this.discount() + this.shipping() + this.tax());
  readonly amountToFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - (this.subtotal() - this.discount()))
  );

  constructor(private toast: ToastService) {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      const promo = this._promo();
      if (promo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    });
  }

  add(product: Product, quantity = 1, color?: string, size?: string): void {
    this._items.update(items => {
      const existing = items.find(
        i => i.productId === product.id && i.color === color && i.size === size
      );
      if (existing) {
        return items.map(i =>
          i === existing ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          image: product.images[0],
          price: product.price,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          color,
          size,
        },
      ];
    });
    this.toast.success(`${product.name} added to cart`);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === item.productId && i.color === item.color && i.size === item.size
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  }

  remove(item: CartItem): void {
    this._items.update(items =>
      items.filter(
        i => !(i.productId === item.productId && i.color === item.color && i.size === item.size)
      )
    );
  }

  clear(): void {
    this._items.set([]);
    this._promo.set(null);
  }

  applyPromo(code: string): boolean {
    const promo = PROMO_CODES.find(p => p.code === code.trim().toUpperCase());
    if (promo) {
      this._promo.set(promo);
      this.toast.success(`Promo applied â€” ${promo.description}`);
      return true;
    }
    return false;
  }

  removePromo(): void {
    this._promo.set(null);
  }

  openDrawer(): void {
    this._drawerOpen.set(true);
  }

  closeDrawer(): void {
    this._drawerOpen.set(false);
  }

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private loadPromo(): PromoCode | null {
    try {
      return JSON.parse(localStorage.getItem(PROMO_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}

``

## src\app\core\services\cloudinary.service.ts

``typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  
  
  private readonly uploadEndpoint = `${environment.apiUrl}/images/upload`;

  
  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<CloudinaryUploadResponse>(this.uploadEndpoint, formData);
  }
}

``

## src\app\core\services\order.service.ts

``typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { Address, CartItem, Order, OrderStatus, PromoCode } from '../models/shop.models';

const STORAGE_KEY = 'budgetha_orders_v2';

const SEED_ORDERS: Order[] = [];

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentSummary: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(this.load());

  readonly orders = computed(() =>
    this._orders().slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders())));
  }

  getByNumber(orderNumber: string): Order | undefined {
    return this._orders().find(o => o.number === orderNumber);
  }

  placeOrder(input: PlaceOrderInput): Order {
    const id = Math.max(0, ...this._orders().map(o => o.id)) + 1;
    const order: Order = {
      id,
      number: `BGT-2026-${String(600 + id * 7).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processing' as OrderStatus,
      items: input.items.map(i => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      shippingAddress: `${input.address.line1}${input.address.line2 ? ', ' + input.address.line2 : ''}, ${input.address.city}, ${input.address.state} ${input.address.zip}`,
      paymentSummary: input.paymentSummary,
    };
    this._orders.update(orders => [...orders, order]);
    return order;
  }

  private load(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  }
}

``

## src\app\core\services\product.service.ts

``typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BRANDS } from '../mocks/mock-products';
import {
  CatalogQuery,
  CatalogResult,
  Category,
  Product,
  RatingBucket,
  Review,
} from '../models/shop.models';
import { environment } from '../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(err => {
        console.error('Failed to fetch categories', err);
        return of([]);
      })
    );
  }

  createCategory(category: { name: string, slug: string, description?: string, imageUrl?: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: { id: string, name: string, slug: string, imageUrl?: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/categories/${id}`, category);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/brands`).pipe(
      catchError(err => {
        console.error('Failed to fetch brands', err);
        return of([]);
      })
    );
  }

  getAll(): Observable<Product[]> {
    return this.query({ page: 1, pageSize: 100, minPrice: 0, maxPrice: 1000000, minRating: 0 } as CatalogQuery).pipe(map(res => res?.items || []));
  }

  getFeatured(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isFeatured)));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getAll().pipe(map(items => items.filter(p => p.isNew)));
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`).pipe(
      catchError(err => {
        console.error(`Failed to fetch product ${slug}`, err);
        throw err; 
      })
    );
  }

  getRelated(product: Product, count = 4): Observable<Product[]> {
    return this.getAll().pipe(
      map(items => {
        const sameCategory = items.filter(p => p.id !== product.id && p.category === product.category);
        const others = items.filter(p => p.id !== product.id && p.category !== product.category);
        return [...sameCategory, ...others].slice(0, count);
      })
    );
  }

  priceBounds(): Observable<{ min: number; max: number }> {
    return this.getAll().pipe(
      map(items => {
        if (!items || items.length === 0) {
          return { min: 0, max: 1000 };
        }
        const prices = items.map(p => p.price);
        return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
      })
    );
  }

  query(q: CatalogQuery): Observable<CatalogResult> {
    let params: any = {
      page: q.page,
      pageSize: q.pageSize
    };
    if (q.search) params.search = q.search;
    if (q.minPrice) params.minPrice = q.minPrice;
    if (q.maxPrice) params.maxPrice = q.maxPrice;
    if (q.minRating) params.minRating = q.minRating;
    if (q.sort) params.sort = q.sort;

    let qs = new URLSearchParams(params).toString();
    if (q.categories && q.categories.length) {
      q.categories.forEach(c => qs += `&categories=${encodeURIComponent(c)}`);
    }
    if (q.brands && q.brands.length) {
      q.brands.forEach(b => qs += `&brands=${encodeURIComponent(b)}`);
    }

    return this.http.get<CatalogResult>(`${this.apiUrl}/products?${qs}`).pipe(
      catchError(err => {
        console.error('Failed to query products', err);
        return of({ items: [], total: 0, totalPages: 1 } as CatalogResult);
      })
    );
  }


}

``

## src\app\core\services\pwa.service.ts

``typescript
import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ToastService } from './toast.service';


interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'budgetha:install-dismissed';


@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly toast = inject(ToastService);
  private readonly swUpdate = inject(SwUpdate, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  private readonly promptAvailable = signal(false);
  private readonly installed = signal(false);
  private readonly dismissed = signal(readDismissed());

  readonly online = signal(true);

  
  readonly canInstall = computed(() => this.promptAvailable() && !this.installed() && !this.dismissed());

  
  readonly showInstallAffordance = computed(() => !this.installed() && !this.dismissed());

  
  readonly isStandalone = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    this.online.set(navigator.onLine);
    this.isStandalone.set(detectStandalone());
    this.installed.set(detectStandalone());

    const onBeforeInstall = (event: Event) => {
      
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.promptAvailable.set(true);
    };

    const onInstalled = () => {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.installed.set(true);
      this.toast.success('Budgetha is installed. Look for it alongside your other apps.');
    };

    const onOnline = () => {
      this.online.set(true);
      this.toast.success('Youâ€™re back online.');
    };

    const onOffline = () => {
      this.online.set(false);
      this.toast.warning('Youâ€™re offline. You can keep browsing pages youâ€™ve already visited.', { duration: 0 });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    });

    this.watchForUpdates();
  }

  
  async install(): Promise<boolean> {
    const prompt = this.deferredPrompt;

    if (!prompt) {
      
      this.toast.info(installHint(), { duration: 8000 });
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;

      
      this.deferredPrompt = null;
      this.promptAvailable.set(false);

      if (outcome === 'accepted') return true;

      this.dismissInstall();
      return false;
    } catch {
      this.deferredPrompt = null;
      this.promptAvailable.set(false);
      this.toast.error('We couldnâ€™t open the install dialog. Try your browserâ€™s menu instead.');
      return false;
    }
  }

  
  dismissInstall(): void {
    this.dismissed.set(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      
    }
  }

  private watchForUpdates(): void {
    if (!this.swUpdate?.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toast.info('A new version of Budgetha is ready.', {
          duration: 0,
          action: {
            label: 'Reload now',
            handler: () => this.swUpdate!.activateUpdate().then(() => document.location.reload()),
          },
        });
      });

    
    this.swUpdate.unrecoverable.subscribe(() => {
      this.toast.error('Budgetha needs to reload to recover from a caching problem.', {
        duration: 0,
        action: { label: 'Reload', handler: () => document.location.reload() },
      });
    });
  }
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return window.matchMedia?.('(display-mode: standalone)').matches === true || iosStandalone;
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function installHint(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'To install Budgetha: tap Share, then â€œAdd to Home Screenâ€.';
  }
  if (/Firefox/i.test(ua)) {
    return 'To install Budgetha: open the Firefox menu and choose â€œInstallâ€.';
  }
  return 'To install Budgetha: open your browser menu and choose â€œInstall appâ€.';
}

``

## src\app\core\services\quick-view.service.ts

``typescript
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/shop.models';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly _product = signal<Product | null>(null);
  readonly product = this._product.asReadonly();

  open(product: Product): void {
    this._product.set(product);
  }

  close(): void {
    this._product.set(null);
  }
}

``

## src\app\core\services\review.service.ts

``typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/shop.models';
import { environment } from '../../../environments/environment';

export interface AddReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  reviewId: string;
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
  }

  addReview(dto: AddReviewDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updateReview(id: string, dto: UpdateReviewDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

``

## src\app\core\services\toast.service.ts

``typescript
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  
  action?: ToastAction;
}

export interface ToastOptions {
  
  duration?: number;
  action?: ToastAction;
}


const MAX_VISIBLE = 4;

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 4500,
  warning: 5000,
  error: 6500,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', options: ToastOptions | number = {}): number {
    
    const opts: ToastOptions = typeof options === 'number' ? { duration: options } : options;
    const duration = opts.duration ?? DEFAULT_DURATION[type];
    const id = this.nextId++;

    this.toasts.update(current => {
      
      const deduped = current.filter(t => !(t.message === message && t.type === type));
      const next = [...deduped, { id, message, type, action: opts.action }];
      const overflow = next.slice(0, Math.max(0, next.length - MAX_VISIBLE));
      overflow.forEach(t => this.clearTimer(t.id));
      return next.slice(-MAX_VISIBLE);
    });

    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }

    return id;
  }

  success(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions | number): number {
    return this.show(message, 'warning', options);
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear(): void {
    this.timers.forEach(handle => clearTimeout(handle));
    this.timers.clear();
    this.toasts.set([]);
  }

  private clearTimer(id: number): void {
    const handle = this.timers.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
  }
}

``

## src\app\core\services\wishlist.service.ts

``typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'budgetha_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _ids = signal<string[]>(this.load());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  constructor(private toast: ToastService) {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));
  }

  has(productId: string): boolean {
    return this._ids().includes(productId);
  }

  toggle(productId: string, productName?: string): void {
    if (this.has(productId)) {
      this._ids.update(ids => ids.filter(id => id !== productId));
      if (productName) this.toast.info(`${productName} removed from wishlist`);
    } else {
      this._ids.update(ids => [...ids, productId]);
      if (productName) this.toast.success(`${productName} saved to wishlist`);
    }
  }

  private load(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch { }
    return [];
  }
}

``

## src\app\features\account\account-addresses.component.ts

``typescript
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-addresses',
  imports: [ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="card overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Saved Addresses</h2>
            <p class="text-sm text-slate-400 mt-0.5">Manage your delivery destinations</p>
          </div>
          <button type="button" (click)="startAdd()" class="btn-primary px-4 py-2.5 text-sm gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
            Add Address
          </button>
        </div>

        @if (account.addresses().length === 0 && !formVisible()) {
          <app-empty-state
            icon="address"
            title="No saved addresses"
            message="Save an address to breeze through checkout â€” your default will be pre-filled automatically." />
        } @else {
          <div class="grid sm:grid-cols-2 gap-4 p-6">
            @for (address of account.addresses(); track address.id) {
              <div class="rounded-2xl border p-5 transition-all duration-300"
                   [class]="address.isDefault ? 'border-violet-300 bg-violet-50/40 ring-1 ring-violet-100' : 'border-slate-200 hover:border-slate-300'">
                <div class="flex items-start justify-between">
                  <span class="badge" [class]="address.isDefault ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'">
                    {{ address.label }}
                  </span>
                  @if (address.isDefault) {
                    <span class="text-[11px] font-bold text-violet-600 uppercase tracking-wider">Default</span>
                  }
                </div>
                <p class="mt-3 font-bold text-slate-900 text-sm">{{ address.fullName }}</p>
                <p class="mt-1 text-sm text-slate-500 leading-relaxed">
                  {{ address.line1 }}@if (address.line2) {<br />{{ address.line2 }}}<br />
                  {{ address.city }}, {{ address.state }} {{ address.zip }}<br />
                  {{ address.country }}
                </p>
                <p class="mt-1.5 text-xs text-slate-400">{{ address.phone }}</p>
                <div class="mt-4 flex items-center gap-3 text-xs font-semibold">
                  <button type="button" (click)="startEdit(address)" class="text-violet-600 hover:text-violet-500 transition-colors duration-300">Edit</button>
                  @if (!address.isDefault) {
                    <button type="button" (click)="account.setDefaultAddress(address.id)" class="text-slate-500 hover:text-slate-700 transition-colors duration-300">Set default</button>
                  }
                  <button type="button" (click)="remove(address)" class="text-rose-500 hover:text-rose-400 transition-colors duration-300 ml-auto">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Add / edit form -->
      @if (formVisible()) {
        <form [formGroup]="form" (ngSubmit)="save()" class="card p-6">
          <h3 class="text-base font-bold text-slate-900 mb-5">{{ editingId() ? 'Edit address' : 'New address' }}</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="addr-label" class="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
              <input id="addr-label" type="text" formControlName="label" placeholder="Home, Officeâ€¦" class="input-field" [class.input-error]="invalid('label')" />
              @if (invalid('label')) { <p class="mt-1.5 text-xs text-red-500">Label is required.</p> }
            </div>
            <div>
              <label for="addr-name" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input id="addr-name" type="text" formControlName="fullName" autocomplete="name" class="input-field" [class.input-error]="invalid('fullName')" />
              @if (invalid('fullName')) { <p class="mt-1.5 text-xs text-red-500">Full name is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
              <input id="addr-line1" type="text" formControlName="line1" autocomplete="address-line1" class="input-field" [class.input-error]="invalid('line1')" />
              @if (invalid('line1')) { <p class="mt-1.5 text-xs text-red-500">Street address is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
              <input id="addr-line2" type="text" formControlName="line2" autocomplete="address-line2" class="input-field" />
            </div>
            <div>
              <label for="addr-city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input id="addr-city" type="text" formControlName="city" autocomplete="address-level2" class="input-field" [class.input-error]="invalid('city')" />
              @if (invalid('city')) { <p class="mt-1.5 text-xs text-red-500">City is required.</p> }
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="addr-state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input id="addr-state" type="text" formControlName="state" autocomplete="address-level1" class="input-field" [class.input-error]="invalid('state')" />
                @if (invalid('state')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
              <div>
                <label for="addr-zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP</label>
                <input id="addr-zip" type="text" formControlName="zip" autocomplete="postal-code" class="input-field" [class.input-error]="invalid('zip')" />
                @if (invalid('zip')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
            </div>
            <div>
              <label for="addr-country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <select id="addr-country" formControlName="country" class="input-field">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>Jordan</option>
              </select>
            </div>
            <div>
              <label for="addr-phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input id="addr-phone" type="tel" formControlName="phone" autocomplete="tel" class="input-field" [class.input-error]="invalid('phone')" />
              @if (invalid('phone')) { <p class="mt-1.5 text-xs text-red-500">Phone is required.</p> }
            </div>
            <label class="sm:col-span-2 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isDefault" class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30" />
              <span class="text-sm text-slate-600">Set as my default address</span>
            </label>
          </div>
          <div class="mt-6 flex gap-3">
            <button type="submit" class="btn-primary">{{ editingId() ? 'Save changes' : 'Add address' }}</button>
            <button type="button" (click)="cancel()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AccountAddressesComponent {
  readonly account = inject(AccountService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.group({
    label: ['', Validators.required],
    fullName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['United States', Validators.required],
    phone: ['', Validators.required],
    isDefault: [false],
  });

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  startAdd(): void {
    this.editingId.set(null);
    this.submitted.set(false);
    this.form.reset({ country: 'United States', isDefault: this.account.addresses().length === 0 });
    this.formVisible.set(true);
  }

  startEdit(address: Address): void {
    this.editingId.set(address.id);
    this.submitted.set(false);
    this.form.patchValue({ ...address, line2: address.line2 ?? '' });
    this.formVisible.set(true);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.account.saveAddress({
      id: this.editingId() ?? undefined,
      label: v.label!,
      fullName: v.fullName!,
      line1: v.line1!,
      line2: v.line2 || undefined,
      city: v.city!,
      state: v.state!,
      zip: v.zip!,
      country: v.country!,
      phone: v.phone!,
      isDefault: !!v.isDefault,
    });
    this.toast.success(this.editingId() ? 'Address updated' : 'Address added');
    this.cancel();
  }

  remove(address: Address): void {
    this.account.deleteAddress(address.id);
    this.toast.info(`Address â€œ${address.label}â€ deleted`);
  }

  cancel(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.submitted.set(false);
  }
}

``

## src\app\features\account\account-layout.component.ts

``typescript
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Account</h1>

      <div class="mt-8 grid lg:grid-cols-4 gap-8 items-start">
        <!-- â•â• Sidebar â•â• -->
        <aside class="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
          <!-- Profile card -->
          <div class="card p-5 flex items-center gap-4">
            <span class="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-lg font-bold flex items-center justify-center shrink-0">
              {{ initials() }}
            </span>
            <div class="min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ fullName() }}</p>
              <p class="text-xs text-slate-400 truncate">{{ auth.user()?.email }}</p>
            </div>
          </div>

          <!-- Nav -->
          <nav class="card p-2" aria-label="Account">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-violet-50 text-violet-700 font-semibold"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors duration-200">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                </svg>
                {{ item.label }}
              </a>
            }
            <button
              type="button"
              (click)="auth.logout()"
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-200 mt-1 border-t border-slate-100">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </nav>
        </aside>

        <!-- â•â• Content â•â• -->
        <div class="lg:col-span-3 min-w-0">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AccountLayoutComponent {
  readonly auth = inject(AuthService);

  readonly navItems = [
    {
      label: 'Order History',
      path: '/account/orders',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    },
    {
      label: 'Saved Addresses',
      path: '/account/addresses',
      icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    },

    {
      label: 'Account Settings',
      path: '/account/settings',
      icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  readonly fullName = computed(() => {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}`.trim() || u.email : 'Guest';
  });

  readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
  });
}

``

## src\app\features\account\account-orders.component.ts

``typescript
import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-orders',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, EmptyStateComponent],
  template: `
    <div class="card overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Order History</h2>
          <p class="text-sm text-slate-400 mt-0.5">{{ orders().length }} orders placed</p>
        </div>
      </div>

      @if (orders().length === 0) {
        <app-empty-state
          icon="orders"
          title="No orders found"
          message="You haven't placed any orders yet. When you do, they'll show up here with live status tracking."
          ctaLabel="Start Shopping"
          ctaLink="/shop" />
      } @else {
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                <th class="px-6 py-3.5">Order</th>
                <th class="px-6 py-3.5">Date</th>
                <th class="px-6 py-3.5">Items</th>
                <th class="px-6 py-3.5">Total</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (order of orders(); track order.id) {
                <tr class="hover:bg-violet-50/40 transition-colors duration-200">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.number }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ order.date | date: 'MMM d, y' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex -space-x-2.5">
                      @for (item of order.items.slice(0, 3); track item.productId) {
                        <img [src]="item.image" [alt]="item.name" class="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                      }
                      @if (order.items.length > 3) {
                        <span class="h-9 w-9 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[11px] font-bold text-slate-500">
                          +{{ order.items.length - 3 }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-slate-900">{{ order.total | currency }}</td>
                  <td class="px-6 py-4">
                    <span class="badge" [class]="statusClasses(order.status)">
                      <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      type="button"
                      (click)="toggleExpand(order.id)"
                      [attr.aria-expanded]="expandedId() === order.id"
                      class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                      {{ expandedId() === order.id ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                @if (expandedId() === order.id) {
                  <tr>
                    <td colspan="6" class="bg-slate-50/60 px-6 py-5">
                      <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden divide-y divide-slate-100">
          @for (order of orders(); track order.id) {
            <div class="p-5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">{{ order.number }}</span>
                <span class="badge" [class]="statusClasses(order.status)">
                  <span class="h-1.5 w-1.5 rounded-full" [class]="dotClasses(order.status)"></span>
                  {{ order.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-slate-400">{{ order.date | date: 'MMM d, y' }}</span>
                <span class="font-bold text-slate-900">{{ order.total | currency }}</span>
              </div>
              <button
                type="button"
                (click)="toggleExpand(order.id)"
                class="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                {{ expandedId() === order.id ? 'Hide details' : 'View details' }}
              </button>
              @if (expandedId() === order.id) {
                <div class="mt-4">
                  <ng-container *ngTemplateOutlet="orderDetail; context: { $implicit: order }"></ng-container>
                </div>
              }
            </div>
          }
        </div>

        <!-- Shared order detail template -->
        <ng-template #orderDetail let-order>
          <div class="space-y-3">
            @for (item of order.items; track item.productId + (item.color ?? '')) {
              <div class="flex items-center gap-3.5">
                <img [src]="item.image" [alt]="item.name" class="h-14 w-14 rounded-xl object-cover bg-slate-100" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                  <p class="text-xs text-slate-400">
                    Qty {{ item.quantity }}{{ item.color ? ' Â· ' + item.color : '' }}{{ item.size ? ' Â· ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </div>
            }
            <div class="pt-3 border-t border-slate-200 grid sm:grid-cols-2 gap-3 text-xs text-slate-500">
              <p><span class="font-semibold text-slate-700">Ships to:</span> {{ order.shippingAddress }}</p>
              <p><span class="font-semibold text-slate-700">Payment:</span> {{ order.paymentSummary }}</p>
            </div>
          </div>
        </ng-template>
      }
    </div>
  `,
})
export class AccountOrdersComponent {
  private readonly orderService = inject(OrderService);

  readonly orders = this.orderService.orders;
  readonly expandedId = signal<number | null>(null);

  toggleExpand(id: number): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  statusClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 ring-1 ring-sky-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 ring-1 ring-rose-100';
    }
  }

  dotClasses(status: OrderStatus): string {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500';
      case 'Shipped':
        return 'bg-sky-500';
      case 'Processing':
        return 'bg-amber-500 animate-pulse';
      case 'Cancelled':
        return 'bg-rose-500';
    }
  }
}

``

## src\app\features\account\account-settings.component.ts

``typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Profile -->
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Profile</h2>
        <p class="text-sm text-slate-400 mt-0.5">This information appears on your receipts and shipping labels</p>

        <div class="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
            <input id="firstName" type="text" formControlName="firstName" autocomplete="given-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'firstName')" />
            @if (invalid(profileForm, 'firstName')) { <p class="mt-1.5 text-xs text-red-500">First name is required.</p> }
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
            <input id="lastName" type="text" formControlName="lastName" autocomplete="family-name" class="input-field"
                   [class.input-error]="invalid(profileForm, 'lastName')" />
            @if (invalid(profileForm, 'lastName')) { <p class="mt-1.5 text-xs text-red-500">Last name is required.</p> }
          </div>
          <div class="sm:col-span-2">
            <label for="settings-email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input id="settings-email" type="email" formControlName="email" autocomplete="email" class="input-field bg-slate-100/70 cursor-not-allowed" readonly />
            <p class="mt-1.5 text-xs text-slate-400">Contact support to change the email tied to your account.</p>
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Save changes</button>
      </form>

      <!-- Password -->
      <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Change Password</h2>
        <p class="text-sm text-slate-400 mt-0.5">Use at least 6 characters with a mix of letters and numbers</p>

        <div class="mt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
            <input id="currentPassword" type="password" formControlName="current" autocomplete="current-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'current')" />
            @if (invalid(passwordForm, 'current')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <input id="newPassword" type="password" formControlName="next" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'next')" />
            @if (invalid(passwordForm, 'next')) { <p class="mt-1.5 text-xs text-red-500">At least 6 characters.</p> }
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input id="confirmPassword" type="password" formControlName="confirm" autocomplete="new-password" class="input-field"
                   [class.input-error]="invalid(passwordForm, 'confirm') || mismatch()" />
            @if (mismatch()) { <p class="mt-1.5 text-xs text-red-500">Passwords don't match.</p> }
          </div>
        </div>
        <button type="submit" class="btn-primary mt-6">Update password</button>
      </form>

      <!-- Notifications -->
      <div class="card p-6">
        <h2 class="text-lg font-bold text-slate-900">Notifications</h2>
        <p class="text-sm text-slate-400 mt-0.5">Choose what we email you about</p>
        <div class="mt-5 divide-y divide-slate-100">
          @for (pref of notificationPrefs(); track pref.key) {
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ pref.label }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ pref.description }}</p>
              </div>
              <button
                type="button"
                role="switch"
                [attr.aria-checked]="pref.enabled"
                [attr.aria-label]="'Toggle ' + pref.label"
                (click)="togglePref(pref.key)"
                class="relative h-6 w-11 rounded-full transition-colors duration-300 shrink-0"
                [class]="pref.enabled ? 'bg-violet-600' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
                      [class]="pref.enabled ? 'left-[1.375rem]' : 'left-0.5'"></span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Seller Account -->
      <div class="card p-6 border-indigo-100">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-slate-900">Seller Account</h2>
            @if (isSeller()) {
              <p class="text-sm text-slate-500 mt-1">You are already a registered seller! You can access the Seller Dashboard from the menu.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Seller Active
              </div>
            } @else if (sellerRequestStatus() === 'Pending') {
              <p class="text-sm text-slate-500 mt-1">Your request to become a seller is currently under review by our team.</p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Request Pending
              </div>
            } @else {
              <p class="text-sm text-slate-500 mt-1">Want to sell your own products? Apply for a seller account today and reach thousands of customers.</p>
              
              @if (isRequestingSeller()) {
                <div class="mt-4 space-y-3">
                  <textarea [(ngModel)]="sellerRequestReason" rows="3" placeholder="Tell us briefly about what you plan to sell..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none text-sm"></textarea>
                  <div class="flex items-center gap-3">
                    <button type="button" (click)="submitSellerRequest()" [disabled]="submittingSellerRequest()"
                            class="btn-primary py-2 px-5 text-sm">
                      {{ submittingSellerRequest() ? 'Submitting...' : 'Submit Request' }}
                    </button>
                    <button type="button" (click)="isRequestingSeller.set(false)" class="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              } @else {
                <button type="button" (click)="isRequestingSeller.set(true)"
                        class="mt-4 inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5
                               text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all duration-300">
                  Request Seller Account
                </button>
              }
            }
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border-rose-100">
        <h2 class="text-lg font-bold text-rose-600">Danger Zone</h2>
        <p class="text-sm text-slate-400 mt-0.5">Permanently delete your account and all associated data</p>
        <button type="button" (click)="requestDelete()"
                class="mt-5 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3
                       text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-all duration-300">
          Delete my account
        </button>
      </div>
    </div>
  `,
})
export class AccountSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly http = inject(HttpClient);

  readonly profileSubmitted = signal(false);
  readonly passwordSubmitted = signal(false);

  readonly profileForm = this.fb.group({
    firstName: [this.auth.user()?.firstName ?? '', Validators.required],
    lastName: [this.auth.user()?.lastName ?? '', Validators.required],
    email: [{ value: this.auth.user()?.email ?? '', disabled: false }],
  });

  readonly passwordForm = this.fb.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  });

  readonly notificationPrefs = signal([
    { key: 'orders', label: 'Order updates', description: 'Shipping confirmations and delivery notifications', enabled: true },
    { key: 'deals', label: 'Deals & promotions', description: 'Weekly digest of price drops and exclusive codes', enabled: true },
    { key: 'wishlist', label: 'Wishlist alerts', description: 'When a saved item goes on sale or is back in stock', enabled: false },
  ]);

  readonly isSeller = signal(false);
  readonly sellerRequestStatus = signal<'None' | 'Pending' | 'Rejected'>('None');
  readonly isRequestingSeller = signal(false);
  sellerRequestReason = '';
  readonly submittingSellerRequest = signal(false);

  ngOnInit() {
    this.checkSellerStatus();
  }

  checkSellerStatus() {
    const roles = this.auth.user()?.roles || [];
    this.isSeller.set(roles.includes('Seller'));
  }

  submitSellerRequest() {
    this.submittingSellerRequest.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests`, { reason: this.sellerRequestReason }).subscribe({
      next: () => {
        this.toast.success('Your request to become a seller has been submitted!');
        this.sellerRequestStatus.set('Pending');
        this.isRequestingSeller.set(false);
        this.submittingSellerRequest.set(false);
      },
      error: () => {
        this.toast.error('Failed to submit request.');
        this.submittingSellerRequest.set(false);
      }
    });
  }

  invalid(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    const submitted = form === this.profileForm ? this.profileSubmitted() : this.passwordSubmitted();
    return !!c && c.invalid && (c.touched || submitted);
  }

  mismatch(): boolean {
    const { next, confirm } = this.passwordForm.getRawValue();
    return !!confirm && next !== confirm && (this.passwordForm.get('confirm')!.touched || this.passwordSubmitted());
  }

  saveProfile(): void {
    this.profileSubmitted.set(true);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    const { firstName, lastName } = this.profileForm.value;
    this.auth.updateProfile(firstName!, lastName!).subscribe({
      next: () => this.toast.success('Profile updated'),
      error: () => this.toast.error('Failed to update profile')
    });
  }

  changePassword(): void {
    this.passwordSubmitted.set(true);
    if (this.passwordForm.invalid || this.mismatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    
    const { current, next } = this.passwordForm.value;
    this.auth.changePassword(current!, next!).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.passwordSubmitted.set(false);
        this.toast.success('Password changed successfully');
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to change password';
        this.toast.error(msg);
      }
    });
  }

  togglePref(key: string): void {
    this.notificationPrefs.update(prefs =>
      prefs.map(p => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    );
  }

  requestDelete(): void {
    this.toast.info('Account deletion requires email confirmation â€” check your inbox.');
  }
}

``

## src\app\features\admin\admin-add-product.component.ts

``typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { ProductService } from '../../core/services/product.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { Category } from '../../core/models/shop.models';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-add-product',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isEditMode() ? 'Update your product listing details.' : 'Create a new product listing. It will be immediately published to the catalog.' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 md:p-8 space-y-8">
          
          <!-- Basic Info -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-semibold text-slate-700">Product Name <span class="text-rose-500">*</span></label>
                <input type="text" id="name" formControlName="name" placeholder="e.g. Wireless Noise-Cancelling Headphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>

              <div class="space-y-2">
                <label for="categoryId" class="block text-sm font-semibold text-slate-700">Category <span class="text-rose-500">*</span></label>
                <select id="categoryId" formControlName="categoryId"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                  <option value="" disabled selected>Select a category</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="brand" class="block text-sm font-semibold text-slate-700">Brand <span class="text-rose-500">*</span></label>
                <input type="text" id="brand" formControlName="brand" placeholder="e.g. Sony, Samsung, Nike"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>
            </div>

            <div class="space-y-2">
              <label for="description" class="block text-sm font-semibold text-slate-700">Description <span class="text-rose-500">*</span></label>
              <textarea id="description" formControlName="description" rows="4" placeholder="Describe your product in detail..."
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"></textarea>
            </div>
          </div>

          <!-- Pricing & Inventory -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Pricing & Inventory</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="price" class="block text-sm font-semibold text-slate-700">Price ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="price" formControlName="price" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2">
                <label for="originalPrice" class="block text-sm font-semibold text-slate-700">Original Price ($) <span class="text-xs text-slate-500 font-normal">(Optional - for discounts)</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="originalPrice" formControlName="originalPrice" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="stockQuantity" class="block text-sm font-semibold text-slate-700">Stock Quantity <span class="text-rose-500">*</span></label>
                <input type="number" id="stockQuantity" formControlName="stockQuantity" min="0" placeholder="0"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Rentals -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Rental Options</h3>
            </div>
            
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-800 text-sm">Available for Rent?</p>
                <p class="text-xs text-slate-500 mt-0.5">Allow users to rent this item instead of buying.</p>
              </div>
              <button type="button" (click)="toggleRentable()"
                      [class.bg-indigo-600]="form.get('isAvailableForRent')?.value"
                      [class.bg-slate-300]="!form.get('isAvailableForRent')?.value"
                      class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none">
                <span [class.translate-x-7]="form.get('isAvailableForRent')?.value"
                      [class.translate-x-1]="!form.get('isAvailableForRent')?.value"
                      class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow inline-block transition-transform duration-200"></span>
              </button>
            </div>

            @if (form.get('isAvailableForRent')?.value) {
              <div class="w-full md:w-1/2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label for="rentalPricePerDay" class="block text-sm font-semibold text-slate-700">Rental Price Per Day ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="rentalPricePerDay" formControlName="rentalPricePerDay" min="0" step="0.01" placeholder="0.00"
                         class="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>
            }
          </div>

          <!-- Product Images -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Product Images <span class="text-rose-500">*</span></h3>
              <p class="text-xs font-medium text-slate-500">{{ uploadedImages().length }} uploaded</p>
            </div>
            
            <!-- Upload Area -->
            <div class="relative group">
              <input type="file" multiple (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" [disabled]="isUploadingImage()">
              <div class="w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all"
                   [class.border-indigo-300]="!isUploadingImage()"
                   [class.bg-indigo-50]="!isUploadingImage()"
                   [class.border-slate-200]="isUploadingImage()"
                   [class.bg-slate-50]="isUploadingImage()"
                   [class.group-hover:border-indigo-400]="!isUploadingImage()"
                   [class.group-hover:bg-indigo-100]="!isUploadingImage()">
                
                @if (isUploadingImage()) {
                  <div class="flex flex-col items-center gap-3">
                    <svg class="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-sm font-semibold text-slate-600">Uploading to Cloudinary...</p>
                  </div>
                } @else {
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <p class="text-sm font-semibold text-indigo-900">Click or drag images here to upload</p>
                    <p class="text-xs text-indigo-500/80">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                }
              </div>
            </div>

            <!-- Image Gallery -->
            @if (uploadedImages().length > 0) {
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                @for (img of uploadedImages(); track img; let i = $index) {
                  <div class="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                    <img [src]="img" alt="Product Image" class="w-full h-full object-contain rounded-xl">
                    <!-- Delete Button -->
                    <button type="button" (click)="removeImage(i)" 
                            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600 focus:outline-none">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <!-- Main Thumbnail Badge -->
                    @if (i === 0) {
                      <div class="absolute bottom-2 left-2 px-2 py-1 bg-indigo-600/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-sm">
                        Main Image
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6 text-sm text-slate-500">
                <span class="text-rose-500 font-medium">Warning:</span> Please add at least one image to list this product.
              </div>
            }
          </div>

          <!-- Submit -->
          <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <a routerLink="/seller/products" class="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || isSubmitting || uploadedImages().length === 0"
                    class="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-indigo-200">
              @if (isSubmitting) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Saving...
                </span>
              } @else {
                {{ isEditMode() ? 'Save Changes' : 'Publish Product' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Editor Modal -->
    @if (editingFile()) {
      <div class="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full h-[85vh] max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h3 class="text-lg font-bold text-slate-900">Advanced Image Editor</h3>
            <button type="button" (click)="closeEditor()" class="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
          </div>
          <div id="filerobot-editor-container" class="w-full flex-1 relative"></div>
        </div>
      </div>
    }
  `
})
export class AdminAddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cloudinary = inject(CloudinaryService);
  private productService = inject(ProductService);
  private sanitizer = inject(DomSanitizer);

  isSubmitting = false;
  isUploadingImage = signal(false);
  isEditMode = signal(false);
  editProductId = signal<string | null>(null);

  uploadedImages = signal<string[]>([]);
  categories = signal<Category[]>([]);
  editingFile = signal<File | null>(null);
  editorInstance: any = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    brand: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    originalPrice: [null as number | null, [Validators.min(0.01)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
    categoryId: ['', [Validators.required]],
    isAvailableForRent: [false],
    rentalPricePerDay: [null as number | null]
  });

  ngOnInit() {
    this.productService.getCategories().subscribe(res => {
      this.categories.set(res);
    });
    
    // Check if in edit mode
    const urlParts = this.router.url.split('/');
    if (urlParts.includes('edit-product')) {
      const slug = urlParts[urlParts.length - 1];
      this.isEditMode.set(true);
      this.loadProductForEdit(slug);
    }
  }

  loadProductForEdit(slug: string) {
    this.productService.getBySlug(slug).subscribe({
      next: (product) => {
        this.editProductId.set(product.id);
        this.form.patchValue({
          name: product.name,
          brand: product.brand || '',
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stockQuantity: product.stock,
          categoryId: product.categoryId,
          isAvailableForRent: product.isAvailableForRent,
          rentalPricePerDay: product.rentalPricePerDay
        });
        if (product.images) {
          this.uploadedImages.set(product.images);
        }
        if (product.isAvailableForRent) {
          this.form.get('rentalPricePerDay')?.setValidators([Validators.required, Validators.min(0.01)]);
          this.form.get('rentalPricePerDay')?.updateValueAndValidity();
        }
      },
      error: (err) => {
        this.toast.error('Failed to load product details.');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  toggleRentable(): void {
    const control = this.form.get('isAvailableForRent');
    const rentPriceControl = this.form.get('rentalPricePerDay');

    if (control) {
      control.setValue(!control.value);
      if (control.value) {
        rentPriceControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        rentPriceControl?.clearValidators();
        rentPriceControl?.setValue(null);
      }
      rentPriceControl?.updateValueAndValidity();
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editingFile.set(file);
      
      // Delay to let Angular render the container
      setTimeout(() => {
        this.initEditor(file);
      }, 100);
    }
    
    event.target.value = '';
  }

  initEditor(file: File) {
    const container = document.getElementById('filerobot-editor-container');
    if (!container) return;
    
    const imageUrl = URL.createObjectURL(file);
    
    // @ts-ignore
    const { TABS, TOOLS } = window.FilerobotImageEditor;
    
    const config = {
      source: imageUrl,
      onSave: (imageInfo: any, designState: any) => {
        if (imageInfo && imageInfo.imageBase64) {
          this.uploadEditedImage(imageInfo.imageBase64, file.name);
          this.closeEditor();
        } else if (imageInfo && imageInfo.imageCanvas) {
           const base64 = imageInfo.imageCanvas.toDataURL('image/jpeg');
           this.uploadEditedImage(base64, file.name);
           this.closeEditor();
        } else {
           this.toast.error("Could not capture edited image.");
        }
      },
      onClose: () => {
        this.closeEditor();
      },
      annotationsCommon: { fill: '#0f766e' },
      Text: { text: 'Budgetha' },
      theme: {
        colors: {
          primaryBg: '#ffffff',
          primaryBgHover: '#f8fafc',
          secondaryBg: '#f1f5f9',
          secondaryBgHover: '#e2e8f0',
          text: '#0f172a',
          textHover: '#000000',
          textMuted: '#64748b',
          textWarn: '#f87171',
          textError: '#ef4444',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          borderActive: '#0f766e',
        },
      }
    };
    
    // @ts-ignore
    this.editorInstance = new window.FilerobotImageEditor(container, config);
    this.editorInstance.render({
      onClose: () => this.closeEditor()
    });
  }

  closeEditor() {
    if (this.editorInstance) {
      this.editorInstance.terminate();
      this.editorInstance = null;
    }
    this.editingFile.set(null);
  }

  // saveAndUpload() method removed because we now use onSave hook in the Filerobot config

  uploadEditedImage(base64: string, originalName: string) {
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const newFile = new File([blob], 'edited_' + originalName, { type: 'image/jpeg' });
        
        this.isUploadingImage.set(true);
        this.cloudinary.uploadImage(newFile).subscribe({
          next: (response) => {
            this.uploadedImages.update(images => [...images, response.url]);
            this.isUploadingImage.set(false);
            this.toast.success('Image edited and uploaded successfully!');
          },
          error: (err) => {
            console.error('Cloudinary upload error:', err);
            this.toast.error('Failed to upload edited image.');
            this.isUploadingImage.set(false);
          }
        });
      });
  }

  removeImage(index: number): void {
    this.uploadedImages.update(images => images.filter((_, i) => i !== index));
  }

  

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
      return;
    }

    if (this.uploadedImages().length === 0) {
      this.toast.error('Please add at least one product image.');
      return;
    }

    this.isSubmitting = true;
    const val = this.form.value;

    const categoryId = val.categoryId || '00000000-0000-0000-0000-000000000001';

    const payload = {
      name: val.name,
      brand: val.brand,
      description: val.description,
      price: val.price,
      originalPrice: val.originalPrice,
      stockQuantity: val.stockQuantity,
      categoryId: categoryId,
      imageUrls: this.uploadedImages(),
      isAvailableForRent: val.isAvailableForRent,
      rentalPricePerDay: val.rentalPricePerDay
    };

    if (this.isEditMode() && this.editProductId()) {
      this.http.put<void>(`${environment.apiUrl}/products/${this.editProductId()}`, payload).subscribe({
        next: () => {
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to update product.');
          console.error(err);
        }
      });
    } else {
      this.http.post<string>(`${environment.apiUrl}/products`, payload).subscribe({
        next: () => {
          this.toast.success('Product added successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to add product.');
          console.error(err);
        }
      });
    }
  }
}

``

## src\app\features\admin\admin-announcements.component.ts

``typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-announcements',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Announcements</h1>
        <button type="button" class="btn-primary" (click)="openForm()">Create New</button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="card p-6 border-violet-200 shadow-md">
          <h2 class="text-lg font-bold mb-4">{{ editingId() ? 'Edit Announcement' : 'New Announcement' }}</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Message *</label>
              <textarea formControlName="message" rows="2" class="input-field" placeholder="E.g. Free shipping on orders over $75..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Link URL (Optional)</label>
              <input type="text" formControlName="linkUrl" class="input-field" placeholder="/shop?deals=1" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Start Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="startDate" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">End Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="endDate" class="input-field" />
              </div>
            </div>

            <label class="flex items-center gap-2 mt-2">
              <input type="checkbox" formControlName="isActive" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span class="text-sm text-slate-700">Is Active</span>
            </label>

            <div class="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button type="button" class="btn-secondary" (click)="cancelForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || isSubmitting()">
                {{ isSubmitting() ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 font-semibold">Message</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 font-semibold">Start</th>
                <th class="px-6 py-4 font-semibold">End</th>
                <th class="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading announcements...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (item of announcements(); track item.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate" [title]="item.message">
                    {{ item.message }}
                  </td>
                  <td class="px-6 py-4">
                    @if (item.isActive) {
                      <span class="badge bg-green-100 text-green-700">Active</span>
                    } @else {
                      <span class="badge bg-slate-100 text-slate-600">Inactive</span>
                    }
                  </td>
                  <td class="px-6 py-4">{{ item.startDate ? (item.startDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4">{{ item.endDate ? (item.endDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button type="button" class="text-violet-600 hover:text-violet-900 font-medium mr-4" (click)="edit(item)">Edit</button>
                    <button type="button" class="text-red-600 hover:text-red-900 font-medium" (click)="delete(item.id)">Delete</button>
                  </td>
                </tr>
              }
              @if (announcements().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                    No announcements found.
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Announcement</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this announcement?<br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDelete()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminAnnouncementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private announcementService = inject(AnnouncementService);
  private toastService = inject(ToastService);

  announcements = signal<Announcement[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);
  isLoading = signal(true);
  confirmAction = signal<string | null>(null);

  form = this.fb.group({
    message: ['', Validators.required],
    linkUrl: [''],
    isActive: [true],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.announcementService.getAll().subscribe({
      next: (data) => {
        this.announcements.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load announcements:', err);
        this.isLoading.set(false);
        this.announcements.set([]);
      }
    });
  }

  openForm() {
    this.form.reset({ isActive: true });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  edit(item: Announcement) {
    this.editingId.set(item.id);
    this.form.patchValue({
      message: item.message,
      linkUrl: item.linkUrl,
      isActive: item.isActive,
      startDate: item.startDate ? item.startDate.substring(0, 16) : '', 
      endDate: item.endDate ? item.endDate.substring(0, 16) : ''
    });
    this.showForm.set(true);
  }

  delete(id: string) {
    this.confirmAction.set(id);
  }

  closeConfirmModal() {
    this.confirmAction.set(null);
  }

  executeDelete() {
    const id = this.confirmAction();
    if (!id) return;
    this.closeConfirmModal();

    this.announcementService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Announcement deleted successfully.');
        this.load();
      },
      error: () => this.toastService.error('Failed to delete announcement.')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const val = this.form.value;
    const dto = {
      message: val.message!,
      linkUrl: val.linkUrl || undefined,
      isActive: val.isActive!,
      startDate: val.startDate ? new Date(val.startDate).toISOString() : undefined,
      endDate: val.endDate ? new Date(val.endDate).toISOString() : undefined,
    };

    const id = this.editingId();
    if (id) {
      this.announcementService.update(id, { ...dto, id }).subscribe({
        next: () => {
          this.toastService.success('Announcement updated successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to update announcement.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.announcementService.create(dto).subscribe({
        next: () => {
          this.toastService.success('Announcement created successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to create announcement.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}

``

## src\app\features\admin\admin-categories.component.ts

``typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/shop.models';
import { ToastService } from '../../core/services/toast.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Categories Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ categories().length }} total categories.
          </p>
        </div>
        <button (click)="openAdd()" *ngIf="!isAdding()"
                class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Category
        </button>
      </div>

      <!-- Add Category Form -->
      @if (isAdding()) {
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-[slideDown_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900">{{ editId() ? 'Edit Category' : 'Create New Category' }}</h3>
            <button (click)="isAdding.set(false)" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Name *</label>
                <input type="text" formControlName="name" placeholder="e.g. Smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Slug *</label>
                <input type="text" formControlName="slug" placeholder="e.g. smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Image</label>
              
              <div class="flex items-start gap-4">
                @if (imageUrl()) {
                  <div class="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden relative group shrink-0 bg-slate-50">
                    <img [src]="imageUrl()" class="w-full h-full object-cover">
                    <button type="button" (click)="imageUrl.set(null)"
                            class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                } @else {
                  <div class="flex-1 w-full border-2 border-dashed border-slate-200 rounded-xl px-6 py-6 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" id="categoryImage" class="hidden" accept="image/*" (change)="onFileSelected($event)">
                    <label for="categoryImage" class="cursor-pointer flex flex-col items-center">
                      <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <span class="text-sm font-semibold text-indigo-600">Click to upload</span>
                      <span class="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" (click)="isAdding.set(false)"
                      class="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="form.invalid || isSubmitting()"
                      class="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2">
                @if (isSubmitting()) {
                  <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                } @else {
                  Save Category
                }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Categories List -->
      @if (isLoading()) {
        <div class="py-12 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm text-slate-500 font-medium">Loading categories...</p>
          </div>
        </div>
      } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (category of categories(); track category.id) {
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
            <button (click)="editCategory(category)" class="absolute top-2 right-2 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" aria-label="Edit category">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            @if (category.image) {
              <img [src]="category.image" class="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-slate-50">
            } @else {
              <div class="w-20 h-20 rounded-full mb-4 ring-4 ring-slate-50 flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600">
                <span class="text-3xl font-bold">{{ category.name[0] }}</span>
              </div>
            }
            <h3 class="text-lg font-bold text-slate-900">{{ category.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 font-mono bg-slate-100 px-2 py-0.5 rounded">{{ category.slug }}</p>
            <p class="text-sm text-slate-500 mt-3">{{ category.productCount }} Products</p>
          </div>
        }
      </div>
      }

    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private cloudinaryService = inject(CloudinaryService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isAdding = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(true);
  imageUrl = signal<string | null>(null);
  editId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
  });

  ngOnInit() {
    this.loadCategories();
    
    
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.form.get('slug')?.dirty) {
        const slug = name.toLowerCase()
                         .replace(/[^a-z0-9\s-]/g, '')
                         .replace(/\s+/g, '-')
                         .replace(/-+/g, '-');
        this.form.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  loadCategories() {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.isLoading.set(false);
        this.categories.set([]);
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please upload an image file');
      return;
    }
    
    this.isSubmitting.set(true);
    try {
      const res = await firstValueFrom(this.cloudinaryService.uploadImage(file));
      this.imageUrl.set(res.url);
      this.toastService.success('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      this.toastService.error('Failed to upload image');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  openAdd() {
    this.editId.set(null);
    this.form.reset();
    this.imageUrl.set(null);
    this.isAdding.set(true);
  }

  editCategory(category: Category) {
    this.editId.set(category.id);
    this.form.patchValue({
      name: category.name,
      slug: category.slug
    });
    this.imageUrl.set(category.image || null);
    this.isAdding.set(true);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    
    if (this.editId()) {
      const data = {
        id: this.editId()!,
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.updateCategory(this.editId()!, data).subscribe({
        next: () => {
          this.toastService.success('Category updated successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to update category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    } else {
      const data = {
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.createCategory(data).subscribe({
        next: () => {
          this.toastService.success('Category created successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to create category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    }
  }
}

``

## src\app\features\admin\admin-dashboard.component.ts

``typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminService, AdminStats, AdminUser, SellerStats } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe, DecimalPipe, CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Welcome Banner -->
      <div class="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-white flex items-center justify-between shadow-lg overflow-hidden relative">
        <div class="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2"></div>
        <div class="relative z-10">
          <p class="text-teal-200 text-sm font-medium mb-1">Welcome back,</p>
          <h1 class="text-2xl font-bold">{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</h1>
          <p class="text-teal-300 text-sm mt-1">
            @if (isSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                Super Administrator â€” Full system access
              </span>
            } @else if (isAdminOrSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-teal-300 inline-block"></span>
                Administrator â€” Product & content management
              </span>
            } @else {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                Store Seller â€” Manage your products
              </span>
            }
          </p>
        </div>
        <div class="relative z-10 hidden sm:flex gap-3">
          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/users" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/10">
              Manage Users
            </a>
          }
          <a routerLink="/admin/products" class="px-4 py-2 bg-white text-teal-800 text-sm font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
            View Products
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Users -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalUsers | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Users</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Listed</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalProducts | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full" style="width: 55%"></div>
          </div>
        </div>

        <!-- Padding space instead of Pending -->
        <!-- Total Orders -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Orders</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalOrders | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Orders</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-400 to-rose-200 rounded-full" style="width: 40%"></div>
          </div>
        </div>
        </div>
      } @else {
        <!-- Seller Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Products -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalProducts | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          </div>

          <!-- Total Sales (Items Sold) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalSales | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Items Sold</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalRevenue | currency }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Revenue</p>
          </div>

          <!-- Total Orders -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalOrders | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Unique Orders</p>
          </div>
        </div>
      }

      <!-- Charts Row -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Bar Chart â€” Registration Activity -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900">Platform Activity</h3>
              <p class="text-sm text-slate-500 mt-0.5">Overview of key metrics</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-teal-500 inline-block"></span>Users</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span>Products</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-rose-400 inline-block"></span>Orders</span>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="relative">
            <svg viewBox="0 0 600 200" class="w-full" style="overflow: visible;">
              <!-- Y-axis grid lines -->
              <line x1="40" y1="10" x2="40" y2="170" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="40" y1="10" x2="590" y2="10" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="52.5" x2="590" y2="52.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="95" x2="590" y2="95" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="137.5" x2="590" y2="137.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="170" x2="590" y2="170" stroke="#e2e8f0" stroke-width="1"/>

              <!-- Y axis labels -->
              <text x="32" y="13" text-anchor="end" font-size="9" fill="#94a3b8">100%</text>
              <text x="32" y="55.5" text-anchor="end" font-size="9" fill="#94a3b8">75%</text>
              <text x="32" y="98" text-anchor="end" font-size="9" fill="#94a3b8">50%</text>
              <text x="32" y="140.5" text-anchor="end" font-size="9" fill="#94a3b8">25%</text>
              <text x="32" y="173" text-anchor="end" font-size="9" fill="#94a3b8">0%</text>

              <!-- Users bar (teal) -->
              <rect x="52" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalUsers, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalUsers, maxStat())"
                    fill="url(#tealGrad)" class="transition-all duration-700"/>
              <!-- Products bar (indigo) -->
              <rect x="84" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalProducts, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalProducts, maxStat())"
                    fill="url(#indigoGrad)" class="transition-all duration-700"/>
              <!-- Orders bar (rose) -->
              <rect x="116" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalOrders, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalOrders, maxStat())"
                    fill="url(#roseGrad)" class="transition-all duration-700"/>

              <!-- X-axis label -->
              <text x="88" y="188" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">Current Stats</text>


              <!-- Gradients -->
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0d9488"/>
                  <stop offset="100%" stop-color="#5eead4"/>
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#a5b4fc"/>
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f43f5e"/>
                  <stop offset="100%" stop-color="#fda4af"/>
                </linearGradient>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#fde68a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Legend numbers -->
          <div class="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div class="text-center">
              <p class="text-lg font-bold text-teal-700">{{ stats()?.totalUsers ?? 0 }}</p>
              <p class="text-xs text-slate-400">Users</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-indigo-600">{{ stats()?.totalProducts ?? 0 }}</p>
              <p class="text-xs text-slate-400">Products</p>
            </div>

            <div class="text-center">
              <p class="text-lg font-bold text-rose-500">{{ stats()?.totalOrders ?? 0 }}</p>
              <p class="text-xs text-slate-400">Orders</p>
            </div>
          </div>
        </div>

        <!-- Donut Chart â€” System Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div class="mb-4">
            <h3 class="text-base font-bold text-slate-900">System Health</h3>
            <p class="text-sm text-slate-500 mt-0.5">Platform distribution</p>
          </div>

          <!-- SVG Donut -->
          <div class="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 160 160" class="w-40 h-40">
              <!-- Background track -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="20"/>
              <!-- Users segment (teal) - 0 to products/total -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#0d9488" stroke-width="20"
                      stroke-dasharray="377" stroke-dashoffset="0"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalUsers ?? 1, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Products segment (indigo) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#6366f1" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalProducts ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset(stats()?.totalUsers ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Orders segment (rose) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f43f5e" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalOrders ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset2(stats()?.totalUsers ?? 0, stats()?.totalProducts ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Center text -->
              <text x="80" y="75" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">{{ totalPlatformItems() }}</text>
              <text x="80" y="90" text-anchor="middle" font-size="9" fill="#94a3b8">Total Records</text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="space-y-2.5 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Users</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalUsers ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Products</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalProducts ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Orders</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalOrders ?? 0 }}</span>
            </div>
          </div>
        </div>
        </div>
      }

      <!-- Recent Users Table + Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        @if (isAdminOrSuperAdmin()) {
          <!-- Recent Users -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">Recent Users</h3>
            <a routerLink="/admin/users" class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">View all â†’</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Roles</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-slate-700">
                @for (user of recentUsers(); track user.id) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-3.5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {{ user.firstName[0] }}{{ user.lastName[0] }}
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800 text-sm">{{ user.firstName }} {{ user.lastName }}</p>
                          <p class="text-xs text-slate-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-3.5">
                      <div class="flex gap-1 flex-wrap">
                        @for (role of user.roles; track role) {
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                                [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                                [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                                [class.bg-amber-100]="role === 'Seller'" [class.text-amber-700]="role === 'Seller'"
                                [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                            {{ role }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-3.5 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="px-6 py-10 text-center text-slate-400 text-sm">No users yet</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        }

        <!-- Quick Actions & System Info -->
        <div class="space-y-4" [class.lg:col-span-3]="!isAdminOrSuperAdmin()">

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 class="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div class="space-y-2" [class.grid]="!isAdminOrSuperAdmin()" [class.grid-cols-2]="!isAdminOrSuperAdmin()" [class.gap-4]="!isAdminOrSuperAdmin()">
              
              @if (isAdminOrSuperAdmin()) {
                <a routerLink="/admin/users"
                   class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                  <div class="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">Manage Users</p>
                    <p class="text-xs text-slate-400">View & assign roles</p>
                  </div>
                  <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              }

              <a routerLink="/admin/products"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Review Products</p>
                  <p class="text-xs text-slate-400">
                    All products are active
                  </p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>

              <a routerLink="/"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Visit Store</p>
                  <p class="text-xs text-slate-400">Go to customer view</p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>

          <!-- Removed Role Permissions Summary per user request -->
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly stats = signal<AdminStats | null>(null);
  readonly sellerStats = signal<SellerStats | null>(null);
  readonly recentUsers = signal<AdminUser[]>([]);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly isAdminOrSuperAdmin = computed(() =>
    this.authService.user()?.roles?.some(r => r === 'Admin' || r === 'SuperAdmin') ?? false
  );

  readonly totalPlatformItems = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return (s.totalUsers + s.totalProducts + s.totalOrders) || 1;
  });

  readonly maxStat = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return Math.max(s.totalUsers, s.totalProducts, s.totalOrders, s.pendingProducts, 1);
  });

  readonly pendingPercent = computed(() => {
    const s = this.stats();
    if (!s || !s.totalProducts) return 0;
    return Math.round((s.pendingProducts / s.totalProducts) * 100);
  });

  
  barHeight(value: number | undefined, max: number): number {
    if (!value || !max) return 4;
    return Math.max(4, Math.round((value / max) * 160));
  }

  
  private readonly CIRC = 2 * Math.PI * 60;

  donutSegment(value: number, total: number): string {
    const frac = total > 0 ? value / total : 0;
    const seg = frac * this.CIRC;
    return `${seg} ${this.CIRC - seg}`;
  }

  donutOffset(prevValue: number, total: number): number {
    const frac = total > 0 ? prevValue / total : 0;
    return -(frac * this.CIRC);
  }

  donutOffset2(v1: number, v2: number, total: number): number {
    const frac = total > 0 ? (v1 + v2) / total : 0;
    return -(frac * this.CIRC);
  }

  ngOnInit(): void {
    if (this.isAdminOrSuperAdmin()) {
      this.adminService.getStats().subscribe({
        next: stats => this.stats.set(stats),
        error: () => this.stats.set(null)
      });
      this.adminService.getRecentUsers(5).subscribe({
        next: users => this.recentUsers.set(users || []),
        error: () => this.recentUsers.set([])
      });
    } else {
      this.adminService.getSellerStats().subscribe({
        next: stats => this.sellerStats.set(stats),
        error: () => this.sellerStats.set(null)
      });
    }
  }
}

``

## src\app\features\admin\admin-layout.component.ts

``typescript
import { Component, inject, computed, signal, effect, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet],
  template: `
    <div class="h-screen bg-slate-50 flex overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-teal-950 to-slate-900 text-teal-100 flex-shrink-0 flex flex-col hidden md:flex h-full">
        <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      @if (mobileMenuOpen()) {
        <div class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" (click)="mobileMenuOpen.set(false)"></div>
        <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-950 to-slate-900 text-teal-100 shadow-2xl flex flex-col md:hidden animate-[slideInLeft_0.3s_ease-out] h-full">
          <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
        </aside>
      }

      <ng-template #sidebarContent>
        <!-- Logo -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">{{ isAdminOrSuperAdmin() ? 'Admin Panel' : 'Seller Panel' }}</span>
          </div>
          <button (click)="mobileMenuOpen.set(false)" class="md:hidden text-teal-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- User Info -->
        <div class="px-5 py-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-teal-600/50 flex items-center justify-center font-bold text-sm text-white border border-teal-500/30">
              {{ authService.user()?.firstName?.[0] }}{{ authService.user()?.lastName?.[0] }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">
                {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
              </p>
              <div class="flex items-center gap-1 mt-0.5">
                @if (isSuperAdmin()) {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-purple-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
                    SuperAdmin
                  </span>
                } @else if (isAdminOrSuperAdmin()) {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-teal-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                    Admin
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                    Seller
                  </span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          <p class="px-3 text-xs font-semibold text-teal-500 uppercase tracking-wider mb-3">Main</p>

          <a routerLink="/admin/dashboard"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center group-[.active]:bg-teal-500/30 bg-white/5">
              <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <span class="text-sm font-medium">Dashboard</span>
          </a>

          @if (isAdminOrSuperAdmin()) {

            <a routerLink="/admin/users"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span class="text-sm font-medium">Users</span>
            @if (isSuperAdmin()) {
              <span class="ml-auto text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-md font-medium">SA</span>
            }
            </a>

            <a routerLink="/admin/seller-requests" (click)="mobileMenuOpen.set(false)"
               routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <span class="text-sm font-medium">Seller Requests</span>
            </a>
          }

          <a routerLink="/admin/products" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-sm font-medium">Products</span>
          </a>

          <a routerLink="/admin/logs" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <span class="text-sm font-medium">Transaction Logs</span>
          </a>

          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/categories" (click)="mobileMenuOpen.set(false)"
               routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <span class="text-sm font-medium">Categories</span>
            </a>

            <a routerLink="/admin/announcements" (click)="mobileMenuOpen.set(false)"
             routerLinkActive="bg-teal-700/60 text-white border-teal-600/40"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-teal-200 hover:bg-white/10 hover:text-white border border-transparent group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
            </div>
            <span class="text-sm font-medium">Announcements</span>
            </a>
          }
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-white/10 space-y-1">
          <a routerLink="/"
             class="flex items-center gap-3 px-3 py-2.5 text-teal-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Store
          </a>
          <button (click)="authService.logout()"
                  class="w-full flex items-center gap-3 px-3 py-2.5 text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all text-sm font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </ng-template>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm flex-shrink-0">
          <div class="flex items-center gap-4">
            <!-- Mobile menu placeholder -->
            <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500" (click)="mobileMenuOpen.set(true)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 class="text-lg font-bold text-slate-800">{{ authService.user()?.roles?.includes('Seller') && !authService.user()?.roles?.includes('Admin') && !authService.user()?.roles?.includes('SuperAdmin') ? 'Seller Dashboard' : 'Budgetha Admin' }}</h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-600 hidden sm:block">
              {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
            </span>
          </div>
        </header>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-6 lg:p-8 bg-slate-50/50">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnDestroy {
  readonly authService = inject(AuthService);
  readonly mobileMenuOpen = signal(false);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly isAdminOrSuperAdmin = computed(() =>
    this.authService.user()?.roles?.some(r => r === 'Admin' || r === 'SuperAdmin') ?? false
  );

  constructor() {
    effect(() => {
      if (this.mobileMenuOpen()) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('overflow-hidden');
  }
}

``

## src\app\features\admin\admin-logs.component.ts

``typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

export interface TransactionHistoryDto {
  orderId: string;
  orderNumber: string;
  date: string;
  type: string;
  totalAmount: number;
  status: string;
  customerName: string;
  items: TransactionItemDto[];
}

export interface TransactionItemDto {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-admin-logs',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Transaction Logs</h1>
          <p class="text-slate-500 mt-1">View your sales and purchase history</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div class="space-y-1.5 flex-1 min-w-[200px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction Type</label>
          <select [(ngModel)]="filterType" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
            <option value="All">All Transactions</option>
            <option value="Sales">Sales Only</option>
            <option value="Purchases">Purchases Only</option>
          </select>
        </div>
        
        <div class="space-y-1.5 flex-1 min-w-[150px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
          <input type="date" [(ngModel)]="startDate" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
        </div>

        <div class="space-y-1.5 flex-1 min-w-[150px]">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
          <input type="date" [(ngModel)]="endDate" (change)="loadLogs()" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none">
        </div>

        <div class="flex gap-2">
          <button (click)="clearFilters()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors">
            Clear
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-teal-50 to-teal-100/50 p-6 rounded-2xl border border-teal-100">
          <p class="text-teal-600 font-semibold text-sm">Total Sales (Filtered)</p>
          <p class="text-3xl font-bold text-teal-900 mt-1">{{ totalSales() | currency }}</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-100">
          <p class="text-indigo-600 font-semibold text-sm">Total Purchases (Filtered)</p>
          <p class="text-3xl font-bold text-indigo-900 mt-1">{{ totalPurchases() | currency }}</p>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        @if (isLoading()) {
          <div class="p-10 flex justify-center">
            <div class="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
          </div>
        } @else if (logs().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900">No transactions found</h3>
            <p class="text-slate-500 mt-1">Try adjusting your filters.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-slate-700">
                @for (log of logs(); track log.orderId) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-4">{{ log.date | date:'MMM d, y, h:mm a' }}</td>
                    <td class="px-6 py-4 font-medium text-slate-900">{{ log.orderNumber }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            [class.bg-teal-100]="log.type === 'Sale'" [class.text-teal-700]="log.type === 'Sale'"
                            [class.bg-indigo-100]="log.type === 'Purchase'" [class.text-indigo-700]="log.type === 'Purchase'">
                        {{ log.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 font-bold" [class.text-teal-600]="log.type === 'Sale'">
                      {{ log.type === 'Sale' ? '+' : '-' }}{{ log.totalAmount | currency }}
                    </td>
                    <td class="px-6 py-4">{{ log.customerName }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {{ log.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button (click)="toggleExpand(log.orderId)" class="text-teal-600 hover:text-teal-700 font-semibold text-xs transition-colors">
                        {{ expandedId() === log.orderId ? 'Hide' : 'View' }}
                      </button>
                    </td>
                  </tr>
                  
                  <!-- Expanded Details -->
                  @if (expandedId() === log.orderId) {
                    <tr>
                      <td colspan="7" class="bg-slate-50/50 p-6 border-b border-slate-100">
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Transaction Items</h4>
                        <div class="space-y-3">
                          @for (item of log.items; track item.productId) {
                            <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm max-w-2xl">
                              <img [src]="item.productImage || 'assets/placeholder.png'" class="w-12 h-12 rounded-lg object-cover bg-slate-50" [alt]="item.productName">
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-slate-900 truncate">{{ item.productName }}</p>
                                <p class="text-xs text-slate-500">Qty: {{ item.quantity }} Ã— {{ item.price | currency }}</p>
                              </div>
                              <div class="text-right">
                                <p class="text-sm font-bold text-slate-900">{{ (item.quantity * item.price) | currency }}</p>
                              </div>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminLogsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  
  readonly logs = signal<TransactionHistoryDto[]>([]);
  readonly isLoading = signal(true);
  readonly expandedId = signal<string | null>(null);

  filterType = 'All';
  startDate = '';
  endDate = '';

  readonly totalSales = computed(() => {
    return this.logs().filter(l => l.type === 'Sale').reduce((sum, log) => sum + log.totalAmount, 0);
  });

  readonly totalPurchases = computed(() => {
    return this.logs().filter(l => l.type === 'Purchase').reduce((sum, log) => sum + log.totalAmount, 0);
  });

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading.set(true);
    let params = `?type=${this.filterType}`;
    if (this.startDate) params += `&startDate=${this.startDate}`;
    if (this.endDate) params += `&endDate=${this.endDate}`;

    // Assuming we add getTransactionHistory to adminService or we can use HttpClient directly.
    this.adminService.getTransactionHistory(this.filterType, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.logs.set([]);
        this.isLoading.set(false);
      }
    });
  }

  clearFilters() {
    this.filterType = 'All';
    this.startDate = '';
    this.endDate = '';
    this.loadLogs();
  }

  toggleExpand(id: string) {
    this.expandedId.update(curr => curr === id ? null : id);
  }
}

``

## src\app\features\admin\admin-products.component.ts

``typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminProductResult } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Products Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ productsResult()?.total ?? 0 }} total products.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a routerLink="/admin/add-product" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </a>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading products...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (product of filteredProducts(); track product.id) {
                <tr class="hover:bg-slate-50/60 transition-colors" [class.opacity-50]="processingId() === product.id">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        @if (product.images && product.images.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        }
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 max-w-[200px] truncate" [title]="product.name">{{ product.name }}</p>
                        <p class="text-xs text-slate-400">{{ product.category }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold">{{ product.price | currency }}</td>
                  <td class="px-6 py-4">
                    <span [class.text-rose-600]="product.stock < 10"
                          [class.font-semibold]="product.stock < 10"
                          [class.text-slate-700]="product.stock >= 10">
                      {{ product.stock }}
                      @if (product.stock < 10) {
                        <span class="text-xs text-rose-400 ml-1">(Low)</span>
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Edit -->
                      @if (canManageProducts()) {
                        <a [routerLink]="['/admin/edit-product', product.slug]"
                           class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Edit
                        </a>

                        <!-- Delete -->
                        <button (click)="confirmDelete(product)"
                                [disabled]="processingId() === product.id"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      <p class="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    @if (productToDelete()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="productToDelete.set(null)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="p-6">
            <div class="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Delete Product?</h3>
            <p class="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to permanently delete
              <span class="font-semibold text-slate-800">"{{ productToDelete()?.name }}"</span>?
              This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button (click)="productToDelete.set(null)"
                      class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                Cancel
              </button>
              <button (click)="deleteProduct()"
                      class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly productsResult = signal<AdminProductResult | null>(null);
  readonly processingId = signal<string | null>(null);
  readonly productToDelete = signal<any>(null);
  readonly isLoading = signal(true);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly canManageProducts = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.includes('SuperAdmin') || roles.includes('Seller');
  });

  readonly filteredProducts = computed(() => {
    return this.productsResult()?.items ?? [];
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.adminService.getAllProducts().subscribe({
      next: (result) => {
        this.productsResult.set(result);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  confirmDelete(product: any): void {
    this.productToDelete.set(product);
  }

  deleteProduct(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.processingId.set(product.id);
    this.adminService.deleteProduct(product.id).subscribe({
      next: () => {
        const current = this.productsResult();
        if (current) {
          const updated = current.items.filter((p: any) => p.id !== product.id);
          this.productsResult.set({ ...current, items: updated, total: current.total - 1 });
        }
        this.productToDelete.set(null);
        this.processingId.set(null);
      },
      error: () => {
        this.productToDelete.set(null);
        this.processingId.set(null);
      }
    });
  }
}

``

## src\app\features\admin\admin-seller-requests.component.ts

``typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { DatePipe } from '@angular/common';

interface SellerRequest {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  status: string;
  reason: string;
  created: string;
}

@Component({
  selector: 'app-admin-seller-requests',
  imports: [DatePipe],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Seller Requests</h2>
        <p class="mt-1 text-sm text-slate-500">
          Manage applications from users wanting to become sellers.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Reason</th>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading requests...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (req of requests(); track req.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">{{ req.fullName }}</p>
                    <p class="text-xs text-slate-500">{{ req.email }}</p>
                  </td>
                  <td class="px-6 py-4 max-w-xs truncate" [title]="req.reason">
                    {{ req.reason || 'No reason provided' }}
                  </td>
                  <td class="px-6 py-4 text-slate-500">
                    {{ req.created | date:'MMM d, y' }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full"
                          [class.bg-amber-100]="req.status === 'Pending'"
                          [class.text-amber-700]="req.status === 'Pending'"
                          [class.bg-emerald-100]="req.status === 'Approved'"
                          [class.text-emerald-700]="req.status === 'Approved'"
                          [class.bg-rose-100]="req.status === 'Rejected'"
                          [class.text-rose-700]="req.status === 'Rejected'">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (req.status === 'Pending') {
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="approve(req.id)" [disabled]="isProcessing()" class="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50">Approve</button>
                        <button (click)="reject(req.id)" [disabled]="isProcessing()" class="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50">Reject</button>
                      </div>
                    } @else {
                      <span class="text-xs text-slate-400 font-medium italic">Processed</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                    <div class="flex flex-col items-center justify-center">
                      <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                      <p class="font-medium text-slate-600">No requests found</p>
                      <p class="text-sm">There are currently no seller requests to review.</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminSellerRequestsComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  requests = signal<SellerRequest[]>([]);
  isProcessing = signal(false);
  isLoading = signal(true);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/sellerrequests`).subscribe({
      next: (res) => {
        this.requests.set(res.items || res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load seller requests:', err);
        this.isLoading.set(false);
        this.requests.set([]);
      }
    });
  }

  approve(id: string) {
    this.isProcessing.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests/${id}/approve`, {}).subscribe({
      next: () => {
        this.toast.success('Request approved successfully. The user is now a Seller.');
        this.loadRequests();
        this.isProcessing.set(false);
      },
      error: () => {
        this.toast.error('Failed to approve request.');
        this.isProcessing.set(false);
      }
    });
  }

  reject(id: string) {
    this.isProcessing.set(true);
    this.http.post(`${environment.apiUrl}/sellerrequests/${id}/reject`, {}).subscribe({
      next: () => {
        this.toast.success('Request rejected.');
        this.loadRequests();
        this.isProcessing.set(false);
      },
      error: () => {
        this.toast.error('Failed to reject request.');
        this.isProcessing.set(false);
      }
    });
  }
}

``

## src\app\features\admin\admin-user-profile.component.ts

``typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService, AdminUserProfile } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-user-profile',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a routerLink="/admin/users" class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </a>
          <div>
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">User Profile</h2>
            <p class="mt-1 text-sm text-slate-500">Detailed information and associated products</p>
          </div>
        </div>

        @if (profile() && isSuperAdmin()) {
          <div class="flex items-center gap-3">
            <button (click)="toggleBan()"
                    [class.text-rose-600]="!profile()!.isBanned" [class.bg-rose-50]="!profile()!.isBanned" [class.hover:bg-rose-100]="!profile()!.isBanned"
                    [class.text-emerald-600]="profile()!.isBanned" [class.bg-emerald-50]="profile()!.isBanned" [class.hover:bg-emerald-100]="profile()!.isBanned"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {{ profile()!.isBanned ? 'Unban User' : 'Ban User' }}
            </button>
            <button (click)="deleteUser()"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Delete User
            </button>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center p-12">
          <div class="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      } @else if (profile()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile Card -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <div class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-teal-200 mb-6 relative">
                {{ profile()!.firstName[0] }}{{ profile()!.lastName[0] }}
                @if (profile()!.isBanned) {
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center text-white" title="User is Banned">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                }
              </div>
              <h3 class="text-xl font-bold text-slate-900">{{ profile()!.firstName }} {{ profile()!.lastName }}</h3>
              <p class="text-slate-500 mt-1">{{ profile()!.email }}</p>

              <div class="flex flex-wrap justify-center gap-2 mt-4">
                @for (role of profile()!.roles; track role) {
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold"
                        [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                        [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                        [class.bg-indigo-100]="role === 'Seller'" [class.text-indigo-700]="role === 'Seller'"
                        [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                    {{ role }}
                  </span>
                }
                @if (profile()!.roles.length === 0) {
                  <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-slate-100 text-left space-y-4">
                <div>
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p class="text-sm font-medium text-slate-700 mt-1">{{ profile()!.createdAt | date:'longDate' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</p>
                  <p class="text-sm font-medium text-slate-700 mt-1 truncate" [title]="profile()!.id">{{ profile()!.id }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User's Products -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-slate-900">Products Created ({{ profile()!.products.length }})</h3>
              </div>

              @if (profile()!.products.length > 0) {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (product of profile()!.products; track product.id) {
                    <div class="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                      <div class="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        @if (product.images?.length > 0) {
                          <img [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
                        } @else {
                          <div class="w-full h-full flex items-center justify-center text-slate-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-slate-900 truncate">{{ product.name }}</h4>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">{{ product.category }}</p>
                        <div class="flex items-center gap-3 mt-2">
                          <span class="text-sm font-bold text-teal-600">{{ product.price | currency }}</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                [class.bg-emerald-100]="product.approvalStatus === 'Approved'" [class.text-emerald-700]="product.approvalStatus === 'Approved'"
                                [class.bg-amber-100]="product.approvalStatus === 'Pending'" [class.text-amber-700]="product.approvalStatus === 'Pending'"
                                [class.bg-rose-100]="product.approvalStatus === 'Rejected'" [class.text-rose-700]="product.approvalStatus === 'Rejected'">
                            {{ product.approvalStatus }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div class="w-12 h-12 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <h4 class="text-sm font-bold text-slate-700">No products found</h4>
                  <p class="text-xs text-slate-500 mt-1">This user hasn't created any products yet.</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <h4 class="text-lg font-bold text-slate-900">User not found</h4>
          <p class="text-slate-500 mt-1">The user might have been deleted or the ID is incorrect.</p>
        </div>
      }

    <!-- Confirmation Modal -->
    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                 [class.bg-rose-100]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.text-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.bg-emerald-100]="confirmAction()?.type === 'unban'"
                 [class.text-emerald-600]="confirmAction()?.type === 'unban'">
              @if (confirmAction()?.type === 'delete') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              } @else if (confirmAction()?.type === 'ban') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              } @else {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Confirm Action</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to <strong>{{ confirmAction()?.type }}</strong> {{ profile()?.firstName }}?
              @if (confirmAction()?.type === 'delete') {
                <br>This action cannot be undone.
              }
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeConfirmAction()" 
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban'">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
  `
})
export class AdminUserProfileComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly profile = signal<AdminUserProfile | null>(null);
  readonly loading = signal<boolean>(true);
  readonly confirmAction = signal<{ type: 'ban' | 'unban' | 'delete' } | null>(null);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfile(id);
    } else {
      this.loading.set(false);
    }
  }

  loadProfile(userId: string): void {
    this.loading.set(true);
    this.adminService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.loading.set(false);
      }
    });
  }

  openConfirmModal(type: 'ban' | 'unban' | 'delete'): void {
    this.confirmAction.set({ type });
  }

  closeConfirmModal(): void {
    this.confirmAction.set(null);
  }

  toggleBan(): void {
    const user = this.profile();
    if (!user) return;
    this.openConfirmModal(user.isBanned ? 'unban' : 'ban');
  }

  deleteUser(): void {
    this.openConfirmModal('delete');
  }

  executeConfirmAction(): void {
    const action = this.confirmAction();
    const user = this.profile();
    if (!action || !user) return;

    const { type } = action;
    this.closeConfirmModal();

    if (type === 'ban' || type === 'unban') {
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
          this.toastService.success(`User successfully ${type}ned.`);
          this.loadProfile(user.id);
        },
        error: () => this.toastService.error(`Failed to ${type} user.`)
      });
    } else if (type === 'delete') {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.toastService.success(`User deleted permanently.`);
          this.router.navigate(['/admin/users']);
        },
        error: () => this.toastService.error('Failed to delete user.')
      });
    }
  }
}

``

## src\app\features\admin\admin-users.component.ts

``typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ users().length }} registered users.
            @if (isSuperAdmin()) {
              <span class="text-purple-600 font-medium">You can assign and remove roles.</span>
            }
          </p>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Roles</th>
                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Joined At</th>
                @if (isSuperAdmin()) {
                  <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-700">
              @if (isLoading()) {
                <tr>
                  <td [attr.colspan]="isSuperAdmin() ? 4 : 3" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              } @else {
                @for (user of users(); track user.id) {
                <tr class="hover:bg-slate-50/60 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {{ user.firstName[0] }}{{ user.lastName[0] }}
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                        <p class="text-xs text-slate-400">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-1 flex-wrap">
                      @for (role of user.roles; track role) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
                              [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                              [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"

                              [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                          {{ role }}
                        </span>
                      }
                      @if (user.roles.length === 0) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">User</span>
                      }
                      @if (user.isBanned) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 ml-1">
                          Banned
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y Â· h:mm a' }}</td>
                  @if (isSuperAdmin()) {
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <a [routerLink]="['/admin/users', user.id]"
                           class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          Profile
                        </a>

                        @if (!user.roles.includes('SuperAdmin')) {
                          <button (click)="openRoleModal(user)"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            Roles
                          </button>

                          <button (click)="toggleBan(user)"
                                  [class.from-rose-600]="!user.isBanned" [class.to-rose-700]="!user.isBanned" [class.hover:from-rose-700]="!user.isBanned"
                                  [class.from-emerald-600]="user.isBanned" [class.to-emerald-700]="user.isBanned" [class.hover:from-emerald-700]="user.isBanned"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            {{ user.isBanned ? 'Unban' : 'Ban' }}
                          </button>

                          <button (click)="deleteUser(user)"
                                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        } @else {
                          <span class="text-xs text-slate-300 italic">Protected</span>
                        }
                      </div>
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="isSuperAdmin() ? 4 : 3" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <p class="text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
        
        @if (hasMore()) {
          <div class="px-6 py-4 border-t border-slate-100 flex justify-center">
            <button (click)="loadMore()" [disabled]="loadingMore()"
                    class="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
              @if (loadingMore()) {
                <span class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
                  Loading...
                </span>
              } @else {
                Load More Users
              }
            </button>
          </div>
        }
      </div>
    </div>

    <!-- Role Management Modal (SuperAdmin only) -->
    @if (selectedUser() && isSuperAdmin()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-teal-700 to-teal-900 px-6 py-5 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  {{ selectedUser()!.firstName[0] }}{{ selectedUser()!.lastName[0] }}
                </div>
                <div>
                  <h3 class="font-bold">{{ selectedUser()!.firstName }} {{ selectedUser()!.lastName }}</h3>
                  <p class="text-teal-200 text-xs">{{ selectedUser()!.email }}</p>
                </div>
              </div>
              <button (click)="closeModal()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-500">Assign or remove roles for this user. Changes take effect immediately.</p>

            <!-- Role toggles -->
            <div class="space-y-3">
              <!-- Admin role -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">Admin</p>
                    <p class="text-xs text-slate-400">Product approval, content management</p>
                  </div>
                </div>
                <button (click)="toggleRole('Admin')"
                        [class.bg-teal-600]="hasRole('Admin')"
                        [class.bg-slate-200]="!hasRole('Admin')"
                        class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
                  <span [class.translate-x-6]="hasRole('Admin')"
                        [class.translate-x-0]="!hasRole('Admin')"
                        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
                </button>
              </div>

              <!-- Seller role -->
              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors mt-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">Seller</p>
                    <p class="text-xs text-slate-400">Can add and manage own products</p>
                  </div>
                </div>
                <button (click)="toggleRole('Seller')"
                        [class.bg-indigo-600]="hasRole('Seller')"
                        [class.bg-slate-200]="!hasRole('Seller')"
                        class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                  <span [class.translate-x-6]="hasRole('Seller')"
                        [class.translate-x-0]="!hasRole('Seller')"
                        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 inline-block"></span>
                </button>
              </div>


            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 pb-6">
            <button (click)="closeModal()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Confirmation Modal -->
    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                 [class.bg-rose-100]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.text-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                 [class.bg-emerald-100]="confirmAction()?.type === 'unban'"
                 [class.text-emerald-600]="confirmAction()?.type === 'unban'">
              @if (confirmAction()?.type === 'delete') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              } @else if (confirmAction()?.type === 'ban') {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              } @else {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Confirm Action</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to <strong>{{ confirmAction()?.type }}</strong> {{ confirmAction()?.user?.firstName }}?
              @if (confirmAction()?.type === 'delete') {
                <br>This action cannot be undone.
              }
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeConfirmAction()" 
                      class="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-colors shadow-sm"
                      [class.bg-rose-600]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.hover:bg-rose-700]="confirmAction()?.type === 'delete' || confirmAction()?.type === 'ban'"
                      [class.bg-emerald-600]="confirmAction()?.type === 'unban'"
                      [class.hover:bg-emerald-700]="confirmAction()?.type === 'unban'">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly loadingMore = signal(false);
  readonly currentPage = signal(1);
  readonly hasMore = signal(false);
  
  readonly selectedUser = signal<AdminUser | null>(null);
  readonly confirmAction = signal<{ type: 'ban' | 'unban' | 'delete', user: AdminUser } | null>(null);
  
  private readonly toastService = inject(ToastService);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  ngOnInit(): void {
    this.isLoading.set(true);
    this.adminService.getAllUsers(1, 20).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.hasMore.set(res.page < res.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load users. Please refresh the page.');
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;
    
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    this.adminService.getAllUsers(nextPage, 20).subscribe({
      next: (res) => {
        this.users.update(current => [...current, ...res.items]);
        this.currentPage.set(res.page);
        this.hasMore.set(res.page < res.totalPages);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }

  openRoleModal(user: AdminUser): void {
    this.selectedUser.set({ ...user, roles: [...user.roles] });
  }

  closeModal(): void {
    this.selectedUser.set(null);
  }

  openConfirmModal(type: 'ban' | 'unban' | 'delete', user: AdminUser): void {
    this.confirmAction.set({ type, user });
  }

  closeConfirmModal(): void {
    this.confirmAction.set(null);
  }

  hasRole(role: string): boolean {
    return this.selectedUser()?.roles.includes(role) ?? false;
  }

  toggleRole(role: string): void {
    const user = this.selectedUser();
    if (!user) return;

    const alreadyHas = user.roles.includes(role);    
    const updatedRoles = alreadyHas
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role];
      
    this.selectedUser.set({ ...user, roles: updatedRoles });
    this.users.update(users => users.map(u => u.id === user.id ? { ...u, roles: updatedRoles } : u));

    const action$ = alreadyHas
      ? this.adminService.removeRole(user.id, role)
      : this.adminService.assignRole(user.id, role);

    action$.subscribe({
      next: () => {
        this.toastService.success(`Role "${role}" ${alreadyHas ? 'removed' : 'assigned'} successfully.`);
      },
      error: () => {
        this.selectedUser.set(user);
        this.users.update(users => users.map(u => u.id === user.id ? user : u));
        this.toastService.error(`Failed to ${alreadyHas ? 'remove' : 'assign'} role "${role}".`);
      }
    });
  }

  toggleBan(user: AdminUser): void {
    this.openConfirmModal(user.isBanned ? 'unban' : 'ban', user);
  }

  deleteUser(user: AdminUser): void {
    this.openConfirmModal('delete', user);
  }

  executeConfirmAction(): void {
    const action = this.confirmAction();
    if (!action) return;

    const { type, user } = action;
    this.closeConfirmModal();

    if (type === 'ban' || type === 'unban') {
      const newStatus = type === 'ban';
      this.users.update(users => users.map(u => u.id === user.id ? { ...u, isBanned: newStatus } : u));
      
      const action$ = type === 'unban'
        ? this.adminService.unbanUser(user.id)
        : this.adminService.banUser(user.id);

      action$.subscribe({
        next: () => {
            this.toastService.success(`User successfully ${type}ned.`);
        },
        error: () => {
          this.users.update(users => users.map(u => u.id === user.id ? user : u));
          this.toastService.error(`Failed to ${type} user.`);
        }
      });
    } else if (type === 'delete') {
      const previousUsers = this.users();
      this.users.set(previousUsers.filter(u => u.id !== user.id));
      
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
            this.toastService.success(`User deleted permanently.`);
        },
        error: () => {
          this.users.set(previousUsers);
          this.toastService.error('Failed to delete user.');
        }
      });
    }
  }
}

``

## src\app\features\auth\forgot-password\forgot-password.component.ts

``typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div class="w-full max-w-[420px]">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-8 sm:-ml-2">
            <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
            <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
          </div>

          @if (!submitted()) {
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
              <p class="mt-2 text-sm text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  autocomplete="email"
                  class="input-field"
                  [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                  placeholder="you@example.com" />
                @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
                  <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
                }
                @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
                  <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
                }
              </div>

              <button type="submit" [disabled]="loading()" class="btn-primary w-full">
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Sending...
                } @else {
                  Send reset link
                }
              </button>
            </form>
          } @else {
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p class="text-sm text-slate-500 mb-6">
                If an account with that email exists, we've sent a password reset link.
              </p>
              <a routerLink="/auth/reset-password"
                 class="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors">
                Have a reset token? Reset your password
              </a>
            </div>
          }

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  submitted = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.loading.set(false);
        
        this.submitted.set(true);
      }
    });
  }
}

``

## src\app\features\auth\login\login.component.html

``html
<div class="min-h-screen flex">
  <!-- â”€â”€ Left Brand Panel â”€â”€ -->
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
    <!-- Background Image -->
    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Shopping" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
    
    <!-- Gradient Overlay (Animated) -->
    <div class="absolute inset-0 bg-gradient-to-br from-teal-950/95 via-teal-900/80 to-slate-900/95 bg-[length:200%_200%] animate-gradient-slow"></div>

    <div class="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full text-white">
      <!-- Logo -->
      <div class="flex items-center gap-4 -ml-2">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-900/40 overflow-hidden shrink-0">
          <img src="/images/logo.png" alt="Budgetha" class="h-14 w-auto object-contain" />
        </div>
        <span class="text-4xl font-black tracking-tighter text-white" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
      </div>

      <!-- Hero copy -->
      <div class="space-y-6 mt-12">
        <h2 class="text-5xl font-bold leading-tight font-sans">
          Discover a new way<br />
          to <span class="text-teal-300">shop online.</span>
        </h2>
        <p class="text-xl text-teal-50/80 max-w-md leading-relaxed font-light">
          Compare prices, find exclusive deals, and check out securely across hundreds of premium vendors.
        </p>
      </div>

      <!-- UI Cards Animated Slider (3D Coverflow) -->
      <app-auth-slider></app-auth-slider>

      <!-- Features snippet -->
      <div class="mt-auto border-t border-white/10 pt-8 pb-4">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-sm text-teal-300 font-bold tracking-wider uppercase">Why choose Budgetha?</span>
        </div>
        <p class="text-lg font-medium text-white/90 leading-snug">
          Experience a smarter way to shop with confidence. Compare prices instantly, discover authentic products, and connect with trusted vendors across our platform.
        </p>
      </div>
    </div>
  </div>

  <!-- â”€â”€ Right Form Panel â”€â”€ -->
  <div class="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-pan-bg">
    
    <!-- Optional: Super soft glowing orb in background of right panel to make it even more magical -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
      <!-- Mobile logo (visible < lg) -->
      <div class="lg:hidden flex items-center justify-center gap-2 mb-10">
        <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
        <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
        <p class="mt-2 text-slate-500">Sign in to your account to continue</p>
      </div>

      <!-- Login form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="input-field"
            [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
            placeholder="you@example.com" />
          @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
          }
          @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
            <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
          }
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <a routerLink="/auth/forgot-password" class="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors">
              Forgot password?
            </a>
          </div>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              autocomplete="current-password"
              class="input-field pr-11"
              [class.input-error]="form.get('password')?.touched && form.get('password')?.invalid"
              placeholder="Enter your password" />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          @if (form.get('password')?.touched && form.get('password')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Password is required.</p>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
            <p class="mt-1.5 text-xs text-red-500">Password must be at least 6 characters.</p>
          }
        </div>

        <!-- Submit -->
        <button type="submit" [disabled]="loading()" class="btn-primary w-full bg-teal-700 hover:bg-teal-800 focus:ring-teal-500/50">
          @if (loading()) {
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Signing inâ€¦
          } @else {
            Sign in
          }
        </button>
      </form>

      <!-- Social divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-white/90 px-4 text-slate-400 uppercase tracking-wider">Or continue with</span>
        </div>
      </div>

      <!-- Social buttons -->
      <div>
        <button type="button" (click)="googleLogin()" class="btn-social w-full justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="mt-8 text-center text-sm text-slate-500">
        Don&rsquo;t have an account?
        <a routerLink="/auth/register" [queryParams]="linkQuery" class="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Create one</a>
      </p>
    </div>
  </div>
</div>

``

## src\app\features\auth\login\login.component.scss

``
:host {
  display: block;
}

``

## src\app\features\auth\login\login.component.ts

``typescript
import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

import { AuthSliderComponent } from '../../../shared/components/auth-slider/auth-slider.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthSliderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  showPassword = signal(false);
  
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.form.value).subscribe({
      next: response => {
        this.loading.set(false);
        this.toastService.success(`Welcome back${response?.firstName ? ', ' + response.firstName : ''}!`);
        
        const u = this.authService.user();
        let target = this.returnUrl;
        const isAdminRoute = target.startsWith('/admin');
        const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
        
        if (isAdminRoute && !hasAdminPrivileges) {
          target = '/';
        }
        
        this.router.navigateByUrl(target);
      },
      error: () => {
        
        
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isnâ€™t available right now. Please sign in with your email instead.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.ngZone.run(() => {
          this.loading.set(true);
          this.authService.googleLogin(response.credential).subscribe({
            next: () => {
              this.loading.set(false);
              this.toastService.success('Signed in with Google.');
              
              const u = this.authService.user();
              let target = this.returnUrl;
              const isAdminRoute = target.startsWith('/admin');
              const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
              
              if (isAdminRoute && !hasAdminPrivileges) {
                target = '/';
              }
              
              this.router.navigateByUrl(target);
            },
            error: () => {
              this.loading.set(false);
            }
          });
        });
      }
    });

    google.accounts.id.prompt();
  }
}

``

## src\app\features\auth\register\register.component.html

``html
<div class="min-h-screen flex">
  <!-- â”€â”€ Left Brand Panel â”€â”€ -->
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
    <!-- Background Image -->
    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Shopping" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
    
    <!-- Gradient Overlay (Animated) -->
    <div class="absolute inset-0 bg-gradient-to-br from-teal-950/95 via-teal-900/80 to-slate-900/95 bg-[length:200%_200%] animate-gradient-slow"></div>

    <div class="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full text-white">
      <!-- Logo -->
      <div class="flex items-center gap-4 -ml-2">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-900/40 overflow-hidden shrink-0">
          <img src="/images/logo.png" alt="Budgetha" class="h-14 w-auto object-contain" />
        </div>
        <span class="text-4xl font-black tracking-tighter text-white" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
      </div>

      <!-- Hero copy -->
      <div class="space-y-6 mt-12">
        <h2 class="text-5xl font-bold leading-tight font-sans">
          Start your<br />
          <span class="text-teal-300">shopping journey.</span>
        </h2>
        <p class="text-xl text-teal-50/80 max-w-md leading-relaxed font-light">
          Create your free account and unlock access to hundreds of verified vendors and exclusive member deals.
        </p>
      </div>

      <!-- UI Cards Animated Slider (3D Coverflow) -->
      <app-auth-slider></app-auth-slider>

      <!-- Features snippet -->
      <div class="mt-auto border-t border-white/10 pt-8 pb-4">
        <div class="flex items-center gap-4 mb-3">
          <span class="text-sm text-teal-300 font-bold tracking-wider uppercase">Why choose Budgetha?</span>
        </div>
        <p class="text-lg font-medium text-white/90 leading-snug">
          Experience a smarter way to shop with confidence. Compare prices instantly, discover authentic products, and connect with trusted vendors across our platform.
        </p>
      </div>
    </div>
  </div>

  <!-- â”€â”€ Right Form Panel â”€â”€ -->
  <div class="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-pan-bg">
    
    <!-- Optional: Super soft glowing orb in background of right panel to make it even more magical -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Form Container -->
    <div class="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center justify-center gap-2 mb-10">
        <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
        <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
        <p class="mt-2 text-slate-500">Join Budgetha and start shopping smarter</p>
      </div>

      <!-- Register form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Name row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              autocomplete="given-name"
              class="input-field bg-white/50 focus:bg-white"
              [class.input-error]="form.get('firstName')?.touched && form.get('firstName')?.invalid"
              placeholder="John" />
            @if (form.get('firstName')?.touched && form.get('firstName')?.hasError('required')) {
              <p class="mt-1.5 text-xs text-red-500">Required.</p>
            }
            @if (form.get('firstName')?.touched && form.get('firstName')?.hasError('minlength')) {
              <p class="mt-1.5 text-xs text-red-500">At least 2 characters.</p>
            }
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              autocomplete="family-name"
              class="input-field bg-white/50 focus:bg-white"
              [class.input-error]="form.get('lastName')?.touched && form.get('lastName')?.invalid"
              placeholder="Doe" />
            @if (form.get('lastName')?.touched && form.get('lastName')?.hasError('required')) {
              <p class="mt-1.5 text-xs text-red-500">Required.</p>
            }
            @if (form.get('lastName')?.touched && form.get('lastName')?.hasError('minlength')) {
              <p class="mt-1.5 text-xs text-red-500">At least 2 characters.</p>
            }
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="input-field bg-white/50 focus:bg-white"
            [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
            placeholder="you@example.com" />
          @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
          }
          @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
            <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
          }
        </div>

        <!-- Password + strength meter -->
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              autocomplete="new-password"
              class="input-field pr-11 bg-white/50 focus:bg-white"
              [class.input-error]="form.get('password')?.touched && form.get('password')?.invalid"
              placeholder="Create a strong password" />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          <!-- Strength meter -->
          @if (form.get('password')?.value) {
            <div class="mt-2.5 space-y-1.5">
              <div class="flex gap-1.5">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div class="h-1 flex-1 rounded-full transition-all duration-300"
                       [ngClass]="i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'">
                  </div>
                }
              </div>
              <p class="text-xs" [ngClass]="passwordStrength.score <= 1 ? 'text-red-500' : passwordStrength.score <= 3 ? 'text-amber-600' : 'text-emerald-600'">
                {{ passwordStrength.label }}
              </p>
            </div>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Password is required.</p>
          }
          @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
            <p class="mt-1.5 text-xs text-red-500">Password must be at least 6 characters.</p>
          }
        </div>

        <!-- Confirm password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
          <div class="relative">
            <input
              id="confirmPassword"
              [type]="showConfirmPassword() ? 'text' : 'password'"
              formControlName="confirmPassword"
              autocomplete="new-password"
              class="input-field pr-11 bg-white/50 focus:bg-white"
              [class.input-error]="form.get('confirmPassword')?.touched && form.get('confirmPassword')?.invalid"
              placeholder="Repeat your password" />
            <button
              type="button"
              (click)="toggleConfirmPassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (showConfirmPassword()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                }
              </svg>
            </button>
          </div>
          @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('required')) {
            <p class="mt-1.5 text-xs text-red-500">Please confirm your password.</p>
          }
          @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('passwordMismatch')) {
            <p class="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
          }
        </div>

        <!-- Terms -->
        <p class="text-xs text-slate-400 leading-relaxed">
          By creating an account, you agree to our
          <a routerLink="/legal/terms" class="text-teal-600 hover:text-teal-700 font-medium">Terms of Service</a>
          and
          <a routerLink="/legal/privacy" class="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</a>.
        </p>

        <!-- Submit -->
        <button type="submit" [disabled]="loading()" class="btn-primary w-full bg-teal-700 hover:bg-teal-800 focus:ring-teal-500/50">
          @if (loading()) {
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Creating accountâ€¦
          } @else {
             Create account
          }
        </button>
      </form>

      <!-- Social divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-white/90 px-4 text-slate-400 uppercase tracking-wider">Or sign up with</span>
        </div>
      </div>

      <!-- Social buttons -->
      <div>
        <button type="button" (click)="googleLogin()" class="btn-social w-full justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="mt-8 text-center text-sm text-slate-500">
        Already have an account?
        <a routerLink="/auth/login" [queryParams]="linkQuery" class="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Sign in</a>
      </p>
    </div>
  </div>
</div>

``

## src\app\features\auth\register\register.component.scss

``
:host {
  display: block;
}

``

## src\app\features\auth\register\register.component.ts

``typescript
import { Component, signal, NgZone, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

import { AuthSliderComponent } from '../../../shared/components/auth-slider/auth-slider.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthSliderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  private get returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
    if (target.startsWith('/auth/')) return '/';
    return target;
  }

  
  get linkQuery(): { returnUrl: string | null } {
    const target = this.returnUrl;
    return { returnUrl: target === '/' ? null : target };
  }

  get passwordStrength(): { score: number; label: string; color: string } {
    const password = this.form?.get('password')?.value || '';
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 5, label: 'Excellent', color: 'bg-emerald-600' };
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fix the highlighted fields before continuing.');
      return;
    }

    const { confirmPassword, ...payload } = this.form.value;

    this.loading.set(true);
    this.authService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        
        
        this.toastService.success('Your account is ready. Welcome to Budgetha!');
        
        const u = this.authService.user();
        let target = this.returnUrl;
        const isAdminRoute = target.startsWith('/admin');
        const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
        
        if (isAdminRoute && !hasAdminPrivileges) {
          target = '/';
        }
        
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  googleLogin(): void {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In isnâ€™t available right now. Please sign up with your email instead.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.ngZone.run(() => {
          this.loading.set(true);
          this.authService.googleLogin(response.credential).subscribe({
            next: () => {
              this.loading.set(false);
              this.toastService.success('Signed up with Google.');
              
              const u = this.authService.user();
              let target = this.returnUrl;
              const isAdminRoute = target.startsWith('/admin');
              const hasAdminPrivileges = u?.roles?.includes('Admin') || u?.roles?.includes('SuperAdmin') || u?.roles?.includes('Seller');
              
              if (isAdminRoute && !hasAdminPrivileges) {
                target = '/';
              }
              
              this.router.navigateByUrl(target);
            },
            error: () => {
              this.loading.set(false);
            }
          });
        });
      }
    });

    google.accounts.id.prompt();
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...(confirmPassword.errors ?? {}), passwordMismatch: true });
    return { passwordMismatch: true };
  }

  
  if (confirmPassword.hasError('passwordMismatch')) {
    const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
    confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
  }
  return null;
}

``

## src\app\features\auth\reset-password\reset-password.component.ts

``typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div class="w-full max-w-[420px]">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-8 sm:-ml-2">
            <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
            <span class="text-3xl font-black text-slate-900 tracking-tighter" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
          </div>

          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h1>
            <p class="mt-2 text-sm text-slate-500">Enter the reset token from your email and choose a new password.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                class="input-field"
                [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                placeholder="you@example.com" />
              @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Email is required.</p>
              }
              @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
                <p class="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
              }
            </div>

            <!-- Token -->
            <div>
              <label for="token" class="block text-sm font-medium text-slate-700 mb-1.5">Reset token</label>
              <input
                id="token"
                type="text"
                formControlName="token"
                class="input-field"
                [class.input-error]="form.get('token')?.touched && form.get('token')?.invalid"
                placeholder="Paste your reset token here" />
              @if (form.get('token')?.touched && form.get('token')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Reset token is required.</p>
              }
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <div class="relative">
                <input
                  id="newPassword"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="newPassword"
                  autocomplete="new-password"
                  class="input-field pr-11"
                  [class.input-error]="form.get('newPassword')?.touched && form.get('newPassword')?.invalid"
                  placeholder="Enter new password" />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword()) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    }
                  </svg>
                </button>
              </div>
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">New password is required.</p>
              }
              @if (form.get('newPassword')?.touched && form.get('newPassword')?.hasError('minlength')) {
                <p class="mt-1.5 text-xs text-red-500">Password must be at least 8 characters.</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <input
                id="confirmPassword"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
                class="input-field"
                [class.input-error]="form.get('confirmPassword')?.touched && form.get('confirmPassword')?.invalid"
                placeholder="Repeat new password" />
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('required')) {
                <p class="mt-1.5 text-xs text-red-500">Please confirm your new password.</p>
              }
              @if (form.get('confirmPassword')?.touched && form.get('confirmPassword')?.hasError('passwordMismatch')) {
                <p class="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
              }
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Resetting...
              } @else {
                Reset password
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-500">
            Remember your password?
            <a routerLink="/auth/login" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, token, newPassword } = this.form.value;
    this.authService.resetPassword(email, token, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Password has been reset successfully. Please sign in.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Password reset failed. The token may be invalid or expired.');
      }
    });
  }
}

``

## src\app\features\cart\cart.component.ts

``typescript
import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, FormsModule, EmptyStateComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>

      @if (cart.items().length === 0) {
        <div class="card mt-8 max-w-2xl mx-auto">
          <app-empty-state
            icon="cart"
            title="Your cart is empty"
            message="Looks like you haven't added anything to your cart yet. Explore our catalog and find something you'll love."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      } @else {
        <div class="mt-8 grid lg:grid-cols-3 gap-8 items-start">
          <!-- â•â• Item list â•â• -->
          <div class="lg:col-span-2 card divide-y divide-slate-100">
            <div class="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span class="col-span-6">Product</span>
              <span class="col-span-3 text-center">Quantity</span>
              <span class="col-span-2 text-right">Subtotal</span>
              <span class="col-span-1"></span>
            </div>

            @for (item of cart.items(); track trackItem(item)) {
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-5 items-center">
                <!-- Product -->
                <div class="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <a [routerLink]="['/products', item.slug]" class="shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-2" />
                  </a>
                  <div class="min-w-0">
                    <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ item.brand }}</span>
                    <a [routerLink]="['/products', item.slug]" class="block text-sm font-semibold text-slate-900 hover:text-violet-600 transition-colors duration-300 leading-snug">
                      {{ item.name }}
                    </a>
                    @if (item.color || item.size) {
                      <p class="mt-1 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' Â· Size ' : item.size ? 'Size ' : '' }}{{ item.size }}
                      </p>
                    }
                    <p class="mt-1 text-sm font-bold text-slate-700 sm:hidden">{{ item.price | currency }}</p>
                    <p class="hidden sm:block mt-1 text-sm text-slate-500">{{ item.price | currency }} each</p>
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-span-7 sm:col-span-3 flex sm:justify-center">
                  <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                    </button>
                    <span class="w-10 text-center text-sm font-bold text-slate-900" aria-live="polite">{{ item.quantity }}</span>
                    <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-8 w-8">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="col-span-4 sm:col-span-2 text-right">
                  <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                </div>

                <!-- Remove -->
                <div class="col-span-1 flex justify-end">
                  <button
                    type="button"
                    (click)="cart.remove(item)"
                    [attr.aria-label]="'Remove ' + item.name + ' from cart'"
                    class="icon-btn h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            }

            <div class="px-6 py-4 flex items-center justify-between">
              <a routerLink="/shop" class="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue shopping
              </a>
              <button type="button" (click)="cart.clear()" class="text-sm font-medium text-slate-400 hover:text-rose-500 transition-colors duration-300">
                Clear cart
              </button>
            </div>
          </div>

          <!-- â•â• Order summary â•â• -->
          <aside class="card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <!-- Promo code -->
            <div class="mt-5">
              @if (cart.promo(); as promo) {
                <div class="flex items-center justify-between rounded-xl bg-emerald-50 ring-1 ring-emerald-100 px-4 py-3">
                  <div>
                    <p class="text-sm font-bold text-emerald-700">{{ promo.code }}</p>
                    <p class="text-xs text-emerald-600">{{ promo.description }}</p>
                  </div>
                  <button type="button" (click)="cart.removePromo()" aria-label="Remove promo code" class="icon-btn h-8 w-8 text-emerald-500 hover:text-rose-500 hover:bg-rose-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              } @else {
                <form (submit)="applyPromo($event)" class="flex gap-2">
                  <input
                    type="text"
                    name="promo"
                    [(ngModel)]="promoInput"
                    placeholder="Promo code"
                    aria-label="Promo code"
                    class="input-field py-2.5 uppercase placeholder:normal-case"
                    [class.input-error]="promoError()" />
                  <button type="submit" class="btn-secondary px-4 py-2.5 whitespace-nowrap">Apply</button>
                </form>
                @if (promoError()) {
                  <p class="mt-1.5 text-xs text-red-500">That code isn't valid. Try WELCOME10 or SAVE20.</p>
                }
              }
            </div>

            <!-- Totals -->
            <dl class="mt-6 space-y-3.5 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal ({{ cart.count() }} items)</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between">
                <dt class="text-slate-500">Shipping</dt>
                <dd class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Estimated tax</dt>
                <dd class="font-semibold text-slate-900">{{ cart.tax() | currency }}</dd>
              </div>
              <div class="flex justify-between border-t border-slate-100 pt-4 text-base">
                <dt class="font-bold text-slate-900">Total</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>

            <a routerLink="/checkout" class="btn-primary w-full mt-6 py-4 text-base">
              Proceed to Checkout
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure 256-bit SSL encrypted checkout
            </div>
          </aside>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  readonly cart = inject(CartService);

  promoInput = '';
  readonly promoError = signal(false);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  applyPromo(event: Event): void {
    event.preventDefault();
    if (!this.promoInput.trim()) return;
    const ok = this.cart.applyPromo(this.promoInput);
    this.promoError.set(!ok);
    if (ok) this.promoInput = '';
  }
}

``

## src\app\features\catalog\catalog.component.ts

``typescript
import { Component, computed, inject, signal, effect } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CatalogResult, Product, SortOption } from '../../core/models/shop.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe, NgTemplateOutlet, RouterLink, ProductCardComponent, EmptyStateComponent, StarRatingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
      <!-- Breadcrumb + heading -->
      <nav class="text-xs text-slate-400 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
        <span>/</span>
        <span class="text-slate-600 font-medium">Shop</span>
      </nav>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {{ pageTitle() }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">{{ result().total }} {{ result().total === 1 ? 'product' : 'products' }} found</p>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-3">
          <!-- Mobile filter toggle -->
          <button
            type="button"
            (click)="filtersOpen.set(true)"
            class="lg:hidden btn-secondary px-4 py-2.5 text-sm gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="badge bg-violet-600 text-white">{{ activeFilterCount() }}</span>
            }
          </button>

          <!-- Sort -->
          <div class="relative">
            <select
              [value]="sort()"
              (change)="setSort($event)"
              aria-label="Sort products"
              class="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer
                     transition-all duration-300">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <!-- View toggle -->
          <div class="hidden sm:inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              (click)="view.set('grid')"
              aria-label="Grid view"
              [attr.aria-pressed]="view() === 'grid'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'grid' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="view.set('list')"
              aria-label="List view"
              [attr.aria-pressed]="view() === 'list'"
              class="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
              [class]="view() === 'list' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex gap-8">
        <!-- â•â• Sidebar filters (desktop) â•â• -->
        <aside class="hidden lg:block w-64 shrink-0 space-y-6">
          <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
        </aside>

        <!-- â•â• Mobile filter drawer â•â• -->
        @if (filtersOpen()) {
          <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" (click)="filtersOpen.set(false)" aria-hidden="true"></div>
          <aside class="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto p-5 lg:hidden animate-[slideInLeft_0.3s_ease-out]"
                 role="dialog" aria-modal="true" aria-label="Filters">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-slate-900">Filters</h2>
              <button type="button" (click)="filtersOpen.set(false)" aria-label="Close filters" class="icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-6">
              <ng-container *ngTemplateOutlet="filterPanel"></ng-container>
            </div>
          </aside>
        }

        <!-- â•â• Filter panel template (shared desktop/mobile) â•â• -->
        <ng-template #filterPanel>
          <!-- Active filters / clear -->
          @if (activeFilterCount() > 0) {
            <div class="card p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-900">{{ activeFilterCount() }} active {{ activeFilterCount() === 1 ? 'filter' : 'filters' }}</span>
                <button type="button" (click)="clearFilters()" class="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-300">
                  Clear all
                </button>
              </div>
            </div>
          }

          <!-- Categories -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
            <div class="space-y-2.5">
              @for (category of categories(); track category.id) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedCategories().includes(category.slug)"
                    (change)="toggleCategory(category.slug)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200 flex-1">{{ category.name }}</span>
                  <span class="text-xs text-slate-400">{{ category.productCount }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Price range -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
            <div class="relative h-6 mt-1">
              <div class="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-slate-100"></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-violet-500"
                [style.left.%]="minPercent()"
                [style.width.%]="maxPercent() - minPercent()"></div>
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-10"
                [min]="bounds().min" [max]="bounds().max" [step]="5"
                [value]="minPrice()"
                (input)="setMinPrice($event)"
                aria-label="Minimum price" />
              <input
                type="range"
                class="range-slider top-1/2 -translate-y-1/2 z-20"
                [min]="bounds().min" [max]="bounds().max" [step]="5"
                [value]="maxPrice()"
                (input)="setMaxPrice($event)"
                aria-label="Maximum price" />
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Min</span>
                <span class="text-sm font-bold text-slate-900">{{ minPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
              <span class="text-slate-300">â€”</span>
              <div class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center">
                <span class="block text-[10px] uppercase tracking-wider text-slate-400">Max</span>
                <span class="text-sm font-bold text-slate-900">{{ maxPrice() | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Brands -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Brands</h3>
            <div class="space-y-2.5">
              @for (brand of brands(); track brand) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    [checked]="selectedBrands().includes(brand)"
                    (change)="toggleBrand(brand)"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 transition-colors duration-200" />
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors duration-200">{{ brand }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Rating -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Rating</h3>
            <div class="space-y-2">
              @for (threshold of [4, 3, 2]; track threshold) {
                <button
                  type="button"
                  (click)="minRating.set(minRating() === threshold ? 0 : threshold); page.set(1)"
                  class="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200"
                  [class]="minRating() === threshold ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'">
                  <app-star-rating [rating]="threshold" size="sm" />
                  <span class="text-sm text-slate-600">&amp; up</span>
                </button>
              }
            </div>
          </div>
        </ng-template>

        <!-- â•â• Results â•â• -->
        <div class="flex-1 min-w-0">
          @if (result().items.length === 0) {
            <div class="card">
              <app-empty-state
                [icon]="wishlistOnly() ? 'wishlist' : 'search'"
                [title]="wishlistOnly() ? 'Your wishlist is empty' : 'No products match your filters'"
                [message]="wishlistOnly() ? 'Save your favorite items here to review them later and purchase when you are ready.' : 'Try widening the price range, removing a brand filter, or searching for something else.'"
                [ctaLabel]="wishlistOnly() ? 'Explore products' : 'Clear all filters'"
                ctaLink="/shop" />
            </div>
          } @else {
            @if (view() === 'grid') {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="grid" />
                }
              </div>
            } @else {
              <div class="space-y-5">
                @for (product of result().items; track product.id) {
                  <app-product-card [product]="product" layout="list" />
                }
              </div>
            }

            <!-- Pagination -->
            @if (result().totalPages > 1) {
              <nav class="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  (click)="goToPage(page() - 1)"
                  [disabled]="page() === 1"
                  aria-label="Previous page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                @for (p of pages(); track p) {
                  <button
                    type="button"
                    (click)="goToPage(p)"
                    [attr.aria-current]="page() === p ? 'page' : null"
                    class="h-10 min-w-10 px-2 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-300"
                    [class]="page() === p
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'">
                    {{ p }}
                  </button>
                }

                <button
                  type="button"
                  (click)="goToPage(page() + 1)"
                  [disabled]="page() === result().totalPages"
                  aria-label="Next page"
                  class="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500
                         hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500
                         transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </nav>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  `,
})
export class CatalogComponent {
  private readonly productService = inject(ProductService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly brands = toSignal(this.productService.getBrands(), { initialValue: [] }); 
  
  
  readonly bounds = toSignal(this.productService.priceBounds(), { initialValue: { min: 0, max: 10000 } });

  readonly search = signal('');
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);
  readonly minPrice = signal(0);
  readonly maxPrice = signal(10000);
  readonly minRating = signal(0);
  readonly sort = signal<SortOption>('featured');
  readonly page = signal(1);
  readonly view = signal<'grid' | 'list'>('grid');
  readonly filtersOpen = signal(false);
  readonly dealsOnly = signal(false);
  readonly wishlistOnly = signal(false);

  
  
  
  
  
  
  
  readonly result = signal<CatalogResult>({ items: [], total: 0, totalPages: 1 });

  readonly pages = computed(() => Array.from({ length: this.result().totalPages }, (_, i) => i + 1));

  readonly activeFilterCount = computed(
    () =>
      this.selectedCategories().length +
      this.selectedBrands().length +
      (this.minRating() > 0 ? 1 : 0) +
      (this.minPrice() > this.bounds().min || this.maxPrice() < this.bounds().max ? 1 : 0) +
      (this.dealsOnly() ? 1 : 0)
  );

  readonly pageTitle = computed(() => {
    if (this.wishlistOnly()) return 'My Wishlist';
    if (this.dealsOnly()) return 'Todayâ€™s Deals';
    if (this.search()) return `Results for â€œ${this.search()}â€`;
    if (this.selectedCategories().length === 1) {
      return this.categories().find(c => c.slug === this.selectedCategories()[0])?.name ?? 'Shop';
    }
    return 'All Products';
  });

  readonly minPercent = computed(() => {
    const min = this.bounds().min;
    const max = this.bounds().max;
    if (max === min) return 0;
    const pct = ((this.minPrice() - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  });
  readonly maxPercent = computed(() => {
    const min = this.bounds().min;
    const max = this.bounds().max;
    if (max === min) return 100;
    const pct = ((this.maxPrice() - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.search.set(params.get('search') ?? '');
      const category = params.get('category');
      this.selectedCategories.set(category ? [category] : []);
      const brand = params.get('brand');
      this.selectedBrands.set(brand ? [brand] : []);
      this.dealsOnly.set(params.get('deals') === '1');
      this.wishlistOnly.set(params.get('wishlist') === '1');
      const sort = params.get('sort') as SortOption | null;
      if (sort && ['featured', 'newest', 'price-asc', 'price-desc', 'rating'].includes(sort)) {
        this.sort.set(sort);
      }
      this.page.set(1);
    });

    
    this.productService.priceBounds().pipe(takeUntilDestroyed()).subscribe(b => {
       this.minPrice.set(b.min);
       this.maxPrice.set(b.max);
    });

    
    effect(() => {
      const q = {
        search: this.search(),
        categories: this.selectedCategories(),
        brands: this.selectedBrands(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        minRating: this.minRating(),
        sort: this.sort(),
        page: this.wishlistOnly() || this.dealsOnly() ? 1 : this.page(),
        pageSize: this.wishlistOnly() || this.dealsOnly() ? 100 : PAGE_SIZE,
      };
      this.productService.query(q).subscribe(res => {
        let items = res?.items || [];
        if (this.dealsOnly()) {
          items = items.filter(p => p.originalPrice && p.originalPrice > p.price);
        }
        if (this.wishlistOnly()) {
          const ids = this.wishlist.ids();
          items = items.filter(p => ids.includes(p.id));
        }
        
        let total = res.total;
        let totalPages = res.totalPages;
        
        if (this.wishlistOnly() || this.dealsOnly()) {
          total = items.length;
          totalPages = Math.ceil(total / PAGE_SIZE);
          
          const start = (this.page() - 1) * PAGE_SIZE;
          items = items.slice(start, start + PAGE_SIZE);
        }
        
        this.result.set({ items, total, totalPages });
      });
    });
  }

  toggleCategory(slug: string): void {
    this.selectedCategories.update(list =>
      list.includes(slug) ? list.filter(s => s !== slug) : [...list, slug]
    );
    this.page.set(1);
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update(list =>
      list.includes(brand) ? list.filter(b => b !== brand) : [...list, brand]
    );
    this.page.set(1);
  }

  setMinPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.minPrice.set(Math.min(value, this.maxPrice() - 5));
    this.page.set(1);
  }

  setMaxPrice(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.maxPrice.set(Math.max(value, this.minPrice() + 5));
    this.page.set(1);
  }

  setSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortOption);
    this.page.set(1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.result().totalPages) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.minPrice.set(this.bounds().min);
    this.maxPrice.set(this.bounds().max);
    this.minRating.set(0);
    this.dealsOnly.set(false);
    this.page.set(1);
    this.router.navigate(['/shop']);
  }
}

``

## src\app\features\checkout\checkout.component.ts

``typescript
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AccountService } from '../../core/services/account.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

type PaymentMethod = 'paypal' | 'cod';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule, EmptyStateComponent, NgxPayPalModule],
  template: `
    @if (cart.items().length === 0) {
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="cart"
            title="Nothing to check out"
            message="Your cart is empty. Add a few items first, then come back to complete your order."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <!-- Progress -->
        <nav class="flex items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm" aria-label="Checkout progress">
          <a routerLink="/cart" class="flex items-center gap-2 text-violet-600 font-semibold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </span>
            Cart
          </a>
          <span class="w-8 sm:w-14 h-px bg-violet-300"></span>
          <span class="flex items-center gap-2 text-violet-700 font-bold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            Checkout
          </span>
          <span class="w-8 sm:w-14 h-px bg-slate-200"></span>
          <span class="flex items-center gap-2 text-slate-400 font-medium">
            <span class="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
            Confirmation
          </span>
        </nav>

        <h1 class="mt-8 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Checkout</h1>

        <form [formGroup]="form" (ngSubmit)="placeOrder()" class="mt-8 grid lg:grid-cols-5 gap-8 items-start">
          <!-- â•â• Left column â•â• -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Contact -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>
              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"
                         class="input-field" [class.input-error]="invalid('email')" />
                  @if (invalid('email')) {
                    <p class="mt-1.5 text-xs text-red-500">A valid email is required for your receipt.</p>
                  }
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
                  <input id="phone" type="tel" formControlName="phone" autocomplete="tel" placeholder="+1 (555) 000-0000"
                         class="input-field" [class.input-error]="invalid('phone')" />
                  @if (invalid('phone')) {
                    <p class="mt-1.5 text-xs text-red-500">Phone number is required for delivery updates.</p>
                  }
                </div>
              </div>
            </section>

            <!-- Shipping -->
            <section class="card p-6">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">2</span>
                  Delivery Address
                </h2>
                @if (savedAddresses.length) {
                  <div class="flex gap-2">
                    @for (address of savedAddresses; track address.id) {
                      <button type="button" (click)="useAddress(address)"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600
                                     hover:border-violet-300 hover:text-violet-700 transition-all duration-300">
                        Use â€œ{{ address.label }}â€
                      </button>
                    }
                  </div>
                }
              </div>

              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input id="fullName" type="text" formControlName="fullName" autocomplete="name" placeholder="Jane Doe"
                         class="input-field" [class.input-error]="invalid('fullName')" />
                  @if (invalid('fullName')) {
                    <p class="mt-1.5 text-xs text-red-500">Full name is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
                  <input id="line1" type="text" formControlName="line1" autocomplete="address-line1" placeholder="123 Main Street"
                         class="input-field" [class.input-error]="invalid('line1')" />
                  @if (invalid('line1')) {
                    <p class="mt-1.5 text-xs text-red-500">Street address is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
                  <input id="line2" type="text" formControlName="line2" autocomplete="address-line2" placeholder="Apt 4B" class="input-field" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input id="city" type="text" formControlName="city" autocomplete="address-level2" placeholder="Springfield"
                         class="input-field" [class.input-error]="invalid('city')" />
                  @if (invalid('city')) {
                    <p class="mt-1.5 text-xs text-red-500">City is required.</p>
                  }
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                    <input id="state" type="text" formControlName="state" autocomplete="address-level1" placeholder="IL"
                           class="input-field" [class.input-error]="invalid('state')" />
                    @if (invalid('state')) {
                      <p class="mt-1.5 text-xs text-red-500">Required.</p>
                    }
                  </div>
                  <div>
                    <label for="zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP code</label>
                    <input id="zip" type="text" formControlName="zip" autocomplete="postal-code" placeholder="62704"
                           class="input-field" [class.input-error]="invalid('zip')" />
                    @if (invalid('zip')) {
                      <p class="mt-1.5 text-xs text-red-500">Valid ZIP required.</p>
                    }
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <select id="country" formControlName="country" autocomplete="country-name" class="input-field">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Australia</option>
                    <option>United Arab Emirates</option>
                    <option>Saudi Arabia</option>
                    <option>Jordan</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Payment -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>

              <div class="mt-5 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Payment method">
                <!-- PayPal option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'paypal'" (click)="paymentMethod.set('paypal')"
                        class="rounded-2xl border-2 p-4 text-left transition-all duration-300"
                        [class]="paymentMethod() === 'paypal' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none">
                    <path d="M7.076 21.337H4.13a.64.64 0 01-.633-.74L6.222 3.384a.77.77 0 01.76-.65h6.673c2.217 0 3.916.472 4.933 1.404.95.87 1.322 2.083 1.106 3.72-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-.81 5.148-.15 1.31z" [attr.fill]="paymentMethod() === 'paypal' ? '#003087' : '#94a3b8'"/>
                    <path d="M19.62 7.858c-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-1.04 6.6a.54.54 0 00.534.625h2.79a.673.673 0 00.665-.568l.027-.142.526-3.336.034-.183a.673.673 0 01.665-.569h.418c2.712 0 4.835-1.101 5.455-4.288.26-1.33.126-2.442-.56-3.223a2.68 2.68 0 00-.856-.637z" [attr.fill]="paymentMethod() === 'paypal' ? '#0070E0' : '#cbd5e1'"/>
                  </svg>
                  <p class="text-sm font-bold text-slate-900">PayPal</p>
                  <p class="text-xs text-slate-400 mt-0.5">Fast &amp; buyer protected</p>
                </button>

                <!-- COD option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'cod'" (click)="paymentMethod.set('cod')"
                        class="rounded-2xl border-2 p-4 text-left transition-all duration-300"
                        [class]="paymentMethod() === 'cod' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" [class]="paymentMethod() === 'cod' ? 'text-violet-600' : 'text-slate-400'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm font-bold text-slate-900">Cash on Delivery</p>
                  <p class="text-xs text-slate-400 mt-0.5">Pay when it arrives</p>
                </button>
              </div>

              @if (paymentMethod() === 'paypal') {
                <div class="mt-6">
                  <p class="text-sm text-slate-600 mb-4">Click the button below to log in to PayPal and complete your purchase securely.</p>
                  
                  @if (form.valid) {
                    <!-- Render PayPal Button -->
                    <ngx-paypal [config]="payPalConfig"></ngx-paypal>
                  } @else {
                    <div class="rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                      Please fill in your Contact Information and Delivery Address above to unlock the PayPal checkout.
                    </div>
                  }
                </div>
              } @else {
                <div class="mt-6 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-5 flex items-center gap-4">
                  <svg class="w-8 h-8 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm text-slate-700 leading-relaxed">
                    Pay <span class="font-bold">{{ cart.total() | currency }}</span> in cash when your order arrives.
                    Please have the exact amount ready for the courier.
                  </p>
                </div>
                
                @if (form.invalid) {
                  <div class="mt-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                    Please fill in your Contact Information and Delivery Address above to place your order.
                  </div>
                }
              }
            </section>
          </div>

          <!-- â•â• Right column: sticky summary â•â• -->
          <aside class="lg:col-span-2 card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <ul class="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">
              @for (item of cart.items(); track item.productId + (item.color ?? '') + (item.size ?? '')) {
                <li class="flex items-center gap-3.5">
                  <div class="relative shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-1" />
                    <span class="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      {{ item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">{{ item.color }}{{ item.color && item.size ? ' Â· ' : '' }}{{ item.size }}</p>
                  </div>
                  <span class="text-sm font-bold text-slate-900 shrink-0">{{ item.price * item.quantity | currency }}</span>
                </li>
              }
            </ul>

            <dl class="mt-6 space-y-3 text-sm border-t border-slate-100 pt-5">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount ({{ cart.promo()?.code }})</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between">
                <dt class="text-slate-500">Shipping</dt>
                <dd class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Tax</dt>
                <dd class="font-semibold text-slate-900">{{ cart.tax() | currency }}</dd>
              </div>
              <div class="flex justify-between border-t border-slate-100 pt-4 text-lg">
                <dt class="font-bold text-slate-900">Total</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>

            @if (submitted() && form.invalid) {
              <div class="mt-5 rounded-xl bg-red-50 ring-1 ring-red-100 px-4 py-3 flex items-start gap-2.5">
                <svg class="w-4.5 h-4.5 w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p class="text-xs text-red-600 leading-relaxed">Please fix the highlighted fields above.</p>
              </div>
            }

            @if (paymentMethod() === 'cod') {
              <button type="submit" [disabled]="placing() || form.invalid" class="btn-primary w-full mt-6 py-4 sm:py-5 text-base sm:text-lg shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                @if (placing()) {
                  <svg class="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Placing orderâ€¦
                } @else {
                  Place Order â€” {{ cart.total() | currency }}
                }
              </button>
            }

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Protected by buyer guarantee Â· SSL encrypted
            </div>
          </aside>
        </form>
      </div>
    }
  `,
})
export class CheckoutComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly account = inject(AccountService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public payPalConfig?: IPayPalConfig;

  readonly paymentMethod = signal<PaymentMethod>('paypal');
  readonly placing = signal(false);
  readonly submitted = signal(false);

  readonly savedAddresses = this.account.addresses();

  readonly form = this.fb.group({
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    fullName: [this.defaultName(), Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\- ]{3,10}$/)]],
    country: ['United States', Validators.required],
  });

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb', 
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.cart.total().toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.cart.subtotal().toFixed(2)
                },
                tax_total: {
                  currency_code: 'USD',
                  value: this.cart.tax().toFixed(2)
                },
                shipping: {
                  currency_code: 'USD',
                  value: this.cart.shipping().toFixed(2)
                },
                discount: {
                  currency_code: 'USD',
                  value: this.cart.discount().toFixed(2)
                }
              }
            },
            items: this.cart.items().map(i => ({
              name: i.name,
              quantity: i.quantity.toString(),
              unit_amount: {
                currency_code: 'USD',
                value: i.price.toFixed(2),
              },
            }))
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        
        this.placing.set(true);
        actions.order.get().then((details: any) => {
          
        });
      },
      onClientAuthorization: (data) => {
        
        this.completeOrder('PayPal Transaction ID: ' + data.id);
      },
      onCancel: (data, actions) => {
        this.placing.set(false);
        this.toast.info('PayPal payment cancelled');
      },
      onError: err => {
        this.placing.set(false);
        this.toast.error('An error occurred during PayPal payment');
        console.log('PayPal Error', err);
      },
      onClick: (data, actions) => {
        
        this.submitted.set(true);
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.toast.error('Please complete your delivery address first.');
          
          
        }
      },
    };
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  useAddress(address: Address): void {
    this.form.patchValue({
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    });
    this.toast.info(`Address â€œ${address.label}â€ applied`);
  }

  placeOrder(): void {
    if (this.paymentMethod() !== 'cod') {
      return; 
    }

    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please complete the highlighted fields.');
      return;
    }

    this.placing.set(true);
    
    setTimeout(() => {
      this.completeOrder('Cash on Delivery');
    }, 900);
  }

  private completeOrder(paymentSummary: string): void {
    const v = this.form.getRawValue();
    const order = this.orders.placeOrder({
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      shipping: this.cart.shipping(),
      tax: this.cart.tax(),
      discount: this.cart.discount(),
      total: this.cart.total(),
      address: {
        id: 0,
        label: 'Shipping',
        fullName: v.fullName!,
        line1: v.line1!,
        line2: v.line2 || undefined,
        city: v.city!,
        state: v.state!,
        zip: v.zip!,
        country: v.country!,
        phone: v.phone!,
        isDefault: false,
      },
      paymentSummary,
    });
    this.cart.clear();
    this.placing.set(false);
    this.router.navigate(['/checkout/success', order.number]);
  }

  private defaultName(): string {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}`.trim() : '';
  }
}

``

## src\app\features\checkout\order-success.component.ts

``typescript
import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-success',
  imports: [CurrencyPipe, DatePipe, RouterLink, EmptyStateComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      @if (order(); as o) {
        <!-- Success header -->
        <div class="text-center">
          <div class="relative inline-flex mb-6">
            <div class="absolute inset-0 bg-emerald-300/50 rounded-full blur-2xl scale-125"></div>
            <div class="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-[pop_0.4s_ease-out]">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Order confirmed!</h1>
          <p class="mt-3 text-slate-500 leading-relaxed max-w-md mx-auto">
            Thank you for shopping with Budgetha. A confirmation email is on its way â€” your order is being prepared right now.
          </p>
          <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-50 ring-1 ring-violet-100 px-5 py-2">
            <span class="text-sm text-slate-500">Order number</span>
            <span class="text-sm font-bold text-violet-700 tracking-wide">{{ o.number }}</span>
          </div>
        </div>

        <!-- Order details card -->
        <div class="card mt-10 overflow-hidden">
          <div class="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/60">
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Order date</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.date | date: 'MMMM d, y' }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Payment</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ o.paymentSummary }}</p>
            </div>
            <div class="px-6 py-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Ships to</p>
              <p class="mt-1 text-sm font-bold text-slate-900 truncate">{{ o.shippingAddress }}</p>
            </div>
          </div>

          <ul class="divide-y divide-slate-100">
            @for (item of o.items; track item.productId + (item.color ?? '') + (item.size ?? '')) {
              <li class="flex items-center gap-4 px-6 py-4">
                <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Qty {{ item.quantity }}{{ item.color ? ' Â· ' + item.color : '' }}{{ item.size ? ' Â· ' + item.size : '' }}
                  </p>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
              </li>
            }
          </ul>

          <dl class="border-t border-slate-100 px-6 py-5 space-y-2.5 text-sm bg-slate-50/40">
            <div class="flex justify-between"><dt class="text-slate-500">Subtotal</dt><dd class="font-semibold text-slate-900">{{ o.subtotal | currency }}</dd></div>
            @if (o.discount > 0) {
              <div class="flex justify-between"><dt class="text-emerald-600">Discount</dt><dd class="font-semibold text-emerald-600">-{{ o.discount | currency }}</dd></div>
            }
            <div class="flex justify-between"><dt class="text-slate-500">Shipping</dt><dd class="font-semibold text-slate-900">{{ o.shipping === 0 ? 'Free' : (o.shipping | currency) }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Tax</dt><dd class="font-semibold text-slate-900">{{ o.tax | currency }}</dd></div>
            <div class="flex justify-between pt-3 border-t border-slate-200 text-base"><dt class="font-bold text-slate-900">Total</dt><dd class="font-extrabold text-slate-900">{{ o.total | currency }}</dd></div>
          </dl>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/account/orders" class="btn-secondary w-full sm:w-auto">Track My Orders</a>
          <a routerLink="/shop" class="btn-primary w-full sm:w-auto">Continue Shopping</a>
        </div>
      } @else {
        <div class="card">
          <app-empty-state
            icon="orders"
            title="Order not found"
            message="We couldn't find that order. It may belong to a different account or the link is incorrect."
            ctaLabel="View My Orders"
            ctaLink="/account/orders" />
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  `,
})
export class OrderSuccessComponent {
  private readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  private readonly orderNumber = toSignal(
    this.route.paramMap.pipe(map(params => params.get('number') ?? '')),
    { initialValue: '' }
  );

  readonly order = computed(() => this.orders.getByNumber(this.orderNumber()));
}

``

## src\app\features\home\home.component.ts

``typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  template: `
    <!-- â•â• Hero â•â• -->
    <section class="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800">
      <!-- Decorative blurs -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 right-10 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left">
          <span class="badge bg-white/10 text-teal-200 ring-1 ring-white/20 backdrop-blur px-4 py-1.5">
            Summer Sale â€” up to 40% off
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Shop smarter.<br />
            <span class="bg-gradient-to-r from-teal-300 to-teal-100 bg-clip-text text-transparent">Spend wiser.</span>
          </h1>
          <p class="mt-6 text-lg text-teal-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Discover hand-picked deals from 200+ trusted vendors. Premium quality, honest prices, delivered to your door.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a routerLink="/shop" class="btn-primary bg-teal-600 hover:bg-teal-500 px-8 py-4 text-base shadow-lg shadow-teal-950/40">
              Shop the Collection
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a routerLink="/shop" [queryParams]="{ deals: 1 }"
               class="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white
                      ring-1 ring-white/30 hover:bg-white/10 transition-all duration-300">
              Browse Deals
            </a>
          </div>

          <!-- Trust stats -->
          <div class="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">50K+</div>
              <div class="text-xs text-teal-200/70 mt-1">Happy Shoppers</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">200+</div>
              <div class="text-xs text-teal-200/70 mt-1">Trusted Vendors</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl font-bold text-white">4.9â˜…</div>
              <div class="text-xs text-teal-200/70 mt-1">Average Rating</div>
            </div>
          </div>
        </div>

        <!-- Hero product collage -->
        <div class="hidden lg:grid grid-cols-2 gap-5 relative">
          <div class="space-y-5 pt-10">
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Wireless headphones" class="aspect-[4/5] object-cover object-[75%_center] w-full" />
            </div>
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Order delivered</p>
                <p class="text-xs text-teal-100/70">2,341 orders shipped today</p>
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <div class="glass-card rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
              <div class="h-10 w-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Rated 4.9/5</p>
                <p class="text-xs text-teal-100/70">from 12,000+ reviews</p>
              </div>
            </div>
            <div class="card overflow-hidden rounded-3xl border-white/10 shadow-2xl shadow-teal-950/50 rotate-[2deg] hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Running sneakers" class="aspect-[4/5] object-cover w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- â•â• Value props â•â• -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div class="card grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-lg shadow-slate-200/60">
        @for (prop of valueProps; track prop.title) {
          <div class="flex items-center gap-4 p-6">
            <div class="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="prop.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">{{ prop.title }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ prop.text }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- â•â• Top categories â•â• -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p class="mt-1.5 text-sm text-slate-500">Browse our most popular departments</p>
        </div>
        <a routerLink="/shop" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        @for (category of categories(); track category.id) {
          <a
            [routerLink]="['/shop']"
            [queryParams]="{ category: category.slug }"
            class="group flex flex-col items-center text-center">
            <div class="relative w-full aspect-square max-w-[8.5rem] rounded-full overflow-hidden ring-4 ring-transparent
                        group-hover:ring-teal-200 shadow-md shadow-slate-200/80 transition-all duration-300">
              @if (category.image) {
                <img [src]="category.image" [alt]="category.name" loading="lazy"
                     class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              } @else {
                <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 group-hover:scale-110 transition-transform duration-500">
                  <span class="text-3xl font-bold">{{ category.name[0] }}</span>
                </div>
              }
              <div class="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors duration-300"></div>
            </div>
            <span class="mt-3 text-sm font-semibold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{{ category.name }}</span>
            <span class="text-xs text-slate-400">{{ category.productCount }} items</span>
          </a>
        }
      </div>
    </section>

    <!-- â•â• Featured deals â•â• -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Featured Deals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Hand-picked favorites at their best prices</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ deals: 1 }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          All deals
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        @for (product of featured(); track product.id) {
          <app-product-card [product]="product" layout="grid" />
        }
      </div>
    </section>

    <!-- â•â• Promo banner â•â• -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 to-teal-800 px-8 py-12 sm:px-14 sm:py-16">
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-20 left-1/4 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl"></div>
        <div class="relative max-w-xl">
          <span class="badge bg-white/15 text-white ring-1 ring-white/25 px-3 py-1">Limited time</span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get 20% off your next order</h2>
          <p class="mt-3 text-teal-50/90 leading-relaxed">
            Apply code <span class="font-bold bg-white/15 rounded-md px-2 py-0.5 tracking-wider">SAVE20</span> at checkout on any order. New arrivals included.
          </p>
          <a routerLink="/shop" class="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700
                                       hover:bg-teal-50 shadow-lg shadow-teal-950/30 transition-all duration-300">
            Claim the Deal
          </a>
        </div>
      </div>
    </section>

    <!-- â•â• New arrivals â•â• -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20 mb-4">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
          <p class="mt-1.5 text-sm text-slate-500">Fresh drops, just landed</p>
        </div>
        <a routerLink="/shop" [queryParams]="{ sort: 'newest' }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-300">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        @for (product of newArrivals(); track product.id) {
          <app-product-card [product]="product" layout="grid" />
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly featured = toSignal(this.productService.getFeatured(), { initialValue: [] });
  readonly newArrivals = toSignal(this.productService.getNewArrivals(), { initialValue: [] });

  readonly valueProps = [
    {
      title: 'Free & Fast Shipping',
      text: 'Free on all orders over $75',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    },
    {
      title: '30-Day Returns',
      text: 'No-questions-asked refunds',
      icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
    },
    {
      title: 'Secure Checkout',
      text: '256-bit SSL encrypted payments',
      icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    },
  ];
}

``

## src\app\features\info\info-page.component.ts

``typescript
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { INFO_PAGES, InfoPage } from '../../core/mocks/info-pages';


@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (content(); as page) {
      <div class="bg-gradient-to-b from-violet-50 to-white border-b border-slate-100">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
            <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
            <span aria-hidden="true">/</span>
            <span class="text-slate-500">{{ page.eyebrow }}</span>
          </nav>

          <p class="mt-6 text-xs font-bold uppercase tracking-widest text-violet-600">{{ page.eyebrow }}</p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{{ page.title }}</h1>
          @if (page.updated) {
            <p class="mt-2 text-xs text-slate-400">{{ page.updated }}</p>
          }
          <p class="mt-4 text-base sm:text-lg leading-relaxed text-slate-500">{{ page.intro }}</p>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div class="space-y-10">
          @for (section of page.sections; track section.heading) {
            <section>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">{{ section.heading }}</h2>
              <div class="mt-3 space-y-3">
                @for (paragraph of section.body; track paragraph) {
                  <p class="text-sm leading-relaxed text-slate-600">{{ paragraph }}</p>
                }
              </div>
            </section>
          }
        </div>

        <div class="card mt-12 p-6 sm:p-8 text-center">
          <h3 class="text-base font-bold text-slate-900">Still need a hand?</h3>
          <p class="mt-2 text-sm text-slate-500">Our support team replies within one business day.</p>
          <div class="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <a routerLink="/contact" class="btn-primary px-6">Contact support</a>
            <a routerLink="/shop" class="btn-secondary px-6">Continue shopping</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class InfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  
  private readonly key = toSignal(this.route.data.pipe(map(data => data['key'] as string)), {
    initialValue: this.route.snapshot.data['key'] as string,
  });

  protected readonly content = computed<InfoPage | null>(() => INFO_PAGES[this.key()] ?? null);
}

``

## src\app\features\not-found\not-found.component.ts

``typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <p class="text-[7rem] sm:text-[9rem] font-black leading-none text-gradient select-none">404</p>
      <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Page not found</h1>
      <p class="mt-3 text-slate-500 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Let's get you back to the good stuff.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <a routerLink="/" class="btn-primary px-8">Back to Home</a>
        <a routerLink="/shop" class="btn-secondary px-8">Browse Products</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}

``

## src\app\features\product-detail\product-detail.component.ts

``typescript
import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, Review } from '../../core/models/shop.models';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

type Tab = 'description' | 'specs' | 'reviews';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent, ProductCardComponent, EmptyStateComponent, FormsModule],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <!-- Breadcrumb -->
        <nav class="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <a routerLink="/" class="hover:text-violet-600 transition-colors duration-300">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-violet-600 transition-colors duration-300">Shop</a>
          <span>/</span>
          <a routerLink="/shop" [queryParams]="{ category: p.category }" class="hover:text-violet-600 transition-colors duration-300 capitalize">{{ categoryName() }}</a>
          <span>/</span>
          <span class="text-slate-600 font-medium truncate max-w-[16rem]">{{ p.name }}</span>
        </nav>

        <!-- â•â• Main section â•â• -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <!-- Gallery -->
          <div>
            <div class="card overflow-hidden aspect-square flex items-center justify-center p-6 bg-slate-50">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-scale-down mix-blend-multiply transition-opacity duration-300 p-4" />
            </div>
            <div class="mt-4 grid grid-cols-4 gap-3">
              @for (image of p.images; track image; let i = $index) {
                <button
                  type="button"
                  (click)="activeIndex.set(i)"
                  [attr.aria-label]="'View image ' + (i + 1)"
                  class="aspect-square rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-300 bg-slate-50 p-2 flex items-center justify-center"
                  [class]="activeIndex() === i ? 'ring-violet-600' : 'ring-transparent hover:ring-slate-300'">
                  <img [src]="image" [alt]="p.name + ' thumbnail ' + (i + 1)" class="h-full w-full object-scale-down mix-blend-multiply" />
                </button>
              }
            </div>
          </div>

          <!-- Buy panel -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              @if (p.isNew) {
                <span class="badge bg-violet-100 text-violet-700">New</span>
              }
              @if (discountPercent() > 0) {
                <span class="badge bg-rose-100 text-rose-600">Save {{ discountPercent() }}%</span>
              }
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{{ p.name }}</h1>

            <button type="button" (click)="activeTab.set('reviews'); scrollToTabs()" class="mt-3 flex items-center gap-2 w-fit group">
              <app-star-rating [rating]="averageRating()" size="md" />
              <span class="text-sm font-semibold text-slate-700">{{ averageRating() }}</span>
              <span class="text-sm text-slate-400 group-hover:text-violet-600 underline-offset-2 group-hover:underline transition-colors duration-300">
                {{ reviews().length }} reviews
              </span>
            </button>

            <div class="mt-5 flex items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900">{{ p.price | currency }}</span>
              @if (p.originalPrice) {
                <span class="text-lg text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
              }
            </div>

            <p class="mt-4 text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

            <!-- Stock indicator -->
            <div class="mt-4">
              @if (p.stock === 0) {
                <span class="badge bg-slate-100 text-slate-600">Out of stock</span>
              } @else if (p.stock <= 15) {
                <span class="badge bg-amber-100 text-amber-700 animate-pulse">Only {{ p.stock }} left in stock</span>
              } @else {
                <span class="badge bg-emerald-100 text-emerald-700">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  In stock, ready to ship
                </span>
              }
            </div>

            <!-- Color swatches -->
            @if (p.colors?.length) {
              <div class="mt-6">
                <span class="text-sm font-semibold text-slate-900">
                  Color: <span class="font-normal text-slate-500">{{ selectedColor() }}</span>
                </span>
                <div class="mt-3 flex gap-3">
                  @for (color of (p.colors || []); track color.name) {
                    <button
                      type="button"
                      (click)="selectedColor.set(color.name)"
                      [attr.aria-label]="'Select color ' + color.name"
                      [attr.aria-pressed]="selectedColor() === color.name"
                      class="h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all duration-300 border border-slate-200"
                      [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                      [style.background-color]="color.hex"></button>
                  }
                </div>
              </div>
            }

            <!-- Size pills -->
            @if (p.sizes.length) {
              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-900">Size: <span class="font-normal text-slate-500">{{ selectedSize() || 'Select a size' }}</span></span>
                  <button type="button" class="text-xs font-medium text-violet-600 hover:text-violet-500 underline underline-offset-2 transition-colors duration-300">Size guide</button>
                </div>
                <div class="mt-3 flex flex-wrap gap-2.5">
                  @for (size of p.sizes; track size) {
                    <button
                      type="button"
                      (click)="selectedSize.set(size)"
                      [attr.aria-pressed]="selectedSize() === size"
                      class="min-w-[3rem] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300"
                      [class]="selectedSize() === size
                        ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'">
                      {{ size }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Quantity + CTAs -->
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
                <button type="button" (click)="decrement()" [disabled]="quantity() <= 1" aria-label="Decrease quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                </button>
                <span class="w-12 text-center text-base font-bold text-slate-900" aria-live="polite">{{ quantity() }}</span>
                <button type="button" (click)="increment()" [disabled]="quantity() >= p.stock" aria-label="Increase quantity" class="qty-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1 py-3.5 text-base gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {{ p.stock === 0 ? 'Out of stock' : 'Add to Cart â€” ' + (p.price * quantity() | currency) }}
              </button>

              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="h-[3.25rem] w-[3.25rem] rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0"
                [class]="inWishlist()
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200'">
                <svg class="w-6 h-6" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <!-- Trust rows -->
            <div class="mt-8 card divide-y divide-slate-100">
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free delivery</span> on orders over $75 Â· arrives in 2â€“4 business days</p>
              </div>
              <div class="flex items-center gap-3 px-5 py-3.5">
                <svg class="w-5 h-5 text-violet-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <p class="text-sm text-slate-600"><span class="font-semibold text-slate-900">Free 30-day returns</span> â€” no questions asked</p>
              </div>
            </div>
          </div>
        </div>

        <!-- â•â• Tabs â•â• -->
        <div class="mt-14" id="product-tabs">
          <div class="border-b border-slate-200 flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product information">
            @for (tab of tabs; track tab.key) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.key"
                (click)="activeTab.set(tab.key)"
                class="relative px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                [class]="activeTab() === tab.key ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'">
                {{ tab.label }}
                @if (tab.key === 'reviews') {
                  <span class="ml-1.5 badge bg-slate-100 text-slate-500">{{ reviews().length }}</span>
                }
                @if (activeTab() === tab.key) {
                  <span class="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-violet-600"></span>
                }
              </button>
            }
          </div>

          <div class="py-8">
            @switch (activeTab()) {
              <!-- Description -->
              @case ('description') {
                <div class="grid lg:grid-cols-5 gap-10">
                  <div class="lg:col-span-3">
                    <h2 class="text-lg font-bold text-slate-900 mb-4">About this product</h2>
                    <p class="text-slate-600 leading-relaxed">{{ p.description }}</p>
                  </div>
                  <div class="lg:col-span-2">
                    <h3 class="text-lg font-bold text-slate-900 mb-4">Highlights</h3>
                    <ul class="space-y-3">
                      @for (feature of (p.features || []); track feature) {
                        <li class="flex items-start gap-3">
                          <span class="mt-0.5 h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span class="text-sm text-slate-600 leading-relaxed">{{ feature }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- Specifications -->
              @case ('specs') {
                <div class="card overflow-hidden max-w-3xl">
                  <table class="w-full text-sm">
                    <tbody>
                      @for (spec of (p.specs || []); track spec.label; let even = $even) {
                        <tr [class]="even ? 'bg-slate-50/70' : 'bg-white'">
                          <th scope="row" class="text-left font-semibold text-slate-700 px-6 py-3.5 w-1/3">{{ spec.label }}</th>
                          <td class="text-slate-600 px-6 py-3.5">{{ spec.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Reviews -->
              @case ('reviews') {
                <div class="grid lg:grid-cols-3 gap-10">
                  <!-- Ratings summary -->
                  <div class="lg:col-span-1">
                    <div class="card p-6 lg:sticky lg:top-24">
                      <div class="flex items-end gap-3">
                        <span class="text-5xl font-extrabold text-slate-900 leading-none">{{ averageRating() }}</span>
                        <div class="pb-1">
                          <app-star-rating [rating]="averageRating()" size="md" />
                          <p class="mt-1 text-xs text-slate-400">Based on {{ reviews().length }} reviews</p>
                        </div>
                      </div>

                      <!-- Star distribution -->
                      <div class="mt-6 space-y-2.5">
                        @for (bucket of ratingBuckets(); track bucket.stars) {
                          <div class="flex items-center gap-3">
                            <span class="text-xs font-medium text-slate-600 w-10 shrink-0">{{ bucket.stars }} star</span>
                            <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" [style.width.%]="bucket.percent"></div>
                            </div>
                            <span class="text-xs text-slate-400 w-9 text-right shrink-0">{{ bucket.percent }}%</span>
                          </div>
                        }
                      </div>

                      @if (authService.isAuthenticated()) {
                        <div class="mt-8 border-t border-slate-100 pt-6">
                          <h3 class="font-bold text-sm mb-3">Write a Review</h3>
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="newReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= newReviewRating() ? 'text-amber-400' : 'text-slate-200'">â˜…</button>
                            }
                          </div>
                          <textarea [(ngModel)]="newReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3" placeholder="Share your thoughts..."></textarea>
                          <button type="button" (click)="submitReview()" [disabled]="isSubmittingReview()" class="btn-primary w-full disabled:opacity-50">Submit Review</button>
                        </div>
                      } @else {
                        <button type="button" routerLink="/login" class="btn-primary w-full mt-6">Log in to Review</button>
                      }
                    </div>
                  </div>

                  <!-- Review cards -->
                  <div class="lg:col-span-2 space-y-5">
                    @if (reviews().length === 0) {
                      <app-empty-state
                        icon="reviews"
                        title="No reviews yet"
                        message="Be the first to share your experience with this product â€” your review helps other shoppers decide." />
                    }
                    @for (review of reviews(); track review.id) {
                      <article class="card p-6">
                        @if (isEditingReview() === review.id) {
                          <div class="flex items-center gap-1 mb-4">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button type="button" (click)="editReviewRating.set(star)" class="text-2xl transition-colors" [class]="star <= editReviewRating() ? 'text-amber-400' : 'text-slate-200'">â˜…</button>
                            }
                          </div>
                          <textarea [(ngModel)]="editReviewComment" rows="3" class="w-full rounded-xl border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500 mb-3"></textarea>
                          <div class="flex gap-2">
                            <button type="button" (click)="saveEdit()" class="btn-primary flex-1 py-2 text-sm">Save</button>
                            <button type="button" (click)="cancelEdit()" class="px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                          </div>
                        } @else {
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                              <span class="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {{ review.initials }}
                              </span>
                              <div>
                                <p class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  {{ review.author }}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">{{ review.date }}</p>
                              </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                              <app-star-rating [rating]="review.rating" size="sm" />
                              <div class="flex items-center gap-2">
                                @if (review.isAuthor) {
                                  <button type="button" (click)="startEdit(review)" class="text-xs text-violet-600 font-medium hover:underline">Edit</button>
                                }
                                @if (review.isAuthor || isAdmin()) {
                                  <button type="button" (click)="deleteReview(review.id)" class="text-xs text-rose-500 font-medium hover:underline">Delete</button>
                                }
                              </div>
                            </div>
                          </div>
                          @if (review.title) {
                            <h3 class="mt-4 text-sm font-bold text-slate-900">{{ review.title }}</h3>
                          }
                          <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ review.comment }}</p>
                        }
                      </article>
                    }
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <!-- â•â• Related products â•â• -->
        <section class="mt-10">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-6">You might also like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (related of relatedProducts(); track related.id) {
              <app-product-card [product]="related" layout="grid" />
            }
          </div>
        </section>
      </div>
    } @else {
      <!-- Product not found -->
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="search"
            title="Product not found"
            message="The product you're looking for may have been removed or the link is incorrect."
            ctaLabel="Back to Shop"
            ctaLink="/shop" />
        </div>
      </div>
    }

    <!-- Confirmation Modal -->
    @if (confirmDeleteReviewId()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Review</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this review?
              <br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDeleteReview()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly product = signal<Product | undefined>(undefined);
  readonly confirmDeleteReviewId = signal<string | number | null>(null);
  readonly activeIndex = signal(0);
  readonly selectedColor = signal('');
  readonly selectedSize = signal('');
  readonly quantity = signal(1);
  readonly activeTab = signal<Tab>('description');
  readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  readonly relatedProducts = signal<Product[]>([]);

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: 'Customer Reviews' },
  ];

  readonly activeImage = computed(() => {
    const p = this.product();
    return p && p.images && p.images.length ? p.images[Math.min(this.activeIndex(), p.images.length - 1)] : '';
  });

  readonly inWishlist = computed(() => {
    const p = this.product();
    return !!p && this.wishlist.ids().includes(p.id);
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  readonly categoryName = computed(() => {
    const p = this.product();
    const cats = this.categories();
    return p
      ? cats.find(c => c.slug === p.category)?.name ?? p.category
      : '';
  });

  private readonly reviewService = inject(ReviewService);
  readonly authService = inject(AuthService);

  readonly reviews = signal<Review[]>([]);
  readonly isSubmittingReview = signal(false);
  readonly newReviewRating = signal(5);
  readonly newReviewComment = signal('');
  
  readonly isEditingReview = signal<string | number | null>(null);

  readonly isAdmin = computed(() => {
    const roles = this.authService.user()?.roles || [];
    return roles.includes('Admin') || roles.includes('SuperAdmin');
  });
  readonly editReviewRating = signal(5);
  readonly editReviewComment = signal('');

  private hubConnection?: signalR.HubConnection;

  readonly ratingBuckets = computed(() => {
    const revs = this.reviews();
    const total = revs.length;
    return [5, 4, 3, 2, 1].map(stars => {
      const count = revs.filter(r => r.rating === stars).length;
      return {
        stars,
        count,
        percent: total ? Math.round((count / total) * 100) : 0
      };
    });
  });
  
  readonly averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / revs.length).toFixed(1));
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const slug = params.get('slug') ?? '';
      if (slug) {
        this.productService.getBySlug(slug).subscribe(product => {
          this.product.set(product);
          this.activeIndex.set(0);
          this.quantity.set(1);
          this.activeTab.set('description');
          this.selectedColor.set(product?.colors?.[0]?.name ?? '');
          this.selectedSize.set(product?.sizes?.[0] ?? '');
          window.scrollTo({ top: 0 });

          if (product) {
            this.productService.getRelated(product).subscribe(related => {
              this.relatedProducts.set(related);
            });
            this.reviewService.getReviews(product.id.toString()).subscribe(revs => {
              this.reviews.set(revs);
            });
            
            // Setup SignalR
            if (this.hubConnection) {
              this.hubConnection.stop();
            }
            this.hubConnection = new signalR.HubConnectionBuilder()
              .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/reviews`)
              .withAutomaticReconnect()
              .build();
              
            this.hubConnection.on('ReviewsUpdated', () => {
              this.reviewService.getReviews(product.id.toString()).subscribe(revs => {
                this.reviews.set(revs);
              });
            });
            
            this.hubConnection.start().then(() => {
              this.hubConnection?.invoke('JoinProductGroup', product.id.toString());
            }).catch(err => console.error('Error connecting to SignalR', err));

          } else {
             this.relatedProducts.set([]);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  increment(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update(q => Math.min(q + 1, stock));
  }

  decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p || p.stock === 0) return;
    this.cart.add(p, this.quantity(), this.selectedColor() || undefined, this.selectedSize() || undefined);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p.id, p.name);
  }

  scrollToTabs(): void {
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  }

  submitReview(): void {
    const p = this.product();
    if (!p) return;
    this.isSubmittingReview.set(true);
    this.reviewService.addReview({
      productId: p.id.toString(),
      rating: this.newReviewRating(),
      comment: this.newReviewComment()
    }).subscribe({
      next: () => {
        this.newReviewComment.set('');
        this.newReviewRating.set(5);
        this.isSubmittingReview.set(false);
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.isSubmittingReview.set(false)
    });
  }

  startEdit(review: Review): void {
    this.isEditingReview.set(review.id);
    this.editReviewRating.set(review.rating);
    this.editReviewComment.set(review.comment || '');
  }

  cancelEdit(): void {
    this.isEditingReview.set(null);
  }

  saveEdit(): void {
    const p = this.product();
    const id = this.isEditingReview();
    if (!p || !id) return;
    
    this.reviewService.updateReview(id.toString(), {
      reviewId: id.toString(),
      rating: this.editReviewRating(),
      comment: this.editReviewComment()
    }).subscribe({
      next: () => {
        this.isEditingReview.set(null);
        this.toastService.success('Review updated successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to update review.')
    });
  }

  deleteReview(id: string | number): void {
    this.confirmDeleteReviewId.set(id);
  }

  closeConfirmModal(): void {
    this.confirmDeleteReviewId.set(null);
  }

  executeDeleteReview(): void {
    const id = this.confirmDeleteReviewId();
    if (!id) return;
    
    this.closeConfirmModal();

    const p = this.product();
    if (!p) return;
    
    this.reviewService.deleteReview(id.toString()).subscribe({
      next: () => {
        this.toastService.success('Review deleted successfully.');
        this.reviewService.getReviews(p.id.toString()).subscribe(revs => this.reviews.set(revs));
      },
      error: () => this.toastService.error('Failed to delete review.')
    });
  }
}

``

## src\app\layout\cart-drawer\cart-drawer.component.ts

``typescript
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/shop.models';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe],
  template: `
    @if (cart.drawerOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="cart.closeDrawer()"
        aria-hidden="true"></div>

      <!-- Drawer panel -->
      <aside
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            Your Cart
            @if (cart.count() > 0) {
              <span class="badge bg-violet-100 text-violet-700">{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }}</span>
            }
          </h2>
          <button type="button" (click)="cart.closeDrawer()" aria-label="Close cart" class="icon-btn h-9 w-9 bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (cart.items().length === 0) {
          <!-- Empty state -->
          <div class="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-violet-200/60 rounded-full blur-2xl scale-110"></div>
              <div class="relative w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-50 rounded-full flex items-center justify-center ring-1 ring-violet-100">
                <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">Looks like you haven't added anything yet. Discover deals waiting for you.</p>
            <button type="button" (click)="goTo('/shop')" class="btn-primary mt-6">Start Shopping</button>
          </div>
        } @else {
          <!-- Free shipping progress -->
          @if (cart.amountToFreeShipping() > 0) {
            <div class="px-5 pt-4">
              <p class="text-xs text-slate-500 mb-2">
                You're <span class="font-semibold text-violet-700">{{ cart.amountToFreeShipping() | currency }}</span> away from <span class="font-semibold">free shipping</span>
              </p>
              <div class="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" [style.width.%]="shippingProgress()"></div>
              </div>
            </div>
          } @else {
            <div class="px-5 pt-4">
              <p class="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Congratulations â€” your order ships free!
              </p>
            </div>
          }

          <!-- Items -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            @for (item of cart.items(); track trackItem(item)) {
              <div class="flex gap-4 group">
                <img [src]="item.image" [alt]="item.name" class="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ item.color }}{{ item.color && item.size ? ' Â· ' : '' }}{{ item.size }}
                      </p>
                    </div>
                    <button
                      type="button"
                      (click)="cart.remove(item)"
                      [attr.aria-label]="'Remove ' + item.name"
                      class="icon-btn h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity - 1)" [attr.aria-label]="'Decrease quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14" /></svg>
                      </button>
                      <span class="w-8 text-center text-sm font-semibold text-slate-900">{{ item.quantity }}</span>
                      <button type="button" (click)="cart.updateQuantity(item, item.quantity + 1)" [disabled]="item.quantity >= item.stock" [attr.aria-label]="'Increase quantity of ' + item.name" class="qty-btn h-7 w-7">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                    <span class="text-sm font-bold text-slate-900">{{ item.price * item.quantity | currency }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/60">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Subtotal</span>
              <span class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</span>
            </div>
            @if (cart.discount() > 0) {
              <div class="flex justify-between text-sm">
                <span class="text-emerald-600">Discount ({{ cart.promo()?.code }})</span>
                <span class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</span>
              </div>
            }
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Shipping</span>
              <span class="font-semibold" [class]="cart.shipping() === 0 ? 'text-emerald-600' : 'text-slate-900'">
                {{ cart.shipping() === 0 ? 'Free' : (cart.shipping() | currency) }}
              </span>
            </div>
            <div class="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{{ cart.total() | currency }}</span>
            </div>
            <p class="text-[11px] text-slate-400">Tax included: {{ cart.tax() | currency }}. Shipping calculated at checkout.</p>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <button type="button" (click)="goTo('/cart')" class="btn-secondary py-3">View Cart</button>
              <button type="button" (click)="goTo('/checkout')" class="btn-primary py-3">Checkout</button>
            </div>
          </div>
        }
      </aside>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  `,
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  trackItem(item: CartItem): string {
    return `${item.productId}-${item.color ?? ''}-${item.size ?? ''}`;
  }

  shippingProgress(): number {
    const subtotal = this.cart.subtotal() - this.cart.discount();
    return Math.min(100, (subtotal / 75) * 100);
  }

  goTo(path: string): void {
    this.cart.closeDrawer();
    this.router.navigate([path]);
  }
}

``

## src\app\layout\footer\footer.component.ts

``typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallButtonComponent } from '../../shared/components/install-button/install-button.component';
import { ToastService } from '../../core/services/toast.service';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, InstallButtonComponent],
  template: `
    <footer class="bg-slate-900 text-slate-300 mt-20">
      <!-- Newsletter strip -->
      <div class="border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 class="text-xl font-bold text-white">Stay in the loop</h3>
            <p class="mt-1 text-sm text-slate-400">Get early access to deals, new arrivals, and exclusive promo codes.</p>
          </div>
          <form class="flex w-full lg:w-auto gap-3" (submit)="subscribe($event)">
            <input
              type="email"
              name="newsletterEmail"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              class="flex-1 lg:w-80 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                     transition-all duration-300" />
            <button type="submit" class="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      <!-- Link columns -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div class="col-span-2 lg:col-span-2">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
              <img src="/images/logo.png" alt="Budgetha" class="h-10 w-auto object-contain" />
            </div>
            <span class="text-3xl font-black text-white tracking-tighter" style="font-family: 'Outfit', sans-serif;">Budgetha</span>
          </div>
          <p class="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
            Shop smarter, spend wiser. Budgetha brings the best deals from 200+ trusted vendors into one beautiful storefront.
          </p>
          <div class="mt-5 flex gap-3">
            @for (social of socials; track social.label) {
              <a
                [href]="social.href"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="social.label"
                class="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400
                       hover:bg-violet-600 hover:text-white transition-all duration-300">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="social.icon" />
                </svg>
              </a>
            }
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Shop</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/shop" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">All Products</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'electronics' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Electronics</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'fashion' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Fashion</a></li>
            <li><a routerLink="/shop" [queryParams]="{ deals: 1 }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Deals</a></li>
            <li><a routerLink="/shop" [queryParams]="{ sort: 'newest' }" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Account</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/account/orders" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">My Orders</a></li>
            <li><a routerLink="/account/addresses" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Addresses</a></li>
            <li><a routerLink="/account/payments" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Payment Methods</a></li>
            <li><a routerLink="/cart" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Cart</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
          <ul class="mt-4 space-y-2.5">
            <li><a routerLink="/help" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Help Center</a></li>
            <li><a routerLink="/shipping-returns" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Shipping &amp; Returns</a></li>
            <li><a routerLink="/warranty" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Warranty</a></li>
            <li><a routerLink="/contact" class="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-300">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <!-- Install prompt (hides itself, and its spacing, once installed or dismissed) -->
      @if (pwa.showInstallAffordance()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 pb-12 -mt-4">
          <app-install-button variant="footer" />
        </div>
      }

      <!-- Bottom bar -->
      <div class="border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-slate-500">Â© 2026 Mohammad Alghazo. All rights reserved.</p>
          <div class="flex items-center gap-5">
            <a routerLink="/legal/privacy" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Privacy Policy</a>
            <a routerLink="/legal/terms" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Terms of Service</a>
            <a routerLink="/legal/cookies" class="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly pwa = inject(PwaService);
  private readonly toast = inject(ToastService);

  
  subscribe(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('newsletterEmail') as HTMLInputElement | null;
    const email = input?.value.trim() ?? '';

    if (!email) {
      this.toast.warning('Please enter your email address to subscribe.');
      input?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.toast.warning('That doesnâ€™t look like a valid email address.');
      input?.focus();
      return;
    }

    this.toast.success('Youâ€™re on the list â€” watch your inbox for early access to deals.');
    form.reset();
  }

  readonly socials = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mohammad-alghazo-106506288/',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/MohammadAlghazo',
      icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    },
    {
      label: 'Portfolio',
      href: 'https://mohammadalghazo.pages.dev/',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/962772913081',
      icon: 'M11.979 0C5.352 0 .001 5.376.001 11.978c0 2.277.625 4.496 1.796 6.368l-1.792 6.551 6.643-1.758c1.787 1.042 3.842 1.586 5.925 1.586 6.623 0 11.985-5.375 11.985-11.977C23.978 5.376 18.601 0 11.979 0zM12 21.056c-1.865 0-3.69-.512-5.283-1.472l-.379-.228-3.921 1.037 1.045-3.856-.251-.403a9.789 9.789 0 0 1-1.512-5.263C1.699 6.425 6.182 2.022 12 2.022c5.819 0 10.301 4.403 10.301 9.849S17.819 21.056 12 21.056zm5.666-7.854c-.31-.156-1.837-.923-2.12-.1029-.284-.106-.492-.156-.698.156-.206.312-.801.995-.98 1.198-.182.202-.363.228-.674.072-2.13-.996-3.23-1.921-4.482-4.043-.182-.311-.02-.48.136-.636.14-.14.31-.362.464-.543.155-.181.206-.311.31-.518.103-.207.052-.389-.026-.544-.078-.156-.698-1.711-.956-2.345-.252-.619-.508-.535-.698-.544-.181-.009-.389-.011-.595-.011-.207 0-.543.078-.828.389-.284.311-1.087 1.077-1.087 2.622s1.112 3.036 1.267 3.243c.155.207 2.186 3.42 5.371 4.707 2.217.896 3.045.96 4.148.814 1.103-.147 3.504-1.442 3.996-2.836.491-1.393.491-2.585.344-2.836-.147-.251-.543-.404-.854-.56z',
    },
  ];
}

``

## src\app\layout\header\header.component.ts

``typescript
import { Component, HostListener, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { PwaService } from '../../core/services/pwa.service';
import { ToastService } from '../../core/services/toast.service';
import { InstallButtonComponent } from '../../shared/components/install-button/install-button.component';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, InstallButtonComponent],
  template: `
    <!-- Announcement bar -->
    @if (announcement()) {
      <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 text-white text-center text-xs sm:text-sm font-medium py-2 px-4 transition-all duration-300">
        @if (announcement()?.linkUrl) {
          <a [href]="announcement()?.linkUrl" class="hover:underline">{{ announcement()?.message }}</a>
        } @else {
          {{ announcement()?.message }}
        }
      </div>
    }

    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm shadow-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between gap-4 h-16 lg:h-[4.5rem]">
          <!-- Left: mobile hamburger + logo -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle menu"
              class="lg:hidden icon-btn h-10 w-10">
              @if (mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              }
            </button>

            <a routerLink="/" class="flex items-center gap-2 group -ml-3">
              <img src="/images/logo.png" alt="Budgetha" class="h-16 w-auto object-contain" />
              <span class="text-3xl font-black text-slate-900 tracking-tighter hidden sm:block" style="font-family: 'Outfit', sans-serif; padding-top: 4px;">Budgetha</span>
            </a>
          </div>

          <!-- Center: desktop nav -->
          <nav class="hidden lg:flex items-center gap-1" aria-label="Primary">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                [queryParams]="link.query"
                routerLinkActive="text-teal-700 bg-teal-50"
                [routerLinkActiveOptions]="{ exact: link.exact }"
                class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300">
                {{ link.label }}
              </a>
            }
          </nav>

          <!-- Right: search + actions -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- Install as app (hidden once installed or dismissed) -->
            <app-install-button variant="header" />

            <!-- Desktop search -->
            <form (submit)="$event.preventDefault()" class="hidden md:block relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                name="search"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Search productsâ€¦"
                aria-label="Search products"
                class="w-44 lg:w-64 rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20
                       focus:border-teal-500 focus:bg-white transition-all duration-300" />
            </form>

            <!-- Wishlist -->
            <a routerLink="/shop" [queryParams]="{ wishlist: 1 }" aria-label="Wishlist" class="icon-btn h-10 w-10 relative">
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              @if (wishlistCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {{ wishlistCount() }}
                </span>
              }
            </a>

            <!-- Cart -->
            <button type="button" (click)="cart.openDrawer()" aria-label="Open cart" class="icon-btn h-10 w-10 relative">
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              @if (cartCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {{ cartCount() }}
                </span>
              }
            </button>

            <!-- User menu -->
            @if (auth.isAuthenticated()) {
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleUserMenu($event)"
                  [attr.aria-expanded]="userMenuOpen()"
                  aria-label="Account menu"
                  class="flex items-center gap-2 rounded-full pl-1 pr-1 sm:pr-3 py-1 hover:bg-slate-100 transition-colors duration-300">
                  <span class="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-bold flex items-center justify-center">
                    {{ initials() }}
                  </span>
                  <svg class="hidden sm:block w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                @if (userMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-64 card p-2 bg-white shadow-xl shadow-slate-200/80 animate-[menuIn_0.15s_ease-out] z-50" (click)="$event.stopPropagation()">
                    <div class="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
                      <p class="text-xs text-slate-400 break-all">{{ auth.user()?.email }}</p>
                    </div>
                    @if (auth.user()?.roles?.includes('Admin') || auth.user()?.roles?.includes('SuperAdmin') || auth.user()?.roles?.includes('Seller')) {
                      <a
                        routerLink="/admin"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors duration-200 mb-1 font-medium">
                        {{ auth.user()?.roles?.includes('Seller') && !auth.user()?.roles?.includes('Admin') && !auth.user()?.roles?.includes('SuperAdmin') ? 'Seller Dashboard' : 'Admin Dashboard' }}
                      </a>
                    }

                    @for (item of accountLinks; track item.path) {
                      <a
                        [routerLink]="item.path"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200">
                        {{ item.label }}
                      </a>
                    }
                    <button
                      type="button"
                      (click)="logout()"
                      class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-200 mt-1 border-t border-slate-100 pt-2.5">
                      Sign out
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a
                routerLink="/auth/login"
                class="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300">
                Sign in
              </a>
              <a routerLink="/auth/register" class="btn-primary px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm ml-1">Sign up</a>
            }
          </div>
        </div>

        <!-- Mobile search -->
        <form (submit)="$event.preventDefault()" class="md:hidden pb-3 relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-[calc(50%+0.375rem)] w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            name="search-mobile"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search productsâ€¦"
            aria-label="Search products"
            class="w-full rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm
                   placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20
                   focus:border-teal-500 focus:bg-white transition-all duration-300" />
        </form>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <nav class="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-[menuIn_0.2s_ease-out]" aria-label="Mobile">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              [queryParams]="link.query"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="text-teal-700 bg-teal-50"
              [routerLinkActiveOptions]="{ exact: link.exact }"
              class="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200">
              {{ link.label }}
            </a>
          }

          @if (!auth.isAuthenticated()) {
            <div class="pt-2 mt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" class="btn-secondary py-3">Sign in</a>
              <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" class="btn-primary py-3">Sign up</a>
            </div>
          }

          @if (pwa.showInstallAffordance()) {
            <button
              type="button"
              (click)="installApp()"
              class="mt-2 w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors duration-200">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13.5m0 0l4.5-4.5M12 16.5L7.5 12M3.75 18.75h16.5" />
              </svg>
              Install Budgetha app
            </button>
          }
        </nav>
      }
    </header>
  `,
  styles: `
    @keyframes menuIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  `,
})
export class HeaderComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly pwa = inject(PwaService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly toast = inject(ToastService);
  private readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);

  readonly announcement = signal<Announcement | null>(null);
  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);
  searchTerm = '';
  private searchSubject = new Subject<string>();

  readonly cartCount = this.cart.count;
  readonly wishlistCount = this.wishlist.count;

  readonly navLinks = [
    { label: 'Home', path: '/', query: {}, exact: true },
    { label: 'Shop', path: '/shop', query: {}, exact: true },
    { label: 'Electronics', path: '/shop', query: { category: 'electronics' }, exact: false },
    { label: 'Fashion', path: '/shop', query: { category: 'fashion' }, exact: false },
    { label: 'Deals', path: '/shop', query: { deals: 1 }, exact: false },
  ];

  readonly accountLinks = [
    { label: 'My Orders', path: '/account/orders' },
    { label: 'Saved Addresses', path: '/account/addresses' },
    { label: 'Account Settings', path: '/account/settings' },
  ];

  readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
  });

  ngOnInit() {
    this.announcementService.getActive().subscribe(data => {
      this.announcement.set(data);
    });
    
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.router.navigate(['/shop'], { queryParams: { search: term || null } });
    });
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen.update(v => !v);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
    this.toast.success('Youâ€™ve been signed out.');
  }

  installApp(): void {
    this.mobileMenuOpen.set(false);
    void this.pwa.install();
  }
}

``

## src\app\layout\shell\shell.component.ts

``typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';
import { QuickViewComponent } from '../../shared/components/quick-view/quick-view.component';
import { OfflineBannerComponent } from '../../shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CartDrawerComponent, QuickViewComponent, OfflineBannerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <app-offline-banner />
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-cart-drawer />
      <app-quick-view />
    </div>
  `,
})
export class ShellComponent {}

``

## src\app\shared\components\auth-slider\auth-slider.component.ts

``typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-[340px] relative mx-auto mt-8 mb-12 h-[170px]">
      
      <!-- The Slider Track -->
      <div class="w-full h-full relative">
        <div *ngFor="let card of cards; let i = index" 
             class="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center" 
             [ngStyle]="getCardStyle(i)">
          
          <div class="relative backdrop-blur-2xl p-5 rounded-2xl shadow-2xl w-full h-full border flex flex-col justify-between"
               [ngClass]="card.bgClass">
            
            <div class="flex gap-4 items-start mb-2">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                   [ngClass]="card.iconBgClass">
                <i class="w-6 h-6 flex items-center justify-center" [ngClass]="card.iconColorClass" [innerHTML]="card.icon"></i>
              </div>
              <div>
                <div class="text-white font-bold text-lg leading-tight">{{ card.title }}</div>
                <div class="text-sm mt-1" [ngClass]="card.subtitleColorClass">{{ card.subtitle }}</div>
              </div>
            </div>
            
            <div class="flex justify-between items-end mt-auto">
              <div class="text-sm font-medium text-white/90 leading-snug" [innerHTML]="card.description"></div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Floating Buttons -->
      <button type="button" (click)="prevCard()" class="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <button type="button" (click)="nextCard()" class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      <!-- Slider Dots -->
      <div class="absolute -bottom-8 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-4">
        <button type="button" *ngFor="let dot of cards; let i = index" 
                (click)="currentCardIndex.set(i)"
                class="h-2 rounded-full transition-all duration-300 ease-out"
                [class.bg-teal-400]="currentCardIndex() === i"
                [class.w-4]="currentCardIndex() === i"
                [class.w-2]="currentCardIndex() !== i"
                [class.bg-white]="currentCardIndex() !== i"
                [class.opacity-40]="currentCardIndex() !== i"
                [class.hover:opacity-70]="currentCardIndex() !== i">
        </button>
      </div>
    </div>
  `
})
export class AuthSliderComponent {
  currentCardIndex = signal(0);

  cards = [
    {
      title: 'Premium Quality',
      subtitle: 'Verified Products',
      description: 'We ensure all products meet the highest quality standards before reaching you.',
      bgClass: 'bg-white/10 border-white/20',
      iconBgClass: 'bg-teal-500/20 border-teal-500/30',
      iconColorClass: 'text-teal-300',
      subtitleColorClass: 'text-teal-200/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
    },
    {
      title: 'Lightning Fast',
      subtitle: 'Express Delivery',
      description: 'Get your orders delivered to your doorstep in record time.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-amber-500/20 border-amber-500/30',
      iconColorClass: 'text-amber-300',
      subtitleColorClass: 'text-amber-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
    },
    {
      title: 'Endless Variety',
      subtitle: 'From Electronics to Home',
      description: 'Explore thousands of items across multiple categories all in one place.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-blue-500/20 border-blue-500/30',
      iconColorClass: 'text-blue-300',
      subtitleColorClass: 'text-blue-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>'
    },
    {
      title: 'Built by',
      subtitle: 'Mohammad Alghazo',
      description: 'Budgetha is passionately crafted to deliver a seamless shopping experience.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-rose-500/20 border-rose-500/30',
      iconColorClass: 'text-rose-300',
      subtitleColorClass: 'text-rose-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'
    },
    {
      title: 'Secure Payments',
      subtitle: '100% Protected',
      description: 'Your transactions are guarded with industry-leading encryption.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-emerald-500/20 border-emerald-500/30',
      iconColorClass: 'text-emerald-300',
      subtitleColorClass: 'text-emerald-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>'
    },
    {
      title: 'Connect with Me',
      subtitle: 'LinkedIn',
      description: 'Visit my LinkedIn profile to connect and see my professional background.',
      bgClass: 'bg-[#0a66c2]/20 border-[#0a66c2]/30',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-white/70',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
    },
    {
      title: 'Open Source',
      subtitle: 'GitHub',
      description: 'Check out the source code and other projects on my GitHub.',
      bgClass: 'bg-slate-800 border-slate-600',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-slate-400',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
    },
    {
      title: 'My Portfolio',
      subtitle: 'See My Work',
      description: 'Discover more about my skills, projects, and contact information.',
      bgClass: 'bg-indigo-900/80 border-indigo-500/30',
      iconBgClass: 'bg-indigo-500/20 border-indigo-500/30',
      iconColorClass: 'text-indigo-300',
      subtitleColorClass: 'text-indigo-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'
    },
    {
      title: 'Reliable Sellers',
      subtitle: 'Trusted Partners',
      description: 'We carefully vet all sellers to ensure a trustworthy shopping environment.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-purple-500/20 border-purple-500/30',
      iconColorClass: 'text-purple-300',
      subtitleColorClass: 'text-purple-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
    },
    {
      title: '24/7 Support',
      subtitle: 'Always Here',
      description: 'Got questions? Contact the creator or our support team anytime.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-cyan-500/20 border-cyan-500/30',
      iconColorClass: 'text-cyan-300',
      subtitleColorClass: 'text-cyan-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
    }
  ];

  get totalCards() { return this.cards.length; }

  prevCard(): void {
    this.currentCardIndex.update(i => (i - 1 + this.totalCards) % this.totalCards);
  }

  nextCard(): void {
    this.currentCardIndex.update(i => (i + 1) % this.totalCards);
  }

  getCardStyle(index: number) {
    const diff = (index - this.currentCardIndex() + this.totalCards) % this.totalCards;
    
    if (diff === 0) {
      return { transform: 'translateX(0) scale(1)', zIndex: 30, opacity: 1, visibility: 'visible' };
    } else if (diff === 1) {
      return { transform: 'translateX(60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else if (diff === this.totalCards - 1) {
      return { transform: 'translateX(-60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else {
      return { transform: 'translateX(0) scale(0.7)', zIndex: 10, opacity: 0, visibility: 'hidden' };
    }
  }
}

``

## src\app\shared\components\empty-state\empty-state.component.ts

``typescript
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type EmptyStateIcon = 'cart' | 'search' | 'orders' | 'wishlist' | 'reviews' | 'address' | 'card';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="relative mb-6">
        <div class="absolute inset-0 bg-violet-200/60 rounded-full blur-2xl scale-110"></div>
        <div class="relative w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-50 rounded-full flex items-center justify-center ring-1 ring-violet-100">
          @switch (icon()) {
            @case ('cart') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            }
            @case ('search') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            @case ('orders') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            @case ('wishlist') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
            @case ('reviews') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
            @case ('address') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            }
            @case ('card') {
              <svg class="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          }
        </div>
      </div>
      <h3 class="text-lg font-bold text-slate-900">{{ title() }}</h3>
      <p class="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">{{ message() }}</p>
      @if (ctaLabel() && ctaLink()) {
        <a [routerLink]="ctaLink()" class="btn-primary mt-6">{{ ctaLabel() }}</a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<EmptyStateIcon>('search');
  readonly title = input('Nothing here yet');
  readonly message = input('');
  readonly ctaLabel = input('');
  readonly ctaLink = input('');
}

``

## src\app\shared\components\install-button\install-button.component.ts

``typescript
import { Component, inject, input } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';


@Component({
  selector: 'app-install-button',
  standalone: true,
  template: `
    @if (pwa.showInstallAffordance()) {
      @switch (variant()) {
        @case ('header') {
          <button
            type="button"
            (click)="pwa.install()"
            title="Install Budgetha as an app"
            class="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2
                   text-xs font-semibold text-violet-700 hover:bg-violet-100 hover:border-violet-300
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                   transition-all duration-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13.5m0 0l4.5-4.5M12 16.5L7.5 12M3.75 18.75h16.5" />
            </svg>
            Install app
          </button>
        }

        @case ('footer') {
          <div class="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
            <div class="flex items-start gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-white">Get the Budgetha app</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-400">
                  Install it for faster loading, offline browsing, and one-tap access from your home screen.
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <button type="button" (click)="pwa.install()" class="btn-primary flex-1 py-2.5 text-xs">Install app</button>
              <button
                type="button"
                (click)="pwa.dismissInstall()"
                class="rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors duration-300">
                Not now
              </button>
            </div>
          </div>
        }
      }
    }
  `,
})
export class InstallButtonComponent {
  readonly pwa = inject(PwaService);
  readonly variant = input<'header' | 'footer'>('header');
}

``

## src\app\shared\components\offline-banner\offline-banner.component.ts

``typescript
import { Component, inject } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';


@Component({
  selector: 'app-offline-banner',
  standalone: true,
  template: `
    @if (!pwa.online()) {
      <div
        role="status"
        class="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-amber-200">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75h.008v.008H12v-.008zM3 3l18 18M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c.512-.512 1.08-.95 1.688-1.312m10.1 1.312a7.5 7.5 0 00-2.39-1.6M1.924 8.674a13.5 13.5 0 013.16-2.226m14.992 2.226a13.46 13.46 0 00-7.65-3.44" />
        </svg>
        Youâ€™re offline â€” browsing cached pages. Checkout will resume once you reconnect.
      </div>
    }
  `,
})
export class OfflineBannerComponent {
  readonly pwa = inject(PwaService);
}

``

## src\app\shared\components\product-card\product-card.component.ts

``typescript
import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/shop.models';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, StarRatingComponent],
  template: `
    @if (layout() === 'grid') {
      <!-- â”€â”€ Grid card â”€â”€ -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div class="relative aspect-square overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-scale-down mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" />
          </a>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().stock === 0) {
              <span class="badge bg-slate-700 text-white shadow-sm">Sold out</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>

          <!-- Hover actions -->
          <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-300">
            <button
              type="button"
              (click)="toggleWishlist()"
              [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur"
              [class.text-rose-500]="inWishlist()">
              <svg class="w-4.5 h-4.5 w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="quickView()"
              aria-label="Quick view"
              class="icon-btn h-9 w-9 bg-white/95 shadow-md backdrop-blur">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Add to cart slide-up -->
          <div class="absolute inset-x-3 bottom-3 opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
            <button
              type="button"
              (click)="addToCart()"
              [disabled]="product().stock === 0"
              class="w-full rounded-xl bg-slate-900/90 backdrop-blur text-white text-sm font-semibold py-2.5
                     hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-slate-900/90
                     transition-colors duration-300 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
            </button>
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">({{ product().reviewCount }})</span>
          </div>
          <div class="mt-auto pt-3 flex items-baseline gap-2">
            <span class="text-lg font-bold text-slate-900">{{ product().price | currency }}</span>
            @if (product().originalPrice) {
              <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
            }
          </div>
        </div>
      </article>
    } @else {
      <!-- â”€â”€ List card â”€â”€ -->
      <article class="group card overflow-hidden hover:shadow-xl hover:shadow-violet-100/60 transition-all duration-300 flex flex-col sm:flex-row">
        <div class="relative sm:w-56 lg:w-64 shrink-0 aspect-square sm:aspect-auto overflow-hidden bg-slate-100">
          <a [routerLink]="['/products', product().slug]" class="block h-full p-4">
            <img
              [src]="product().images[0]"
              [alt]="product().name"
              loading="lazy"
              class="h-full w-full object-scale-down mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" />
          </a>
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (discountPercent() > 0) {
              <span class="badge bg-rose-500 text-white shadow-sm">-{{ discountPercent() }}%</span>
            }
            @if (product().isNew) {
              <span class="badge bg-violet-600 text-white shadow-sm">New</span>
            }
            @if (product().approvalStatus && product().approvalStatus !== 'Approved') {
              <span class="badge" [class]="product().approvalStatus === 'Pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-rose-700 text-white shadow-sm'">
                {{ product().approvalStatus }}
              </span>
            }
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ product().brand }}</span>
          <a [routerLink]="['/products', product().slug]" class="mt-1 text-lg font-semibold text-slate-900 leading-snug hover:text-violet-600 transition-colors duration-300">
            {{ product().name }}
          </a>
          <div class="mt-2 flex items-center gap-1.5">
            <app-star-rating [rating]="product().rating" size="sm" />
            <span class="text-xs text-slate-400">{{ product().rating }} ({{ product().reviewCount }} reviews)</span>
          </div>
          <p class="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">{{ product().shortDescription }}</p>

          <div class="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-slate-900">{{ product().price | currency }}</span>
              @if (product().originalPrice) {
                <span class="text-sm text-slate-400 line-through">{{ product().originalPrice | currency }}</span>
              }
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="toggleWishlist()"
                [attr.aria-label]="inWishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
                class="icon-btn h-10 w-10 border border-slate-200"
                [class.text-rose-500]="inWishlist()">
                <svg class="w-[18px] h-[18px]" [attr.fill]="inWishlist() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                type="button"
                (click)="addToCart()"
                [disabled]="product().stock === 0"
                class="btn-primary px-5 py-2.5">
                {{ product().stock === 0 ? 'Out of stock' : 'Add to cart' }}
              </button>
            </div>
          </div>
        </div>
      </article>
    }
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly layout = input<'grid' | 'list'>('grid');

  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly quickViewService = inject(QuickViewService);

  readonly inWishlist = computed(() => this.wishlist.ids().includes(this.product().id));
  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  addToCart(): void {
    const p = this.product();
    this.cart.add(p, 1, p.colors[0]?.name, p.sizes[0]);
  }

  toggleWishlist(): void {
    this.wishlist.toggle(this.product().id, this.product().name);
  }

  quickView(): void {
    this.quickViewService.open(this.product());
  }
}

``

## src\app\shared\components\quick-view\quick-view.component.ts

``typescript
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-quick-view',
  imports: [CurrencyPipe, StarRatingComponent],
  template: `
    @if (product(); as p) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        (click)="close()"
        aria-hidden="true"></div>

      <!-- Dialog -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none" role="dialog" aria-modal="true" [attr.aria-label]="'Quick view: ' + p.name">
        <div class="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.25s_ease-out]">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Image -->
            <div class="relative aspect-square bg-slate-100 md:rounded-l-2xl overflow-hidden flex items-center justify-center p-4">
              <img [src]="activeImage()" [alt]="p.name" class="h-full w-full object-scale-down mix-blend-multiply p-6" />
              @if (p.images.length > 1) {
                <div class="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  @for (image of p.images; track image; let i = $index) {
                    <button
                      type="button"
                      (click)="activeIndex.set(i)"
                      [attr.aria-label]="'Image ' + (i + 1)"
                      class="h-2 rounded-full transition-all duration-300"
                      [class]="activeIndex() === i ? 'w-6 bg-violet-600' : 'w-2 bg-white/80 hover:bg-white'"></button>
                  }
                </div>
              }
            </div>

            <!-- Details -->
            <div class="p-6 flex flex-col relative">
              <button
                type="button"
                (click)="close()"
                aria-label="Close quick view"
                class="absolute top-4 right-4 icon-btn h-9 w-9 bg-slate-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">{{ p.brand }}</span>
              <h2 class="mt-1 text-xl font-bold text-slate-900 pr-10">{{ p.name }}</h2>
              <div class="mt-2 flex items-center gap-2">
                <app-star-rating [rating]="p.rating" size="sm" />
                <span class="text-xs text-slate-400">{{ p.rating }} Â· {{ p.reviewCount }} reviews</span>
              </div>

              <div class="mt-4 flex items-baseline gap-2">
                <span class="text-2xl font-bold text-slate-900">{{ p.price | currency }}</span>
                @if (p.originalPrice) {
                  <span class="text-base text-slate-400 line-through">{{ p.originalPrice | currency }}</span>
                }
              </div>

              <p class="mt-4 text-sm text-slate-500 leading-relaxed">{{ p.shortDescription }}</p>

              @if (p.colors.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Color: <span class="text-slate-500 font-normal">{{ selectedColor() }}</span></span>
                  <div class="mt-2 flex gap-2">
                    @for (color of p.colors; track color.name) {
                      <button
                        type="button"
                        (click)="selectedColor.set(color.name)"
                        [attr.aria-label]="color.name"
                        class="h-8 w-8 rounded-full ring-2 ring-offset-2 transition-all duration-300"
                        [class]="selectedColor() === color.name ? 'ring-violet-600 scale-110' : 'ring-transparent hover:ring-slate-300'"
                        [style.background-color]="color.hex"></button>
                    }
                  </div>
                </div>
              }

              @if (p.sizes.length) {
                <div class="mt-5">
                  <span class="text-sm font-medium text-slate-700">Size</span>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (size of p.sizes; track size) {
                      <button
                        type="button"
                        (click)="selectedSize.set(size)"
                        class="min-w-[2.75rem] px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300"
                        [class]="selectedSize() === size
                          ? 'border-violet-600 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'">
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>
              }

              <div class="mt-auto pt-6 flex gap-3">
                <button type="button" (click)="addToCart()" [disabled]="p.stock === 0" class="btn-primary flex-1">
                  {{ p.stock === 0 ? 'Out of stock' : 'Add to cart' }}
                </button>
                <button type="button" (click)="viewFullDetails()" class="btn-secondary">
                  Full details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `,
})
export class QuickViewComponent {
  private readonly quickViewService = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly product = this.quickViewService.product;
  readonly activeIndex = signal(0);
  readonly selectedColor = signal<string>('');
  readonly selectedSize = signal<string>('');

  readonly activeImage = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.images[Math.min(this.activeIndex(), p.images.length - 1)];
  });

  constructor() {
    
    effect(() => {
      const p = this.product();
      this.activeIndex.set(0);
      this.selectedColor.set(p?.colors[0]?.name ?? '');
      this.selectedSize.set(p?.sizes[0] ?? '');
    });
  }

  close(): void {
    this.quickViewService.close();
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(
      p,
      1,
      this.selectedColor() || p.colors[0]?.name,
      this.selectedSize() || p.sizes[0]
    );
    this.close();
  }

  viewFullDetails(): void {
    const p = this.product();
    if (!p) return;
    this.close();
    this.router.navigate(['/products', p.slug]);
  }
}

``

## src\app\shared\components\star-rating\star-rating.component.ts

``typescript
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="relative inline-flex" [attr.aria-label]="rating() + ' out of 5 stars'" role="img">
      <!-- Empty layer -->
      <div class="flex gap-0.5 text-slate-200">
        @for (star of stars; track star) {
          <svg [class]="sizeClass()" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
      <!-- Filled layer clipped to rating percentage -->
      <div class="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400" [style.width.%]="fillPercent()">
        @for (star of stars; track star) {
          <svg [class]="sizeClass() + ' shrink-0'" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        }
      </div>
    </div>
  `,
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly size = input<'sm' | 'md' | 'lg'>('sm');

  readonly stars = [1, 2, 3, 4, 5];
  readonly fillPercent = computed(() => Math.max(0, Math.min(100, (this.rating() / 5) * 100)));
  readonly sizeClass = computed(
    () => ({ sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' })[this.size()]
  );
}

``

## src\app\shared\components\toast\toast.component.ts

``typescript
import { Component, inject } from '@angular/core';
import { Toast, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <!-- aria-live so screen readers announce toasts without stealing focus.
         pointer-events are off on the stack and back on per card, so the
         container never blocks clicks on the page beneath it. -->
    <div
      class="fixed inset-x-4 top-20 z-[60] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:top-24 sm:max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications">
      <div aria-live="polite" aria-atomic="false" class="sr-only">
        @for (toast of toasts(); track toast.id) {
          <p>{{ toast.message }}</p>
        }
      </div>

      @for (toast of toasts(); track toast.id) {
        <div
          class="w-full pointer-events-auto rounded-2xl border bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur
                 animate-[toastIn_0.28s_cubic-bezier(0.21,1.02,0.73,1)]"
          [class]="shell(toast.type)">
          <div class="flex items-start gap-3 p-4">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" [class]="badge(toast.type)">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="icon(toast.type)" />
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-snug text-slate-800">{{ toast.message }}</p>
              @if (toast.action; as action) {
                <button
                  type="button"
                  (click)="runAction(toast)"
                  class="mt-2 text-xs font-bold uppercase tracking-wide text-violet-600 hover:text-violet-500 transition-colors duration-200">
                  {{ action.label }}
                </button>
              }
            </div>

            <button
              type="button"
              (click)="dismiss(toast.id)"
              aria-label="Dismiss notification"
              class="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600
                     transition-colors duration-200">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-1 rounded-b-2xl" [class]="accent(toast.type)"></div>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      :host div { animation: none !important; }
    }
  `,
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  private static readonly SHELL: Record<ToastType, string> = {
    success: 'border-emerald-200/80',
    error: 'border-rose-200/80',
    warning: 'border-amber-200/80',
    info: 'border-violet-200/80',
  };

  private static readonly BADGE: Record<ToastType, string> = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-rose-100 text-rose-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-violet-100 text-violet-600',
  };

  private static readonly ACCENT: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-violet-600',
  };

  private static readonly ICON: Record<ToastType, string> = {
    success: 'M4.5 12.75l6 6 9-13.5',
    error: 'M6 18L18 6M6 6l12 12',
    warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  };

  protected shell(type: ToastType): string {
    return ToastComponent.SHELL[type] ?? ToastComponent.SHELL.info;
  }

  protected badge(type: ToastType): string {
    return ToastComponent.BADGE[type] ?? ToastComponent.BADGE.info;
  }

  protected accent(type: ToastType): string {
    return ToastComponent.ACCENT[type] ?? ToastComponent.ACCENT.info;
  }

  protected icon(type: ToastType): string {
    return ToastComponent.ICON[type] ?? ToastComponent.ICON.info;
  }

  protected runAction(toast: Toast): void {
    toast.action?.handler();
    this.dismiss(toast.id);
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}

``

## src\environments\environment.prod.ts

``typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  googleClientId: '617748704610-fkb78ghi924ucdutur23971k003gsmg8.apps.googleusercontent.com'
};

``

## src\environments\environment.ts

``typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5272/api',
  googleClientId: '617748704610-fkb78ghi924ucdutur23971k003gsmg8.apps.googleusercontent.com'
};

``

