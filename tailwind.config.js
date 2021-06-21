const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const { purple } = require("@tailwindcss/ui/colors");

module.exports = {
  purge: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx", "public/**/*.html"],
  theme: {
    important: true,
    extend: {
      fontFamily: {
        inter: ["Inter", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        ...defaultTheme.colors,
        dark: "#060606",
        nav: "#191F27",
        "pale-sky": "#6B7280",
        shark: {
          100: "#282828",
          200: "#212121"
        },
        blue: {
          ...defaultTheme.colors.blue,
          100: "#E6EEFF",
          200: "#307FE2",
          300: "#1766C9",
          500: "#307FE2"
        },
        gray: {
          ...defaultTheme.colors.gray,
          50: "#F9FAFB",
          100: "#F5F5F5",
          700: "#999DA5",
          800: "#252F3F",
          900: "#21282F"
        },
        red: {
          ...defaultTheme.colors.red,
          100: "#FEF0F3",
          200: "#F94D6C",
          300: "#EB5757"
        },
        purple: {
          ...defaultTheme.colors.purple,
          100: "#F0F2FE",
          200: "#6875F5"
        },
        green: {
          ...defaultTheme.colors.green,
          100: "#E4FFFA",
          200: "#0B967C"
        }
      },
      boxShadow: {
        ...defaultTheme.boxShadow,
        blue: "0px 0px 10px #EBF2FF"
      },
      margin: {
        ...defaultTheme.margin,
        7: "1.875rem",
        8.5: "2.125rem",
        9: "2.25rem",
        14: "3.5rem",
        30: "7.5rem"
      },
      padding: {
        ...defaultTheme.padding,
        5.5: "1.375rem",
        4.5: "1.125rem"
      },
      maxWidth: {
        ...defaultTheme.maxWidth,
        "5xl": "58rem",
        "7xl": "78.25rem",
        nav: "90rem",
        "8xl": "90rem",
        16: "16rem"
      },
      fontSize: {
        0.5: ".5rem",
        tiny: ".6875rem",
        xs: ".75rem",
        sm: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3.375rem",
        "6xl": "4rem",
        0.9375: "0.9375rem",
        1.375: "1.375rem",
        0.9375: "0.9375rem"
      },
      lineHeight: {
        ...defaultTheme.lineHeight,
        tighter: "1.15",
        middle: "1.3",
        1.14: "1.14",
        3: "0.9375rem",
        4: "1.0625rem",
        4.5: "1.125rem",
        7.5: "1.8125rem"
      },
      letterSpacing: {
        ...defaultTheme.letterSpacing,
        tighter: "0.1px",
        tight: "0.2px",
        xs: "0.3px",
        xm: "0.4px"
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        DEFAULT: "4px",
        md: ".5rem",
        lg: "1rem",
        xl: "2rem",
        full: "9999px",
        large: "12px"
      },
      spacing: {
        ...defaultTheme.spacing,
        "big-video": "55.4%",
        video: "56.25%",
        sm: ".625rem",
        1.68: "1.68rem",
        2.68: "2.68rem",
        19: "4.6875rem",
        27: "6.875rem"
      },
      width: {
        ...defaultTheme.width,
        "vertical-video": "10.3125rem",
        xl: "36rem"
      },
      height: {
        ...defaultTheme.height,
        "vertical-video": "7.75rem"
      },
      opacity: {
        ...defaultTheme.opacity,
        10: "0.1"
      }
    },
    zIndex: {
      "-20": "-20",
      "-10": "-10",
      10: "10",
      20: "20",
      30: "30",
      50: "50",
      100: "100"
    },
    spinner: theme => ({
      default: {
        color: "#dae1e7",
        size: "1em",
        border: "2px",
        speed: "500ms"
      },
      blue: {
        color: "#307FE2",
        size: "1em",
        border: "2px",
        speed: "1000ms"
      },
      large: {
        color: "#999DA5",
        size: "2em",
        border: "2px",
        speed: "500ms"
      }
    })
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
    borderColor: ["responsive", "hover", "focus", "active"]
  },
  plugins: [
    require("@tailwindcss/ui"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-spinner")({
      className: "spinner",
      themeKey: "spinner"
    })
  ]
};

/*const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...defaultTheme.colors,
        blue: {
          ...defaultTheme.colors.blue,
          100: "#E6EEFF",
          200: "#307FE2",
          300: "#1766C9",
          500: "#307FE2",
        },
        gray: {
          ...defaultTheme.colors.gray,
          50: "#F9FAFB",
          100: "#F5F5F5",
          700: "#999DA5",
          800: "#252F3F",
          900: "#21282F",
        },
      },
      /*colors: {
        ...defaultTheme.colors,
        //dark: "#060606",
        nav: "#191F27",
        "pale-sky": "#6B7280",
        shark: {
          100: "#282828",
          200: "#212121",
        },
        gray: {
          ...defaultTheme.colors.gray,
          50: "#F9FAFB",
          100: "#F5F5F5",
          700: "#999DA5",
          800: "#252F3F",
          900: "#21282F",
        },
        blue: {
          100: "#E6EEFF",
          200: "#307FE2",
          300: "#1766C9",
          500: "#307FE2",
        },
        red: {
          100: "#FEF0F3",
          200: "#F94D6C",
          300: "#EB5757",
        },
        purple: {
          100: "#F0F2FE",
          200: "#6875F5",
        },
        green: {
          100: "#E4FFFA",
          200: "#0B967C",
        },
      ///////},
      boxShadow: {
        ...defaultTheme.boxShadow,
        blue: "0px 0px 10px #EBF2FF",
      },
    },
  },
  future: {
    purgeLayersByDefault: true,
  },
  plugins: [
    require("@tailwindcss/ui")({
      layout: "sidebar",
    }),
  ],
};
*/
