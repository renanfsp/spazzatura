<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Price;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PricesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Cache::flush();

        // $cache = Cache::rememberForever('all_prices', function () {
        //     return Price::all();
        // });

        return response()->json(Price::all())->setStatusCode(200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function store(Request $request)
    {
        $request->merge([
            'uuid' => Str::uuid()->toString()
        ]);

        $validated = $request->validate([
            'uuid' => 'required|uuid|unique:prices',
            'material' => 'required|string|unique:prices|min:1|max:255',
            'value' => 'required|numeric|min:0',
            'point' => 'required|numeric|min:0',
        ]);

        Price::create($validated);

        return redirect()->route(route: 'dashboard')->with('success');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Price $prices)
    {
        // Price::where('uuid', '7e2114a4-4912-3ce4-b0e4-6681292b88b7')->delete();
        // Cache::flush('all_prices');
    }
}
