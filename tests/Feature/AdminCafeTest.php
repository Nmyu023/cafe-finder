<?php

namespace Tests\Feature;

use App\Models\Cafe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCafeTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Create an admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@cafefinder.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);
    }

    /**
     * Test admin can create a cafe with all standard and custom specs/location/menu columns.
     */
    public function test_admin_can_create_cafe_with_all_attributes(): void
    {
        $cafeData = [
            'name' => 'Spec Cafe',
            'vibe_ja' => '#集中 #静か',
            'vibe_en' => '#Focus #Quiet',
            'desc_ja' => '快適な作業スペース。',
            'desc_en' => 'Cozy workspace.',
            'hours' => '9:00 – 21:00',
            'is_24h' => false,
            'wifi' => 'EXCELLENT',
            'outlet' => 'YES',
            'price' => '₱200〜',
            'menu_ja' => 'トリュフクッキー、紅茶',
            'menu_en' => 'Truffle Cookie, Black Tea',
            'seats_ja' => '約40席',
            'seats_en' => 'Approx. 40 seats',
            'noise_ja' => '静か（快適）',
            'noise_en' => 'Quiet (Comfortable)',
            'best_ja' => '一人で集中',
            'best_en' => 'Solo focus',
            'tips_ja' => '冷房が強力なので上着が必要。',
            'tips_en' => 'Strong AC, bring hoodie.',
            'map_url' => 'https://maps.google.com/test',
            'lat' => 10.3344,
            'lng' => 123.9088,
            'tags' => '作業向き, 会話OK',
            'accent' => '#FF0000',
            'specs' => [
                'atmosphere' => '落ち着いた',
                'bgm' => 'あり（小さめ）',
                'call' => 'イヤホン推奨',
                'seats_total' => 42,
                'seat_types' => ['カウンター', 'テーブル', 'ソファ'],
                'solo_seat' => '1',
                'toilet' => '1',
                'wifi_available' => '1',
                'outlet_detail' => '全席対応',
            ],
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.cafes.store'), $cafeData);

        $response->assertRedirect(route('admin.cafes.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('cafes', [
            'name' => 'Spec Cafe',
            'menu_ja' => 'トリュフクッキー、紅茶',
            'menu_en' => 'Truffle Cookie, Black Tea',
            'seats_ja' => '約40席',
            'seats_en' => 'Approx. 40 seats',
            'noise_ja' => '静か（快適）',
            'noise_en' => 'Quiet (Comfortable)',
            'best_ja' => '一人で集中',
            'best_en' => 'Solo focus',
            'tips_ja' => '冷房が強力なので上着が必要。',
            'tips_en' => 'Strong AC, bring hoodie.',
            'lat' => 10.3344,
            'lng' => 123.9088,
            'accent' => '#FF0000',
        ]);

        $cafe = Cafe::where('name', 'Spec Cafe')->firstOrFail();
        $this->assertEquals(['作業向き', '会話OK'], $cafe->tags);

        // Verify specs are correctly parsed and cast to array/JSON in the DB
        $this->assertIsArray($cafe->specs);
        $this->assertEquals('落ち着いた', $cafe->specs['atmosphere']);
        $this->assertEquals('あり（小さめ）', $cafe->specs['bgm']);
        $this->assertEquals('イヤホン推奨', $cafe->specs['call']);
        $this->assertEquals(42, $cafe->specs['seats_total']);
        $this->assertEquals(['カウンター', 'テーブル', 'ソファ'], $cafe->specs['seat_types']);
        $this->assertTrue($cafe->specs['solo_seat']);
        $this->assertTrue($cafe->specs['toilet']);
        $this->assertTrue($cafe->specs['wifi_available']);
        $this->assertEquals('全席対応', $cafe->specs['outlet_detail']);
    }

    /**
     * Test admin can update a cafe with all attributes.
     */
    public function test_admin_can_update_cafe_with_all_attributes(): void
    {
        $cafe = Cafe::create([
            'name' => 'Old Name',
            'hours' => '10:00 – 19:00',
            'wifi' => 'GOOD',
            'outlet' => 'LIMITED',
            'specs' => [
                'atmosphere' => 'にぎやか',
                'bgm' => 'あり（大きめ）',
                'call' => 'OK',
                'seats_total' => 20,
                'seat_types' => ['テーブル'],
                'solo_seat' => false,
                'toilet' => false,
                'wifi_available' => false,
                'outlet_detail' => '一部席のみ',
            ]
        ]);

        $updateData = [
            'name' => 'New Name',
            'vibe_ja' => '#おしゃれ',
            'vibe_en' => '#Stylish',
            'desc_ja' => '新しい説明',
            'desc_en' => 'New desc',
            'hours' => '8:00 – 22:00',
            'wifi' => 'EXCELLENT',
            'outlet' => 'YES',
            'price' => '₱150〜',
            'menu_ja' => 'アボカドトースト',
            'menu_en' => 'Avocado Toast',
            'seats_ja' => '約30席',
            'seats_en' => 'Approx. 30 seats',
            'noise_ja' => '静かで上品（小声で）',
            'noise_en' => 'Quiet & elegant (Low voice)',
            'best_ja' => 'PC作業・ノマド',
            'best_en' => 'Laptop work & nomad',
            'tips_ja' => '静かで作業に最適。',
            'tips_en' => 'Quiet place.',
            'map_url' => 'https://maps.google.com/updated',
            'lat' => 10.1234,
            'lng' => 123.5678,
            'tags' => '作業向き',
            'accent' => '#00FF00',
            'specs' => [
                'atmosphere' => 'おしゃれ',
                'bgm' => 'なし',
                'call' => '不可',
                'seats_total' => 35,
                'seat_types' => ['カウンター', 'テラス'],
                'solo_seat' => '1',
                'toilet' => '1',
                'wifi_available' => '1',
                'outlet_detail' => '全席対応',
            ],
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.cafes.update', $cafe), $updateData);

        $response->assertRedirect(route('admin.cafes.index'));
        $response->assertSessionHas('success');

        $cafe->refresh();

        $this->assertEquals('New Name', $cafe->name);
        $this->assertEquals('アボカドトースト', $cafe->menu_ja);
        $this->assertEquals('Avocado Toast', $cafe->menu_en);
        $this->assertEquals('約30席', $cafe->seats_ja);
        $this->assertEquals('Approx. 30 seats', $cafe->seats_en);
        $this->assertEquals('静かで上品（小声で）', $cafe->noise_ja);
        $this->assertEquals('Quiet & elegant (Low voice)', $cafe->noise_en);
        $this->assertEquals('PC作業・ノマド', $cafe->best_ja);
        $this->assertEquals('Laptop work & nomad', $cafe->best_en);
        $this->assertEquals('静かで作業に最適。', $cafe->tips_ja);
        $this->assertEquals('Quiet place.', $cafe->tips_en);
        $this->assertEquals(10.1234, floatval($cafe->lat));
        $this->assertEquals(123.5678, floatval($cafe->lng));
        $this->assertEquals('#00FF00', $cafe->accent);

        $this->assertIsArray($cafe->specs);
        $this->assertEquals('おしゃれ', $cafe->specs['atmosphere']);
        $this->assertEquals('なし', $cafe->specs['bgm']);
        $this->assertEquals('不可', $cafe->specs['call']);
        $this->assertEquals(35, $cafe->specs['seats_total']);
        $this->assertEquals(['カウンター', 'テラス'], $cafe->specs['seat_types']);
        $this->assertTrue($cafe->specs['solo_seat']);
        $this->assertTrue($cafe->specs['toilet']);
        $this->assertTrue($cafe->specs['wifi_available']);
        $this->assertEquals('全席対応', $cafe->specs['outlet_detail']);
    }
}
