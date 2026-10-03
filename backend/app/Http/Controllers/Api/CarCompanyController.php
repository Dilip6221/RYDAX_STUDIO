<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CarCompany;
use App\Models\CarModel;

class CarCompanyController extends Controller
{
    public function getCarCompay(Request $request)
    {
        $companies = CarCompany::where('status', 'ACTIVE')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $companies,
        ]);
    }

    public function getCarModels($companyId)
    {
        $models = CarModel::where('company_id', $companyId)
            ->where('status', 'ACTIVE')
            ->select('id', 'name', 'company_id')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $models,
        ]);
    }
}
