<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{

    function books()
    {
        return Book::all();
    }

    function book(Book $book)
    {
        $review_count = Review::select(DB::raw('count(*) as review_count'))->where("isbn", $book->isbn)->pluck("review_count")[0];
        $total_point = Review::select(DB::raw('sum(star) as total_point'))->where("isbn", $book->isbn)->pluck("total_point")[0];
        $rating_points = Review::select(DB::raw("star,count(*) as point_count"))->where("isbn", $book->isbn)->orderBy("star", "desc")->groupBy("star")->get();
        return response(["book" => $book, "metaData" => ["review_count" => $review_count, "total_point" => $total_point], "rating_points" => $rating_points, "reviews" => Review::where("isbn", $book->isbn)->orderByDesc("id", "date")->get()]);
    }

    function store(Request $request)
    {
        $request->validate([
            "isbn" => "bail|required|unique:books",
            "title" => "required",
            "author" => "required",
            "published" => "required",
            "file" => "required"
        ]);

        $book = new Book;
        $book->isbn = $request->isbn;
        $book->title = $request->title;
        $book->author = $request->author;
        $book->published = $request->published;
        $file = $request->file("file");
        $file->storeAs('public/', $file->getClientOriginalName());
        $book->image = $file->getClientOriginalName();
        $book->save();
        return $book;
    }



    function update(Request $request, Book $book)
    {
        $request->validate([
            "isbn" => ["bail", "required", Rule::unique('books')->ignore($book->isbn, 'isbn')],
            "title" => "required",
            "author" => "required",
            "published" => "required",
        ]);
        $book->isbn = $request->isbn;
        $book->title = $request->title;
        $book->author = $request->author;
        $book->published = $request->published;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            Storage::delete('public/' . $book->getRawOriginal('image'));
            $file->storeAs('public/', $file->getClientOriginalName());
            $book->image = $file->getClientOriginalName();
        }
        $book->save();
        return $book->fresh();
    }

    function destroy(Book $book)
    {
        Storage::delete('public/' . $book->getRawOriginal('image'));
        $book->delete();
    }

    function search($keyword)
    {
        $result = Book::where("Title", "like", "%$keyword%")->orWhere("Author", "like", "%$keyword%")->orWhere("isbn", "$keyword")->get();
        return $result;
    }

    function incre_review(Book $book)
    {
        $book->increment("review", 1);
    }
}
