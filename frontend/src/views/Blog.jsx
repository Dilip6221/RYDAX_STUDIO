import React, {
    useEffect,
    useState,
    useContext,
    useCallback,
    useMemo,
    useRef
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import toast from "react-hot-toast";
import "../css/blog.css";
import LoginDrawer from "../component/LoginDrawer.jsx";
import { Seo } from "../component/Seo.jsx";

const Blog = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const loginDrawerRef = useRef(null);
    const [blogs, setBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [animatingId, setAnimatingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("blog/published");
            setBlogs(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Error fetching blogs");
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(() => {
        const unique = new Set(blogs.map((b) => b.category).filter(Boolean));
        return ["All", ...Array.from(unique)];
    }, [blogs]);

    const filteredBlogs = useMemo(() => {
        if (selectedCategory === "All") return blogs;
        return blogs.filter((b) => b.category === selectedCategory);
    }, [blogs, selectedCategory]);

    const shareMyBlog = async (blog) => {
        const url = `${window.location.origin}/blog/${blog.slug}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.metaDescription || blog.title,
                    url,
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                toast.success("Blog link copied to clipboard!");
            } else {
                const input = document.createElement("input");
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
                toast.success("Blog link copied to clipboard!");
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
                toast.error("Error sharing blog");
            }
        }
    };

    const triggerLikeAnimation = useCallback((blogId) => {
        setAnimatingId(blogId);
        setTimeout(() => {
            setAnimatingId(null);
        }, 800);
    }, []);

    const handleLikeToggle = async (blogId) => {
        if (!user) {
            loginDrawerRef.current?.open();
            return;
        }

        // Optimistic UI update
        setBlogs((prev) =>
            prev.map((blog) => {
                if (blog._id !== blogId) return blog;
                const likedBy = blog.likedBy || [];
                const alreadyLiked = likedBy.includes(user._id);
                return {
                    ...blog,
                    likes: alreadyLiked ? Math.max(0, (blog.likes || 1) - 1) : (blog.likes || 0) + 1,
                    likedBy: alreadyLiked
                        ? likedBy.filter((id) => id !== user._id)
                        : [...likedBy, user._id]
                };
            })
        );

        try {
            const res = await axios.post(
                `blog/like-toggle/${blogId}`,
                { userId: user._id },
                { skipGlobalLoader: true }
            );
            if (!res.data.success) {
                toast.error(res.data.message);
                // Revert on error
                fetchBlogs();
                return;
            }
            // Sync confirmed likes count from server
            setBlogs((prev) =>
                prev.map((blog) =>
                    blog._id === blogId ? { ...blog, likes: res.data.likes } : blog
                )
            );
        } catch (err) {
            console.error(err);
            toast.error("Error toggling like");
            fetchBlogs();
        }
    };

    const likeAndAnimate = (blogId) => {
        handleLikeToggle(blogId);
        triggerLikeAnimation(blogId);
    };

    return (
        <div className="premium-blog-section bg-black text-white">
            <Seo
                title="Automotive Stories & Insights | RYDAX Studio"
                description="Discover expert car care tips, premium detailing guides, performance upgrades, and the latest trends in luxury automotive culture."
            />

            <div className="blog-hero text-center">
                <div className="services-heading text-center">
                    <div className="section-top-title">
                        <span></span>
                        <p>OUR BLOGS</p>
                        <span></span>
                    </div>

                    <h1 className="services-title">
                        Automotive <span>Stories & Insights</span>
                    </h1>
                </div>

                {/* Category Filter Pills */}
                {categories.length > 1 && (
                    <div className="blog-category-bar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`blog-category-btn ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="container pb-5">
                {loading ? (
                    <div className="row">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div className="col-xl-4 col-md-6 col-12 mb-4" key={i}>
                                <div className="blog-skeleton"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <div className="empty-blog-box">
                            <div className="empty-icon">
                                <i className="bi bi-journal-x"></i>
                            </div>
                            <h3 className="mt-3">No Blogs Available</h3>
                            <p className="empty-text">
                                We're preparing something exciting for you.
                                <br />
                                Check back soon for fresh automotive insights!
                            </p>
                            <div className="notfound-actions">
                                <button
                                    className="back-btn-404"
                                    onClick={() => navigate("/")}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {filteredBlogs.map((blog) => {
                            const isLiked = blog.likedBy?.includes(user?._id);
                            return (
                                <div
                                    className="col-xl-4 col-md-6 col-12 mb-4 d-flex"
                                    key={blog._id}
                                >
                                    <div className="ultra-blog-card">
                                        <div
                                            className="ultra-blog-image"
                                            onDoubleClick={() => likeAndAnimate(blog._id)}
                                            title="Double click to like"
                                        >
                                            <img
                                                src={blog.thumbnail?.url}
                                                alt={blog.title}
                                                loading="lazy"
                                            />
                                            {blog.category && (
                                                <span className="ultra-blog-badge">
                                                    {blog.category}
                                                </span>
                                            )}
                                            <div className="blog-meta-float">
                                                <span className="meta-chip">
                                                    <i className="bi bi-clock"></i>
                                                    {blog.readTime || 4} min
                                                </span>
                                                <span className="meta-chip">
                                                    <i className="bi bi-shield-check"></i>
                                                    RYDAX
                                                </span>
                                            </div>

                                            {/* Luxury Double-Click Heart Burst */}
                                            {animatingId === blog._id && (
                                                <div className="double-like-heart-wrapper">
                                                    <div className="double-like-ripple"></div>
                                                    <i className="bi bi-heart-fill double-like-heart"></i>
                                                    <div className="sparkle-particle"></div>
                                                    <div className="sparkle-particle"></div>
                                                    <div className="sparkle-particle"></div>
                                                    <div className="sparkle-particle"></div>
                                                    <div className="sparkle-particle"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ultra-blog-content">
                                            <h3 className="ultra-blog-title" title={blog.title}>
                                                {blog.title}
                                            </h3>
                                            <p className="ultra-blog-desc">
                                                {blog.metaDescription || blog.title}
                                            </p>

                                            <div className="ultra-blog-actions">
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="garage-btn"
                                                >
                                                    Read Article
                                                    <i className="bi bi-arrow-right"></i>
                                                </Link>

                                                <button
                                                    className="glass-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        shareMyBlog(blog);
                                                    }}
                                                    title="Share article"
                                                >
                                                    <i className="bi bi-share-fill"></i>
                                                </button>

                                                <button
                                                    className={`glass-btn like-btn ${isLiked ? "liked" : ""}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        likeAndAnimate(blog._id);
                                                    }}
                                                    title={isLiked ? "Unlike" : "Like"}
                                                >
                                                    <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                                                    {blog.likes > 0 && (
                                                        <span className="like-count">{blog.likes}</span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <LoginDrawer ref={loginDrawerRef} />
        </div>
    );
};

export default Blog;