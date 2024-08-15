import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0, remainingTime: '' });
  const [msg, setMsg] = useState(null);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
    setMsg(null);
  };

  const handleUpload = () => {
    if (!files) {
      setMsg("No file selected");
      return;
    }

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append(`file${i + 1}`, files[i]);
    }

    setMsg("Uploading...");
    setProgress({ started: true, pc: 0, remainingTime: '' });

    const startTime = Date.now();

    axios.post('http://httpbin.org/post', fd, {
      onUploadProgress: (progressEvent) => {
        const percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        const elapsedTime = Date.now() - startTime;
        const estimatedTotalTime = (elapsedTime / percentage) * 100;
        const remainingTime = Math.max(estimatedTotalTime - elapsedTime, 0);

        setProgress({ started: true, pc: percentage, remainingTime: (remainingTime / 1000).toFixed(2) + 's remaining' });

        console.log(`Progress: ${percentage}%`);
      },
      headers: {
        "Custom-Header": "value"
      }
    }).then(res => {
      setMsg("Upload successful");
      setProgress({ started: false, pc: 100, remainingTime: '0s remaining' });
      console.log(res.data);
    }).catch(err => {
      setMsg("Upload failed");
      console.error(err);
    });
  };

  return (
    <div className="wrapper">
      <header>File Uploader JavaScript</header>
      <form>
        <input
          onChange={handleFileChange}
          type="file"
          multiple
          hidden
          className="file-input"
        />
        <i className="fas fa-cloud-upload-alt" onClick={() => document.querySelector('.file-input').click()}></i>
        <p onClick={() => document.querySelector('.file-input').click()}>Browse File to Upload</p>
      </form>
      <section className="progress-area">
        {progress.started && (
          <li className="row">
            <i className="fas fa-spinner fa-spin"></i>
            <div className="content">
              <div className="details">
                <span className="name">Uploading</span>
                <span className="percent">{progress.pc}%</span>
                <span className="time">{progress.remainingTime}</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress.pc}%` }}></div>
              </div>
            </div>
          </li>
        )}
      </section>
      <section className="uploaded-area">
        {msg && <span>{msg}</span>}
      </section>
      <button onClick={handleUpload} disabled={!files}>Upload</button>
    </div>
  );
};

export default App;
