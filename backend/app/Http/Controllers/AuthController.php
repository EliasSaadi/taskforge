<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\SessionGuard;

class AuthController extends Controller
{
    public function __construct()
    {
        // ❌ Pas de middleware ici : les routes doivent rester publiques
    }

    // ✅ Enregistrement
    public function register(Request $request)
    {
        $request->validate([
            'prenom' => 'required|string|max:64',
            'nom' => 'required|string|max:64',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'actif' => true,
            'theme' => 'clair',
        ]);

        Auth::login($user); // Connexion automatique après inscription

        return response()->json(['message' => 'Utilisateur créé', 'user' => $user]);
    }

    // ✅ Connexion
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        if (Auth::guard() instanceof SessionGuard && $request->hasSession()) {
            $request->session()->regenerate();
        }


        return response()->json(['message' => 'Connexion réussie', 'user' => Auth::user()]);
    }

    // ✅ Données de l’utilisateur connecté
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // ✅ Déconnexion
    public function logout(Request $request)
    {
        if (Auth::guard() instanceof SessionGuard && $request->hasSession()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
