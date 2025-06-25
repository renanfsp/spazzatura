<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UserController extends Controller
{
    public function dashboard()
    {
        return match(auth()->user()->role) {
            'collector' => Inertia::render('dashboard/collector'),
            'merchant' => Inertia::render('dashboard/merchant'),
            'cooperative' => Inertia::render('dashboard/cooperative'),
        };
    }
}
