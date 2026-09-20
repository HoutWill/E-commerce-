<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember', true);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'redirect' => $user->isAdmin() ? route('admin.dashboard') : route('storefront.index'),
                ]);
            }

            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'))->with('success', 'Welcome back to Admin Control Panel, ' . $user->name . '!');
            }

            return redirect()->intended(route('storefront.index'))->with('success', 'Welcome back, ' . $user->name . '!');
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials do not match our records.',
            ], 422);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput($request->only('email'))->with('login_error', true);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'user' => $user,
                'redirect' => route('storefront.index'),
            ]);
        }

        return redirect()->route('storefront.index')->with('success', 'Welcome to Classy Bling, ' . $user->name . '!');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('storefront.index')->with('info', 'You have been signed out.');
    }
}
