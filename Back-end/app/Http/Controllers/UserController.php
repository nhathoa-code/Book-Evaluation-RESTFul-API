<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function register(Request $request)
    {
        $request->validate([
            "email" => "bail|required|email|unique:users",
            "password" => "required"
        ]);
        $user = new User;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->typeUser = 0;
        $user->save();
        return response(["user" => $user], 200);
    }

    function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['bail', 'required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $token = $request->user()->createToken("mytoken");
            return response(["user" => Auth::user(), "token" => $token->plainTextToken], 200);
        } else {
            return response(["failed" => "Email or password wrong"], 422);
        }
    }

    function logout(Request $request)
    {
        $request->user()->tokens()->delete();
    }
}
