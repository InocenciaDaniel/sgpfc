import React, { useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const PdfViewer = ({ pdfUrl }) => {
  const pdfWrapper = useRef(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      pdfWrapper.current.pdf = pdf;
      pdfWrapper.current.page = 1; // Renderiza a primeira página inicialmente
      renderPage();
    };

    const renderPage = async () => {
      const page = await pdfWrapper.current.pdf.getPage(pdfWrapper.current.page);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      pdfWrapper.current.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext);
    };

    fetchPdf();
  }, [pdfUrl]);

  return (
    <div ref={pdfWrapper} style={{ overflowY: 'scroll', height: '600px' }} />
  );
};

export default PdfViewer;