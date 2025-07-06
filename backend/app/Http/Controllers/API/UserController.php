<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        // Optionnel : s'assurer que l'utilisateur ne peut voir que son propre profil
        if (auth()->id() !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'prenom' => 'sometimes|string|max:64',
            'nom' => 'sometimes|string|max:64',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'theme' => 'in:clair,sombre',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Compte supprimé avec succès.']);
    }

    /**
     * Désactiver le compte de l'utilisateur.
     * ✅ PATCH /api/users/{id}/deactivate
     */
    public function deactivate($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user->actif = false;
        $user->save();

        return response()->json(['message' => 'Compte désactivé.']);
    }

    /**
     * Changer le theme de l'utilisateur entre 'sombre' et 'clair'.
     * ✅ PATCH /api/users/{id}/theme
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleTheme($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user->theme = $user->theme === 'sombre' ? 'clair' : 'sombre';
        $user->save();

        return response()->json([
            'message' => 'Thème mis à jour.',
            'theme' => $user->theme,
        ]);
    }
}
