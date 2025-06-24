<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AppLockedMiddlewareTest extends TestCase
{
    public function test_api_is_blocked_without_token_when_locked()
    {
        Config::set('app.lock_enabled', true);
        Config::set('app.access_token', 'secret123');

        $response = $this->getJson('/api/middleware-test');

        $response->assertStatus(403);
        $response->assertJson([
            'error' => 'API temporairement verrouillée.',
        ]);
    }
    public function test_api_is_blocked_with_false_token_when_locked()
    {
        Config::set('app.lock_enabled', true);
        Config::set('app.access_token', 'secret123');

        $response = $this->getJson('/api/middleware-test', [
            'X-Access-Token' => 'bgefobgzebfuezg',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'error' => 'API temporairement verrouillée.',
        ]);
    }

    public function test_api_is_allowed_with_token_when_locked()
    {
        Config::set('app.lock_enabled', true);
        Config::set('app.access_token', 'secret123');

        $response = $this->getJson('/api/middleware-test', [
            'X-Access-Token' => 'secret123',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['ok' => true]);
    }

    public function test_api_is_allowed_when_not_locked()
    {
        Config::set('app.lock_enabled', value: false);

        $response = $this->getJson('/api/middleware-test');

        $response->assertStatus(200);
        $response->assertJson(['ok' => true]);
    }
}
