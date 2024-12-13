export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  years: string;
}

export interface ReferenceEntry {
  name: string;
  contactInfo: string;
}

export interface CvData {
  _id?: string;
  userEmail?: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    aboutMe: string;
    imageData?: string;
  };
  skills: string[];
  education: { institution: string; degree: string; year: string }[];
  experience: { title: string; company: string; years: string }[];
  references: { name: string; contactInfo: string }[];
}

export interface WaitlistEntry {
  _id?: string;
  name: string;
  email: string;
  password: string;
}
