import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout.jsx";
import toast from "react-hot-toast";
import { validateForm } from "../../../utils/formValidation.js";
import { jobMediaValidationRules } from "../../../utils/validationRules.js";

const STAGES = [
    "CHECK_IN",
    "INSPECTION",
    "WORK_STARTED",
    "PART_REPLACED",
    "QUALITY_CHECK",
    "READY",
    "DELIVERED"
];

const AdminJobMedia = () => {
    const { id } = useParams(); // jobId
    const navigate = useNavigate();

    const [media, setMedia] = useState([]);
    const [file, setFile] = useState(null);
    const [stage, setStage] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const stageRef = useRef(null);

    const fetchMedia = async () => {
        try {
            const res = await axios.get(`jobcard/admin/job-cards/${id}/get-media`);
            setMedia(res.data.data || []);
        } catch (error) {
            toast.error("Failed to load media");
            console.error("Fetch media error", error);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [id]);

    const uploadMedia = async () => {
        const isValid = validateForm({
            values: { file, stage },
            validationRules: jobMediaValidationRules,
            inputRefs: { file: fileInputRef, stage: stageRef },
        });
        if (!isValid) return;

        const formData = new FormData();
        formData.append("media", file);
        formData.append("stage", stage);

        try {
            setUploading(true);
            await axios.post(
                `jobcard/admin/job-cards/${id}/media`,
                formData
            );
            toast.success("Media uploaded successfully");
            setFile(null);
            setStage("");
            if (fileInputRef.current) fileInputRef.current.value = null;
            fetchMedia();
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
            console.error("Upload error", error);
        } finally {
            setUploading(false);
        }
    };

    const deleteMedia = async (mediaId) => {
        if (!window.confirm("Are you sure you want to delete this media?")) return;
        try {
            await axios.delete(
                `jobcard/admin/job-cards/${id}/media/${mediaId}`
            );
            toast.success("Media deleted");
            fetchMedia();
        } catch {
            toast.error("Failed to delete media");
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm">

                    {/* Header */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-images text-danger"></i>
                                <span>Job Media Gallery</span>
                            </h4>
                            <small className="text-secondary">Upload stage-wise photos and videos as repair progress evidence</small>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>

                    {/* UPLOAD FORM CARD */}
                    <div className="bg-black bg-opacity-25 rounded p-3 mb-4 border border-secondary">
                        <h6 className="text-white mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-cloud-arrow-up text-danger"></i>
                            <span>Upload Media File</span>
                        </h6>
                        <div className="row g-2">
                            <div className="col-12 col-md-5">
                                <label className="form-label text-secondary small mb-1">Select Photo / Video File</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    className="form-control text-white bg-dark border-secondary"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <label className="form-label text-secondary small mb-1">Select Stage</label>
                                <select
                                    className="form-control text-white bg-dark border-secondary"
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                    ref={stageRef}
                                >
                                    <option value="">-- Select Stage --</option>
                                    {STAGES.map(s => (
                                        <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 d-flex align-items-end gap-2">
                                <button
                                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={uploadMedia}
                                    disabled={uploading}
                                >
                                    <i className="bi bi-upload"></i>
                                    <span>{uploading ? "Uploading..." : "Upload"}</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setFile(null);
                                        setStage("");
                                        if (fileInputRef.current) fileInputRef.current.value = null;
                                    }}
                                    title="Clear"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MEDIA GRID */}
                    <div className="row g-3">
                        {media.length === 0 ? (
                            <div className="col-12 text-center text-secondary py-5">
                                <i className="bi bi-camera-video-off fs-1 d-block mb-2 text-secondary"></i>
                                No media uploaded for this job card yet.
                            </div>
                        ) : (
                            media.map((m) => (
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={m._id}>
                                    <div className="job-media-card">
                                        <div className="media-wrapper">
                                            {m.mediaType === "video" ? (
                                                <video
                                                    src={m.url}
                                                    controls
                                                    className="media-preview"
                                                />
                                            ) : (
                                                <img
                                                    src={m.url}
                                                    alt="job-media"
                                                    className="media-preview"
                                                    loading="lazy"
                                                />
                                            )}

                                            {/* Stage badge */}
                                            {m.stage && (
                                                <span className="stage-badge">
                                                    {m.stage.replaceAll("_", " ")}
                                                </span>
                                            )}
                                        </div>

                                        <div className="media-footer">
                                            <button
                                                className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
                                                onClick={() => deleteMedia(m._id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminJobMedia;