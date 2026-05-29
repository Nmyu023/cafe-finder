<?php

namespace Database\Seeders;

use App\Models\Cafe;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ユーザーを取得、いなければ作成
        $testUser = User::where('email', 'test@example.com')->first();
        if (!$testUser) {
            $testUser = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $adminUser = User::where('email', 'admin@cafefinder.com')->first();
        if (!$adminUser) {
            $adminUser = User::factory()->create([
                'name' => 'Admin',
                'email' => 'admin@cafefinder.com',
                'password' => bcrypt('password'),
            ]);
        }

        // 追加のレビュー用ユーザーを取得または作成
        $user1 = User::where('email', 'sakura@example.com')->first();
        if (!$user1) {
            $user1 = User::create([
                'name' => 'Sakura',
                'email' => 'sakura@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $user2 = User::where('email', 'kento@example.com')->first();
        if (!$user2) {
            $user2 = User::create([
                'name' => 'Kento',
                'email' => 'kento@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $user3 = User::where('email', 'sophie@example.com')->first();
        if (!$user3) {
            $user3 = User::create([
                'name' => 'Sophie',
                'email' => 'sophie@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // 既存の古いレビューを削除してクリーンにする
        Review::truncate();

        // ユーザーのDBにある実際のカフェ名で取得
        $mezzanine = Cafe::where('name', 'Mezzanine Coffee and Bar - Lahug')->first();
        $workplace = Cafe::where('name', 'Workplace Cafe')->first();
        $coffeebay = Cafe::where('name', 'CoffeeBay (HM Tower)')->first();
        $simply = Cafe::where('name', 'Simply Brewed')->first();
        $takapi = Cafe::where('name', 'Ta Kapi - Beans & Brews at The Median')->first();
        $highlands = Cafe::where('name', 'Highlands Coffee')->first();
        $cbtl = Cafe::where('name', 'The Coffee Bean & Tea Leaf Garden Row')->first();
        $onward = Cafe::where('name', 'Onward Coffee')->first();
        $butfirst = Cafe::where('name', 'But First , Coffee -salinas Drive')->first();

        // 1. Mezzanine Coffee and Bar - Lahug
        if ($mezzanine) {
            Review::create([
                'user_id' => $user1->id,
                'cafe_id' => (string) $mezzanine->id,
                'user_name' => $user1->name,
                'stars' => [4, 4, 4, 3, 5],
                'crowd' => 'ふつう',
                'tags' => ['作業向き', '映える'],
                'comment' => '二階席（メザニン）の雰囲気がとてもお洒落で気に入っています。Wi-Fiも普通に快適でPC作業がはかどります！',
                'purpose' => '作業',
            ]);
        }

        // 2. Workplace Cafe
        if ($workplace) {
            Review::create([
                'user_id' => $user1->id,
                'cafe_id' => (string) $workplace->id,
                'user_name' => $user1->name,
                'stars' => [5, 5, 5, 4, 4],
                'crowd' => 'ふつう',
                'tags' => ['作業向き', '静か'],
                'comment' => 'セブでPC作業・自習するならここ一択です。Wi-Fiは非常に高速で、ほぼ全席にコンセントがあります。冷房がかなり強いので上着を持参することをおすすめします！',
                'purpose' => '勉強',
            ]);

            Review::create([
                'user_id' => $user2->id,
                'cafe_id' => (string) $workplace->id,
                'user_name' => $user2->name,
                'stars' => [5, 5, 5, 5, 4],
                'crowd' => '混んでる',
                'tags' => ['作業向き', '冷房強め'],
                'comment' => 'Very productive environment. Internet speed is outstanding. Power plugs are everywhere. Truffle cookies are delicious!',
                'purpose' => '作業',
            ]);
        }

        // 3. CoffeeBay (HM Tower)
        if ($coffeebay) {
            Review::create([
                'user_id' => $user3->id,
                'cafe_id' => (string) $coffeebay->id,
                'user_name' => $user3->name,
                'stars' => [4, 4, 3, 4, 4],
                'crowd' => '混んでる',
                'tags' => ['作業向き', 'おすすめメニューあり'],
                'comment' => 'HMタワー内にあるカフェ。窓が大きくて景色もよく、広々としています。ハニーバターブレッドが美味しいです。',
                'purpose' => '勉強',
            ]);
        }

        // 4. Simply Brewed
        if ($simply) {
            Review::create([
                'user_id' => $testUser->id,
                'cafe_id' => (string) $simply->id,
                'user_name' => $testUser->name,
                'stars' => [4, 3, 4, 4, 4],
                'crowd' => '空いてる',
                'tags' => ['静か', 'コスパ◎'],
                'comment' => '静かでリラックスして過ごせる穴場のカフェ。価格もリーズナブルで、ちょっとした作業や読書にぴったりです。',
                'purpose' => '勉強',
            ]);
        }

        // 5. Ta Kapi - Beans & Brews at The Median
        if ($takapi) {
            Review::create([
                'user_id' => $user2->id,
                'cafe_id' => (string) $takapi->id,
                'user_name' => $user2->name,
                'stars' => [4, 5, 5, 3, 4],
                'crowd' => '空いてる',
                'tags' => ['作業向き', '静か'],
                'comment' => 'The Medianにある静かなカフェ。混んでいないことが多いので、一人で黙々と集中してコードを書いたり勉強したりしたい時に最高です！',
                'purpose' => '作業',
            ]);
        }

        // 6. Highlands Coffee
        if ($highlands) {
            Review::create([
                'user_id' => $user3->id,
                'cafe_id' => (string) $highlands->id,
                'user_name' => $user3->name,
                'stars' => [3, 3, 2, 5, 4],
                'crowd' => '混んでる',
                'tags' => ['深夜OK', 'コスパ◎'],
                'comment' => '24時間営業のベトナム系コーヒーチェーン。バインミーが安くて美味しくて最高です！話し声は少しにぎやかですが、耳栓があれば深夜の勉強にも使えます。',
                'purpose' => '勉強',
            ]);
        }

        // 7. The Coffee Bean & Tea Leaf Garden Row
        if ($cbtl) {
            Review::create([
                'user_id' => $user1->id,
                'cafe_id' => (string) $cbtl->id,
                'user_name' => $user1->name,
                'stars' => [3, 4, 3, 3, 4],
                'crowd' => 'ふつう',
                'tags' => ['会話OK', 'おすすめメニューあり'],
                'comment' => 'Garden Rowにあり、テラス席の雰囲気が抜群です！そよ風を感じながらのリラックス勉強やミーティングにぴったり。メンバーカードがあればWi-Fiも使えます。',
                'purpose' => 'ミーティング',
            ]);
        }

        // 8. Onward Coffee
        if ($onward) {
            Review::create([
                'user_id' => $user2->id,
                'cafe_id' => (string) $onward->id,
                'user_name' => $user2->name,
                'stars' => [4, 3, 5, 4, 5],
                'crowd' => '空いてる',
                'tags' => ['静か', '映える'],
                'comment' => 'とても気品がある隠れ家のようなお洒落カフェ。静寂の中で美味しいエスプレッソやエッグタルトを味わいながら読書するのにぴったりです。',
                'purpose' => '作業',
            ]);
        }

        // 9. But First , Coffee -salinas Drive
        if ($butfirst) {
            Review::create([
                'user_id' => $user3->id,
                'cafe_id' => (string) $butfirst->id,
                'user_name' => $user3->name,
                'stars' => [3, 4, 4, 5, 4],
                'crowd' => 'ふつう',
                'tags' => ['会話OK', 'コスパ◎'],
                'comment' => 'サリナスドライブ沿いにあるコスパの良いカフェ。お手頃価格で作業用の席や電源もそれなりにあるので便利です。',
                'purpose' => '勉強',
            ]);
        }
    }
}
