<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index()
    {
        return Space::query()->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:120']]);

        return Space::create($data);
    }

    public function show(Space $space)
    {
        return $space;
    }

    public function update(Request $request, Space $space)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:120']]);
        $space->update($data);

        return $space;
    }

    public function destroy(Space $space)
    {
        $space->delete();

        return response()->noContent();
    }
}
