<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function defaults(): array
    {
        return [
            'brand_name' => 'Souk',
            'primary_color' => '#00C853',
            'secondary_surface' => '#050505',
            'facebook_url' => 'https://facebook.com/souk',
            'instagram_name' => '@souk',
            'instagram_url' => 'https://instagram.com/souk',
            'tiktok_url' => 'https://tiktok.com/@souk',
            'support_email' => 'support@souk.ma',
            'sales_email' => 'sales@souk.ma',
            'phone' => '+212 5XX-XXXXXX',
            'dark_luxury_theme' => true,
            'promo_banner' => true,
            'customer_reviews' => true,
            'guest_checkout' => false,
        ];
    }

    public static function allSettings(): array
    {
        return array_replace(
            self::defaults(),
            self::query()
                ->get(['key', 'value'])
                ->mapWithKeys(fn (self $setting) => [$setting->key => $setting->value['value'] ?? null])
                ->all()
        );
    }

    public static function saveSettings(array $settings): array
    {
        foreach ($settings as $key => $value) {
            self::query()->updateOrCreate(
                ['key' => $key],
                ['value' => ['value' => $value]]
            );
        }

        return self::allSettings();
    }
}
