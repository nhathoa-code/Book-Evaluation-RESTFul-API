<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::get("/books", [BookController::class, 'books']);

Route::get("/book/reviewIncrement/{book}", [BookController::class, 'incre_review']);

Route::get("/book/{book}", [BookController::class, 'book']);

Route::get("/book/search/{keyword}", [BookController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::delete("/book/{book}", [BookController::class, 'destroy']);

    Route::put("/book/{book}", [BookController::class, 'update']);

    Route::post("/book", [BookController::class, 'store']);
});

Route::post("review/add", [ReviewController::class, "add"]);
