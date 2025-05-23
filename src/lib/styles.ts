export type ThemeColors = {
  [theme: string]: {
    background: string;
    foreground: string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    accent: string;
    'accent-foreground': string;
    muted: string;
    'muted-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    border: string;
  };
};

export const Themes: { dark: ThemeColors; light: ThemeColors } = {
  dark: {
    blue: {
      background: '1 21 56',
      foreground: '185 201 255',
      primary: '127 147 255',
      'primary-foreground': '4 20 45',
      secondary: '57 69 109',
      'secondary-foreground': '160 160 220',
      accent: '70 81 140',
      'accent-foreground': '4 20 45',
      muted: '65 80 120',  // Changed to avoid duplication with secondary
      'muted-foreground': '185 201 255',
      destructive: '255 0 0',
      'destructive-foreground': '4 20 45',
      border: '116 146 198',
    },
    green: {
      background: '10 25 20',
      foreground: '200 255 210',
      primary: '0 160 80',
      'primary-foreground': '0 30 20',
      secondary: '40 80 60',
      'secondary-foreground': '180 230 190',
      accent: '50 110 80',
      'accent-foreground': '0 30 20',
      muted: '45 95 70',  // Changed to avoid duplication with secondary
      'muted-foreground': '200 255 210',
      destructive: '255 80 80',
      'destructive-foreground': '0 30 20',
      border: '120 180 140',
    },
    orange: {
      background: '30 20 10',
      foreground: '255 235 215',
      primary: '255 140 0',
      'primary-foreground': '40 25 10',
      secondary: '100 60 20',
      'secondary-foreground': '240 220 200',
      accent: '200 100 40',
      'accent-foreground': '40 25 10',
      muted: '105 75 30',  // Changed to avoid duplication with secondary
      'muted-foreground': '255 235 215',
      destructive: '255 80 80',
      'destructive-foreground': '40 25 10',
      border: '210 150 100',
    },
    purple: {
      background: '20 10 30',
      foreground: '225 200 255',
      primary: '180 100 255',
      'primary-foreground': '35 20 60',
      secondary: '90 50 140',
      'secondary-foreground': '220 200 240',
      accent: '140 70 200',
      'accent-foreground': '35 20 60',
      muted: '95 60 160',  // Changed to avoid duplication with secondary
      'muted-foreground': '225 200 255',
      destructive: '255 80 80',
      'destructive-foreground': '35 20 60',
      border: '180 130 220',
    },
    red: {
      background: '30 10 10',
      foreground: '255 210 210',
      primary: '220 40 40',
      'primary-foreground': '40 10 10',
      secondary: '90 30 30',
      'secondary-foreground': '230 180 180',
      accent: '140 40 40',
      'accent-foreground': '40 10 10',
      muted: '95 40 40',  // Changed to avoid duplication with secondary
      'muted-foreground': '255 210 210',
      destructive: '255 0 0',
      'destructive-foreground': '40 10 10',
      border: '200 120 120',
    },
  },
  light: {
    'blue': {
      background: '235 245 255',
      foreground: '20 40 80',
      primary: '60 120 255',
      'primary-foreground': '255 255 255',
      secondary: '200 220 250',
      'secondary-foreground': '20 40 80',
      accent: '100 160 255',
      'accent-foreground': '20 40 80',
      muted: '220 235 250',
      'muted-foreground': '50 80 130',
      destructive: '220 38 38',
      'destructive-foreground': '255 255 255',
      border: '180 200 235',
    },
    'green': {
      background: '235 255 240',
      foreground: '20 60 30',
      primary: '40 200 100',
      'primary-foreground': '255 255 255',
      secondary: '200 245 215',
      'secondary-foreground': '20 60 30',
      accent: '100 225 150',
      'accent-foreground': '20 60 30',
      muted: '215 245 225',
      'muted-foreground': '60 100 70',
      destructive: '220 38 38',
      'destructive-foreground': '255 255 255',
      border: '180 235 200',
    },
    'orange': {
      background: '255 245 235',
      foreground: '60 30 10',
      primary: '255 165 50',
      'primary-foreground': '255 255 255',
      secondary: '255 225 200',
      'secondary-foreground': '60 30 10',
      accent: '255 200 120',
      'accent-foreground': '60 30 10',
      muted: '255 230 210',
      'muted-foreground': '100 60 30',
      destructive: '220 38 38',
      'destructive-foreground': '255 255 255',
      border: '255 215 180',
    },
    'purple': {
      background: '250 245 255',
      foreground: '50 20 80',
      primary: '200 100 255',
      'primary-foreground': '255 255 255',
      secondary: '235 215 255',
      'secondary-foreground': '50 20 80',
      accent: '220 160 255',
      'accent-foreground': '50 20 80',
      muted: '240 225 250',
      'muted-foreground': '90 60 120',
      destructive: '220 38 38',
      'destructive-foreground': '255 255 255',
      border: '225 200 240',
    },
    'red': {
      background: '255 240 240',
      foreground: '80 20 20',
      primary: '240 80 80',
      'primary-foreground': '255 255 255',
      secondary: '255 210 210',
      'secondary-foreground': '80 20 20',
      accent: '255 160 160',
      'accent-foreground': '80 20 20',
      muted: '255 225 225',
      'muted-foreground': '120 50 50',
      destructive: '220 38 38',
      'destructive-foreground': '255 255 255',
      border: '240 190 190',
    },
  },
};