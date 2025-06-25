<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $cache = Cache::rememberForever('all_prices', function () {
        //     return Price::all();
        // });
        return response()->json(User::all())->setStatusCode(200);
    }
}
