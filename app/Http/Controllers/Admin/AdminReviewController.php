<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    /**
     * Display a listing of the reviews.
     */
    public function index()
    {
        $reviews = Review::withTrashed()->with('cafe')->latest()->paginate(15);

        return view('admin.reviews.index', compact('reviews'));
    }

    /**
     * Show the form for editing the specified review.
     */
    public function edit(Review $review)
    {
        return view('admin.reviews.edit', compact('review'));
    }

    /**
     * Update the specified review in storage.
     */
    public function update(Request $request, Review $review)
    {
        $request->validate([
            'stars' => ['required', 'array', 'size:5'],
            'stars.*' => ['integer', 'min:0', 'max:5'],
            'crowd' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string'],
            'comment' => ['nullable', 'string', 'max:1000'],
            'purpose' => ['nullable', 'string', 'max:255'],
        ]);

        $tags = $request->tags
            ? array_map('trim', explode(',', $request->tags))
            : [];

        $review->update([
            'stars' => array_map('intval', $request->stars),
            'crowd' => $request->crowd ?? '',
            'tags' => $tags,
            'comment' => $request->comment ?? '',
            'purpose' => $request->purpose ?? '',
        ]);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'クチコミ情報を更新しました。');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'クチコミを非表示にしました。');
    }

    /**
     * Restore the soft deleted review.
     */
    public function restore($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->restore();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'クチコミの表示を元に戻しました。');
    }
}
