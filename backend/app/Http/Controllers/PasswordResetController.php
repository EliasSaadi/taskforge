<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function __construct()
    {
        // Cette ligne empêche auth:sanctum de s'appliquer
    }
    // POST /password/forgot
    public function sendResetLink(Request $request)
    {

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        Mail::to($request->email)->send(new PasswordResetMail($token, $request->email));

        $url = url("/reset-password?token={$token}&email={$request->email}");

        $response = [
            'message' => 'Un email de réinitialisation a été envoyé à ' . $request->email,
        ];

        if (app()->environment('local', 'testing')) {
            $response['reset_link'] = $url;
        }

        return response()->json($response);
    }

    // POST /password/reset
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $record = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$record) {
            return response()->json(['message' => 'Lien invalide'], 400);
        }

        // Vérifie que le token correspond (haché)
        if (!Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token invalide'], 400);
        }

        // Vérifie que le token n’est pas expiré (1h ici)
        if (Carbon::parse($record->created_at)->addHour()->isPast()) {
            return response()->json(['message' => 'Token expiré'], 400);
        }

        // Tout est bon : on met à jour le mot de passe
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        // Supprimer le token
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }
}
