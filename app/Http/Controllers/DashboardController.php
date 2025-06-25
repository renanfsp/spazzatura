<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return match(auth()->user()->role) {
            'collector' => Inertia::render('dashboard/collector'),
            'merchant' => Inertia::render('dashboard/merchant'),
            'cooperative' => Inertia::render('dashboard/cooperative'),
        };
    }
}
