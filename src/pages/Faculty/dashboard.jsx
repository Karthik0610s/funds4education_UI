import React, { useRef, useState, useEffect } from "react";
import "./dashboard.css";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { uploadVideoContent, fetchAllVideoContent, deleteFacultyVideo } from "../../app/redux/slices/VideoFacultySlics";
import { publicAxios } from "../../api/config";
import { FaFilter } from "react-icons/fa";
import Header from "../../app/components/header/header";

export default function FacultyDashboard() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const [videoName, setVideoName] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const name = localStorage.getItem("name");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState(0); // seconds
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);


  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [courseText, setCourseText] = useState("");
  const [subjectText, setSubjectText] = useState("");
  const [topicText, setTopicText] = useState("");
  //const [allVideos, setAllVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;
  


  /* ================= SAFE VIDEO ATTACH ================= */
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!userId; // true if userId exists
  useEffect(() => {
  setCurrentPage(1);
}, [course, subject, topic]);

  useEffect(() => {
    if (isLive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLive]);
  const dispatch = useDispatch();
  const { data: allVideos, loading } = useSelector(
    (state) => state.videoContent
  );
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      dispatch(fetchAllVideoContent(Number(userId)));
    } else {
      dispatch(fetchAllVideoContent()); // no id
    }
  }, [dispatch]);


  useEffect(() => {
    if (allVideos?.length > 0) {
      const uniqueCourses = [
        ...new Set(allVideos.map(v => v.course).filter(Boolean))
      ];
      setCourses(uniqueCourses);
    }
  }, [allVideos]);
  useEffect(() => {
    if (course) {
      const filteredSubjects = [
        ...new Set(
          allVideos
            .filter(v => v.course === course)
            .map(v => v.subject)
            .filter(Boolean)
        )
      ];
      setSubjects(filteredSubjects);
    } else {
      setSubjects([]);
      setSubject("");
      setTopics([]);
      setTopic("");
    }
  }, [course, allVideos]);
  useEffect(() => {
    if (subject) {
      const filteredTopics = [
        ...new Set(
          allVideos
            .filter(v => v.course === course && v.subject === subject)
            .map(v => v.topic)
            .filter(Boolean)
        )
      ];
      setTopics(filteredTopics);
    } else {
      setTopics([]);
      setTopic("");
    }
  }, [subject, course, allVideos]);

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setRecordedVideoUrl(url);

      return () => URL.revokeObjectURL(url); // cleanup
    }
  }, [recordedBlob]);
  useEffect(() => {
    if (!courseText) {
      setSubjectText("");
      setTopicText("");
    }
  }, [courseText]);

  useEffect(() => {
    if (!subjectText) {
      setTopicText("");
    }
  }, [subjectText]);

  /* ================= RESET EVERYTHING ================= */
  const resetModal = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());

    setShowModal(false);
    setIsLive(false);
    setRecordedBlob(null);
    setStep(1);

    setCourseText("");
    setSubjectText("");
    setTopicText("");
    setVideoName("");
    resetTimer();
    setIsMuted(false);
      // ✅ ADD THESE
  setUploadMode(false);
  setSelectedFile(null);
  };

  const toggleMute = () => {
  if (!streamRef.current) return;

  const audioTrack = streamRef.current.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
  setIsMuted(!audioTrack.enabled);
};

