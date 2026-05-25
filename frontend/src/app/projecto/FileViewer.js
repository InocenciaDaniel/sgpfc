import React, { useState, useRef, useEffect } from 'react';
import FileReaderInput from 'react-file-reader-input';

const FileViewer = () => {
  const [fileContent, setFileContent] = useState('');
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(null);
 
  const handleFileUpload = (e, results) => {
    results.forEach(([file]) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        setDisplayedContent(event.target.result.slice(0, 1000)); // Exibir apenas os primeiros 1000 caracteres inicialmente
      };
      reader.readAsText(file);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          // Carregar mais conteúdo quando o usuário rola para baixo
          setDisplayedContent(prev => fileContent.slice(0, prev.length + 1000));
        }
      }
    };

    const refCurrent = contentRef.current;
    if (refCurrent) {
      refCurrent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fileContent, displayedContent]);

  return (
    <div>
      <h1>Visualizador de Ficheiros</h1>
      <FileReaderInput as="text" onChange={handleFileUpload}>
        <button>Escolher Ficheiro</button>
      </FileReaderInput>
      <div
        ref={contentRef}
        style={{ height: '500px', overflowY: 'auto', marginTop: '20px' }}
      >
        <pre>{displayedContent}</pre>
      </div>
    </div>
  );
};

export default FileViewer;
