import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import "../css/blog.css";
import LoginDrawer from "../component/LoginDrawer.jsx";
import { Seo } from "../component/Seo.jsx";

const BlogView = () => {
  const loginDrawerRef = useRef(null);
  const { slug } = useParams();
  const { user } = useContext(UserContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatingLike, setAnimatingLike] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`blog/blogs/${slug}`);
      if (!res.data.success) {
        toast.error(res.data.message || "Blog not found");
        navigate("/blog");
        return;
      }
      setBlog(res.data.data);
    } catch (err) {
      console.error("Fetch blog error:", err);
      toast.error("Error fetching blog");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  /* Share */
  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.metaDescription || blog?.title,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied to clipboard!");
      } else {
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        toast.success("Blog link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Something went wrong while sharing the blog.");
      }
    }
  };

  /* Like Animation */
  const triggerLikeAnimation = useCallback(() => {
    setAnimatingLike(true);
    setTimeout(() => setAnimatingLike(false), 800);
  }, []);

  const handleLikeToggle = async () => {
    if (!user) {
      loginDrawerRef.current?.open();
      return;
    }

    if (!blog) return;

    const likedBy = blog.likedBy || [];
    const alreadyLiked = likedBy.includes(user._id);

    // Optimistic UI update
    setBlog((prev) => ({
      ...prev,
      likes: alreadyLiked ? Math.max(0, (prev.likes || 1) - 1) : (prev.likes || 0) + 1,
      likedBy: alreadyLiked
        ? likedBy.filter((id) => id !== user._id)
        : [...likedBy, user._id],
    }));

    triggerLikeAnimation();

    try {
      const res = await axios.post(
        `blog/like-toggle/${blog._id}`,
        { userId: user._id },
        { skipGlobalLoader: true }
      );
      if (!res.data.success) {
        toast.error(res.data.message);
        fetchBlog();
        return;
      }
      setBlog((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Error toggling like");
      fetchBlog();
    }
  };

  const SmallLoader = () => (
    <div className="d-flex justify-content-center align-items-center bg-black" style={{ height: "100vh" }}>
      <div className="premium-loader"></div>
    </div>
  );

  if (loading) return <SmallLoader />;
  if (!blog) return null;

  const isLiked = blog.likedBy?.includes(user?._id);
  const blogDescription = blog.metaDescription || blog.title;

  return (
    <div className="premium-blog-view bg-black text-white">
      {/* Top Reading Progress Bar */}
      <div
        className="blog-reading-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <Seo
        title={`${blog.metaTitle || blog.title} | RYDAX Studio`}
        description={blogDescription}
        image={blog.thumbnail?.url}
        type="article"
      />

      {/* Hero Section */}
      <section className="blog-view-hero">
        <Link to="/blog" className="premium-back-btn" title="Back to Blogs">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <div className="hero-bg-wrapper">
          <img src={blog.thumbnail?.url} alt={blog.title} />
          <div className="hero-overlay"></div>
        </div>

        <div className="container position-relative z-2">
          <div className="hero-content-wrapper">
            {blog.category && (
              <div className="blog-category-chip">{blog.category}</div>
            )}

            <h1 className="premium-blog-heading">{blog.title}</h1>

            <div className="premium-meta-box">
              <div className="meta-item">
                <i className="bi bi-calendar3"></i>
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              <div className="meta-item">
                <i className="bi bi-clock"></i>
                <span>{blog.readTime || 4} min read</span>
              </div>

              <div className="meta-item">
                <i className="bi bi-shield-check"></i>
                <span>RYDAX Studio</span>
              </div>
            </div>

            <div className="hero-action-buttons">
              <button className="hero-btn share-btn" onClick={handleShare}>
                <i className="bi bi-share-fill"></i>
                Share
              </button>

              <button
                className={`hero-btn like-hero-btn ${isLiked ? "liked" : ""}`}
                onClick={handleLikeToggle}
                title={isLiked ? "Unlike article" : "Like article"}
              >
                <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                <span>{blog.likes || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Luxury Heart Animation */}
        {animatingLike && (
          <div className="view-heart-animation">
            <i className="bi bi-heart-fill"></i>
          </div>
        )}
      </section>

      {/* Main Content Section */}
      <section className="blog-main-section">
        <div className="container">
          <div className="blog-main-card">
            {/* Featured Image with Double-Click Like */}
            <div
              className="featured-image-wrapper"
              onDoubleClick={handleLikeToggle}
              title="Double click to like"
            >
              <img src={blog.thumbnail?.url} alt={blog.title} />
              <div className="double-tap-hint">
                <i className="bi bi-heart-fill"></i>
                <span>Double tap image to like</span>
              </div>
            </div>

            {/* Article Content Area */}
            <div className="premium-blog-content-area">
              <div
                dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
                className="blog-content"
              ></div>

              {/* Bottom Appreciation Card */}
              <div className="blog-appreciation-card">
                <div className="appreciation-info">
                  <h4>Enjoyed this article?</h4>
                  <p>Share your love with a like or send it to fellow automotive enthusiasts!</p>
                </div>
                <div className="appreciation-actions">
                  <button
                    className={`hero-btn like-hero-btn ${isLiked ? "liked" : ""}`}
                    onClick={handleLikeToggle}
                  >
                    <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                    <span>{blog.likes || 0} Likes</span>
                  </button>
                  <button className="hero-btn share-btn" onClick={handleShare}>
                    <i className="bi bi-share-fill"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginDrawer ref={loginDrawerRef} />
    </div>
  );
};

export default BlogView;