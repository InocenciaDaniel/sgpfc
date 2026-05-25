import React, { useState } from 'react';
import api from "../axiosConfig";


function FileUpload() {
    const [file, setFile] = useState(null);
    const [fkEntregasEstudante, setFkEntregasEstudante] = useState('');

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!file || !fkEntregasEstudante) {
            alert('Por favor, selecione um ficheiro e adicione o ID do estudante');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fk_entregas_estudante', fkEntregasEstudante);

        try {
            const response = await api.post('upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);
        } catch (error) {
            console.error('There was an error uploading the file!', error);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="file" onChange={onFileChange} />
                <input
                    type="text"
                    placeholder="ID do Estudante"
                    value={fkEntregasEstudante}
                    onChange={(e) => setFkEntregasEstudante(e.target.value)}
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default FileUpload;
