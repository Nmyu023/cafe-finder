<?php

namespace App\Http\Controllers;

use App\Models\CrowdReport;
use Illuminate\Http\Request;

class AdminCrowdReportController extends Controller
{
    public function index()
    {
        $reports = CrowdReport::with(['user', 'cafe'])->latest()->paginate(20);
        return view('admin.crowd_reports.index', compact('reports'));
    }

    public function destroy(CrowdReport $crowdReport)
    {
        $crowdReport->delete();
        return redirect()->route('admin.crowd-reports.index')->with('success', '混雑状況レポートを削除しました。');
    }
}
