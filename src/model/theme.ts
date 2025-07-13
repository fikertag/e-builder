import mongoose, { Schema, Document, Model } from "mongoose";

export interface IThemeStyleProps {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
  "font-sans": string;
  "font-serif": string;
  "font-mono": string;
  radius: string;
  "shadow-color": string;
  "shadow-opacity": string;
  "shadow-blur": string;
  "shadow-spread": string;
  "shadow-offset-x": string;
  "shadow-offset-y": string;
  "letter-spacing": string;
  spacing: string;
}

export interface ITheme extends Document {
  name: string;
  styles: {
    light: IThemeStyleProps;
    dark: IThemeStyleProps;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ThemeStylePropsSchema = new Schema<IThemeStyleProps>(
  {
    background: { type: String, required: true },
    foreground: { type: String, required: true },
    card: { type: String, required: true },
    "card-foreground": { type: String, required: true },
    popover: { type: String, required: true },
    "popover-foreground": { type: String, required: true },
    primary: { type: String, required: true },
    "primary-foreground": { type: String, required: true },
    secondary: { type: String, required: true },
    "secondary-foreground": { type: String, required: true },
    muted: { type: String, required: true },
    "muted-foreground": { type: String, required: true },
    accent: { type: String, required: true },
    "accent-foreground": { type: String, required: true },
    destructive: { type: String, required: true },
    "destructive-foreground": { type: String, required: true },
    border: { type: String, required: true },
    input: { type: String, required: true },
    ring: { type: String, required: true },
    "chart-1": { type: String, required: true },
    "chart-2": { type: String, required: true },
    "chart-3": { type: String, required: true },
    "chart-4": { type: String, required: true },
    "chart-5": { type: String, required: true },
    sidebar: { type: String, required: true },
    "sidebar-foreground": { type: String, required: true },
    "sidebar-primary": { type: String, required: true },
    "sidebar-primary-foreground": { type: String, required: true },
    "sidebar-accent": { type: String, required: true },
    "sidebar-accent-foreground": { type: String, required: true },
    "sidebar-border": { type: String, required: true },
    "sidebar-ring": { type: String, required: true },
    "font-sans": { type: String, required: true },
    "font-serif": { type: String, required: true },
    "font-mono": { type: String, required: true },
    radius: { type: String, required: true },
    "shadow-color": { type: String, required: true },
    "shadow-opacity": { type: String, required: true },
    "shadow-blur": { type: String, required: true },
    "shadow-spread": { type: String, required: true },
    "shadow-offset-x": { type: String, required: true },
    "shadow-offset-y": { type: String, required: true },
    "letter-spacing": { type: String, required: true },
    spacing: { type: String, required: true },
  },
  { _id: false }
);

const ThemeSchema = new Schema<ITheme>(
  {
    name: { type: String, required: true, unique: true, maxlength: 50 },
    styles: {
      light: { type: ThemeStylePropsSchema, required: true },
      dark: { type: ThemeStylePropsSchema, required: true },
    },
  },
  { timestamps: true }
);

const Theme: Model<ITheme> =
  mongoose.models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema);

export default Theme;
