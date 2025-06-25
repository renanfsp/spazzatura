<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $role = $request->query('role');

        if (in_array($role, ['merchant', 'collector'])) {
            $users = User::where('role', $role)->get();
            return response()->json($users, 200);
        }

        return response()->json(['error' => 'bad request'], 400);
    }
}
