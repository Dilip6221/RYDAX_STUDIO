import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const emptyMedia = {
  url: "",
  public_id: "",
};

const emptyInteractiveSection = {
  title: "",
  subtitle: "",
  description: "",
  image: { ...emptyMedia },
  video: { ...emptyMedia },
  points: [""],
  stats: [{ label: "", value: "" }],
};

const emptyPackage = {
  title: "",
  price: "",
  duration: "",
  features: [""],
  recommended: false,
};

const emptyFaq = {
  question: "",
  answer: "",
};

const AdminCreateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    icon: "",
    category: "",
    duration: "",
    status: "ACTIVE",
    displayOrder: 0,
    heroTitle: "",
    heroSubtitle: "",
    heroVideo: { ...emptyMedia },
    warranty: "",
    featured: false,
    cardFeatures: [""],
    benefits: [""],
    interactiveSections: [{ ...emptyInteractiveSection }],
    packages: [{ ...emptyPackage }],
    faqs: [{ ...emptyFaq }],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateArrayValue = (key, index, value) => {
    const arr = [...form[key]];
    arr[index] = value;
    updateForm(key, arr);
  };

  const addArrayValue = (key) => {
    updateForm(key, [...form[key], ""]);
  };

  const removeArrayValue = (key, index) => {
    updateForm(
      key,
      form[key].filter((_, i) => i !== index)
    );
  };

  const updateObjectArray = (key, index, field, value) => {
    const arr = [...form[key]];
    arr[index] = {
      ...arr[index],
      [field]: value,
    };
    updateForm(key, arr);
  };

  const addObjectArray = (key, emptyObj) => {
    updateForm(key, [...form[key], JSON.parse(JSON.stringify(emptyObj))]);
  };

  const removeObjectArray = (key, index) => {
    updateForm(
      key,
      form[key].filter((_, i) => i !== index)
    );
  };

  const updateNestedArray = (
    parentKey,
    parentIndex,
    childKey,
    childIndex,
    value
  ) => {
    const arr = [...form[parentKey]];
    const childArr = [...arr[parentIndex][childKey]];
    childArr[childIndex] = value;

    arr[parentIndex] = {
      ...arr[parentIndex],
      [childKey]: childArr,
    };

    updateForm(parentKey, arr);
  };

  const addNestedArray = (parentKey, parentIndex, childKey, emptyValue) => {
    const arr = [...form[parentKey]];

    arr[parentIndex] = {
      ...arr[parentIndex],
      [childKey]: [...arr[parentIndex][childKey], emptyValue],
    };

    updateForm(parentKey, arr);
  };

  const removeNestedArray = (
    parentKey,
    parentIndex,
    childKey,
    childIndex
  ) => {
    const arr = [...form[parentKey]];

    arr[parentIndex] = {
      ...arr[parentIndex],
      [childKey]: arr[parentIndex][childKey].filter(
        (_, i) => i !== childIndex
      ),
    };

    updateForm(parentKey, arr);
  };

  const updateNestedObjectArray = (
    parentKey,
    parentIndex,
    childKey,
    childIndex,
    field,
    value
  ) => {
    const arr = [...form[parentKey]];
    const childArr = [...arr[parentIndex][childKey]];

    childArr[childIndex] = {
      ...childArr[childIndex],
      [field]: value,
    };

    arr[parentIndex] = {
      ...arr[parentIndex],
      [childKey]: childArr,
    };

    updateForm(parentKey, arr);
  };

  const uploadMedia = async (file, mediaType = "image") => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);

      const toastId = `upload-${mediaType}-${Date.now()}`;
      toast.loading(`Uploading ${mediaType}...`, { id: toastId });

      const res = await axios.post("service/admin/upload-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss(toastId);

      if (res.data.success) {
        toast.success(`${mediaType} uploaded successfully`);
        return res.data.data;
      }

      toast.error(res.data.message || "Upload failed");
      return null;
    } catch (error) {
      console.error("Upload media error:", error);
      toast.error("Upload failed");
      return null;
    }
  };

  const fetchService = async () => {
    try {
      const res = await axios.get(`service/get-service/${id}`);

      if (res.data.success) {
        const s = res.data.data;

        setForm({
          title: s.title || "",
          shortDescription: s.shortDescription || "",
          description: s.description || "",
          icon: s.icon || "",
          category: s.category || "",
          duration: s.duration || "",
          status: s.status || "ACTIVE",
          displayOrder: s.displayOrder || 0,
          heroTitle: s.heroTitle || "",
          heroSubtitle: s.heroSubtitle || "",
          heroVideo: s.heroVideo || { ...emptyMedia },
          warranty: s.warranty || "",
          featured: Boolean(s.featured),
          cardFeatures: s.cardFeatures?.length ? s.cardFeatures : [""],
          benefits: s.benefits?.length ? s.benefits : [""],
          interactiveSections: s.interactiveSections?.length
            ? s.interactiveSections.map((item) => ({
                title: item.title || "",
                subtitle: item.subtitle || "",
                description: item.description || "",
                image: item.image || { ...emptyMedia },
                video: item.video || { ...emptyMedia },
                points: item.points?.length ? item.points : [""],
                stats: item.stats?.length
                  ? item.stats
                  : [{ label: "", value: "" }],
              }))
            : [{ ...emptyInteractiveSection }],
          packages: s.packages?.length
            ? s.packages.map((p) => ({
                title: p.title || "",
                price: p.price || "",
                duration: p.duration || "",
                features: p.features?.length ? p.features : [""],
                recommended: Boolean(p.recommended),
              }))
            : [{ ...emptyPackage }],
          faqs: s.faqs?.length ? s.faqs : [{ ...emptyFaq }],
        });

        if (s.image?.url) {
          setPreview(s.image.url);
        }
      }
    } catch (err) {
      console.error("Fetch service error", err);
      toast.error("Failed to load service");
    }
  };

  useEffect(() => {
    if (isEdit) fetchService();
  }, [id]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroVideoUpload = async (file) => {
    const uploaded = await uploadMedia(file, "video");

    if (uploaded) {
      updateForm("heroVideo", uploaded);
    }
  };

  const handleSectionMediaUpload = async (
    file,
    sectionIndex,
    fieldName,
    mediaType
  ) => {
    const uploaded = await uploadMedia(file, mediaType);

    if (!uploaded) return;

    const arr = [...form.interactiveSections];

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      [fieldName]: uploaded,
    };

    updateForm("interactiveSections", arr);
  };

  const validateService = () => {
    if (!form.title.trim()) {
      toast.error("Service title is required");
      return false;
    }

    if (!form.shortDescription.trim()) {
      toast.error("Short description is required");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!isEdit && !image) {
      toast.error("Service image is required");
      return false;
    }

    return true;
  };

  const cleanPayload = () => {
    return {
      ...form,
      cardFeatures: form.cardFeatures.filter((x) => x.trim()),
      benefits: form.benefits.filter((x) => x.trim()),

      interactiveSections: form.interactiveSections
        .filter(
          (x) =>
            x.title ||
            x.subtitle ||
            x.description ||
            x.image?.url ||
            x.video?.url
        )
        .map((x) => ({
          ...x,
          points: x.points.filter((p) => p.trim()),
          stats: x.stats.filter((s) => s.label || s.value),
        })),

      packages: form.packages
        .filter((x) => x.title || x.price || x.duration)
        .map((x) => ({
          ...x,
          features: x.features.filter((f) => f.trim()),
        })),

      faqs: form.faqs.filter((x) => x.question || x.answer),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateService()) return;

    try {
      const payload = cleanPayload();
      const formData = new FormData();

      formData.append("title", payload.title);
      formData.append("shortDescription", payload.shortDescription);
      formData.append("description", payload.description);
      formData.append("icon", payload.icon);
      formData.append("category", payload.category);
      formData.append("duration", payload.duration);
      formData.append("status", payload.status);
      formData.append("displayOrder", payload.displayOrder);
      formData.append("heroTitle", payload.heroTitle);
      formData.append("heroSubtitle", payload.heroSubtitle);
      formData.append("heroVideo", JSON.stringify(payload.heroVideo));
      formData.append("warranty", payload.warranty);
      formData.append("featured", payload.featured);

      formData.append("cardFeatures", JSON.stringify(payload.cardFeatures));
      formData.append("benefits", JSON.stringify(payload.benefits));
      formData.append(
        "interactiveSections",
        JSON.stringify(payload.interactiveSections)
      );
      formData.append("packages", JSON.stringify(payload.packages));
      formData.append("faqs", JSON.stringify(payload.faqs));

      if (image) {
        formData.append("image", image);
      }

      if (isEdit) {
        formData.append("id", id);
      }

      const res = await axios.post("service/admin/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/services");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Save service error", err);
      toast.error("Failed to save service");
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <h4 className="section-title m-0">
            <span className="first-letter">{isEdit ? "E" : "C"}</span>
            {isEdit ? "dit Service" : "reate Service"}
          </h4>

          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
            onClick={() => navigate("/admin/services")}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>

        <form className="bg-dark rounded text-white p-3 p-md-4 border border-secondary border-opacity-25" onSubmit={handleSubmit}>
          <h5 className="text-danger mb-3">Basic Info</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Service Title *</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Duration</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={form.duration}
                onChange={(e) => updateForm("duration", e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Icon Class</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="bi bi-tools"
                value={form.icon}
                onChange={(e) => updateForm("icon", e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={form.displayOrder}
                onChange={(e) => updateForm("displayOrder", e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-control bg-dark text-white border-secondary"
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Featured</label>
              <select
                className="form-control bg-dark text-white border-secondary"
                value={form.featured ? "true" : "false"}
                onChange={(e) =>
                  updateForm("featured", e.target.value === "true")
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label">Service Image *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="form-control bg-dark text-white border-secondary"
                onChange={handleMainImageChange}
              />
            </div>

            {preview && (
              <div className="col-md-4">
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label">Short Description *</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                rows="3"
                value={form.shortDescription}
                onChange={(e) => updateForm("shortDescription", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Full Description *</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                rows="3"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>
          </div>

          <hr className="border-secondary my-4" />

          <h5 className="text-danger mb-3">Hero Info</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Hero Title</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={form.heroTitle}
                onChange={(e) => updateForm("heroTitle", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Hero Video</label>
              <input
                type="file"
                accept="video/*"
                className="form-control bg-dark text-white border-secondary"
                onChange={(e) => handleHeroVideoUpload(e.target.files[0])}
              />

              {form.heroVideo?.url && (
                <video
                  src={form.heroVideo.url}
                  controls
                  style={{
                    width: "100%",
                    height: "150px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    background: "#000",
                  }}
                />
              )}
            </div>

            <div className="col-12">
              <label className="form-label">Hero Subtitle</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                rows="2"
                value={form.heroSubtitle}
                onChange={(e) => updateForm("heroSubtitle", e.target.value)}
              />
            </div>
          </div>

          <hr className="border-secondary my-4" />

          <DynamicStringSection
            title="Card Features"
            items={form.cardFeatures}
            onChange={(index, value) =>
              updateArrayValue("cardFeatures", index, value)
            }
            onAdd={() => addArrayValue("cardFeatures")}
            onRemove={(index) => removeArrayValue("cardFeatures", index)}
          />

          <hr className="border-secondary my-4" />

          <DynamicStringSection
            title="Benefits"
            items={form.benefits}
            onChange={(index, value) =>
              updateArrayValue("benefits", index, value)
            }
            onAdd={() => addArrayValue("benefits")}
            onRemove={(index) => removeArrayValue("benefits", index)}
          />

          <hr className="border-secondary my-4" />

          <h5 className="text-danger mb-3">Interactive Sections</h5>

          {form.interactiveSections.map((section, index) => (
            <div
              className="border border-secondary rounded p-3 mb-3"
              key={index}
            >
              <div className="d-flex justify-content-between mb-3">
                <strong>Section #{index + 1}</strong>

                {form.interactiveSections.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      removeObjectArray("interactiveSections", index)
                    }
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    value={section.title}
                    onChange={(e) =>
                      updateObjectArray(
                        "interactiveSections",
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Subtitle</label>
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    value={section.subtitle}
                    onChange={(e) =>
                      updateObjectArray(
                        "interactiveSections",
                        index,
                        "subtitle",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="2"
                    className="form-control bg-dark text-white border-secondary"
                    value={section.description}
                    onChange={(e) =>
                      updateObjectArray(
                        "interactiveSections",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Section Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSectionMediaUpload(
                        e.target.files[0],
                        index,
                        "image",
                        "image"
                      )
                    }
                  />

                  {section.image?.url && (
                    <img
                      src={section.image.url}
                      alt="section"
                      style={{
                        width: "100%",
                        height: "170px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Section Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSectionMediaUpload(
                        e.target.files[0],
                        index,
                        "video",
                        "video"
                      )
                    }
                  />

                  {section.video?.url && (
                    <video
                      src={section.video.url}
                      controls
                      style={{
                        width: "100%",
                        height: "170px",
                        borderRadius: "10px",
                        marginTop: "10px",
                        background: "#000",
                      }}
                    />
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Points</label>

                  {section.points.map((point, pointIndex) => (
                    <div className="d-flex gap-2 mb-2" key={pointIndex}>
                      <input
                        className="form-control bg-dark text-white border-secondary"
                        value={point}
                        onChange={(e) =>
                          updateNestedArray(
                            "interactiveSections",
                            index,
                            "points",
                            pointIndex,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeNestedArray(
                            "interactiveSections",
                            index,
                            "points",
                            pointIndex
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() =>
                      addNestedArray("interactiveSections", index, "points", "")
                    }
                  >
                    + Add Point
                  </button>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stats</label>

                  {section.stats.map((stat, statIndex) => (
                    <div className="d-flex gap-2 mb-2" key={statIndex}>
                      <input
                        placeholder="Label"
                        className="form-control bg-dark text-white border-secondary"
                        value={stat.label}
                        onChange={(e) =>
                          updateNestedObjectArray(
                            "interactiveSections",
                            index,
                            "stats",
                            statIndex,
                            "label",
                            e.target.value
                          )
                        }
                      />

                      <input
                        placeholder="Value"
                        className="form-control bg-dark text-white border-secondary"
                        value={stat.value}
                        onChange={(e) =>
                          updateNestedObjectArray(
                            "interactiveSections",
                            index,
                            "stats",
                            statIndex,
                            "value",
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeNestedArray(
                            "interactiveSections",
                            index,
                            "stats",
                            statIndex
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() =>
                      addNestedArray("interactiveSections", index, "stats", {
                        label: "",
                        value: "",
                      })
                    }
                  >
                    + Add Stat
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() =>
              addObjectArray("interactiveSections", emptyInteractiveSection)
            }
          >
            + Add Interactive Section
          </button>

          <hr className="border-secondary my-4" />

          <h5 className="text-danger mb-3">Packages</h5>

          {form.packages.map((pkg, index) => (
            <div
              className="border border-secondary rounded p-3 mb-3"
              key={index}
            >
              <div className="d-flex justify-content-between mb-3">
                <strong>Package #{index + 1}</strong>

                {form.packages.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeObjectArray("packages", index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    value={pkg.title}
                    onChange={(e) =>
                      updateObjectArray(
                        "packages",
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Price</label>
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    value={pkg.price}
                    onChange={(e) =>
                      updateObjectArray(
                        "packages",
                        index,
                        "price",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    value={pkg.duration}
                    onChange={(e) =>
                      updateObjectArray(
                        "packages",
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Recommended</label>
                  <select
                    className="form-control bg-dark text-white border-secondary"
                    value={pkg.recommended ? "true" : "false"}
                    onChange={(e) =>
                      updateObjectArray(
                        "packages",
                        index,
                        "recommended",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Features</label>

                  {pkg.features.map((feature, featureIndex) => (
                    <div className="d-flex gap-2 mb-2" key={featureIndex}>
                      <input
                        className="form-control bg-dark text-white border-secondary"
                        value={feature}
                        onChange={(e) =>
                          updateNestedArray(
                            "packages",
                            index,
                            "features",
                            featureIndex,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeNestedArray(
                            "packages",
                            index,
                            "features",
                            featureIndex
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() =>
                      addNestedArray("packages", index, "features", "")
                    }
                  >
                    + Add Feature
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => addObjectArray("packages", emptyPackage)}
          >
            + Add Package
          </button>

          <hr className="border-secondary my-4" />

          <h5 className="text-danger mb-3">FAQ</h5>

          {form.faqs.map((faq, index) => (
            <div className="row g-2 mb-2" key={index}>
              <div className="col-md-5">
                <input
                  placeholder="Question"
                  className="form-control bg-dark text-white border-secondary"
                  value={faq.question}
                  onChange={(e) =>
                    updateObjectArray("faqs", index, "question", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  placeholder="Answer"
                  className="form-control bg-dark text-white border-secondary"
                  value={faq.answer}
                  onChange={(e) =>
                    updateObjectArray("faqs", index, "answer", e.target.value)
                  }
                />
              </div>

              <div className="col-md-1">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  onClick={() => removeObjectArray("faqs", index)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => addObjectArray("faqs", emptyFaq)}
          >
            + Add FAQ
          </button>

          <hr className="border-secondary my-4" />

          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Warranty</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                value={form.warranty}
                onChange={(e) => updateForm("warranty", e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={() => navigate("/admin/services")}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-danger px-4 py-2">
              <i className="bi bi-save me-2"></i>
              {isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

const DynamicStringSection = ({ title, items, onChange, onAdd, onRemove }) => {
  return (
    <>
      <h5 className="text-danger mb-3">{title}</h5>

      <div className="row g-2">
        {items.map((item, index) => (
          <div className="col-md-6" key={index}>
            <div className="d-flex gap-2">
              <input
                className="form-control bg-dark text-white border-secondary"
                value={item}
                onChange={(e) => onChange(index, e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => onRemove(index)}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <div className="col-12">
          <button type="button" className="btn btn-outline-danger" onClick={onAdd}>
            + Add {title}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminCreateService;