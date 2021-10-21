<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Book;

class ReviewController extends Controller
{
    function add(Request $request)
    {
        $review = new Review;
        $review->isbn = $request->isbn;
        $review->user_id = $request->user_id;
        $review->name = $request->name;
        $review->content = $request->content;
        $review->star = $request->star;
        $review->date = date("Y-m-d", time());
        $review->save();
        $avg_score = Review::where("isbn", $request->isbn)->avg("star");
        $book = Book::find($request->isbn);
        $book->Average_score = $avg_score;
        $book->save();
    }
}
