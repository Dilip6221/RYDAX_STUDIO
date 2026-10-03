<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Blog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller
{
    public function displayPublishedBlogs(Request $request)
    {
        $page = max((int) $request->input('page', 1), 1);
        $limit = min(max((int) $request->input('limit', 12), 1), 50);

        $blogs = Blog::where('status', 'PUBLISHED')
            ->orderBy('id', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $blogs->items(),
            'page' => $blogs->currentPage(),
            'limit' => $limit,
            'total' => $blogs->total(),
        ]);
    }

    public function showSlugWiseBlog($slug)
    {
        $blog = is_numeric($slug)
            ? Blog::find($slug)
            : Blog::where('slug', $slug)->first();

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $blog,
        ]);
    }

    public function displayBlog(Request $request)
    {
        $blogs = Blog::orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $blogs]);
    }

    public function creteAdminBlog(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $id = $request->input('id');
        $title = $request->input('title');
        $slug = Str::slug($title);

        $thumbnailUrl = $request->input('thumbnail_url');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $thumbnailUrl = Storage::url($path);
        }

        $tags = $request->input('tags');
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?: array_map('trim', explode(',', $tags));
        }

        $data = [
            'title' => $title,
            'slug' => $slug,
            'content_html' => $request->input('content') ?? $request->input('content_html', ''),
            'category' => $request->input('category', 'General'),
            'tags' => $tags,
            'meta_title' => $request->input('metaTitle') ?? $request->input('meta_title'),
            'meta_description' => $request->input('metaDescription') ?? $request->input('meta_description'),
        ];

        if ($thumbnailUrl) {
            $data['thumbnail_url'] = $thumbnailUrl;
            $data['thumbnail_public_id'] = $thumbnailUrl;
        }

        if ($id) {
            $blog = Blog::find($id);
            if (!$blog) {
                return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
            }
            $blog->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Blog updated successfully!',
                'data' => $blog,
            ]);
        }

        if (!isset($data['thumbnail_url'])) {
            $data['thumbnail_url'] = '/images/blogs/default.jpg';
        }

        $blog = Blog::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully!',
            'data' => $blog,
        ]);
    }

    public function changeBlogStatus(Request $request, $id = null)
    {
        $id = $id ?? $request->input('id') ?? $request->input('blogId');
        $newStatus = $request->input('newStatus') ?? $request->input('status');

        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        $blog->status = $newStatus;
        $blog->save();

        return response()->json([
            'success' => true,
            'message' => 'Blog status updated successfully',
        ]);
    }

    public function likeBlogToggle(Request $request, $id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        $userId = $request->user()->id;
        $hasLiked = DB::table('blog_likes')
            ->where('blog_id', $blog->id)
            ->where('user_id', $userId)
            ->exists();

        if ($hasLiked) {
            DB::table('blog_likes')
                ->where('blog_id', $blog->id)
                ->where('user_id', $userId)
                ->delete();
            $blog->decrement('likes');
            $liked = false;
        } else {
            DB::table('blog_likes')->insert([
                'blog_id' => $blog->id,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $blog->increment('likes');
            $liked = true;
        }

        return response()->json([
            'success' => true,
            'likes' => $blog->fresh()->likes,
            'liked' => $liked,
        ]);
    }
}
