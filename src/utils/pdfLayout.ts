import jsPDF from "jspdf";
import { CvData } from "../types/types";
import {
  skillsIcon,
  educationIcon,
  experienceIcon,
  referencesIcon,
  personalIcon,
  headerIcon,
} from "../utils/icondata";

function buildPdf(doc: jsPDF, cvData: CvData) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 40;

  function checkPageSpace(lineHeight: number = 8) {
    if (currentY + lineHeight > pageHeight - 20) {
      doc.addPage();
      currentY = 40;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.setFillColor(30, 30, 60);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setFontSize(22);
  doc.text("Curriculum Vitae", 10, 17);
  doc.addImage(headerIcon, "PNG", pageWidth - 30, 3, 20, 20);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20);
  doc.text(cvData.personalInfo.name, 10, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  currentY += 8;
  checkPageSpace();
  doc.text(`Email: ${cvData.personalInfo.email}`, 10, currentY);
  currentY += 8;
  checkPageSpace();
  doc.text(`Phone: ${cvData.personalInfo.phone}`, 10, currentY);
  currentY += 12;
  checkPageSpace();
  if (cvData.personalInfo.imageData) {
    doc.addImage(
      cvData.personalInfo.imageData,
      "PNG",
      pageWidth - 50,
      30,
      40,
      40
    );
  }

  function sectionLabel(title: string, iconData: string) {
    doc.setFont("helvetica", "bold");
    doc.setFillColor(200, 200, 230);
    doc.rect(10, currentY, 60, 10, "F");
    doc.setTextColor(0);
    doc.addImage(iconData, "PNG", 12, currentY + 2, 6, 6);
    doc.text(title, 20, currentY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20);
    currentY += 16;
    checkPageSpace();
  }

  sectionLabel("About Me", personalIcon);
  const aboutMeText = cvData.personalInfo.aboutMe || "";
  const aboutMeLines = doc.splitTextToSize(aboutMeText, 190);
  const aboutMeHeight = aboutMeLines.length * 8 + 10;
  checkPageSpace(aboutMeHeight);
  doc.setFillColor(220, 220, 220);
  doc.rect(10, currentY - 6, 190, aboutMeHeight, "F");
  doc.text(aboutMeLines, 10, currentY);
  currentY += aboutMeHeight + 10;
  checkPageSpace();

  sectionLabel("Skills", skillsIcon);
  const maxSkills = 16;
  const displayedSkills = cvData.skills.slice(0, maxSkills);
  doc.setFontSize(10);
  const columns = 3;
  const skillsPerColumn = Math.ceil(displayedSkills.length / columns);
  const columnWidth = 60;
  const skillHeight = skillsPerColumn * 8 + 10;
  checkPageSpace(skillHeight);
  doc.setFillColor(220, 220, 220);
  doc.rect(10, currentY - 6, columnWidth * columns, skillHeight, "F");
  for (let i = 0; i < displayedSkills.length; i++) {
    const colIndex = Math.floor(i / skillsPerColumn);
    const rowIndex = i % skillsPerColumn;
    doc.text(
      `- ${displayedSkills[i]}`,
      10 + colIndex * columnWidth,
      currentY + rowIndex * 8
    );
  }
  currentY += skillHeight + 10;
  checkPageSpace();
  doc.setFontSize(12);

  sectionLabel("Education", educationIcon);
  const eduTexts = cvData.education.map(
    (edu) => `${edu.institution}, ${edu.degree} (${edu.year})`
  );
  const eduHeight = eduTexts.length * 8 + 10;
  checkPageSpace(eduHeight);
  doc.setFillColor(220, 220, 220);
  doc.rect(10, currentY - 6, 190, eduHeight, "F");
  eduTexts.forEach((t) => {
    doc.text(t, 10, currentY);
    currentY += 8;
    checkPageSpace();
  });
  currentY += 10;
  checkPageSpace();

  sectionLabel("Experience", experienceIcon);
  const expTexts = cvData.experience.map(
    (exp) => `${exp.title} at ${exp.company} (${exp.years})`
  );
  const expHeight = expTexts.length * 8 + 10;
  checkPageSpace(expHeight);
  doc.setFillColor(220, 220, 220);
  doc.rect(10, currentY - 6, 190, expHeight, "F");
  expTexts.forEach((t) => {
    doc.text(t, 10, currentY);
    currentY += 8;
    checkPageSpace();
  });
  currentY += 10;
  checkPageSpace();

  sectionLabel("References", referencesIcon);
  const refTexts = cvData.references.map(
    (ref) => `${ref.name} - ${ref.contactInfo}`
  );
  const refHeight = refTexts.length * 8 + 10;
  checkPageSpace(refHeight);
  doc.setFillColor(220, 220, 220);
  doc.rect(10, currentY - 6, 190, refHeight, "F");
  refTexts.forEach((t) => {
    doc.text(t, 10, currentY);
    currentY += 8;
    checkPageSpace();
  });
  currentY += 10;
  checkPageSpace();

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  checkPageSpace();
  doc.text("created using cvportal.io", pageWidth / 2, pageHeight - 10, {
    align: "center",
  });
}

export function generatePdfDataUrl(cvData: CvData): string {
  const doc = new jsPDF();
  buildPdf(doc, cvData);
  return doc.output("datauristring");
}

export function downloadPdf(cvData: CvData): void {
  const doc = new jsPDF();
  buildPdf(doc, cvData);
  doc.save("cv.pdf");
}
