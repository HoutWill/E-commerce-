<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public Storefront Pages (Home, Product, Contact)
Route::get('/', [ProductController::class, 'home'])->name('home');
Route::get('/products', function () {
    return redirect('/#products');
})->name('products.index');
Route::get('/contact', [ProductController::class, 'contactPage'])->name('contact');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Authentication Routes
Route::get('/login', function () {
    return redirect()->route('storefront.index')->with('login_required', true);
})->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Role-based Admin Control Panel
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    Route::post('/products', [AdminController::class, 'store'])->name('products.store');
    Route::put('/products/{id}', [AdminController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [AdminController::class, 'destroy'])->name('products.destroy');
    Route::post('/products/{id}/toggle-stock', [AdminController::class, 'toggleStock'])->name('products.toggle-stock');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
});
