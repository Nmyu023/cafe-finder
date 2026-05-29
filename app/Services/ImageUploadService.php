<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageUploadService
{
    /**
     * Upload an image to Cloudinary or fallback to local storage.
     *
     * @param UploadedFile $image
     * @param string $folder
     * @return string URL of the uploaded image
     */
    public static function upload(UploadedFile $image, string $folder = 'cafes'): string
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        // Use Cloudinary if credentials exist
        if ($cloudName && $apiKey && $apiSecret) {
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => $cloudName,
                    'api_key'    => $apiKey,
                    'api_secret' => $apiSecret,
                ],
            ]);

            $result = $cloudinary->uploadApi()->upload($image->getRealPath(), [
                'folder' => $folder
            ]);

            return $result['secure_url'];
        }

        // Fallback to local storage
        $fileName = Str::uuid() . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs($folder, $fileName, 'public');
        return '/storage/' . $path;
    }
}
