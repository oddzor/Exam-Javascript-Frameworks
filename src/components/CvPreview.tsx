import "../styles/components/cvpreview.css";

interface CvPreviewProps {
  pdfData: string;
}

function CvPreview({ pdfData }: CvPreviewProps) {
  return (
    <div className="cvpreview-container">
      <iframe src={pdfData} className="cvpreview-iframe" title="CV Preview" />
    </div>
  );
}

export default CvPreview;