const formatDuration = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

  /* ================= START CAMERA ================= */
  const startCamera = async () => {
    try {
      // Mic only
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Initial screen (required for recording)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      screenStreamRef.current = screenStream;

      // ONE fixed recording stream
      streamRef.current = new MediaStream([
        screenStream.getVideoTracks()[0],
        micStream.getAudioTracks()[0],
      ]);

      startRecording(streamRef.current);
      setIsLive(true);
      setStep(3);
      startTimer();


      // Preview screen
      videoRef.current.srcObject = screenStream;

    screenStream.getVideoTracks()[0].onended = () => {
      alert("Screen sharing stopped. Recording will end.");
      stopLive();
    };
  } catch (err) {
    //alert("Permission denied");
  }
};
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 3
//HANDLE UPLOADVIDEO
const handleUploadFile = async () => {

  // 1️⃣ Validation same as LIVE logic
  if (!selectedFile || !videoName.trim()) {
    Swal.fire({
      text: "Video name and file are required",
      icon: "warning",
    });
    return;
  }
   if (selectedFile.size > MAX_FILE_SIZE) {
    Swal.fire({
      text: "Files larger than 30 MB are not allowed",
      icon: "warning",
    });
    return;
  }

  const formData = new FormData();

  // 2️⃣ File attach — correct
  const ext = selectedFile.name.split(".").pop();

  formData.append(
    "FormFiles",
    selectedFile,
    `${videoName}.${ext}`
  );

  // 3️⃣ REQUIRED BY API — SAME AS LIVE MODE
  formData.append("FileName", videoName);
  formData.append("TypeofUser", "VideoContent");
  formData.append("FacultyId", localStorage.getItem("userId"));

  // ✅ CRITICAL CORRECTION HERE
  formData.append("Course", courseText);
  formData.append("Subject", subjectText);
  formData.append("Topic", topicText);

  formData.append("CreatedBy", localStorage.getItem("name") || name);
  formData.append("CreatedDate", new Date().toISOString());

  // 4️⃣ Debug payload check
  console.log("UPLOAD PAYLOAD →", {
    courseText,
    subjectText,
    topicText,
    videoName,
    file: selectedFile.name,
  });

  try {

    Swal.fire({
      title: "Uploading video...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const res = await dispatch(uploadVideoContent(formData));

    await Swal.fire({
      text: res.message || "Video uploaded successfully!",
      icon: "success",
    });

    resetModal();

  } catch (err) {
    console.error("UPLOAD ERROR →", err);

    Swal.fire({
      text: err.errorMsg || err.message || "Course/Subject/Topic required by API",
      icon: "error",
    });
  }
};


const startTimer = () => {
  if (timerRef.current) return;

  timerRef.current = setInterval(() => {
    setDuration(prev => prev + 1);
  }, 1000);
};

const pauseTimer = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  setDuration(0);
};

  /* ================= SCREEN SHARE ================= */
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      screenStreamRef.current = screenStream;

      videoRef.current.srcObject = screenStream;

      screenStream.getVideoTracks()[0].onended = () => {
        alert("Screen sharing stopped.");
      };
    } catch {
      alert("Screen permission denied");
    }
  };
  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      pauseTimer();

    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();

    }
  };


  /* ================= BACK TO CAMERA ================= */
  const backToCamera = async () => {
    const confirm = window.confirm(
      "Stop screen sharing and switch to camera?"
    );
    if (!confirm) return;

    const camStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    cameraStreamRef.current = camStream;

    videoRef.current.srcObject = camStream;
  };


  /* ================= RECORD ================= */
  const startRecording = (stream) => {
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = e => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setStep(4);
    };

    recorder.start();
  };

  /* ================= SWITCH TRACK ================= */
  const replaceVideoTrack = (newTrack) => {
    if (!streamRef.current) return;

    const oldTrack = streamRef.current.getVideoTracks()[0];

    if (oldTrack) {
      streamRef.current.removeTrack(oldTrack); // ❌ do NOT stop
    }

    streamRef.current.addTrack(newTrack);
  };



  /* ================= STOP ================= */
  /* const stopLive = () => {
     mediaRecorderRef.current?.stop();
     streamRef.current?.getTracks().forEach(t => t.stop());
     setIsLive(false);
   };*/
  const stopLive = () => {
    // 1️⃣ Stop recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // 2️⃣ Stop recording stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // 3️⃣ Stop camera stream
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      cameraStreamRef.current = null;
    }

    // 4️⃣ Stop screen sharing
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      screenStreamRef.current = null;
    }

    // 5️⃣ Clear preview
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 6️⃣ Reset UI state
    setIsLive(false);
    pauseTimer();
  };


  /* ================= SAVE ================= */
  const saveRecordedVideo = async () => {
    debugger;
    if (!recordedBlob || !videoName) {
      Swal.fire({
        text: "Please enter video name",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();

    formData.append("FormFiles", recordedBlob, `${videoName}.webm`);
    formData.append("FileName", videoName);
    // REQUIRED BY YOUR API
    formData.append("TypeofUser", "VideoContent");
    formData.append("FacultyId", localStorage.getItem("userId"));
    // formData.append("Id",   0||localStorage.getItem("userId") );
    formData.append("Course", courseText);
    formData.append("Subject", subjectText);
    formData.append("Topic", topicText);

    formData.append(
      "CreatedBy",
      localStorage.getItem("name") || name
    );

    formData.append("CreatedDate", new Date().toISOString());

    try {
      // ⏳ Loader
      Swal.fire({
        title: "Uploading video...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 🚀 Upload
      const res = await dispatch(uploadVideoContent(formData));
      debugger;
      // ✅ Success
      await Swal.fire({
        text: res.message || "Video uploaded successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      resetModal();
      // fetchAllVideos();
    } catch (err) {
      console.error("Video upload failed:", err);

      Swal.fire({
        text: err.errorMsg || "Error uploading video",
        icon: "error",
      });
    }
  };
  const handleDeleteVideo = async (videoId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This video will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      debugger;
      if (result.isConfirmed) {
        await dispatch(deleteFacultyVideo(videoId, dispatch));
      }
    });
  };
  const clearFilters = () => {
    setCourse("");
    setSubject("");
    setTopic("");
    setSubjects([]);
    setTopics([]);
  };


  const getVideoUrl = (filePath, fileName) => {
    if (!filePath || !fileName) return "";

    // Normalize slashes
    const normalized = filePath.replace(/\\/g, "/");

    // Extract path after "VideoContent"
    const index = normalized.indexOf("/VideoContent/");
    if (index === -1) return "";

    let relativePath = normalized.substring(index + "/VideoContent".length);
    relativePath = relativePath.replace(/^\/+/, ""); // remove leading slashes

    const baseUrl = publicAxios.defaults.baseURL.replace(/\/api$/, "");

    // Append filename (also encode to be URL safe)
    const encodedFileName = encodeURIComponent(fileName);
    const url = `${baseUrl}/VideoContent/${relativePath}/${encodedFileName}`;
    console.log("Generated Video URL:", url);
    return url;
  };

  const canProceed = courseText && subjectText && topicText;
 const filteredVideos = allVideos.filter(v =>
  (!course || v.course === course) &&
  (!subject || v.subject === subject) &&
  (!topic || v.topic === topic)
);

// Pagination calculations
const indexOfLastVideo = currentPage * videosPerPage;
const indexOfFirstVideo = indexOfLastVideo - videosPerPage;

const currentVideos = filteredVideos.slice(
  indexOfFirstVideo,
  indexOfLastVideo
);

const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };
  return (
    <div>
      <Header variant="faculty-profile" />

      <div className="faculty-wrapper">
        {/* Mobile Filter Icon */}
        <div className="mobile-filter-icon" onClick={() => setShowFilter(true)}>
          <FaFilter />
          <span style={{ marginLeft: "6px" }}>Filters</span>
        </div>

        {/* Left Panel - Desktop */}
        <div className="left-panel desktop-only">
          <div className="filter-title">Category</div>

          <select value={course} onChange={e => setCourse(e.target.value)}>
            <option value="">Course</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!course}>
            <option value="">Subject</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={topic} onChange={e => setTopic(e.target.value)} disabled={!subject}>
            <option value="">Topic</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <button
            className="clear-filters-btn"
            onClick={clearFilters}
            style={{ backgroundColor: "#fe8200" }}
            disabled={!course && !subject && !topic}
          >
            Clear
          </button>
        </div>

        {/* Mobile Filter Overlay */}
        {showFilter && (
          <div className="mobile-filter-overlay">
            <div className="left-panel  mobile-panel">

              {/*<div className="mobile-filter-close" onClick={() => setShowFilter(false)}>
                ✕ Close
              </div>*/}

                <div className="filter-header">
  

  <span className="filter-title">Category</span>
  <span
    className="mobile-filter-close"
    onClick={() => setShowFilter(false)}
  >
    ✕
  </span>
</div>
              {/* <button onClick={() => setShowFilter(false)}>✕ Close</button>*/}


              <select value={course} onChange={e => setCourse(e.target.value)}>
                <option value="">Course</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!course}>
                <option value="">Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={topic} onChange={e => setTopic(e.target.value)} disabled={!subject}>
                <option value="">Topic</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <button
                className="clear-filters-btn"
                onClick={clearFilters}
                style={{ backgroundColor: "#fe8200" }}
                disabled={!course && !subject && !topic}
              >
                Clear
              </button>
            </div>

            {/* Overlay background */}
            <div className="overlay-background" onClick={() => setShowFilter(false)}></div>
          </div>
        )}

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="top-buttons">
            {isLoggedIn && (
              <>
                <button className="live-btn" onClick={() => {setShowModal(true);setUploadMode(false)}}>
                  LIVE
                </button>

      <button className="upload-btn" onClick={() => {setUploadMode(true);setShowModal(true);setStep(1);}}>
        UPLOAD VIDEO
      </button>
    </>
  )}
        </div>

          <div className="video-grid">
            {filteredVideos.length > 0 ? (
              currentVideos.map((v) => (
                <div className="video-card" key={v.id}>
                  <video
                    src={getVideoUrl(v.filePath, v.fileName)}
                    controls
                    preload="metadata"
                    className="thumbnail"
                  />

                  <div className="video-footer">
                    <div className="video-topic">{v.topic}</div>

                    <div className="video-bottom-row">
                      <div className="video-date">
                        Last updated on {formatDate(v.createdDate)}
                      </div>

                      {isLoggedIn && (
                        <i
                          className="fa-solid fa-trash delete-icon"
                          title="Delete video"
                          onClick={() => handleDeleteVideo(v.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-videos">
                <strong>   No video content available</strong>
              </div>
            )}
          </div>
{totalPages > 1 && (
  <div className="pagination-controls">
    <button
      className="pagination-btn"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      ← Prev
    </button>

    <span className="page-info">
      Page {currentPage} of {totalPages}
    </span>

    <button
      className="pagination-btn"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Next →
    </button>
  </div>
)}

        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <button className="modal-close" onClick={resetModal}>
                ✕
              </button>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <h3>E-Learning Course</h3>

                  <div className="modal-form">
                    <label>Course</label>
                    <input value={courseText} onChange={(e) => setCourseText(e.target.value)} />

                    <label>Subject</label>
                    <input value={subjectText} onChange={(e) => setSubjectText(e.target.value)} />

                    <label>Topic</label>
                    <input value={topicText} onChange={(e) => setTopicText(e.target.value)} />
                  </div>

                  <div className="modal-footer">
                    <button
                      className="primary-btn"
                      disabled={!canProceed}
                      onClick={() => setStep(2)}
                    >
                      NEXT
                    </button>

                    <button className="secondary-btn" onClick={resetModal}>
                      CANCEL
                    </button>
                  </div>
                </>
              )}

            {/* STEP 2 */}
            {/* STEP 2 */}
{step === 2 && (
  <>
    {/* UPLOAD MODE */}
    {uploadMode ? (
      <>
        <h3>Upload Video File</h3>

        <div className="modal-form">
          <label>Video Name</label>
          <input
            type="text"
            placeholder="Enter video name"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
        

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={{ marginTop: "10px" }}
        />
     <span style={{fontSize:"12px"}}>
  Please upload a file smaller than 30 MB
</span>
</div>
        <div className="modal-footer">
          <button
            className="primary-btn"
            disabled={!selectedFile || !videoName.trim()}
            onClick={handleUploadFile}
          >
            📤 Upload File
          </button>

          <button className="secondary-btn" onClick={resetModal}>
            Cancel
          </button>
        </div>
      </>
    ) : (
      /* LIVE MODE */
      <>
        <h3>Start Live Session</h3>
        <p>Allow camera & microphone to begin</p>

         <div className="step2-footer">
                    <button className="primary-btn" onClick={startCamera}>
                      🎥 Start Recording
                    </button>
                  </div>
        <div className="modal-footer">
          <button className="secondary-btn" onClick={resetModal}>
            Cancel
          </button>
        </div>
      </>
    )}
  </>
)}


              {/* STEP 3 */}
              {step === 3 && isLive && (
                <>
                  {/* <div className="live-controls">
                    <button onClick={shareScreen}>🖥 Screen</button>
                    <button onClick={backToCamera}>🎥 Camera</button>
                    <button className="stop-btn" onClick={stopLive}>
                      STOP
                    </button>
                  </div> */}
                 <div className="live-header">
  <span className="live-indicator">🔴 LIVE - </span>
  <span className="live-duration">{formatDuration(duration)}</span>
</div>

<div className="live-controls">
  <button onClick={shareScreen}>🖥 Screen</button>
  <button onClick={backToCamera}>🎥 Camera</button>

  <button onClick={toggleMute}>
    {isMuted ? "🔇 Unmute" : "🎤 Mute"}
  </button>

  {!isPaused ? (
    <button className="pause-btn" onClick={pauseRecording}>
      ⏸ Pause
    </button>
  ) : (
    <button className="resume-btn" onClick={resumeRecording}>
      ▶ Resume
    </button>
  )}

  <button className="stop-btn" onClick={stopLive}>
    ⏹ Stop
  </button>
</div>
                  <video ref={videoRef} autoPlay muted />
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && recordedBlob && (
                <>
                  <h3>Recording Ready</h3>

                  <video
                    src={recordedVideoUrl}
                    controls
                    style={{ width: "100%", marginBottom: "10px" }}
                  />

                  <div className="modal-form">
                    <label>Video Name</label>
                    <input
                      type="text"
                      placeholder="Enter video name"
                      value={videoName}
                      onChange={(e) => setVideoName(e.target.value)}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      className="primary-btn"
                      onClick={saveRecordedVideo}
                      disabled={!videoName.trim()}
                    >
                      SAVE VIDEO
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
