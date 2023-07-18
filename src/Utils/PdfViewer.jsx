import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'


function PdfViewer({url}) {

  const token=localStorage.getItem('token')

  return (
    <div >
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"  >
        <Viewer   fileUrl={url} httpHeaders={ {'Access-Control-Allow-Origin':'*' }} />

    ...
    </Worker>
    </div>
  );
}

export default PdfViewer;