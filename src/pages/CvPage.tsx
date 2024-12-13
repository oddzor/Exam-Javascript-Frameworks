import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import CvForm from "../components/CvForm";
import CvPreview from "../components/CvPreview";
import { generatePdfDataUrl, downloadPdf } from "../utils/pdfLayout";
import { CvData } from "../types/types";
import { useLocation } from "react-router-dom";
import "../styles/pages/cvpage.css";

function CvPage() {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [cvs, setCvs] = useState<CvData[]>([]);
  const [selectedCv, setSelectedCv] = useState<CvData | null>(null);
  const [cvPreviewData, setCvPreviewData] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editCvData, setEditCvData] = useState<CvData | null>(null);

  const params = new URLSearchParams(location.search);
  const userEmailParam = params.get("userEmail");

  const handleSelectCv = useCallback((cv: CvData) => {
    setSelectedCv(cv);
    const pdfDataUrl = generatePdfDataUrl(cv);
    setCvPreviewData(pdfDataUrl);
    setShowForm(false);
  }, []);

  const fetchCvs = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/cvs", {
      credentials: "include",
    });
    if (res.ok) {
      const data: CvData[] = await res.json();
      let filteredData = data;
      if (role === "admin" && userEmailParam) {
        filteredData = data.filter((cv) => cv.userEmail === userEmailParam);
      }
      setCvs(filteredData);
      setSelectedCv(null);
      setCvPreviewData(null);
      setShowForm(false);
    }
  }, [role, userEmailParam]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCvs();
    }
  }, [isLoggedIn, fetchCvs]);

  const handleCreateNewCv = () => {
    setShowForm(true);
    setEditCvData(null);
    setSelectedCv(null);
    setCvPreviewData(null);
  };

  const handleEditCv = (cv: CvData) => {
    setEditCvData(cv);
    setShowForm(true);
    setSelectedCv(null);
    setCvPreviewData(null);
  };

  const handleDeleteCv = async (cv: CvData) => {
    if (!cv._id) return;
    const res = await fetch(`http://localhost:5000/api/cvs/${cv._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      await fetchCvs();
    }
  };

  const handleCvSubmitted = () => {
    fetchCvs();
  };

  const handleExportPdf = () => {
    if (selectedCv) {
      downloadPdf(selectedCv);
    }
  };

  if (!isLoggedIn) {
    return <p>Please log in to view or create CVs.</p>;
  }

  if (showForm) {
    return (
      <div className="cvform-page">
        <div className="cvform-container">
          <CvForm
            initialCvData={editCvData}
            onSubmit={handleCvSubmitted}
            onBack={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }
  let headingText = "Your CVs";
  if (role === "admin" && userEmailParam) {
    headingText = `${userEmailParam}'s CVs`;
  }

  if (cvs.length === 0 && !selectedCv) {
    return (
      <div className="cvpage-container">
        <h3>{headingText}</h3>
        <p>No CVs found</p>
        <button onClick={handleCreateNewCv}>Create New CV</button>
      </div>
    );
  }

  if (cvs.length === 1 && !selectedCv && !showForm) {
    const singleCv = cvs[0];
    return (
      <div className="cvpage-container">
        <h3>{headingText}</h3>
        <button onClick={() => handleSelectCv(singleCv)}>
          Preview your CV
        </button>
        <button onClick={() => handleEditCv(singleCv)}>Edit CV</button>
        <button onClick={handleCreateNewCv}>Create New CV</button>
      </div>
    );
  }

  if (cvs.length > 1 && !selectedCv && !showForm) {
    return (
      <div className="cvpage-container">
        <h3>{headingText}</h3>
        <ul className="cv-list">
          {cvs.map((cv, index) => (
            <li key={cv._id || index} className="cv-list-item">
              CV #{index + 1}
              <div className="cv-actions">
                <button onClick={() => handleSelectCv(cv)}>Preview</button>
                <button onClick={() => handleEditCv(cv)}>Edit</button>
                <button onClick={() => handleDeleteCv(cv)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleCreateNewCv}>Create New CV</button>
      </div>
    );
  }

  if (selectedCv && cvPreviewData) {
    return (
      <div className="cvpage-container">
        <h3>{headingText}</h3>
        <CvPreview pdfData={cvPreviewData} />
        <div className="cvpage-preview-actions">
          <button onClick={handleExportPdf}>Export as PDF</button>
          <button
            onClick={() => {
              setSelectedCv(null);
              setCvPreviewData(null);
            }}
          >
            Close
          </button>
          <button onClick={handleCreateNewCv}>Create New CV</button>
        </div>
      </div>
    );
  }

  return null;
}

export default CvPage;
