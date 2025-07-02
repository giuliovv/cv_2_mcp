"use client";
import { useState } from "react";
import { db } from "../../firebaseClient";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type Experience = {
  jobTitle: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
};
type Education = {
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
};

export default function CVUploader() {
  const [tab, setTab] = useState<"manual" | "pdf">("manual");
  const [form, setForm] = useState({
    name: "",
    email: "",
    summary: "",
    experiences: [
      { jobTitle: "", company: "", startYear: "", endYear: "", description: "" } as Experience,
    ],
    education: [
      { university: "", degree: "", startYear: "", endYear: "" } as Education,
    ],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExperienceChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperiences = [...form.experiences];
    newExperiences[idx][name as keyof Experience] = value;
    setForm({ ...form, experiences: newExperiences });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experiences: [...form.experiences, { jobTitle: "", company: "", startYear: "", endYear: "", description: "" } as Experience],
    });
  };

  const removeExperience = (idx: number) => {
    const newExperiences = form.experiences.filter((_, i) => i !== idx);
    setForm({ ...form, experiences: newExperiences });
  };

  const handleEducationChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...form.education];
    newEducation[idx][name as keyof Education] = value;
    setForm({ ...form, education: newEducation });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { university: "", degree: "", startYear: "", endYear: "" } as Education],
    });
  };

  const removeEducation = (idx: number) => {
    const newEducation = form.education.filter((_, i) => i !== idx);
    setForm({ ...form, education: newEducation });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await addDoc(collection(db, "cvs"), {
        ...form,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setForm({ name: "", email: "", summary: "", experiences: [{ jobTitle: "", company: "", startYear: "", endYear: "", description: "" } as Experience], education: [{ university: "", degree: "", startYear: "", endYear: "" } as Education] });
    } catch (err) {
      setError("Failed to upload CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-indigo-700">Upload Your CV</h1>
      <p className="text-center text-gray-600 mb-6">Share your professional story. Upload your CV data manually or (soon) by uploading a PDF!</p>
      <div className="flex justify-center mb-6 gap-2">
        <button
          className={`px-4 py-2 rounded-l-lg font-semibold ${tab === "manual" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("manual")}
        >
          Manual Entry
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg font-semibold ${tab === "pdf" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("pdf")}
          disabled
          title="Coming soon!"
        >
          Upload PDF (soon)
        </button>
      </div>
      {tab === "manual" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
          />
          <textarea
            name="summary"
            placeholder="Professional Summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
          />

          <div>
            <label className="block font-bold mb-1 text-gray-800">Work Experience</label>
            {form.experiences.map((exp, idx) => (
              <div key={idx} className="mb-2 flex flex-col gap-2 border p-3 rounded bg-gray-50 relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={e => handleExperienceChange(idx, e)}
                    className="flex-1 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => handleExperienceChange(idx, e)}
                    className="flex-1 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="startYear"
                    placeholder="Start Year"
                    value={exp.startYear}
                    onChange={e => handleExperienceChange(idx, e)}
                    className="w-1/2 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                  <input
                    type="text"
                    name="endYear"
                    placeholder="End Year"
                    value={exp.endYear}
                    onChange={e => handleExperienceChange(idx, e)}
                    className="w-1/2 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={exp.description}
                  onChange={e => handleExperienceChange(idx, e)}
                  rows={2}
                  className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
                />
                {form.experiences.length > 1 && (
                  <button type="button" onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-xs text-red-500">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addExperience} className="text-indigo-600 hover:underline text-sm mt-1">+ Add Experience</button>
          </div>

          <div>
            <label className="block font-bold mb-1 text-gray-800">Education</label>
            {form.education.map((edu, idx) => (
              <div key={idx} className="mb-2 flex flex-col gap-2 border p-3 rounded bg-gray-50 relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="university"
                    placeholder="University"
                    value={edu.university}
                    onChange={e => handleEducationChange(idx, e)}
                    className="flex-1 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e => handleEducationChange(idx, e)}
                    className="flex-1 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="startYear"
                    placeholder="Start Year"
                    value={edu.startYear}
                    onChange={e => handleEducationChange(idx, e)}
                    className="w-1/2 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                  <input
                    type="text"
                    name="endYear"
                    placeholder="End Year"
                    value={edu.endYear}
                    onChange={e => handleEducationChange(idx, e)}
                    className="w-1/2 border rounded px-3 py-2 text-black placeholder-gray-400"
                  />
                </div>
                {form.education.length > 1 && (
                  <button type="button" onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-xs text-red-500">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addEducation} className="text-indigo-600 hover:underline text-sm mt-1">+ Add Education</button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload CV"}
          </button>
          {success && <p className="text-green-600 text-center">CV uploaded successfully!</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      )}
      {tab === "pdf" && (
        <div className="text-center text-gray-400 py-8">
          <p>PDF upload and parsing coming soon!</p>
        </div>
      )}
    </div>
  );
} 