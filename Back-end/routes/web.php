<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Events\MessageEvent;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('register', [UserController::class, "register"]);

Route::post('login', [UserController::class, "login"]);

Route::post('logout', [UserController::class, "logout"])->middleware("auth:sanctum");


Route::get("/event", function () {
    MessageEvent::dispatch("This is a message");
});

Route::get("/listener", function () {
    return view("message");
});
