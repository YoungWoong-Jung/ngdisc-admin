import type { Config } from "tailwindcss";
import containerQueries from '@tailwindcss/container-queries'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.688rem',
        '3xs': '0.625rem',
      },
      fontFamily: {
        cherryBomb: ['var(--font-cherryBomb)'],
        pretendard: ['var(--font-pretendard)'],
      },
      screens: {
        'xs' : '340px'
      },
      height : {
        header : '4rem'
      },
      padding: {
        header : '4rem'
      },
      boxShadow: {
        'card': '0 0 48px -12px rgba(0, 0, 0, 0.24)',
      },
      aspectRatio: {
        card: '59/86'
      },
      colors: {
        black: {
          DEFAULT: '#20202D',
          50: '#F8F8F8',
          100: '#F4F4F6',
          200: '#E1E1E4',
          300: '#D1D1D4',
          400: '#BBBBBF',
          500: '#AAAAAF',
          600: '#99999E',
          700: '#77777C',
          800: '#55555A',
          900: '#20202D'
        },
        theme: {
          DEFAULT: '#F67E3B',
          50: '#FFF9F8',
          100: '#FFE6D9',
          200: '#FFD5BE',
          300: '#FFBD98',
          400: '#FF9F69',
          500: '#F67E3B',
          600: '#DB6A2C',
          700: '#BF4B0C',
          800: '#903503',
          900: '#542105',
        },
        D: {
          DEFAULT: "#eb5b5b",
          50: "#fef7f7",
          100: "#ffe9e9",
          200: "#ffcece",
          300: "#fca6a6",
          400: "#f87a7a",
          500: "#ed6f6f",
          600: "#de3e3e",
          700: "#bc2d2d",
          800: "#922424",
          900: "#741313"
        },
        I: {
          DEFAULT: "#eeb72b",
          50: "#fffcf4",
          100: "#fff4d8",
          200: "#ffe9b4",
          300: "#ffe092",
          400: "#f8cd61",
          500: "#eeb72b",
          600: "#d9a726",
          700: "#b78d21",
          800: "#956f0e",
          900: "#6c5007"
        },
        S: {
          DEFAULT: "#37a155",
          50: "#f5fbf7",
          100: "#dafde4",
          200: "#a5eeb9",
          300: "#85d49b",
          400: "#5ac077",
          500: "#37a155",
          600: "#238940",
          700: "#196e31",
          800: "#0c4c1e",
          900: "#023711"
        },
        C: {
          DEFAULT: "#596fc6",
          50: "#f6f7fb",
          100: "#dae1ff",
          200: "#bdcafc",
          300: "#8fa1e7",
          400: "#7388db",
          500: "#596fc6",
          600: "#4057b2",
          700: "#2e4396",
          800: "#293874",
          900: "#18224a"
        },
        blueTone: {
          DEFAULT: "#5277d9",
          50: "#f6f9ff",
          100: "#eaf0ff",
          200: "#c2d0f4",
          300: "#bbceff",
          400: "#92b0fd",
          500: "#5277d9",
          600: "#395ab2",
          700: "#2d4992",
          800: "#324475",
          900: "#1f2c4c"
        },
        redTone: {
          DEFAULT: "#dd4b4b",
          50: "#fff5f5",
          100: "#ffe9e9",
          200: "#ffcaca",
          300: "#ffa3a3",
          400: "#ff8282",
          500: "#dd4b4b",
          600: "#c83131",
          700: "#9e0000",
          800: "#770000",
          900: "#4f0000"
        },
        type: {
          "10": '#EB5B5B',
          "12": '#E88383',
          "13": '#ED995F',
          "14": '#B560BF',
          "16": '#FCAA96',
          "17": '#E67978',
          "18": '#E485D1',
          "20": '#EEB72B',
          "23": '#C2DF13',
          "24": '#EEB72B',
          "25": '#FFBE85',
          "27": '#DADA38',
          "28": '#EEAF29',
          "30": '#37A155',
          "34": '#4BC3AC',
          "35": '#40BF92',
          "36": '#B2DB42',
          "38": '#40BF92',
          "40": '#596FC6',
          "45": '#8C74D4',
          "46": '#7B90D5',
          "47": '#409F9E',
          "50": '#ED7D79',
          "56": '#F69678',
          "57": '#FF9797',
          "58": '#CA8AE1',
          "60": '#FAD792',
          "67": '#B7E27A',
          "68": '#F9D68F',
          "70": '#6BD181',
          "78": '#68DEC7',
          "80": '#98B0FF',
          "anonymous": '#B5B5B5',
          "99": '#7C888C',
        },
        casual: {
          DEFAULT: "#f67e3b",
          50: "#fff9f8",
          100: "#ffe6d9",
          200: "#ffd5be",
          300: "#ffbd98",
          400: "#ff9f69",
          500: "#f67e3b",
          600: "#db6a2c",
          700: "#bf4b0c",
          800: "#903503",
          900: "#542105"
        },
        pro: {
          DEFAULT: "#a465ff",
          50: "#fcfaff",
          100: "#f5eeff",
          200: "#e2ceff",
          300: "#d3b5ff",
          400: "#ba8aff",
          500: "#a465ff",
          600: "#7f41d7",
          700: "#6532ae",
          800: "#46217b",
          900: "#34195c"
        }
      },
    },
  },
  plugins: [
    containerQueries,
  ],
};
export default config;
