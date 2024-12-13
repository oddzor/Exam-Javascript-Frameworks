import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CvData } from "../types/types";
import "../styles/components/cvform.css";

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface ExperienceEntry {
  title: string;
  company: string;
  years: string;
}

interface ReferenceEntry {
  name: string;
  contactInfo: string;
}

interface Props {
  initialCvData?: CvData | null;
  onSubmit: (cv: CvData) => void;
  onBack: () => void;
}

function CvForm({ initialCvData, onSubmit, onBack }: Props) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);

  const [skills, setSkills] = useState<string[]>([""]);
  const [education, setEducation] = useState<Education[]>([
    { institution: "", degree: "", year: "" },
  ]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { title: "", company: "", years: "" },
  ]);
  const [references, setReferences] = useState<ReferenceEntry[]>([
    { name: "", contactInfo: "" },
  ]);

  useEffect(() => {
    if (initialCvData) {
      setName(initialCvData.personalInfo.name);
      setEmail(initialCvData.personalInfo.email);
      setPhone(initialCvData.personalInfo.phone);
      setAboutMe(initialCvData.personalInfo.aboutMe);
      setSkills(initialCvData.skills);
      setEducation(initialCvData.education);
      setExperience(initialCvData.experience);
      setReferences(initialCvData.references);
      if (initialCvData.personalInfo.imageData) {
        setImageData(initialCvData.personalInfo.imageData);
      }
    }
  }, [initialCvData]);

  if (!isLoggedIn) return <p>Please log in</p>;

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleAddEducation = () => {
    setEducation([...education, { institution: "", degree: "", year: "" }]);
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  const handleAddExperience = () => {
    setExperience([...experience, { title: "", company: "", years: "" }]);
  };

  const handleExperienceChange = (
    index: number,
    field: keyof ExperienceEntry,
    value: string
  ) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExperience(newExperience);
  };

  const handleAddReference = () => {
    setReferences([...references, { name: "", contactInfo: "" }]);
  };

  const handleReferenceChange = (
    index: number,
    field: keyof ReferenceEntry,
    value: string
  ) => {
    const newReferences = [...references];
    newReferences[index] = { ...newReferences[index], [field]: value };
    setReferences(newReferences);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        if (evt.target?.result) {
          const resultStr = evt.target.result as string;
          setImageData(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: CvData = {
      personalInfo: {
        name,
        email,
        phone,
        aboutMe,
        imageData: imageData ?? undefined,
      },
      skills: skills.filter((s) => s.trim() !== ""),
      education,
      experience,
      references,
    };

    const method = initialCvData && initialCvData._id ? "PUT" : "POST";
    const url =
      initialCvData && initialCvData._id
        ? `http://localhost:5000/api/cvs/${initialCvData._id}`
        : "http://localhost:5000/api/cvs";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToSubmit),
    });

    if (!res.ok) {
      alert("Failed to submit CV");
    } else {
      alert("CV submitted successfully");
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialCvData && initialCvData._id ? "Update CV" : "Create CV"}</h2>
      <button type="button" onClick={onBack}>
        Back
      </button>
      <h3>Personal Info</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <textarea
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        placeholder="About Me"
      />

      <div className="cvform-image-section">
        <label className="cvform-image-label">Profile Picture</label>
        <input
          className="cvform-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imageData && (
          <img src={imageData} alt="Preview" className="cvform-image-preview" />
        )}
      </div>

      <h3>Skills</h3>
      {skills.map((skill, i) => (
        <div key={i}>
          <input
            type="text"
            value={skill}
            onChange={(e) => handleSkillChange(i, e.target.value)}
            placeholder="Skill"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddSkill}>
        Add another skill
      </button>

      <h3>Education</h3>
      {education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={edu.institution}
            onChange={(e) =>
              handleEducationChange(i, "institution", e.target.value)
            }
            placeholder="Institution"
          />
          <input
            type="text"
            value={edu.degree}
            onChange={(e) => handleEducationChange(i, "degree", e.target.value)}
            placeholder="Degree"
          />
          <input
            type="text"
            value={edu.year}
            onChange={(e) => handleEducationChange(i, "year", e.target.value)}
            placeholder="Year"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddEducation}>
        Add another education
      </button>

      <h3>Experience</h3>
      {experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={exp.title}
            onChange={(e) => handleExperienceChange(i, "title", e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            value={exp.company}
            onChange={(e) =>
              handleExperienceChange(i, "company", e.target.value)
            }
            placeholder="Company"
          />
          <input
            type="text"
            value={exp.years}
            onChange={(e) => handleExperienceChange(i, "years", e.target.value)}
            placeholder="Years"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddExperience}>
        Add another experience
      </button>

      <h3>References</h3>
      {references.map((ref, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={ref.name}
            onChange={(e) => handleReferenceChange(i, "name", e.target.value)}
            placeholder="Ref Name"
          />
          <input
            type="text"
            value={ref.contactInfo}
            onChange={(e) =>
              handleReferenceChange(i, "contactInfo", e.target.value)
            }
            placeholder="Ref Contact Info"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddReference}>
        Add another reference
      </button>

      <br />
      <br />
      <button type="submit">
        {initialCvData && initialCvData._id ? "Update CV" : "Create CV"}
      </button>
    </form>
  );
}

export default CvForm;
