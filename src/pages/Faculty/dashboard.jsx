import React, { useRef, useState, useEffect } from "react";
import "./dashboard.css";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { uploadVideoContent,fetchAllVideoContent ,deleteFacultyVideo} from "../../app/redux/slices/VideoFacultySlics";
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
const name =localStorage.getItem("name");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
 //const [allVideos, setAllVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
 /* const [videos] = useState([
    { id: 1, title: "Numeric Function", date: "26 Apr 2023, 10:30 AM" },
    { id: 2, title: "Algebra Basics", date: "26 Apr 2023, 12:00 PM" },
    { id: 3, title: "Trigonometry", date: "27 Apr 2023, 09:00 AM" },
  ]);*/

  /* ================= SAFE VIDEO ATTACH ================= */
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
  dispatch(fetchAllVideoContent());
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



  /* ================= RESET EVERYTHING ================= */
  const resetModal = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());

    setShowModal(false);
    setIsLive(false);
    setRecordedBlob(null);
    setStep(1);

    setCourse("");
    setSubject("");
    setTopic("");
    setVideoName("");
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
 // formData.append("Id",   0||localStorage.getItem("userId") );
  formData.append("Course", course);
  formData.append("Subject", subject);
  formData.append("Topic", topic);

  formData.append(
    "CreatedBy",
    localStorage.getItem("name") || "name"
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
  const res=    await dispatch(uploadVideoContent(formData));
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
const handleDeleteVideo = async(videoId) => {
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

  const canProceed = course && subject && topic;
const filteredVideos = allVideos.filter(v =>
  (!course || v.course === course) &&
  (!subject || v.subject === subject) &&
  (!topic || v.topic === topic)
);
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

             <div className="mobile-filter-close" onClick={() => setShowFilter(false)}>
            ✕ Close
          </div>
       
          <div className="filter-title">Category</div>
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

  {/* Right Panel - Video Grid */}
  <div className="right-panel">
    <div className="top-buttons">
      <button className="live-btn" onClick={() => setShowModal(true)}>LIVE</button>
      <button className="upload-btn">UPLOAD VIDEO</button>
    </div>

    <div className="video-grid">
      {filteredVideos.map(v => (
        <div className="video-card" key={v.Id}>
          <video src={getVideoUrl(v.filePath, v.fileName)} controls className="thumbnail" />
          <div className="video-footer">
            <div className="video-topic">{v.topic}</div>
            <div className="video-bottom-row">
              <div className="video-date">Last updated on {formatDate(v.createdDate)}</div>
              <i className="fa-solid fa-trash delete-icon" onClick={() => handleDeleteVideo(v.id)}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
 </div>

  );
}
