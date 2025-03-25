export type ThemeColors = {
  [theme: string]: {
    background: string;
    foreground: string;
    border: string;
    primary: string;
    secondary: string;
    destructive: string;
  };
};

export const Themes: ThemeColors = {
  'dark-blue': {
    background: '#04142d',
    foreground: '#b9c9ff',
    border: '#7492c6',
    primary: '#608aff',
    secondary: '#39456d',
    destructive: '#FF0000',
  },
  'light-blue': {
    background: '#E3F2FD',
    foreground: '#0D47A1',
    border: '#345774',
    primary: '#42A5F5',
    secondary: '#64B5F6',
    destructive: '#EF5350',
  },
  'dark-red': {
    background: '#2d0404',
    foreground: '#ffb9b9',
    border: '#c67474',
    primary: '#ff6060',
    secondary: '#6d3939',
    destructive: '#fff200',
  },
  'light-red': {
    background: '#fde3e3',
    foreground: '#a10d0d',
    border: '#743434',
    primary: '#f54242',
    secondary: '#f66464',
    destructive: '#efef50',
  },
};
