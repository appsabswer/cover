export interface CoverData {
  title: string;
  subtitle: string;
  subjectCode: string;
  examYear: string;
  department: string;
  website: string;
  themeColor: string;
  accentColor: string;
  showLogo: boolean;
  showDots: boolean;
  logoUrl?: string;
  fontSizeTitle: number;
  fontSizeSubtitle: number;
  fontSizeInfo: number;
  fontSizeDept: number;
  fontSizeWebsite: number;
}

export const defaultCover: CoverData = {
  title: "আস-সীরাহ আন-নবাবিইয়াহ",
  subtitle: "প্রশ্ন ও সমাধান",
  subjectCode: "২০৫৩০১",
  examYear: "২০২৪",
  department: "ইসলামের ইতিহাস ও সংস্কৃতি",
  website: "abswer.com",
  themeColor: "#05164d",
  accentColor: "#2e7d32",
  showLogo: true,
  showDots: true,
  fontSizeTitle: 34,
  fontSizeSubtitle: 28,
  fontSizeInfo: 32,
  fontSizeDept: 24,
  fontSizeWebsite: 12,
};
